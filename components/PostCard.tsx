import Link from "next/link";
import { VIBE_LABELS, VIBE_COLOR_VAR, VibeCode } from "@/lib/config";
import { formatRelativeTime, fullName } from "@/lib/format";
import LikeButton from "./LikeButton";
import CommentsSection from "./CommentsSection";
import DeletePostButton from "./DeletePostButton";
import EditablePostText from "./EditablePostText";
import { visiblePhotoUrl as getVisiblePhotoUrl } from "@/lib/photo";
import { isConnectedFor } from "@/lib/feed";
import ConnectButton from "./ConnectButton";
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
  const shownPhotoUrl = getVisiblePhotoUrl(post.photoUrl, post.createdAt);
  const hasExpiredPhoto = !!post.photoUrl && !shownPhotoUrl;
  const isOwn = currentUserId === post.author.id;
  const isConnected = isConnectedFor(post, currentUserId);
  const hasHiddenMeetInfo = !isConnected && !!(post.place || post.plannedAt);
  const myRequest = post.connectRequests[0] ?? null;

  return (
    <article
      className="card p-4"
      style={{ borderLeft: `4px solid var(${VIBE_COLOR_VAR[vibe]})` }}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2 text-sm">
            <Link href={`/profile/${post.author.id}`} className="font-semibold">
              {fullName(post.author)}
            </Link>
            <span
              className="rounded-full px-2 py-0.5 text-xs font-semibold"
              style={{ background: `var(${VIBE_COLOR_VAR[vibe]})`, color: "#fff" }}
            >
              {VIBE_LABELS[vibe]}
            </span>
          </div>
          {post.author.username && (
            <span className="text-xs" style={{ color: "var(--fg-muted)" }}>
              @{post.author.username}
            </span>
          )}
        </div>
        <span className="text-xs" style={{ color: "var(--fg-muted)" }}>
          {formatRelativeTime(post.createdAt)}
        </span>
      </div>

      <EditablePostText
        postId={post.id}
        initialText={post.text}
        initialPlace={isConnected ? post.place : null}
        initialPlannedAt={isConnected ? post.plannedAt : null}
        hasHiddenMeetInfo={hasHiddenMeetInfo}
        visiblePhotoUrl={shownPhotoUrl}
        hasExpiredPhoto={hasExpiredPhoto}
        isOwn={isOwn}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <LikeButton
            postId={post.id}
            initialLiked={post.likes.length > 0}
            initialCount={post._count.likes}
            isLoggedIn={isLoggedIn}
          />
          <ConnectButton postId={post.id} isOwn={isOwn} myRequest={myRequest} />
        </div>
        {isOwn && <DeletePostButton postId={post.id} />}
      </div>

      <div className="mt-3 border-t pt-3" style={{ borderColor: "var(--border)" }}>
        <CommentsSection postId={post.id} initialComments={post.comments} isLoggedIn={isLoggedIn} />
      </div>
    </article>
  );
}
