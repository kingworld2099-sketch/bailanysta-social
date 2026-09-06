"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type RequestStatus = "PENDING" | "ACCEPTED" | "DECLINED";

export default function ConnectButton({
  postId,
  isOwn,
  myRequest,
}: {
  postId: string;
  isOwn: boolean;
  myRequest: { id: string; status: RequestStatus } | null;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isOwn) return null;

  if (myRequest?.status === "ACCEPTED") {
    return (
      <Link href={`/chat/${myRequest.id}`} className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
        Перейти в чат
      </Link>
    );
  }

  if (myRequest?.status === "PENDING") {
    return (
      <span className="text-sm" style={{ color: "var(--fg-muted)" }}>
        Запрос отправлен
      </span>
    );
  }

  if (myRequest?.status === "DECLINED") {
    return (
      <span className="text-sm" style={{ color: "var(--fg-muted)" }}>
        Отклонено
      </span>
    );
  }

  async function send() {
    setIsSubmitting(true);
    setError(null);

    const res = await fetch(`/api/posts/${postId}/connect`, { method: "POST" });

    setIsSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Не получилось отправить запрос");
      return;
    }

    router.refresh();
  }

  return (
    <div>
      <button type="button" onClick={send} disabled={isSubmitting} className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
        {isSubmitting ? "Отправляю…" : "Хочу законнектиться"}
      </button>
      {error && (
        <p className="mt-1 text-xs" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
