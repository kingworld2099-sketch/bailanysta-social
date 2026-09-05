import Link from "next/link";
import { VIBE_LABELS, VIBE_COLOR_VAR, VibeCode } from "@/lib/config";
import { formatRelativeTime } from "@/lib/format";
import LikeButton from "./LikeButton";
import CommentsSection from "./CommentsSection";
import DeletePostButton from "./DeletePostButton";
import EditablePostText from "./EditablePostText";
import type { FeedPost } from "@/lib/feed";

export default function PostCard({
  post,
  currentUserId,
  isLoggedIn,
}: {
  post: FeedPost;
  currentUserId: string | null;
  isLoggedIn: boolean;
}) {
  const vibe = post.vibe as VibeCode;

  return (
    <article
      className="card p-4"
      style={{ borderLeft: `4px solid var(${VIBE_COLOR_VAR[vibe]})` }}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm">
          <Link href={`/profile/${post.author.id}`} className="font-semibold">
            {post.author.name}
          </Link>
          <span
            className="rounded-full px-2 py-0.5 text-xs font-semibold"
            style={{ background: `var(${VIBE_COLOR_VAR[vibe]})`, color: "#fff" }}
          >
            {VIBE_LABELS[vibe]}
          </span>
        </div>
        <span className="text-xs" style={{ color: "var(--fg-muted)" }}>
          {formatRelativeTime(post.createdAt)}
        </span>
      </div>

      <EditablePostText
        postId={post.id}
        initialText={post.text}
        initialPlace={post.place}
        initialPlannedAt={post.plannedAt}
        isOwn={currentUserId === post.author.id}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <LikeButton
            postId={post.id}
            initialLiked={post.likes.length > 0}
            initialCount={post._count.likes}
            isLoggedIn={isLoggedIn}
          />
        </div>
        {currentUserId === post.author.id && <DeletePostButton postId={post.id} />}
      </div>

      <div className="mt-3 border-t pt-3" style={{ borderColor: "var(--border)" }}>
        <CommentsSection postId={post.id} initialComments={post.comments} isLoggedIn={isLoggedIn} />
      </div>
    </article>
  );
}
