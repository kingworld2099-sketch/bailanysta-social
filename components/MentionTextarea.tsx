"use client";

import { useEffect, useRef, useState } from "react";
import { fullName } from "@/lib/format";

type UserOption = { id: string; name: string; lastName: string | null; username: string };

function detectMention(text: string, cursor: number): { start: number; query: string } | null {
  const before = text.slice(0, cursor);
  const at = before.lastIndexOf("@");
  if (at === -1) return null;

  const query = before.slice(at + 1);
  if (/\s/.test(query)) return null;

  return { start: at, query };
}

export default function MentionTextarea({
  value,
  onChange,
  placeholder,
  rows = 3,
  maxLength,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  className?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [mention, setMention] = useState<{ start: number; query: string } | null>(null);
  const [options, setOptions] = useState<UserOption[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!mention || mention.query.length === 0) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(mention.query)}`, {
          signal: controller.signal,
        });
        if (!res.ok) return;
        const data = await res.json();
        setOptions(data.users ?? []);
        setActiveIndex(0);
      } catch {
        // aborted or network error — ignore
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [mention]);

  function syncMentionState(nextValue: string, cursor: number) {
    setMention(detectMention(nextValue, cursor));
  }

  function selectUser(user: UserOption) {
    if (!mention) return;

    const before = value.slice(0, mention.start);
    const after = value.slice(mention.start + 1 + mention.query.length);
    const insert = `@${user.username} `;
    const nextValue = before + insert + after;

    onChange(nextValue);
    setMention(null);
    setOptions([]);

    requestAnimationFrame(() => {
      const pos = before.length + insert.length;
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(pos, pos);
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!mention || options.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + options.length) % options.length);
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      selectUser(options[activeIndex]);
    } else if (e.key === "Escape") {
      setMention(null);
      setOptions([]);
    }
  }

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          syncMentionState(e.target.value, e.target.selectionStart);
        }}
        onClick={(e) => syncMentionState(value, e.currentTarget.selectionStart)}
        onKeyUp={(e) => {
          if (!["ArrowDown", "ArrowUp", "Enter", "Tab", "Escape"].includes(e.key)) {
            syncMentionState(value, e.currentTarget.selectionStart);
          }
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={`w-full resize-none ${className}`}
      />

      {mention && mention.query.length > 0 && options.length > 0 && (
        <div
          className="card absolute left-0 right-0 top-full z-10 mt-1 max-h-56 overflow-y-auto p-1"
          style={{ background: "var(--bg-elevated)" }}
        >
          {options.map((user, i) => (
            <button
              key={user.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => selectUser(user)}
              className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm"
              style={{ background: i === activeIndex ? "var(--bg)" : "transparent" }}
            >
              <span className="font-medium">{fullName(user)}</span>
              <span style={{ color: "var(--fg-muted)" }}>@{user.username}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
