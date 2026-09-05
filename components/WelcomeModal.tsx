"use client";

import { useSyncExternalStore } from "react";

const INTRO_KEY = "bailanysta-seen-intro";
const TIPS_KEY = "bailanysta-seen-tips";

const INTRO_CONTENT = {
  title: "Добро пожаловать в Bailanysta 👋",
  intro:
    "Это не лента по подпискам. Ты отмечаешь свой вайб — На движе, Спокойно, Выжат или В работе — и видишь тех, кто в твоём городе чувствует то же самое прямо сейчас. Никаких заявок в друзья: связь — из совпадения в моменте.",
  items: [
    "Нажимая на вайб, ты заявляешь своё состояние, а не просто фильтруешь ленту",
    "«Только мой вайб» — видно только совпадения, «Все» — весь город целиком",
    "Счётчик наверху показывает, сколько человек рядом на этом вайбе прямо сейчас",
  ],
  button: "Понятно, погнали →",
};

const TIPS_CONTENT = {
  title: "Аккаунт готов! Коротко, что где",
  intro: null,
  items: [
    "Вверху — переключатель вайба: меняет твоё состояние и перестраивает ленту",
    "Поле «Что у тебя происходит…» — публикуй пост, можно добавить фото, место и время встречи",
    "🔍 в шапке — поиск постов по словам",
    "Твоё имя в шапке — профиль: там редактирование и все твои посты",
  ],
  button: "Начать →",
};

function subscribeFactory(key: string) {
  return (callback: () => void) => {
    window.addEventListener(key, callback);
    return () => window.removeEventListener(key, callback);
  };
}

function hasSeen(key: string): () => boolean {
  return () => {
    try {
      return !!localStorage.getItem(key);
    } catch {
      return true;
    }
  };
}

function getServerSnapshot() {
  return true;
}

export default function WelcomeModal({ variant }: { variant: "intro" | "tips" }) {
  const key = variant === "tips" ? TIPS_KEY : INTRO_KEY;
  const seen = useSyncExternalStore(subscribeFactory(key), hasSeen(key), getServerSnapshot);

  function dismiss() {
    try {
      localStorage.setItem(key, "1");
    } catch {
      // ignore
    }
    window.dispatchEvent(new Event(key));
  }

  if (seen) return null;

  const content = variant === "tips" ? TIPS_CONTENT : INTRO_CONTENT;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center" onClick={dismiss}>
      <div className="card w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-2 text-lg font-bold">{content.title}</h2>
        {content.intro && (
          <p className="mb-3 text-sm" style={{ color: "var(--fg-muted)" }}>
            {content.intro}
          </p>
        )}
        <ul className="mb-4 flex flex-col gap-2">
          {content.items.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm">
              <span style={{ color: "var(--accent)" }}>•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <button type="button" onClick={dismiss} className="btn btn-primary w-full">
          {content.button}
        </button>
      </div>
    </div>
  );
}
