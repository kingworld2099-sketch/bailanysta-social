import { prisma } from "./prisma";
import { ACTIVE_WINDOW_HOURS, AI_SEARCH_CANDIDATE_LIMIT } from "./config";
import { blockedUserIds, trustedUserIds } from "./connect";
import { extractMentionUsernames } from "./mentions";
import type { VibeCode } from "./config";

export function postInclude(currentUserId: string | null) {
  return {
    author: { select: { id: true, name: true, lastName: true, username: true, city: true, vibe: true } },
    comments: {
      orderBy: { createdAt: "asc" as const },
      include: {
        author: { select: { id: true, name: true, lastName: true, username: true } },
        likes: { where: { userId: currentUserId ?? "__guest__" }, select: { id: true } },
        _count: { select: { likes: true } },
      },
    },
    likes: { where: { userId: currentUserId ?? "__guest__" }, select: { id: true } },
    connectRequests: {
      where: { fromUserId: currentUserId ?? "__guest__" },
      select: { id: true, status: true, toTrusts: true },
    },
    _count: { select: { likes: true, comments: true } },
  };
}

export type FeedPost = Awaited<ReturnType<typeof getFeedPosts>>[number];

/**
 * Chat accepted only opens the mini-chat. The author's meetup place/time/photo stay hidden
 * from the viewer until the AUTHOR clicks "Доверять" on them — the viewer's own trust flag
 * has no effect on what they can see, it only reveals the viewer's info to the author.
 */
export function isConnectedFor(
  post: { authorId: string; connectRequests: { status: string; toTrusts: boolean }[] },
  currentUserId: string | null
) {
  if (!currentUserId) return false;
  if (post.authorId === currentUserId) return true;
  const request = post.connectRequests[0];
  return request?.status === "ACCEPTED" && request.toTrusts;
}

async function applyPrivacy<
  T extends {
    text: string;
    author: { id: string; username: string };
    comments: { text: string; author: { id: string; username: string } }[];
  },
>(posts: T[], currentUserId: string | null) {
  const connected = currentUserId ? await trustedUserIds(currentUserId) : new Set<string>();
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

export async function getSearchCandidates(currentUserId: string) {
  const blocked = await blockedUserIds(currentUserId);

  const posts = await prisma.post.findMany({
    where: blocked.length > 0 ? { authorId: { notIn: blocked } } : {},
    orderBy: { createdAt: "desc" },
    include: postInclude(currentUserId),
    take: AI_SEARCH_CANDIDATE_LIMIT,
  });
  return applyPrivacy(posts, currentUserId);
}

export async function getLikedPosts(userId: string) {
  const likes = await prisma.like.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { postId: true },
  });
  if (likes.length === 0) return [];

  const blocked = await blockedUserIds(userId);
  const postIds = likes.map((l) => l.postId);

  const posts = await prisma.post.findMany({
    where: {
      id: { in: postIds },
      ...(blocked.length > 0 ? { authorId: { notIn: blocked } } : {}),
    },
    include: postInclude(userId),
  });

  const byId = new Map(posts.map((p) => [p.id, p]));
  const ordered = postIds
    .map((id) => byId.get(id))
    .filter((p): p is (typeof posts)[number] => !!p);

  return applyPrivacy(ordered, userId);
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
