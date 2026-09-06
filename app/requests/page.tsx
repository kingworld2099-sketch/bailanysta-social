import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { fullName } from "@/lib/format";
import { formatRelativeTime } from "@/lib/format";
import RequestActions from "@/components/RequestActions";
import EmptyState from "@/components/EmptyState";
import BackToFeed from "@/components/BackToFeed";

const STATUS_LABEL: Record<string, string> = {
  ACCEPTED: "Принято",
  DECLINED: "Отклонено",
};

export default async function RequestsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const requests = await prisma.connectRequest.findMany({
    where: { toUserId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      fromUser: { select: { id: true, name: true, lastName: true, city: true, occupation: true, bio: true } },
      post: { select: { id: true, text: true } },
    },
  });

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-6">
      <BackToFeed />
      <h1 className="text-xl font-bold">Запросы на связь</h1>

      {requests.length === 0 ? (
        <EmptyState title="Пока никто не запрашивал связь" />
      ) : (
        requests.map((r) => (
          <div key={r.id} className="card flex flex-col gap-2 p-4">
            <div className="flex items-center justify-between gap-2">
              <Link href={`/profile/${r.fromUser.id}`} className="font-semibold">
                {fullName(r.fromUser)}
              </Link>
              <span className="text-xs" style={{ color: "var(--fg-muted)" }}>
                {formatRelativeTime(r.createdAt)}
              </span>
            </div>
            <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
              {r.fromUser.city}
              {r.fromUser.occupation ? ` · ${r.fromUser.occupation}` : ""}
            </p>
            {r.fromUser.bio && <p className="text-sm">{r.fromUser.bio}</p>}
            <p className="rounded-xl p-2 text-sm" style={{ background: "var(--bg)" }}>
              «{r.post.text}»
            </p>

            {r.status === "PENDING" ? (
              <RequestActions requestId={r.id} />
            ) : r.status === "ACCEPTED" ? (
              <Link href={`/chat/${r.id}`} className="btn btn-primary w-fit !px-4 !py-2 text-sm">
                Перейти в чат
              </Link>
            ) : (
              <span className="text-sm" style={{ color: "var(--fg-muted)" }}>
                {STATUS_LABEL[r.status]}
              </span>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";
