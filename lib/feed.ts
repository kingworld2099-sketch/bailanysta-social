import { prisma } from "./prisma";
import { ACTIVE_WINDOW_HOURS } from "./config";
import type { VibeCode } from "./config";

export function postInclude(currentUserId: string | null) {
  return {
    author: { select: { id: true, name: true, city: true, vibe: true } },
    comments: {
      orderBy: { createdAt: "asc" as const },
      include: { author: { select: { id: true, name: true } } },
    },
    likes: { where: { userId: currentUserId ?? "__guest__" }, select: { id: true } },
    _count: { select: { likes: true, comments: true } },
  };
}

export type FeedPost = Awaited<ReturnType<typeof getFeedPosts>>[number];

export async function getFeedPosts(opts: {
  city: string | null;
  vibe: VibeCode | null;
  currentUserId: string | null;
}) {
  const where: {
    author?: { city: string };
    vibe?: VibeCode;
  } = {};

  if (opts.city) where.author = { city: opts.city };
  if (opts.vibe) where.vibe = opts.vibe;

  return prisma.post.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: postInclude(opts.currentUserId),
    take: 100,
  });
}

export async function getUserPosts(authorId: string, currentUserId: string | null) {
  return prisma.post.findMany({
    where: { authorId },
    orderBy: { createdAt: "desc" },
    include: postInclude(currentUserId),
  });
}

export async function searchPosts(q: string, currentUserId: string | null) {
  return prisma.post.findMany({
    where: { text: { contains: q, mode: "insensitive" } },
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
