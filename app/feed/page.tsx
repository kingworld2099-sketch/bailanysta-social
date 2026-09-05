import { getCurrentUser } from "@/lib/session";
import { getFeedPosts, getActiveCount } from "@/lib/feed";
import { DEFAULT_CITY, VIBES, VIBE_COUNTER_PHRASE, VibeCode, cityInSentence } from "@/lib/config";
import { formatPeopleCount } from "@/lib/format";
import GuestBanner from "@/components/GuestBanner";
import VibeSwitcher from "@/components/VibeSwitcher";
import FeedControls from "@/components/FeedControls";
import PostComposer from "@/components/PostComposer";
import PostCard from "@/components/PostCard";
import EmptyState from "@/components/EmptyState";
import Link from "next/link";

function isVibe(v: unknown): v is VibeCode {
  return typeof v === "string" && (VIBES as readonly string[]).includes(v);
}

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const user = await getCurrentUser();

  const cityParam = typeof params.city === "string" ? params.city : undefined;
  const city = cityParam === "all" ? null : cityParam || (user ? user.city : DEFAULT_CITY);

  let activeVibe: VibeCode | null;
  let scope: "mine" | "all";
  let vibeFilter: VibeCode | null;

  if (user) {
    scope = params.scope === "all" ? "all" : "mine";
    activeVibe = user.vibe;
    vibeFilter = scope === "mine" ? user.vibe : null;
  } else {
    scope = "mine";
    const vibeParam = typeof params.vibe === "string" ? params.vibe : undefined;
    activeVibe = vibeParam === "all" ? null : isVibe(vibeParam) ? vibeParam : "MOVE";
    vibeFilter = activeVibe;
  }

  const searchParamsString = new URLSearchParams(
    Object.entries(params).flatMap(([k, v]) =>
      typeof v === "string" ? [[k, v] as [string, string]] : []
    )
  ).toString();

  const [posts, activeCount] = await Promise.all([
    getFeedPosts({ city, vibe: vibeFilter, currentUserId: user?.id ?? null }),
    activeVibe ? getActiveCount(city, activeVibe) : Promise.resolve(null),
  ]);

  const cityLabel = city ? cityInSentence(city) : "всех городах";

  return (
    <div>
      {!user && <GuestBanner />}

      <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-5">
        <VibeSwitcher active={activeVibe} isLoggedIn={!!user} searchParamsString={searchParamsString} />

        {activeVibe && activeCount !== null ? (
          <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
            {activeCount === 0
              ? "Пока никого — ты первый"
              : `Сейчас в ${cityLabel} ${VIBE_COUNTER_PHRASE[activeVibe]} — ${formatPeopleCount(activeCount)}`}
          </p>
        ) : (
          <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
            Показаны все вайбы
          </p>
        )}

        <FeedControls isLoggedIn={!!user} scope={scope} city={city} searchParamsString={searchParamsString} />

        {user && <PostComposer vibe={user.vibe} />}

        {posts.length === 0 ? (
          <EmptyState
            title={
              vibeFilter
                ? `Сейчас в ${cityLabel} никого на этом вайбе`
                : `Сейчас в ${cityLabel} ещё нет постов`
            }
            action={
              <Link href="/feed?vibe=all&city=all&scope=all" className="btn btn-primary">
                Показать все
              </Link>
            }
          />
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} currentUserId={user?.id ?? null} isLoggedIn={!!user} />
          ))
        )}
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
