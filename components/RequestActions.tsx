"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RequestActions({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function respond(action: "accept" | "decline") {
    setIsSubmitting(true);
    setError(null);

    const res = await fetch(`/api/requests/${requestId}/${action}`, { method: "POST" });

    setIsSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Не получилось выполнить действие");
      return;
    }

    setDone(true);
    router.refresh();
  }

  if (done) {
    return (
      <span className="text-sm" style={{ color: "var(--fg-muted)" }}>
        Готово…
      </span>
    );
  }

  return (
    <div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => respond("accept")}
          disabled={isSubmitting}
          className="btn btn-primary !px-4 !py-2 text-sm"
        >
          Принять
        </button>
        <button
          type="button"
          onClick={() => respond("decline")}
          disabled={isSubmitting}
          className="btn btn-ghost !px-4 !py-2 text-sm"
        >
          Отклонить
        </button>
      </div>
      {error && (
        <p className="mt-1 text-xs" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
