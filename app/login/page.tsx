import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Вход</h1>
      <LoginForm />

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
        <span className="text-xs" style={{ color: "var(--fg-muted)" }}>
          или
        </span>
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
      </div>

      <form action="/api/auth/demo" method="post">
        <button type="submit" className="btn btn-secondary w-full">
          Войти как демо
        </button>
      </form>

      <p className="mt-6 text-center text-sm" style={{ color: "var(--fg-muted)" }}>
        Ещё нет аккаунта?{" "}
        <Link href="/register" className="font-semibold" style={{ color: "var(--accent)" }}>
          Зарегистрироваться
        </Link>
      </p>
    </div>
  );
}
