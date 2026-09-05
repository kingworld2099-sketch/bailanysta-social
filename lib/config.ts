export const ACTIVE_WINDOW_HOURS = 48;

export const VIBES = ["MOVE", "CALM", "DRAINED", "WORK"] as const;
export type VibeCode = (typeof VIBES)[number];

export const VIBE_LABELS: Record<VibeCode, string> = {
  MOVE: "На движе",
  CALM: "Спокойно",
  DRAINED: "Выжат",
  WORK: "В работе",
};

export const VIBE_COUNTER_PHRASE: Record<VibeCode, string> = {
  MOVE: "на движе",
  CALM: "спокойны",
  DRAINED: "выжаты",
  WORK: "в работе",
};

export const CITIES = ["Астана", "Алматы", "Шымкент", "Караганда", "Актобе"] as const;
export const DEFAULT_CITY = "Астана";

const CITY_PREPOSITIONAL: Record<string, string> = {
  Астана: "Астане",
  Алматы: "Алматы",
  Шымкент: "Шымкенте",
  Караганда: "Караганде",
  Актобе: "Актобе",
};

export function cityInSentence(city: string): string {
  return CITY_PREPOSITIONAL[city] ?? city;
}

export const LIMITS = {
  username: { min: 3, max: 20 },
  name: { min: 2, max: 40 },
  password: { min: 6 },
  bio: { max: 300 },
  occupation: { max: 100 },
  contact: { max: 100 },
  postText: { min: 1, max: 500 },
  commentText: { min: 1, max: 300 },
};
