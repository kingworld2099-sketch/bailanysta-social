"use client";

import { useRouter } from "next/navigation";
import { CITIES } from "@/lib/config";

export default function FeedControls({
  isLoggedIn,
  scope,
  city,
  searchParamsString,
}: {
  isLoggedIn: boolean;
  scope: "mine" | "all";
  city: string | null;
  searchParamsString: string;
}) {
  const router = useRouter();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParamsString);
    if (value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/feed?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {isLoggedIn ? (
        <div className="inline-flex overflow-hidden rounded-full border" style={{ borderColor: "var(--border)" }}>
          <button
            type="button"
            onClick={() => updateParam("scope", "")}
            className="px-4 py-2 text-sm font-semibold"
            style={{
              background: scope === "mine" ? "var(--accent)" : "transparent",
              color: scope === "mine" ? "var(--accent-fg)" : "var(--fg-muted)",
            }}
          >
            Только мой вайб
          </button>
          <button
            type="button"
            onClick={() => updateParam("scope", "all")}
            className="px-4 py-2 text-sm font-semibold"
            style={{
              background: scope === "all" ? "var(--accent)" : "transparent",
              color: scope === "all" ? "var(--accent-fg)" : "var(--fg-muted)",
            }}
          >
            Все
          </button>
        </div>
      ) : (
        <span />
      )}

      <select
        value={city ?? "all"}
        onChange={(e) => updateParam("city", e.target.value === "all" ? "all" : e.target.value)}
        className="!w-auto !py-2 text-sm"
        aria-label="Город"
      >
        {city && !(CITIES as readonly string[]).includes(city) && (
          <option value={city}>{city}</option>
        )}
        {CITIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
        <option value="all">Все города</option>
      </select>
    </div>
  );
}
