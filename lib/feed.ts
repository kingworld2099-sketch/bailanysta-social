import { prisma } from "./prisma";
import { ACTIVE_WINDOW_HOURS } from "./config";
import { blockedUserIds, connectedUserIds } from "./connect";
import { extractMentionUsernames } from "./mentions";
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

async function applyPrivacy<
  T extends {
    text: string;
    author: { id: string; username: string };
    comments: { text: string; author: { id: string; username: string } }[];
  },
>(posts: T[], currentUserId: string | null) {
  const connected = currentUserId ? await connectedUserIds(currentUserId) : new Set<string>();
  const visibleAuthor = (authorId: string) => authorId === currentUserId || connected.has(authorId);

  const mentioned = new Set<string>();
  for (const post of posts) {
    for (const u of extractMentionUsernames(post.text)) mentioned.add(u);
    for (const c of post.comments) {
      for (const u of extractMentionUsernames(c.text)) mentioned.add(u);
    }
  }

  let visibleMentions: string[] = [];
  if (currentUserId && mentioned.size > 0) {
    const mentionedUsers = await prisma.user.findMany({
      where: { username: { in: [...mentioned] } },
      select: { id: true, username: true },
    });
    visibleMentions = mentionedUsers
      .filter((u) => visibleAuthor(u.id))
      .map((u) => u.username.toLowerCase());
  }

  return posts.map((post) => ({
    ...post,
    visibleMentions,
    author: { ...post.author, username: visibleAuthor(post.author.id) ? post.author.username : null },
    comments: post.comments.map((c) => ({
      ...c,
      author: { ...c.author, username: visibleAuthor(c.author.id) ? c.author.username : null },
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
  return applyPrivacy(posts, opts.currentUserId);
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
  return applyPrivacy(posts, currentUserId);
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
  return applyPrivacy(posts, currentUserId);
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
