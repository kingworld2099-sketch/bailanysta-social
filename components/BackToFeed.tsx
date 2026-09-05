import Link from "next/link";

export default function BackToFeed() {
  return (
    <Link
      href="/feed"
      className="inline-flex items-center gap-1 text-sm font-semibold"
      style={{ color: "var(--accent)" }}
    >
      ← Ко всем постам
    </Link>
  );
}
