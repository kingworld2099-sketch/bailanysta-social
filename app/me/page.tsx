import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getUserPosts } from "@/lib/feed";
import { VIBE_LABELS, VIBE_COLOR_VAR, VibeCode } from "@/lib/config";
import { contactUrl } from "@/lib/contact";
import { fullName } from "@/lib/format";
import ProfileEditForm from "@/components/ProfileEditForm";
import PostComposer from "@/components/PostComposer";
import PostCard from "@/components/PostCard";
import EmptyState from "@/components/EmptyState";
import BackToFeed from "@/components/BackToFeed";

export default async function MePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const posts = await getUserPosts(user.id, user.id);
  const vibe = user.vibe as VibeCode;

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-6">
      <BackToFeed />
      <div
        className="card flex flex-col gap-2 p-5"
        style={{ borderLeft: `4px solid var(${VIBE_COLOR_VAR[vibe]})` }}
      >
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">{fullName(user)}</h1>
          <span
            className="rounded-full px-2 py-0.5 text-xs font-semibold"
            style={{ background: `var(${VIBE_COLOR_VAR[vibe]})`, color: "#fff" }}
          >
            {VIBE_LABELS[vibe]}
          </span>
        </div>
        <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
          @{user.username} · {user.city}
        </p>
        {user.occupation && <p className="text-sm">{user.occupation}</p>}
        {user.bio && <p className="text-sm">{user.bio}</p>}
        {user.contact && (
          <a href={contactUrl(user.contact)} target="_blank" rel="noopener noreferrer" className="btn btn-secondary mt-1 w-fit">
            Ваша ссылка для связи
          </a>
        )}

        <div className="mt-2">
          <ProfileEditForm
            user={{
              name: user.name,
              lastName: user.lastName,
              city: user.city,
              occupation: user.occupation,
              bio: user.bio,
              contact: user.contact,
            }}
          />
        </div>
      </div>

      <PostComposer vibe={user.vibe} />

      {posts.length === 0 ? (
        <EmptyState title="Пока ничего не публиковали" />
      ) : (
        posts.map((post) => (
          <PostCard key={post.id} post={post} currentUserId={user.id} isLoggedIn={true} />
        ))
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";
