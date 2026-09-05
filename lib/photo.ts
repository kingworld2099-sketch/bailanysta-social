import { PHOTO_EXPIRY_HOURS } from "./config";

export function isPhotoExpired(createdAt: Date | string): boolean {
  const created = typeof createdAt === "string" ? new Date(createdAt) : createdAt;
  return Date.now() - created.getTime() > PHOTO_EXPIRY_HOURS * 60 * 60 * 1000;
}

export function visiblePhotoUrl(photoUrl: string | null, createdAt: Date | string): string | null {
  if (!photoUrl) return null;
  return isPhotoExpired(createdAt) ? null : photoUrl;
}
