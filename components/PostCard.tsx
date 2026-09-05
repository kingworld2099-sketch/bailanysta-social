import Link from "next/link";
import { VIBE_LABELS, VibeCode } from "@/lib/config";
import { formatRelativeTime } from "@/lib/format";
import LikeButton from "./LikeButton";
import CommentsSection from "./CommentsSection";
import DeletePostButton from "./DeletePostButton";
import type { FeedPost } from "@/lib/feed";

const VIBE_VAR: Record<VibeCode, string> = {
  MOVE: "--vibe-move",
  CALM: "--vibe-calm",
  DRAINED: "--vibe-drained",
  WORK: "--vibe-work",
};

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
    <article className="card p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm">
          <Link href={`/profile/${post.author.id}`} className="font-semibold">
            {post.author.name}
          </Link>
          <span
            className="rounded-full px-2 py-0.5 text-xs font-semibold"
            style={{ background: `var(${VIBE_VAR[vibe]})`, color: "#fff" }}
          >
            {VIBE_LABELS[vibe]}
          </span>
        </div>
        <span className="text-xs" style={{ color: "var(--fg-muted)" }}>
          {formatRelativeTime(post.createdAt)}
        </span>
      </div>

      <p className="mb-3 whitespace-pre-wrap text-[15px] leading-relaxed">{post.text}</p>

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
