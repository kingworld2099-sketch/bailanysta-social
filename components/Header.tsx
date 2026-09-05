import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header({
  user,
}: {
  user: { id: string; name: string } | null;
}) {
  return (
    <header className="sticky top-0 z-20 border-b" style={{ background: "var(--bg)", borderColor: "var(--border)" }}>
      <div className="mx-auto flex max-w-xl items-center justify-between gap-2 px-4 py-3">
        <Link href="/feed" className="text-lg font-bold tracking-tight">
          Bailanysta
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/search" aria-label="Поиск" className="btn btn-ghost !p-2 text-xl leading-none">
            🔍
          </Link>
          <ThemeToggle />
          {user ? (
            <>
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
