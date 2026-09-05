"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    setIsSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Не получилось войти");
      return;
    }

    router.push("/feed");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        Логин
        <input value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Пароль
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>

      {error && (
        <p className="text-sm" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}

      <button type="submit" disabled={isSubmitting} className="btn btn-primary">
        {isSubmitting ? "Входим…" : "Войти"}
      </button>
    </form>
  );
}
