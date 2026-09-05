import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
      <div className="text-6xl">🤷</div>
      <h1 className="text-2xl font-bold">Страница не найдена</h1>
      <p style={{ color: "var(--fg-muted)" }}>Такой страницы нет — возможно, ссылка устарела.</p>
      <Link href="/feed" className="btn btn-primary">
        На главную
      </Link>
    </div>
  );
}
