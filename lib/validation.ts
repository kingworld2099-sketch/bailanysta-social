import { CITIES, LIMITS, VIBES, VibeCode } from "./config";
import { ValidationError } from "./errors";

export function normalizeUsername(raw: unknown): string {
  if (typeof raw !== "string") throw new ValidationError("Логин обязателен");
  const value = raw.trim().toLowerCase();
  const { min, max } = LIMITS.username;
  if (value.length < min || value.length > max) {
    throw new ValidationError(`Логин должен быть от ${min} до ${max} символов`);
  }
  if (!/^[a-z0-9_]+$/.test(value)) {
    throw new ValidationError("Логин может содержать только латиницу, цифры и «_»");
  }
  return value;
}

export function normalizeName(raw: unknown): string {
  if (typeof raw !== "string") throw new ValidationError("Имя обязательно");
  const value = raw.trim();
  const { min, max } = LIMITS.name;
  if (value.length < min || value.length > max) {
    throw new ValidationError(`Имя должно быть от ${min} до ${max} символов`);
  }
  return value;
}

export function validatePassword(raw: unknown): string {
  if (typeof raw !== "string") throw new ValidationError("Пароль обязателен");
  if (raw.length < LIMITS.password.min) {
    throw new ValidationError(`Пароль должен быть не короче ${LIMITS.password.min} символов`);
  }
  return raw;
}

export function normalizeCity(cityField: unknown, otherCityField: unknown): string {
  const city = typeof cityField === "string" ? cityField.trim() : "";
  if (!city) throw new ValidationError("Укажите город");

  if (city === "Другой") {
    const other = typeof otherCityField === "string" ? otherCityField.trim() : "";
    if (!other) throw new ValidationError("Введите название города");
    return other;
  }

  if ((CITIES as readonly string[]).includes(city)) return city;
  return city;
}

export function normalizeOptional(raw: unknown, field: keyof typeof LIMITS, label: string): string | null {
  if (raw === undefined || raw === null) return null;
  if (typeof raw !== "string") throw new ValidationError(`Некорректное поле «${label}»`);
  const value = raw.trim();
  if (!value) return null;
  const limit = LIMITS[field] as { max: number };
  if (value.length > limit.max) {
    throw new ValidationError(`Поле «${label}» не длиннее ${limit.max} символов`);
  }
  return value;
}

export function normalizeVibe(raw: unknown): VibeCode {
  if (typeof raw === "string" && (VIBES as readonly string[]).includes(raw)) {
    return raw as VibeCode;
  }
  throw new ValidationError("Некорректный вайб");
}

export function validatePostText(raw: unknown): string {
  if (typeof raw !== "string") throw new ValidationError("Текст поста обязателен");
  const value = raw.trim();
  const { min, max } = LIMITS.postText;
  if (value.length < min || value.length > max) {
    throw new ValidationError(`Текст поста должен быть от ${min} до ${max} символов`);
  }
  return value;
}

export function validateCommentText(raw: unknown): string {
  if (typeof raw !== "string") throw new ValidationError("Текст комментария обязателен");
  const value = raw.trim();
  const { min, max } = LIMITS.commentText;
  if (value.length < min || value.length > max) {
    throw new ValidationError(`Комментарий должен быть от ${min} до ${max} символов`);
  }
  return value;
}
