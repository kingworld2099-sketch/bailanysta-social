"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeletePostButton({ postId }: { postId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  async function remove() {
    setIsDeleting(true);
    const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    setIsDeleting(false);
    if (res.ok) {
      setDeleted(true);
      router.refresh();
    }
  }

  if (deleted) {
    return (
      <span className="text-sm" style={{ color: "var(--fg-muted)" }}>
        Удаляю…
      </span>
    );
  }

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-2 text-sm">
        <span style={{ color: "var(--fg-muted)" }}>Удалить пост?</span>
        <button type="button" onClick={remove} disabled={isDeleting} className="font-semibold" style={{ color: "var(--danger)" }}>
          Да
        </button>
        <button type="button" onClick={() => setConfirming(false)} style={{ color: "var(--fg-muted)" }}>
          Нет
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="text-sm"
      style={{ color: "var(--fg-muted)" }}
    >
      Удалить
    </button>
  );
}
