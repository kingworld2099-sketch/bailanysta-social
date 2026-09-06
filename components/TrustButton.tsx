"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TrustButton({
  requestId,
  initialTrusted,
}: {
  requestId: string;
  initialTrusted: boolean;
}) {
  const router = useRouter();
  const [trusted, setTrusted] = useState(initialTrusted);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    const next = !trusted;
    setIsSubmitting(true);
    setError(null);

    const res = await fetch(`/api/chat/${requestId}/trust`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trust: next }),
    });

    setIsSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Не получилось обновить доверие");
      return;
    }

    setTrusted(next);
    router.refresh();
  }

  if (trusted) {
    return (
      <div className="flex flex-col items-end gap-0.5">
        <span className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
          ✓ Вы раскрыли ему свою информацию
        </span>
        <button
          type="button"
          onClick={toggle}
          disabled={isSubmitting}
          className="text-xs underline"
          style={{ color: "var(--fg-muted)" }}
        >
          {isSubmitting ? "…" : "Отменить доверие"}
        </button>
        {error && (
          <p className="text-xs" style={{ color: "var(--danger)" }}>
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={toggle}
        disabled={isSubmitting}
        className="btn btn-secondary !px-3 !py-1.5 text-sm"
        title="Показать этому человеку своё имя, место встречи и контакт"
      >
        {isSubmitting ? "Отмечаю…" : "Доверять"}
      </button>
      {error && (
        <p className="mt-1 text-xs" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
