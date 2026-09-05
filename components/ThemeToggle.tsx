"use client";

const STORAGE_KEY = "bailanysta-theme";

export default function ThemeToggle() {
  function toggle() {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Переключить тему"
      className="btn btn-ghost !p-2 text-xl leading-none"
    >
      🌓
    </button>
  );
}
