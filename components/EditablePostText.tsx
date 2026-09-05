"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LIMITS } from "@/lib/config";

export default function EditablePostText({
  postId,
  initialText,
  isOwn,
}: {
  postId: string;
  initialText: string;
  isOwn: boolean;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(initialText);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    const trimmed = text.trim();
    if (trimmed.length === 0 || trimmed.length > LIMITS.postText.max) return;

    setIsSubmitting(true);
    setError(null);

    const res = await fetch(`/api/posts/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: trimmed }),
    });

    setIsSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Не получилось сохранить");
      return;
    }

    setEditing(false);
    router.refresh();
  }

  if (!editing) {
    return (
      <div className="mb-3">
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{text}</p>
        {isOwn && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="mt-1 text-sm"
            style={{ color: "var(--fg-muted)" }}
          >
            Редактировать
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="mb-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        maxLength={LIMITS.postText.max}
        className="w-full resize-none text-[15px]"
      />
      <div className="mt-1 flex items-center justify-between">
        <span className="text-xs" style={{ color: "var(--fg-muted)" }}>
          {text.length} / {LIMITS.postText.max}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setText(initialText);
              setEditing(false);
              setError(null);
            }}
            className="btn btn-ghost !px-3 !py-1.5 text-sm"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={save}
            disabled={isSubmitting || text.trim().length === 0}
            className="btn btn-primary !px-3 !py-1.5 text-sm"
          >
            {isSubmitting ? "Сохраняем…" : "Сохранить"}
          </button>
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
