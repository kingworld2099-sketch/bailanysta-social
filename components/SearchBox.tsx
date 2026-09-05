"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBox({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(value.trim())}`);
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Введите слово: кофе, зал, прогулка"
        className="flex-1"
        autoFocus
      />
      <button type="submit" className="btn btn-primary">
        Найти
      </button>
    </form>
  );
}
