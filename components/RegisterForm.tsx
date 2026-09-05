"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CITIES, LIMITS } from "@/lib/config";

export default function RegisterForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState<string>(CITIES[0]);
  const [otherCity, setOtherCity] = useState("");
  const [password, setPassword] = useState("");
  const [occupation, setOccupation] = useState("");
  const [bio, setBio] = useState("");
  const [contact, setContact] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, name, city, otherCity, password, occupation, bio, contact }),
    });

    setIsSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Не получилось зарегистрироваться");
      return;
    }

    router.push("/feed?onboarding=tips");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        Логин (для входа, латиницей)
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="aigerim_k"
          maxLength={LIMITS.username.max}
          required
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Имя (его увидят другие)
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Айгерим"
          maxLength={LIMITS.name.max}
          required
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Город
        <select value={city} onChange={(e) => setCity(e.target.value)}>
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
          <option value="Другой">Другой</option>
        </select>
      </label>

      {city === "Другой" && (
        <label className="flex flex-col gap-1 text-sm">
          Введите город
          <input value={otherCity} onChange={(e) => setOtherCity(e.target.value)} required />
        </label>
      )}

      <label className="flex flex-col gap-1 text-sm">
        Пароль
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={LIMITS.password.min}
          required
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Чем занимаешься (необязательно)
        <input value={occupation} onChange={(e) => setOccupation(e.target.value)} maxLength={LIMITS.occupation.max} />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        О себе (необязательно)
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={LIMITS.bio.max} rows={2} />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Телеграм или инстаграм (необязательно)
        <input value={contact} onChange={(e) => setContact(e.target.value)} maxLength={LIMITS.contact.max} placeholder="@username" />
      </label>

      {error && (
        <p className="text-sm" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}

      <button type="submit" disabled={isSubmitting} className="btn btn-primary">
        {isSubmitting ? "Регистрируем…" : "Создать аккаунт"}
      </button>
    </form>
  );
}
