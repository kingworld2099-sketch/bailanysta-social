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
 * Users this person has decided to trust — accepting a connect request only opens the chat;
 * identity (username, contact, meetup place) stays hidden until they click "Доверять"
 * on that specific person after actually talking to them.
 */
export async function trustedUserIds(userId: string): Promise<Set<string>> {
  const requests = await prisma.connectRequest.findMany({
    where: { status: "ACCEPTED", OR: [{ fromUserId: userId }, { toUserId: userId }] },
    select: { fromUserId: true, toUserId: true, fromTrusts: true, toTrusts: true },
  });

  const ids = new Set<string>();
  for (const r of requests) {
    const iAmFrom = r.fromUserId === userId;
    if (iAmFrom ? r.fromTrusts : r.toTrusts) {
      ids.add(iAmFrom ? r.toUserId : r.fromUserId);
    }
  }
  return ids;
}

export function isRequestExpired(expiresAt: Date | null): boolean {
  return !expiresAt || expiresAt.getTime() <= Date.now();
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
