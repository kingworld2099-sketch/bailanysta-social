import Link from "next/link";
import RegisterForm from "@/components/RegisterForm";
import ProjectIntro from "@/components/ProjectIntro";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-8">
      <ProjectIntro />
      <h1 className="mb-6 text-2xl font-bold">Регистрация</h1>
      <RegisterForm />
      <p className="mt-6 text-center text-sm" style={{ color: "var(--fg-muted)" }}>
        Уже есть аккаунт?{" "}
        <Link href="/login" className="font-semibold" style={{ color: "var(--accent)" }}>
          Войти
        </Link>
      </p>
    </div>
  );
}
