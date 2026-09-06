import Link from "next/link";

function Badge({ n }: { n: number }) {
  return (
    <span
      className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold"
      style={{ background: "var(--danger)", color: "#fff" }}
    >
      {n}
    </span>
  );
}

export default function Header({
  user,
  pendingRequests,
  unseenLikes,
  unseenMessages,
  iconsSide,
}: {
  user: { id: string; name: string } | null;
  pendingRequests: number;
  unseenLikes: number;
  unseenMessages: number;
  iconsSide: "left" | "right";
}) {
  const brandOrder = iconsSide === "left" ? "order-2" : "order-1";
  const iconsOrder = iconsSide === "left" ? "order-1" : "order-2";

  return (
    <header
      className="sticky top-0 z-20 border-b backdrop-blur"
      style={{ background: "color-mix(in srgb, var(--bg) 88%, transparent)", borderColor: "var(--border)" }}
    >
      <div className="mx-auto flex max-w-xl items-center justify-between gap-2 px-3 py-2.5">
        <Link href="/feed" className={`brand shrink-0 text-lg font-extrabold tracking-tight ${brandOrder}`}>
          Bailanysta
        </Link>

        <div className={`flex min-w-0 items-center gap-1 overflow-x-auto ${iconsOrder}`}>
          {user && (
            <Link
              id="tour-search-icon"
              href="/search"
              aria-label="Поиск"
              className="btn btn-ghost shrink-0 !p-1.5 text-lg leading-none"
            >
              🔍
            </Link>
          )}
          {user ? (
            <>
              <Link
                id="tour-likes-icon"
                href="/likes"
                aria-label="Лайки"
                className="btn btn-ghost relative shrink-0 !p-1.5 text-lg leading-none"
              >
                ❤️
                {unseenLikes > 0 && <Badge n={unseenLikes} />}
              </Link>
              <Link
                id="tour-messages-icon"
                href="/messages"
                aria-label="Сообщения"
                className="btn btn-ghost relative shrink-0 !p-1.5 text-lg leading-none"
              >
                💬
                {unseenMessages > 0 && <Badge n={unseenMessages} />}
              </Link>
              <Link
                id="tour-requests-icon"
                href="/requests"
                aria-label="Запросы на связь"
                className="btn btn-ghost relative shrink-0 !p-1.5 text-lg leading-none"
              >
                🔔
                {pendingRequests > 0 && <Badge n={pendingRequests} />}
              </Link>
              <Link href="/me" className="btn btn-secondary max-w-[6rem] shrink-0 truncate !px-2.5 !py-1.5 text-sm">
                {user.name}
              </Link>
              <form action="/api/auth/logout" method="post" className="shrink-0">
                <button type="submit" className="btn btn-ghost shrink-0 !px-2 !py-1.5 text-sm">
                  Выйти
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" className="btn btn-primary shrink-0 !px-3 !py-2 text-sm">
              Войти
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
