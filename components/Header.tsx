import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header({
  user,
  pendingRequests,
}: {
  user: { id: string; name: string } | null;
  pendingRequests: number;
}) {
  return (
    <header
      className="sticky top-0 z-20 border-b backdrop-blur"
      style={{ background: "color-mix(in srgb, var(--bg) 88%, transparent)", borderColor: "var(--border)" }}
    >
      <div className="mx-auto flex max-w-xl items-center justify-between gap-2 px-4 py-3">
        <Link href="/feed" className="brand text-lg font-extrabold tracking-tight">
          Bailanysta
        </Link>

        <div className="flex items-center gap-2">
          {user && (
            <Link href="/search" aria-label="Поиск" className="btn btn-ghost !p-2 text-xl leading-none">
              🔍
            </Link>
          )}
          <ThemeToggle />
          {user ? (
            <>
              <Link href="/requests" aria-label="Запросы на связь" className="btn btn-ghost relative !p-2 text-xl leading-none">
                🔔
                {pendingRequests > 0 && (
                  <span
                    className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold"
                    style={{ background: "var(--danger)", color: "#fff" }}
                  >
                    {pendingRequests}
                  </span>
                )}
              </Link>
              <Link href="/me" className="btn btn-secondary !px-3 !py-2 text-sm">
                {user.name}
              </Link>
              <form action="/api/auth/logout" method="post">
                <button type="submit" className="btn btn-ghost !px-3 !py-2 text-sm">
                  Выйти
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" className="btn btn-primary !px-3 !py-2 text-sm">
              Войти
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
