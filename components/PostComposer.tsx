"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LIMITS, VIBES, VIBE_LABELS, VIBE_COLOR_VAR, VibeCode } from "@/lib/config";

export default function PostComposer({ vibe }: { vibe: VibeCode }) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [selectedVibe, setSelectedVibe] = useState<VibeCode>(vibe);
  const [place, setPlace] = useState("");
  const [plannedAt, setPlannedAt] = useState("");
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
      body: JSON.stringify({ text, vibe: selectedVibe, place, plannedAt }),
    });

    setIsSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Не получилось опубликовать пост");
      return;
    }

    setText("");
    setPlace("");
    setPlannedAt("");
    router.refresh();
  }

  return (
    <div
      className="card p-4"
      style={{ borderColor: `var(${VIBE_COLOR_VAR[selectedVibe]})` }}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        {VIBES.map((v) => {
          const active = v === selectedVibe;
          return (
            <button
              key={v}
              type="button"
              onClick={() => setSelectedVibe(v)}
              className="chip"
              style={
                active
                  ? {
                      background: `var(${VIBE_COLOR_VAR[v]})`,
                      borderColor: `var(${VIBE_COLOR_VAR[v]})`,
                      color: "#fff",
                    }
                  : undefined
              }
            >
              {VIBE_LABELS[v]}
            </button>
          );
        })}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Что у тебя происходит прямо сейчас?"
        rows={3}
        className="w-full resize-none"
      />
      <div className="mt-1 flex justify-end">
        <span className="text-sm" style={{ color: isNearLimit ? "var(--danger)" : "var(--fg-muted)" }}>
          {length} / {max}
        </span>
      </div>

      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <input
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          placeholder="Где будешь? (необязательно)"
          maxLength={LIMITS.place.max}
        />
        <input
          value={plannedAt}
          onChange={(e) => setPlannedAt(e.target.value)}
          placeholder="Когда? (необязательно)"
          maxLength={LIMITS.plannedAt.max}
        />
      </div>

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
