"use client";

import { useState } from "react";
import GuestModal from "./GuestModal";

export default function CommentLikeButton({
  commentId,
  initialLiked,
  initialCount,
  isLoggedIn,
}: {
  commentId: string;
  initialLiked: boolean;
  initialCount: number;
  isLoggedIn: boolean;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [showModal, setShowModal] = useState(false);

  async function toggle() {
    if (!isLoggedIn) {
      setShowModal(true);
      return;
    }

    const nextLiked = !liked;
    setLiked(nextLiked);
    setCount((c) => c + (nextLiked ? 1 : -1));

    const res = await fetch(`/api/comments/${commentId}/like`, { method: "POST" });

    if (!res.ok) {
      setLiked(!nextLiked);
      setCount((c) => c + (nextLiked ? -1 : 1));
      return;
    }

    const data = await res.json();
    setLiked(data.liked);
    setCount(data.count);
  }

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        className="inline-flex items-center gap-1 text-xs font-medium"
        style={{ color: liked ? "var(--danger)" : "var(--fg-muted)" }}
      >
        <span>{liked ? "❤️" : "🤍"}</span>
        {count > 0 && <span>{count}</span>}
      </button>
      {showModal && <GuestModal action="поставить лайк" onClose={() => setShowModal(false)} />}
    </>
  );
}
