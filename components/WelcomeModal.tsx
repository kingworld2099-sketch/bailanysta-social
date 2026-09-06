"use client";

import { useState, useSyncExternalStore } from "react";

const INTRO_KEY = "bailanysta-seen-intro-v2";
const TIPS_KEY = "bailanysta-seen-tips-v2";

type Step = { title: string; text: string; highlight?: boolean };

const INTRO_STEPS: Step[] = [
  {
    title: "Добро пожаловать в Bailanysta 👋",
    text: "Это не лента по подпискам. Ты отмечаешь свой вайб — На движе, Спокойно, Выжат или В работе — и видишь тех, кто в твоём городе чувствует то же самое прямо сейчас. Никаких подписок и друзей — только совпадение в моменте.",
  },
  {
    title: "Заяви своё состояние",
    text: "Нажимая на вайб, ты заявляешь состояние, а не просто фильтруешь ленту — оно меняется и у тебя самого. Хочешь просто посмотреть весь город, не переключаясь, — включи «Все» вместо «Только мой вайб». Город тоже можно сменить наверху.",
  },
  {
    title: "Публикуй момент",
    text: "Пиши, что происходит прямо сейчас — до 500 символов. Можно добавить фото (видно 8 часов и исчезает), место и время встречи — оба поля необязательные.",
  },
  {
    title: "Лайки и комментарии",
    text: "Понравился пост — ставь ❤️. Есть что сказать — пиши в комментариях, там же можно отметить человека через @, если вы уже знакомы.",
  },
  {
    title: "🔒 Приватно по умолчанию",
    text: "Без входа лента вообще не видна — только вход и регистрация. А внутри логин, место встречи и контакт скрыты ото всех, с кем ты ещё не связался.",
    highlight: true,
  },
  {
    title: "🔒 Связь только по запросу",
    text: "Понравился пост — жми «Хочу законнектиться». Согласится человек — откроется чат на 24 часа. Откажет — увидишь «Отклонено», без объяснений и без второй попытки.",
    highlight: true,
  },
  {
    title: "🔒 Доверять — отдельное решение",
    text: "Сам чат ещё ничего не раскрывает. Логин, место и контакт человека откроются, только когда ты нажмёшь «Доверять» рядом с его именем — уже после того, как пообщался и решил, что ему можно верить.",
    highlight: true,
  },
  {
    title: "🔒 Переписка исчезает без следа",
    text: "Чат живёт ровно 24 часа и потом пропадает — история не хранится. Можно и раньше завершить его вручную и заблокировать собеседника.",
    highlight: true,
  },
  {
    title: "Ищи по словам и по смыслу",
    text: "🔍 в шапке — обычный поиск по тексту постов. А в поиске есть переключатель «Искать по смыслу (ИИ)»: опиши своими словами, что ищешь, и модель сама найдёт подходящие посты, даже без точных совпадений слов.",
  },
];

const TIPS_STEPS: Step[] = [
  {
    title: "Аккаунт готов 🎉",
    text: "Коротко покажу, что где и какие тут есть фишки.",
  },
  {
    title: "Публикуй",
    text: "Поле «Что у тебя происходит…» — пиши текст, добавляй фото, место и время встречи. Всё, кроме текста, — по желанию.",
  },
  {
    title: "Отмечай знакомых",
    text: "Напиши @ в тексте — появится подсказка с людьми, с которыми ты уже связался. Отметить незнакомого человека нельзя — это тоже часть приватности.",
  },
  {
    title: "🔒 Твой логин под защитой",
    text: "Логин, место и контакт видны собеседнику, только когда он сам нажмёт «Доверять» в чате после общения с тобой — не автоматически при согласии на связь.",
    highlight: true,
  },
  {
    title: "🔔 Запросы на связь",
    text: "Значок в шапке — сюда приходят входящие запросы «Хочу законнектиться». Принимай или отклоняй сам, счётчик показывает, сколько ждут ответа.",
  },
  {
    title: "Профиль и поиск",
    text: "Твоё имя в шапке — профиль и все твои посты. 🔍 — поиск постов, в том числе по смыслу через ИИ.",
  },
  {
    title: "Своя тема",
    text: "Тёмная и светлая тема переключаются значком-кругом в шапке — выбор запоминается.",
  },
];

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
  const [index, setIndex] = useState(0);

  function dismiss() {
    try {
      localStorage.setItem(key, "1");
    } catch {
      // ignore
    }
    window.dispatchEvent(new Event(key));
  }

  if (seen) return null;

  const steps = variant === "tips" ? TIPS_STEPS : INTRO_STEPS;
  const step = steps[index];
  const isLast = index === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center" onClick={dismiss}>
      <div className="card w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-center gap-1.5">
          {steps.map((s, i) => (
            <span
              key={s.title}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === index ? 20 : 6,
                background: i <= index ? "var(--accent)" : "var(--border)",
              }}
            />
          ))}
        </div>

        <div
          className="mb-4 rounded-2xl p-3"
          style={step.highlight ? { background: "color-mix(in srgb, var(--accent) 14%, transparent)" } : undefined}
        >
          <h2 className="mb-2 text-lg font-bold">{step.title}</h2>
          <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
            {step.text}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={dismiss}
            className="text-sm"
            style={{ color: "var(--fg-muted)" }}
          >
            Пропустить
          </button>
          <div className="flex gap-2">
            {index > 0 && (
              <button
                type="button"
                onClick={() => setIndex((i) => i - 1)}
                className="btn btn-secondary !px-4 !py-2 text-sm"
              >
                Назад
              </button>
            )}
            <button
              type="button"
              onClick={() => (isLast ? dismiss() : setIndex((i) => i + 1))}
              className="btn btn-primary !px-4 !py-2 text-sm"
            >
              {isLast ? "Начать →" : "Далее"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
