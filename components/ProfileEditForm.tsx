"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CITIES, LIMITS } from "@/lib/config";

export default function ProfileEditForm({
  user,
}: {
  user: { name: string; city: string; occupation: string | null; bio: string | null; contact: string | null };
}) {
  const router = useRouter();
  const knownCity = (CITIES as readonly string[]).includes(user.city);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [city, setCity] = useState(knownCity ? user.city : "Другой");
  const [otherCity, setOtherCity] = useState(knownCity ? "" : user.city);
  const [occupation, setOccupation] = useState(user.occupation ?? "");
  const [bio, setBio] = useState(user.bio ?? "");
  const [contact, setContact] = useState(user.contact ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const res = await fetch("/api/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, city, otherCity, occupation, bio, contact }),
    });

    setIsSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Не получилось сохранить");
      return;
    }

    setEditing(false);
    router.refresh();
  }

  if (!editing) {
    return (
      <button type="button" onClick={() => setEditing(true)} className="btn btn-secondary">
        Редактировать профиль
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="card flex flex-col gap-4 p-4">
      <label className="flex flex-col gap-1 text-sm">
        Имя
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={LIMITS.name.max} required />
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
        Чем занимаешься
        <input value={occupation} onChange={(e) => setOccupation(e.target.value)} maxLength={LIMITS.occupation.max} />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        О себе
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={LIMITS.bio.max} rows={2} />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Телеграм или инстаграм
        <input value={contact} onChange={(e) => setContact(e.target.value)} maxLength={LIMITS.contact.max} placeholder="@username" />
      </label>

      {error && (
        <p className="text-sm" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <button type="submit" disabled={isSubmitting} className="btn btn-primary flex-1">
          {isSubmitting ? "Сохраняем…" : "Сохранить"}
        </button>
        <button type="button" onClick={() => setEditing(false)} className="btn btn-ghost">
          Отмена
        </button>
      </div>
    </form>
  );
}
