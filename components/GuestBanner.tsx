import Link from "next/link";

export default function GuestBanner() {
  return (
    <div
      className="mx-auto flex max-w-xl flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm"
      style={{ background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)" }}
    >
      <span style={{ color: "var(--fg-muted)" }}>Вы смотрите как гость</span>
      <div className="flex gap-2">
        <form action="/api/auth/demo" method="post">
          <button type="submit" className="btn btn-secondary !px-3 !py-2 text-sm">
            Войти как демо
          </button>
        </form>
        <Link href="/register" className="btn btn-primary !px-3 !py-2 text-sm">
          Создать аккаунт
        </Link>
      </div>
    </div>
  );
}
