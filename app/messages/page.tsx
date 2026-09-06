import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { fullName, truncate } from "@/lib/format";
import { isRequestExpired } from "@/lib/connect";
import EmptyState from "@/components/EmptyState";
import BackToFeed from "@/components/BackToFeed";

export default async function MessagesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const requests = await prisma.connectRequest.findMany({
    where: { status: "ACCEPTED", OR: [{ fromUserId: user.id }, { toUserId: user.id }] },
    orderBy: { createdAt: "desc" },
    include: {
      fromUser: { select: { id: true, name: true, lastName: true } },
      toUser: { select: { id: true, name: true, lastName: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  const chats = await Promise.all(
    requests.map(async (r) => {
      const iAmFrom = r.fromUserId === user.id;
      const other = iAmFrom ? r.toUser : r.fromUser;
      const lastReadAt = iAmFrom ? r.fromLastReadAt : r.toLastReadAt;
      const unread = await prisma.message.count({
        where: { requestId: r.id, authorId: { not: user.id }, createdAt: { gt: lastReadAt ?? new Date(0) } },
      });
      return {
        id: r.id,
        other,
        lastMessage: r.messages[0] ?? null,
        unread,
        active: !isRequestExpired(r.expiresAt),
      };
    })
  );

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-3 px-4 py-6">
      <BackToFeed />
      <h1 className="text-xl font-bold">💬 Сообщения</h1>

      {chats.length === 0 ? (
        <EmptyState title="Пока нет активных чатов" />
      ) : (
        chats.map((c) => (
          <Link
            key={c.id}
            href={`/chat/${c.id}`}
            className="card flex items-center justify-between gap-3 p-3 text-sm"
          >
            <span>
              <span className="font-semibold">{fullName(c.other)}</span>
              {c.lastMessage ? (
                <span style={{ color: "var(--fg-muted)" }}> — {truncate(c.lastMessage.text, 40)}</span>
              ) : (
                <span style={{ color: "var(--fg-muted)" }}> — чат открыт, сообщений пока нет</span>
              )}
              {!c.active && <span style={{ color: "var(--fg-muted)" }}> (чат закрыт)</span>}
            </span>
            {c.unread > 0 && (
              <span
                className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-xs font-bold"
                style={{ background: "var(--danger)", color: "#fff" }}
              >
                {c.unread}
              </span>
            )}
          </Link>
        ))
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";
