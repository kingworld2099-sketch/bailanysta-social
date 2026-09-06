import { prisma } from "./prisma";
import { blockedUserIds } from "./connect";

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

export async function getReceivedCommentLikes(userId: string, limit = 50) {
  return prisma.commentLike.findMany({
    where: { comment: { authorId: userId }, userId: { not: userId } },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      user: { select: { id: true, name: true, lastName: true } },
      comment: { select: { id: true, text: true, postId: true } },
    },
  });
}

export async function getLikedComments(userId: string, limit = 50) {
  const blocked = await blockedUserIds(userId);

  return prisma.commentLike.findMany({
    where: {
      userId,
      ...(blocked.length > 0 ? { comment: { authorId: { notIn: blocked } } } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      comment: {
        select: {
          id: true,
          text: true,
          postId: true,
          author: { select: { id: true, name: true, lastName: true } },
        },
      },
    },
  });
}

export async function countUnseenLikes(userId: string, lastSeenAt: Date | null): Promise<number> {
  const since = lastSeenAt ?? new Date(0);
  const [postLikes, commentLikes] = await Promise.all([
    prisma.like.count({
      where: { post: { authorId: userId }, userId: { not: userId }, createdAt: { gt: since } },
    }),
    prisma.commentLike.count({
      where: { comment: { authorId: userId }, userId: { not: userId }, createdAt: { gt: since } },
    }),
  ]);
  return postLikes + commentLikes;
}

export async function markLikesSeen(userId: string) {
  await prisma.user.update({ where: { id: userId }, data: { lastSeenLikesAt: new Date() } });
}
