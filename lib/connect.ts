import { prisma } from "./prisma";
import { NotFoundError, ForbiddenError, ValidationError } from "./errors";

export async function isBlockedPair(aId: string, bId: string): Promise<boolean> {
  if (aId === bId) return false;

  const block = await prisma.block.findFirst({
    where: {
      OR: [
        { blockerId: aId, blockedId: bId },
        { blockerId: bId, blockedId: aId },
      ],
    },
    select: { id: true },
  });

  return !!block;
}

export async function didIBlock(blockerId: string, blockedId: string): Promise<boolean> {
  const block = await prisma.block.findUnique({
    where: { blockerId_blockedId: { blockerId, blockedId } },
    select: { id: true },
  });
  return !!block;
}

export async function blockedUserIds(userId: string): Promise<string[]> {
  const blocks = await prisma.block.findMany({
    where: { OR: [{ blockerId: userId }, { blockedId: userId }] },
    select: { blockerId: true, blockedId: true },
  });

  const ids = new Set<string>();
  for (const b of blocks) {
    ids.add(b.blockerId === userId ? b.blockedId : b.blockerId);
  }
  return [...ids];
}

/**
 * Users whose identity is visible to this person — accepting a connect request only opens
 * the chat; each side's username, contact and meetup place stay hidden from the other until
 * THEY click "Доверять" and reveal their own info. Clicking "Доверять" never unlocks the other
 * person's info for yourself — it only opens your own info to them.
 */
export async function trustedUserIds(userId: string): Promise<Set<string>> {
  const requests = await prisma.connectRequest.findMany({
    where: { status: "ACCEPTED", OR: [{ fromUserId: userId }, { toUserId: userId }] },
    select: { fromUserId: true, toUserId: true, fromTrusts: true, toTrusts: true },
  });

  const ids = new Set<string>();
  for (const r of requests) {
    const iAmFrom = r.fromUserId === userId;
    // The OTHER side's own trust flag decides whether I can see THEM.
    if (iAmFrom ? r.toTrusts : r.fromTrusts) {
      ids.add(iAmFrom ? r.toUserId : r.fromUserId);
    }
  }
  return ids;
}

export function isRequestExpired(expiresAt: Date | null): boolean {
  return !expiresAt || expiresAt.getTime() <= Date.now();
}

export async function markChatRead(requestId: string, userId: string) {
  const request = await prisma.connectRequest.findUnique({
    where: { id: requestId },
    select: { fromUserId: true, toUserId: true },
  });
  if (!request) return;
  const isFrom = request.fromUserId === userId;
  await prisma.connectRequest.update({
    where: { id: requestId },
    data: isFrom ? { fromLastReadAt: new Date() } : { toLastReadAt: new Date() },
  });
}

export async function countUnseenMessages(userId: string): Promise<number> {
  const requests = await prisma.connectRequest.findMany({
    where: { status: "ACCEPTED", OR: [{ fromUserId: userId }, { toUserId: userId }] },
    select: {
      id: true,
      fromUserId: true,
      toUserId: true,
      fromLastReadAt: true,
      toLastReadAt: true,
      expiresAt: true,
    },
  });

  const active = requests.filter((r) => !isRequestExpired(r.expiresAt));
  if (active.length === 0) return 0;

  const counts = await Promise.all(
    active.map((r) => {
      const iAmFrom = r.fromUserId === userId;
      const lastReadAt = iAmFrom ? r.fromLastReadAt : r.toLastReadAt;
      return prisma.message.count({
        where: { requestId: r.id, authorId: { not: userId }, createdAt: { gt: lastReadAt ?? new Date(0) } },
      });
    })
  );

  return counts.reduce((sum, c) => sum + c, 0);
}

export async function getActiveChat(requestId: string, userId: string) {
  const request = await prisma.connectRequest.findUnique({ where: { id: requestId } });
  if (!request) throw new NotFoundError("Чат не найден");
  if (request.fromUserId !== userId && request.toUserId !== userId) {
    throw new ForbiddenError("Это не ваш чат");
  }
  if (request.status !== "ACCEPTED") throw new ValidationError("Чат недоступен");
  if (isRequestExpired(request.expiresAt)) {
    throw new ValidationError("Время чата истекло");
  }
  return request;
}
