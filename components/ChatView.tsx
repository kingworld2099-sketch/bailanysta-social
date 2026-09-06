"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { fullName, ruPlural } from "@/lib/format";
import { CHAT_POLL_MS, LIMITS } from "@/lib/config";

type ChatMessage = {
  id: string;
  text: string;
  createdAt: string;
  author: { id: string; name: string; lastName: string | null };
};

function timeLeftLabel(expiresAt: number): string {
  const ms = expiresAt - Date.now();
  if (ms <= 0) return "чат истёк";
  const hours = Math.floor(ms / (60 * 60 * 1000));
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
  if (hours >= 1) return `осталось ${hours} ${ruPlural(hours, ["час", "часа", "часов"])}`;
  return `осталось ${minutes} ${ruPlural(minutes, ["минута", "минуты", "минут"])}`;
}

export default function ChatView({
  requestId,
  currentUserId,
  initialMessages,
  initialExpiresAt,
}: {
  requestId: string;
  currentUserId: string;
  initialMessages: ChatMessage[];
  initialExpiresAt: string;
}) {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [expiresAt] = useState(new Date(initialExpiresAt).getTime());
  const [now, setNow] = useState(() => Date.now());
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ended, setEnded] = useState(false);
  const [confirmingEnd, setConfirmingEnd] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    if (now >= expiresAt) return;

    const poll = setInterval(async () => {
      try {
        const res = await fetch(`/api/chat/${requestId}/messages`);
        if (!res.ok) return;
        const data = await res.json();
        setMessages(data.messages ?? []);
      } catch {
        // network hiccup — try again next tick
      }
    }, CHAT_POLL_MS);

    return () => clearInterval(poll);
  }, [requestId, now, expiresAt]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  const isActive = now < expiresAt && !ended;

  async function send() {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length > LIMITS.messageText.max) return;

    setIsSending(true);
    setError(null);

    const res = await fetch(`/api/chat/${requestId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: trimmed }),
    });

    setIsSending(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Не получилось отправить сообщение");
      return;
    }

    const data = await res.json();
    setMessages((prev) => [...prev, data.message]);
    setText("");
  }

  async function endChat() {
    setIsEnding(true);
    const res = await fetch(`/api/chat/${requestId}/end`, { method: "POST" });
    setIsEnding(false);

    if (res.ok) {
      setEnded(true);
      router.refresh();
    }
  }

  return (
    <div className="card flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium" style={{ color: isActive ? "var(--accent)" : "var(--danger)" }}>
          {isActive ? timeLeftLabel(expiresAt) : "чат завершён"}
        </span>
        {isActive && !confirmingEnd && (
          <button type="button" onClick={() => setConfirmingEnd(true)} className="text-xs" style={{ color: "var(--danger)" }}>
            Завершить
          </button>
        )}
        {isActive && confirmingEnd && (
          <span className="inline-flex items-center gap-2 text-xs">
            <span style={{ color: "var(--fg-muted)" }}>Завершить и заблокировать?</span>
            <button type="button" onClick={endChat} disabled={isEnding} className="font-semibold" style={{ color: "var(--danger)" }}>
              Да
            </button>
            <button type="button" onClick={() => setConfirmingEnd(false)} style={{ color: "var(--fg-muted)" }}>
              Нет
            </button>
          </span>
        )}
      </div>

      <div ref={listRef} className="flex max-h-96 flex-col gap-2 overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
            Сообщений пока нет — напишите первым
          </p>
        )}
        {messages.map((m) => {
          const mine = m.author.id === currentUserId;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className="max-w-[80%] rounded-2xl px-3 py-2 text-sm"
                style={{
                  background: mine ? "var(--accent)" : "var(--bg)",
                  color: mine ? "var(--accent-fg)" : "var(--fg)",
                }}
              >
                {!mine && (
                  <p className="mb-0.5 text-xs font-semibold" style={{ color: "var(--fg-muted)" }}>
                    {fullName(m.author)}
                  </p>
                )}
                {m.text}
              </div>
            </div>
          );
        })}
      </div>

      {isActive ? (
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
            placeholder="Написать сообщение…"
            maxLength={LIMITS.messageText.max}
            className="flex-1 !py-2 text-sm"
          />
          <button
            type="button"
            onClick={send}
            disabled={isSending || text.trim().length === 0}
            className="btn btn-primary !px-4 !py-2 text-sm"
          >
            Отпр.
          </button>
        </div>
      ) : (
        <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
          Переписка больше не доступна.
        </p>
      )}

      {error && (
        <p className="text-sm" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
