"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

export default function SettingsSection({ initialIconsSide }: { initialIconsSide: "left" | "right" }) {
  const router = useRouter();
  const [iconsSide, setIconsSide] = useState(initialIconsSide);
  const [isSavingSide, setIsSavingSide] = useState(false);
  const [isResettingTour, setIsResettingTour] = useState(false);

  async function changeSide(side: "left" | "right") {
    if (side === iconsSide) return;
    setIconsSide(side);
    setIsSavingSide(true);
    await fetch("/api/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ headerIconsSide: side }),
    });
    setIsSavingSide(false);
    router.refresh();
  }

  async function replayTour() {
    setIsResettingTour(true);
    await fetch("/api/me/tour", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tour: "reset" }),
    });
    setIsResettingTour(false);
    router.refresh();
  }

  return (
    <div className="card flex flex-col gap-4 p-4">
      <h2 className="text-sm font-semibold">⚙️ Настройки</h2>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm" style={{ color: "var(--fg-muted)" }}>
          Значки в шапке — с какой стороны удобнее (право- или левша)
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => changeSide("left")}
            disabled={isSavingSide}
            className={iconsSide === "left" ? "btn btn-primary !px-3 !py-1.5 text-sm" : "btn btn-secondary !px-3 !py-1.5 text-sm"}
          >
            Слева
          </button>
          <button
            type="button"
            onClick={() => changeSide("right")}
            disabled={isSavingSide}
            className={iconsSide === "right" ? "btn btn-primary !px-3 !py-1.5 text-sm" : "btn btn-secondary !px-3 !py-1.5 text-sm"}
          >
            Справа
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="text-sm" style={{ color: "var(--fg-muted)" }}>
          Тема оформления
        </span>
        <ThemeToggle />
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="text-sm" style={{ color: "var(--fg-muted)" }}>
          Показать обучающий тур ещё раз
        </span>
        <button
          type="button"
          onClick={replayTour}
          disabled={isResettingTour}
          className="btn btn-secondary !px-3 !py-1.5 text-sm"
        >
          {isResettingTour ? "…" : "Повторить"}
        </button>
      </div>
    </div>
  );
}
