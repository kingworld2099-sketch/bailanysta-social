"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BlockButton({
  userId,
  initialBlocked,
}: {
  userId: string;
  initialBlocked: boolean;
}) {
  const router = useRouter();
  const [blocked, setBlocked] = useState(initialBlocked);
  const [confirming, setConfirming] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle(next: boolean) {
    setIsSubmitting(true);
    setError(null);

    const res = await fetch(`/api/users/${userId}/block`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ block: next }),
    });

    setIsSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Не получилось выполнить действие");
      return;
    }

    setBlocked(next);
    setConfirming(false);
    router.refresh();
  }

  if (blocked) {
    return (
      <div className="flex flex-col items-start gap-0.5">
        <span className="text-xs font-semibold" style={{ color: "var(--danger)" }}>
          🚫 Пользователь заблокирован
        </span>
        <button
          type="button"
          onClick={() => toggle(false)}
          disabled={isSubmitting}
          className="text-xs underline"
          style={{ color: "var(--fg-muted)" }}
        >
          {isSubmitting ? "…" : "Разблокировать"}
        </button>
      </div>
    );
  }

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-2 text-xs">
        <span style={{ color: "var(--fg-muted)" }}>Заблокировать этого человека?</span>
        <button
          type="button"
          onClick={() => toggle(true)}
          disabled={isSubmitting}
          className="font-semibold"
          style={{ color: "var(--danger)" }}
        >
          Да
        </button>
        <button type="button" onClick={() => setConfirming(false)} style={{ color: "var(--fg-muted)" }}>
          Нет
        </button>
      </span>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-xs"
        style={{ color: "var(--fg-muted)" }}
      >
        🚫 Заблокировать
      </button>
      {error && (
        <p className="mt-1 text-xs" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
