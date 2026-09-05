"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LIMITS, VIBE_LABELS, VibeCode } from "@/lib/config";

export default function PostComposer({ vibe }: { vibe: VibeCode }) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const max = LIMITS.postText.max;
  const length = text.length;
  const isNearLimit = length > max - 40;
  const canSubmit = length > 0 && length <= max && !isSubmitting;

  async function submit() {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setError(null);

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    setIsSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Не получилось опубликовать пост");
      return;
    }

    setText("");
    router.refresh();
  }

  return (
    <div className="card p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="chip !cursor-default" style={{ pointerEvents: "none" }}>
          {VIBE_LABELS[vibe]}
        </span>
        <span className="text-sm" style={{ color: isNearLimit ? "var(--danger)" : "var(--fg-muted)" }}>
          {length} / {max}
        </span>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Что у тебя происходит прямо сейчас?"
        rows={3}
        className="w-full resize-none"
      />
      {error && (
        <p className="mt-2 text-sm" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}
      <div className="mt-3 flex justify-end">
        <button type="button" onClick={submit} disabled={!canSubmit} className="btn btn-primary">
          {isSubmitting ? "Публикую…" : "Опубликовать"}
        </button>
      </div>
    </div>
  );
}
