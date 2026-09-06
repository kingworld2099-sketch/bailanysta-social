import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { getLikedPosts } from "@/lib/feed";
import { getReceivedLikes, getReceivedCommentLikes, getLikedComments, markLikesSeen } from "@/lib/likes";
import { fullName, formatRelativeTime } from "@/lib/format";
import PostCard from "@/components/PostCard";
import EmptyState from "@/components/EmptyState";
import BackToFeed from "@/components/BackToFeed";

function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

export default async function LikesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [received, likedPosts, receivedCommentLikes, likedComments] = await Promise.all([
    getReceivedLikes(user.id),
    getLikedPosts(user.id),
    getReceivedCommentLikes(user.id),
    getLikedComments(user.id),
  ]);

  await markLikesSeen(user.id);

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-8 px-4 py-6">
      <BackToFeed />

      <div>
        <h1 className="mb-3 text-xl font-bold">❤️ Лайки на твои посты</h1>
        {received.length === 0 ? (
          <EmptyState title="Пока никто не лайкнул твои посты" />
        ) : (
          <div className="flex flex-col gap-2">
            {received.map((l) => (
              <div key={l.id} className="card flex items-center justify-between gap-3 p-3 text-sm">
                <span>
                  <Link href={`/profile/${l.user.id}`} className="font-semibold">
                    {fullName(l.user)}
                  </Link>{" "}
                  лайкнул(а) «{l.post.text.length > 40 ? `${l.post.text.slice(0, 40)}…` : l.post.text}»
                </span>
                <span className="shrink-0 text-xs" style={{ color: "var(--fg-muted)" }}>
                  {formatRelativeTime(l.createdAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-xl font-bold">Посты, которые ты лайкнул</h2>
        {likedPosts.length === 0 ? (
          <EmptyState title="Ты пока ничего не лайкнул" />
        ) : (
          <div className="flex flex-col gap-4">
            {likedPosts.map((post) => (
              <PostCard key={post.id} post={post} currentUserId={user.id} isLoggedIn />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-xl font-bold">❤️ Лайки на твои комментарии</h2>
        {receivedCommentLikes.length === 0 ? (
          <EmptyState title="Пока никто не лайкнул твои комментарии" />
        ) : (
          <div className="flex flex-col gap-2">
            {receivedCommentLikes.map((l) => (
              <div key={l.id} className="card flex items-center justify-between gap-3 p-3 text-sm">
                <span>
                  <Link href={`/profile/${l.user.id}`} className="font-semibold">
                    {fullName(l.user)}
                  </Link>{" "}
                  лайкнул(а) твой комментарий «{truncate(l.comment.text, 40)}»
                </span>
                <span className="shrink-0 text-xs" style={{ color: "var(--fg-muted)" }}>
                  {formatRelativeTime(l.createdAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-xl font-bold">Комментарии, которые ты лайкнул</h2>
        {likedComments.length === 0 ? (
          <EmptyState title="Ты пока не лайкнул ни одного комментария" />
        ) : (
          <div className="flex flex-col gap-2">
            {likedComments.map((l) => (
              <div key={l.id} className="card p-3 text-sm">
                <Link href={`/profile/${l.comment.author.id}`} className="font-semibold">
                  {fullName(l.comment.author)}
                </Link>
                <p style={{ color: "var(--fg-muted)" }}>{truncate(l.comment.text, 120)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
