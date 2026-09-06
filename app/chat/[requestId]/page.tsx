import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { fullName } from "@/lib/format";
import { contactUrl } from "@/lib/contact";
import { placeSearchUrl } from "@/lib/place";
import { isRequestExpired, markChatRead } from "@/lib/connect";
import BackToFeed from "@/components/BackToFeed";
import ChatView from "@/components/ChatView";
import TrustButton from "@/components/TrustButton";
import ReportButton from "@/components/ReportButton";

export default async function ChatPage({ params }: { params: Promise<{ requestId: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { requestId } = await params;

  const request = await prisma.connectRequest.findUnique({
    where: { id: requestId },
    include: {
      fromUser: { select: { id: true, name: true, lastName: true, contact: true } },
      toUser: { select: { id: true, name: true, lastName: true, contact: true } },
      post: { select: { text: true, place: true, plannedAt: true } },
    },
  });

  if (!request) notFound();
  if (request.fromUserId !== user.id && request.toUserId !== user.id) notFound();

  const other = request.fromUserId === user.id ? request.toUser : request.fromUser;
  const isActive = request.status === "ACCEPTED" && !isRequestExpired(request.expiresAt);
  const iAmFrom = request.fromUserId === user.id;

  // My own flag — controls what the TrustButton shows and whether I've revealed MY info to them.
  const myTrust = iAmFrom ? request.fromTrusts : request.toTrusts;
  // Their own flag — controls whether THEY have revealed their info to me.
  const otherTrusts = iAmFrom ? request.toTrusts : request.fromTrusts;
  // The post's place/time belongs to its author (always toUser) — visible to the author
  // unconditionally (it's their own data), and to the other side once the author trusts.
  const canSeePlace = !iAmFrom || request.toTrusts;

  if (request.status === "ACCEPTED") {
    await markChatRead(request.id, user.id);
  }

  const rawMessages = isActive
    ? await prisma.message.findMany({
        where: { requestId: request.id },
        orderBy: { createdAt: "asc" },
        include: { author: { select: { id: true, name: true, lastName: true } } },
      })
    : [];

  const initialMessages = rawMessages.map((m) => ({
    id: m.id,
    text: m.text,
    createdAt: m.createdAt.toISOString(),
    author: m.author,
  }));

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-6">
      <BackToFeed />

      <div className="card flex flex-col gap-1 p-4">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-lg font-bold">Чат с {fullName(other)}</h1>
          {request.status === "ACCEPTED" && <TrustButton requestId={request.id} initialTrusted={myTrust} />}
        </div>
        {!canSeePlace && (
          <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
            📍 Место и время скрыты — автор поста откроет их, когда решит вам довериться
          </p>
        )}
        {!otherTrusts && (
          <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
            🔒 Контакт {fullName(other)} скрыт — откроется, когда {fullName(other)} нажмёт «Доверять»
          </p>
        )}
        {canSeePlace && request.post.place && (
          <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
            📍{" "}
            <a href={placeSearchUrl(request.post.place)} target="_blank" rel="noopener noreferrer" className="underline">
              {request.post.place}
            </a>
            {request.post.plannedAt ? ` · ${request.post.plannedAt}` : ""}
          </p>
        )}
        {otherTrusts && other.contact && (
          <a href={contactUrl(other.contact)} target="_blank" rel="noopener noreferrer" className="btn btn-secondary mt-1 w-fit !px-3 !py-1.5 text-sm">
            Связь: {other.contact}
          </a>
        )}
        <div className="mt-1">
          <ReportButton reportedUserId={other.id} context={`chat:${request.id}`} />
        </div>
      </div>

      {isActive ? (
        <ChatView
          requestId={request.id}
          currentUserId={user.id}
          initialMessages={initialMessages}
          initialExpiresAt={request.expiresAt!.toISOString()}
        />
      ) : (
        <div className="card p-4 text-sm" style={{ color: "var(--fg-muted)" }}>
          {request.status !== "ACCEPTED" ? "Этот чат ещё не открыт." : "Время чата истекло, переписка больше не доступна."}
        </div>
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";
