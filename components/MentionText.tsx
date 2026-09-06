import Link from "next/link";
import { MENTION_RE } from "@/lib/mentions";

export default function MentionText({
  text,
  visibleMentions = [],
  revealAll = false,
}: {
  text: string;
  visibleMentions?: string[];
  revealAll?: boolean;
}) {
  const parts = text.split(MENTION_RE);
  const mentions = text.match(MENTION_RE) ?? [];
  const visible = new Set(visibleMentions);

  return (
    <>
      {parts.map((part, i) => {
        const mention = mentions[i];
        const username = mention?.slice(1).toLowerCase();

        return (
          <span key={i}>
            {part}
            {mention && username && (revealAll || visible.has(username)) && (
              <Link href={`/u/${username}`} style={{ color: "var(--accent)" }}>
                {mention}
              </Link>
            )}
            {mention && username && !revealAll && !visible.has(username) && (
              <span title="Отметка скрыта — пользователь ещё не законнектился с вами" style={{ color: "var(--fg-muted)" }}>
                @•••
              </span>
            )}
          </span>
        );
      })}
    </>
  );
}
