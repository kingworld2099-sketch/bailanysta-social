"use client";

import { useState } from "react";

export default function ReportButton({
  reportedUserId,
  context,
}: {
  reportedUserId: string;
  context: string;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setIsSubmitting(true);
    setError(null);

    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportedUserId, context, reason }),
    });

    setIsSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Не получилось отправить жалобу");
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <span className="text-xs" style={{ color: "var(--fg-muted)" }}>
        Жалоба отправлена — спасибо
      </span>
    );
  }

  if (open) {
    return (
      <div className="flex flex-col gap-1.5">
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Что произошло? (необязательно)"
          maxLength={500}
          rows={2}
          className="text-xs"
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={submit}
            disabled={isSubmitting}
            className="text-xs font-semibold"
            style={{ color: "var(--danger)" }}
          >
            {isSubmitting ? "Отправляю…" : "Отправить жалобу"}
          </button>
          <button type="button" onClick={() => setOpen(false)} className="text-xs" style={{ color: "var(--fg-muted)" }}>
            Отмена
          </button>
        </div>
        {error && (
          <p className="text-xs" style={{ color: "var(--danger)" }}>
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <button type="button" onClick={() => setOpen(true)} className="text-xs" style={{ color: "var(--fg-muted)" }}>
      ⚠️ Пожаловаться
    </button>
  );
}
