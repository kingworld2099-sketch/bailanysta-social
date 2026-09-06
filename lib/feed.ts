import { prisma } from "./prisma";
import { ACTIVE_WINDOW_HOURS } from "./config";
import { blockedUserIds, connectedUserIds } from "./connect";
import type { VibeCode } from "./config";

export function postInclude(currentUserId: string | null) {
  return {
    author: { select: { id: true, name: true, lastName: true, username: true, city: true, vibe: true } },
    comments: {
      orderBy: { createdAt: "asc" as const },
      include: { author: { select: { id: true, name: true, lastName: true, username: true } } },
    },
    likes: { where: { userId: currentUserId ?? "__guest__" }, select: { id: true } },
    connectRequests: {
      where: { fromUserId: currentUserId ?? "__guest__" },
      select: { id: true, status: true },
    },
    _count: { select: { likes: true, comments: true } },
  };
}

export type FeedPost = Awaited<ReturnType<typeof getFeedPosts>>[number];

export function isConnectedFor(post: { authorId: string; connectRequests: { status: string }[] }, currentUserId: string | null) {
  if (!currentUserId) return false;
  if (post.authorId === currentUserId) return true;
  return post.connectRequests[0]?.status === "ACCEPTED";
}

async function withUsernamePrivacy<
  T extends { author: { id: string; username: string }; comments: { author: { id: string; username: string } }[] },
>(posts: T[], currentUserId: string | null) {
  const connected = currentUserId ? await connectedUserIds(currentUserId) : new Set<string>();
  const visible = (authorId: string) => authorId === currentUserId || connected.has(authorId);

  return posts.map((post) => ({
    ...post,
    author: { ...post.author, username: visible(post.author.id) ? post.author.username : null },
    comments: post.comments.map((c) => ({
      ...c,
      author: { ...c.author, username: visible(c.author.id) ? c.author.username : null },
    })),
  }));
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

  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: postInclude(opts.currentUserId),
    take: 100,
  });
  return withUsernamePrivacy(posts, opts.currentUserId);
}

export async function getUserPosts(authorId: string, currentUserId: string | null) {
  if (currentUserId) {
    const blocked = await blockedUserIds(currentUserId);
    if (blocked.includes(authorId)) return [];
  }

  const posts = await prisma.post.findMany({
    where: { authorId },
    orderBy: { createdAt: "desc" },
    include: postInclude(currentUserId),
  });
  return withUsernamePrivacy(posts, currentUserId);
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

  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: postInclude(currentUserId),
    take: 50,
  });
  return withUsernamePrivacy(posts, currentUserId);
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
