"use client";

import { useState } from "react";
import Link from "next/link";
import GuestModal from "./GuestModal";
import { formatRelativeTime, fullName } from "@/lib/format";
import { LIMITS } from "@/lib/config";
import MentionText from "./MentionText";

type CommentItem = {
  id: string;
  text: string;
  createdAt: string | Date;
  author: { id: string; name: string; lastName: string | null; username: string | null };
};

export default function CommentsSection({
  postId,
  initialComments,
  isLoggedIn,
}: {
  postId: string;
  initialComments: CommentItem[];
  isLoggedIn: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState(initialComments);
  const [text, setText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!isLoggedIn) {
      setShowModal(true);
      return;
    }
    if (text.trim().length === 0 || text.length > LIMITS.commentText.max) return;

    setIsSubmitting(true);
    setError(null);

    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    setIsSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Не получилось добавить комментарий");
      return;
    }

    const data = await res.json();
    setComments((prev) => [...prev, data.comment]);
    setText("");
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-sm font-medium"
        style={{ color: "var(--fg-muted)" }}
      >
        💬 Комментарии ({comments.length})
      </button>

      {open && (
        <div className="mt-3 flex flex-col gap-3">
          {comments.map((c) => (
            <div key={c.id} className="text-sm">
              <Link href={`/profile/${c.author.id}`} className="font-semibold">
                {fullName(c.author)}
              </Link>{" "}
              <span style={{ color: "var(--fg-muted)" }}>
                {c.author.username && `@${c.author.username} · `}
                {formatRelativeTime(c.createdAt)}
              </span>
              <p>
                <MentionText text={c.text} />
              </p>
            </div>
          ))}

          {isLoggedIn ? (
            <div className="flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Написать комментарий…"
                maxLength={LIMITS.commentText.max}
                className="flex-1 !py-2 text-sm"
              />
              <button
                type="button"
                onClick={submit}
                disabled={isSubmitting || text.trim().length === 0}
                className="btn btn-primary !px-4 !py-2 text-sm"
              >
                Отпр.
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="text-left text-sm underline"
              style={{ color: "var(--accent)" }}
            >
              Войдите, чтобы прокомментировать
            </button>
          )}

          {error && (
            <p className="text-sm" style={{ color: "var(--danger)" }}>
              {error}
            </p>
          )}
        </div>
      )}

      {showModal && <GuestModal action="прокомментировать" onClose={() => setShowModal(false)} />}
    </div>
  );
}
