"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { VIBES, VIBE_LABELS, VibeCode } from "@/lib/config";

const VIBE_VAR: Record<VibeCode, string> = {
  MOVE: "--vibe-move",
  CALM: "--vibe-calm",
  DRAINED: "--vibe-drained",
  WORK: "--vibe-work",
};

export default function VibeSwitcher({
  active,
  isLoggedIn,
  searchParamsString,
}: {
  active: VibeCode | null;
  isLoggedIn: boolean;
  searchParamsString: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function select(vibe: VibeCode) {
    if (vibe === active) return;

    if (!isLoggedIn) {
      const params = new URLSearchParams(searchParamsString);
      params.set("vibe", vibe);
      router.push(`/feed?${params.toString()}`);
      return;
    }

    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/me/vibe", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vibe }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Не получилось сменить вайб");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {VIBES.map((vibe) => {
          const isActive = vibe === active;
          return (
            <button
              key={vibe}
              type="button"
              disabled={isPending}
              onClick={() => select(vibe)}
              className="chip justify-center"
              style={
                isActive
                  ? {
                      background: `var(${VIBE_VAR[vibe]})`,
                      borderColor: `var(${VIBE_VAR[vibe]})`,
                      color: "#fff",
                    }
                  : undefined
              }
            >
              {VIBE_LABELS[vibe]}
            </button>
          );
        })}
      </div>
      {error && (
        <p className="mt-2 text-sm" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
