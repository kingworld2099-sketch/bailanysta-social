import Link from "next/link";

const MENTION_RE = /@[a-z0-9_]{3,20}/gi;

export default function MentionText({ text }: { text: string }) {
  const parts = text.split(MENTION_RE);
  const mentions = text.match(MENTION_RE) ?? [];

  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {mentions[i] && (
            <Link href={`/u/${mentions[i].slice(1).toLowerCase()}`} style={{ color: "var(--accent)" }}>
              {mentions[i]}
            </Link>
          )}
        </span>
      ))}
    </>
  );
}
