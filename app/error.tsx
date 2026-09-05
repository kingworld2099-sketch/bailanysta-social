"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
      <div className="text-6xl">😕</div>
      <h1 className="text-2xl font-bold">Что-то пошло не так</h1>
      <p style={{ color: "var(--fg-muted)" }}>Попробуйте обновить страницу.</p>
      <button type="button" onClick={reset} className="btn btn-primary">
        Обновить
      </button>
    </div>
  );
}
