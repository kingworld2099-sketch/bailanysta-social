export const MENTION_RE = /@[a-z0-9_]{3,20}/gi;

export function extractMentionUsernames(text: string): string[] {
  const matches = text.match(MENTION_RE) ?? [];
  return matches.map((m) => m.slice(1).toLowerCase());
}
