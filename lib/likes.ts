import { prisma } from "./prisma";

export async function getReceivedLikes(userId: string, limit = 50) {
  return prisma.like.findMany({
    where: { post: { authorId: userId }, userId: { not: userId } },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      user: { select: { id: true, name: true, lastName: true } },
      post: { select: { id: true, text: true } },
    },
  });
}

export async function countUnseenLikes(userId: string, lastSeenAt: Date | null): Promise<number> {
  return prisma.like.count({
    where: {
      post: { authorId: userId },
      userId: { not: userId },
      createdAt: { gt: lastSeenAt ?? new Date(0) },
    },
  });
}

export async function markLikesSeen(userId: string) {
  await prisma.user.update({ where: { id: userId }, data: { lastSeenLikesAt: new Date() } });
}
