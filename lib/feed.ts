import { prisma } from "./prisma";
import { ACTIVE_WINDOW_HOURS } from "./config";
import { blockedUserIds } from "./connect";
import type { VibeCode } from "./config";

export function postInclude(currentUserId: string | null) {
  return {
    author: { select: { id: true, name: true, lastName: true, username: true, city: true, vibe: true } },
    comments: {
      orderBy: { createdAt: "asc" as const },
      include: { author: { select: { id: true, name: true, lastName: true, username: true } } },
    },
    likes: { where: { userId: currentUserId ?? "__guest__" }, select: { id: true } },
    myConnectRequest: {
      where: { fromUserId: currentUserId ?? "__guest__" },
      select: { id: true, status: true },
    },
    _count: { select: { likes: true, comments: true } },
  };
}

export type FeedPost = Awaited<ReturnType<typeof getFeedPosts>>[number];

export function isConnectedFor(post: { authorId: string; myConnectRequest: { status: string }[] }, currentUserId: string | null) {
  if (!currentUserId) return false;
  if (post.authorId === currentUserId) return true;
  return post.myConnectRequest[0]?.status === "ACCEPTED";
}

export async function getFeedPosts(opts: {
  city: string | null;
  vibe: VibeCode | null;
  currentUserId: string | null;
}) {
  const where: {
    author?: { city: string };
    vibe?: VibeCode;
    authorId?: { notIn: string[] };
  } = {};

  if (opts.city) where.author = { city: opts.city };
  if (opts.vibe) where.vibe = opts.vibe;

  if (opts.currentUserId) {
    const blocked = await blockedUserIds(opts.currentUserId);
    if (blocked.length > 0) where.authorId = { notIn: blocked };
  }

  return prisma.post.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: postInclude(opts.currentUserId),
    take: 100,
  });
}

export async function getUserPosts(authorId: string, currentUserId: string | null) {
  if (currentUserId) {
    const blocked = await blockedUserIds(currentUserId);
    if (blocked.includes(authorId)) return [];
  }

  return prisma.post.findMany({
    where: { authorId },
    orderBy: { createdAt: "desc" },
    include: postInclude(currentUserId),
  });
}

export async function searchPosts(q: string, currentUserId: string | null) {
  const where: {
    text: { contains: string; mode: "insensitive" };
    authorId?: { notIn: string[] };
  } = { text: { contains: q, mode: "insensitive" } };

  if (currentUserId) {
    const blocked = await blockedUserIds(currentUserId);
    if (blocked.length > 0) where.authorId = { notIn: blocked };
  }

  return prisma.post.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: postInclude(currentUserId),
    take: 50,
  });
}

export async function getActiveCount(city: string | null, vibe: VibeCode) {
  const since = new Date(Date.now() - ACTIVE_WINDOW_HOURS * 60 * 60 * 1000);

  return prisma.user.count({
    where: {
      vibe,
      vibeUpdatedAt: { gte: since },
      ...(city ? { city } : {}),
    },
  });
}
