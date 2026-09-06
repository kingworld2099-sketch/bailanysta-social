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

  if (trusted) {
    return (
      <span className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
        ✓ Вы доверяете
      </span>
    );
  }

  async function send() {
    setIsSubmitting(true);
    setError(null);

    const res = await fetch(`/api/chat/${requestId}/trust`, { method: "POST" });

    setIsSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Не получилось отметить доверие");
      return;
    }

    setTrusted(true);
    router.refresh();
  }

  return (
    <div>
      <button
        type="button"
        onClick={send}
        disabled={isSubmitting}
        className="btn btn-secondary !px-3 !py-1.5 text-sm"
        title="Открыть логин, место и контакт этого человека"
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
