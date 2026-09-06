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

export async function connectedUserIds(userId: string): Promise<Set<string>> {
  const requests = await prisma.connectRequest.findMany({
    where: { status: "ACCEPTED", OR: [{ fromUserId: userId }, { toUserId: userId }] },
    select: { fromUserId: true, toUserId: true },
  });

  const ids = new Set<string>();
  for (const r of requests) {
    ids.add(r.fromUserId === userId ? r.toUserId : r.fromUserId);
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
