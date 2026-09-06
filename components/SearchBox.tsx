"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBox({
  initialQuery,
  initialAi,
}: {
  initialQuery: string;
  initialAi: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);
  const [ai, setAi] = useState(initialAi);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({ q: value.trim() });
    if (ai) params.set("ai", "1");
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={ai ? "Опишите что ищете своими словами" : "Введите слово: кофе, зал, прогулка"}
          className="flex-1"
          autoFocus
        />
        <button type="submit" className="btn btn-primary">
          Найти
        </button>
      </div>
      <label className="flex w-fit items-center gap-2 text-sm" style={{ color: "var(--fg-muted)" }}>
        <input type="checkbox" checked={ai} onChange={(e) => setAi(e.target.checked)} className="h-4 w-4" />
        🤖 Искать по смыслу (ИИ)
      </label>
    </form>
  );
}
