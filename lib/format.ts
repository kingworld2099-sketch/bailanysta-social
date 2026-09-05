export function ruPlural(n: number, forms: [string, string, string]): string {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return forms[0];
  if (n10 >= 2 && n10 <= 4 && !(n100 >= 12 && n100 <= 14)) return forms[1];
  return forms[2];
}

export function formatPeopleCount(n: number): string {
  return `${n} ${ruPlural(n, ["человек", "человека", "человек"])}`;
}

export function fullName(user: { name: string; lastName?: string | null }): string {
  return user.lastName ? `${user.name} ${user.lastName}` : user.name;
}

const MONTHS = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

export function formatRelativeTime(date: Date | string): string {
  const target = typeof date === "string" ? new Date(date) : date;
  const diffMs = Date.now() - target.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "только что";
  if (diffMin < 60) return `${diffMin} ${ruPlural(diffMin, ["минуту", "минуты", "минут"])} назад`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours} ${ruPlural(diffHours, ["час", "часа", "часов"])} назад`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} ${ruPlural(diffDays, ["день", "дня", "дней"])} назад`;

  return `${target.getDate()} ${MONTHS[target.getMonth()]}`;
}
