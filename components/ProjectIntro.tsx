export default function ProjectIntro() {
  return (
    <div className="mb-6 flex flex-col gap-3">
      <div className="rounded-2xl p-4 text-sm" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
        <p className="mb-1 font-semibold">Добро пожаловать в Bailanysta 👋</p>
        <p style={{ color: "var(--fg-muted)" }}>
          Прежде чем начать — зарегистрируйся. Это не лента по подпискам: ты отмечаешь свой вайб —
          На движе, Спокойно, Выжат или В работе — и видишь тех, кто в твоём городе чувствует то же
          самое прямо сейчас. Понравился пост — отправляешь запрос на связь, и после согласия
          открывается чат на 24 часа. После регистрации коротко покажем, что где.
        </p>
      </div>
      <div
        className="rounded-2xl p-4 text-sm"
        style={{ background: "color-mix(in srgb, var(--accent) 14%, transparent)", border: "1px solid var(--accent)" }}
      >
        <p className="mb-1 font-semibold">🔒 Максимально приватно и анонимно</p>
        <p style={{ color: "var(--fg-muted)" }}>
          Без входа лента вообще не видна. Даже после согласия на связь логин, место встречи,
          контакт и фото остаются скрыты для обеих сторон. Кнопка «Доверять» открывает СВОИ
          данные собеседнику, а не его данные тебе — увидеть его информацию можно, только когда
          он тоже решит довериться в ответ. Отказ — без объяснений и без повторных попыток.
          Переписка живёт 24 часа и потом исчезает без следа.
        </p>
      </div>
    </div>
  );
}
