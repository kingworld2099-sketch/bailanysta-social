import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUserPosts } from "@/lib/feed";
import { getCurrentUser } from "@/lib/session";
import { trustedUserIds, didIBlock } from "@/lib/connect";
import { VIBE_LABELS, VIBE_COLOR_VAR, VibeCode } from "@/lib/config";
import { contactUrl } from "@/lib/contact";
import { fullName } from "@/lib/format";
import PostCard from "@/components/PostCard";
import EmptyState from "@/components/EmptyState";
import BackToFeed from "@/components/BackToFeed";
import BlockButton from "@/components/BlockButton";
import ReportButton from "@/components/ReportButton";

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [profileUser, currentUser] = await Promise.all([
    prisma.user.findUnique({ where: { id } }),
    getCurrentUser(),
  ]);

  if (!currentUser) redirect("/login");
  if (!profileUser) notFound();

  const isSelf = currentUser.id === profileUser.id;
  const isConnected = isSelf || (await trustedUserIds(currentUser.id)).has(profileUser.id);
  const isBlocked = isSelf ? false : await didIBlock(currentUser.id, profileUser.id);

  const posts = await getUserPosts(profileUser.id, currentUser.id);
  const vibe = profileUser.vibe as VibeCode;

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-6">
      <BackToFeed />
      <div
        className="card flex flex-col gap-2 p-5"
        style={{ borderLeft: `4px solid var(${VIBE_COLOR_VAR[vibe]})` }}
      >
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">{fullName(profileUser)}</h1>
          <span
            className="rounded-full px-2 py-0.5 text-xs font-semibold"
            style={{ background: `var(${VIBE_COLOR_VAR[vibe]})`, color: "#fff" }}
          >
            {VIBE_LABELS[vibe]}
          </span>
        </div>
        <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
          {isConnected && `@${profileUser.username} · `}
          {profileUser.city}
        </p>
        {profileUser.occupation && <p className="text-sm">{profileUser.occupation}</p>}
        {profileUser.bio && <p className="text-sm">{profileUser.bio}</p>}

        {isConnected && profileUser.contact && (
          <a
            href={contactUrl(profileUser.contact)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary mt-2 w-fit"
          >
            Написать
          </a>
        )}

        {!isSelf && (
          <div className="mt-2 flex items-center gap-3">
            <BlockButton userId={profileUser.id} initialBlocked={isBlocked} />
            <ReportButton reportedUserId={profileUser.id} context={`profile:${profileUser.id}`} />
          </div>
        )}
      </div>

      {posts.length === 0 ? (
        <EmptyState title="Пока ничего не публиковал" />
      ) : (
        posts.map((post) => (
          <PostCard key={post.id} post={post} currentUserId={currentUser.id} isLoggedIn />
        ))
      )}
    </div>
  );
}
