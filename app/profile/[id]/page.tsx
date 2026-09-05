import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUserPosts } from "@/lib/feed";
import { getCurrentUser } from "@/lib/session";
import { VIBE_LABELS, VibeCode } from "@/lib/config";
import { contactUrl } from "@/lib/contact";
import PostCard from "@/components/PostCard";
import EmptyState from "@/components/EmptyState";

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [profileUser, currentUser] = await Promise.all([
    prisma.user.findUnique({ where: { id } }),
    getCurrentUser(),
  ]);

  if (!profileUser) notFound();

  const posts = await getUserPosts(profileUser.id, currentUser?.id ?? null);
  const vibe = profileUser.vibe as VibeCode;

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-6">
      <div className="card flex flex-col gap-2 p-5">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">{profileUser.name}</h1>
          <span className="rounded-full bg-[var(--accent)] px-2 py-0.5 text-xs font-semibold text-[var(--accent-fg)]">
            {VIBE_LABELS[vibe]}
          </span>
        </div>
        <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
          @{profileUser.username} · {profileUser.city}
        </p>
        {profileUser.occupation && <p className="text-sm">{profileUser.occupation}</p>}
        {profileUser.bio && <p className="text-sm">{profileUser.bio}</p>}

        {profileUser.contact && (
          <a
            href={contactUrl(profileUser.contact)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary mt-2 w-fit"
          >
            Написать
          </a>
        )}
      </div>

      {posts.length === 0 ? (
        <EmptyState title="Пока ничего не публиковал" />
      ) : (
        posts.map((post) => (
          <PostCard key={post.id} post={post} currentUserId={currentUser?.id ?? null} isLoggedIn={!!currentUser} />
        ))
      )}
    </div>
  );
}
