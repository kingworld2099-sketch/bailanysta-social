import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getFeedPosts, getActiveCount } from "@/lib/feed";
import { VIBE_COUNTER_PHRASE, VIBE_COLOR_VAR, VibeCode, cityInSentence } from "@/lib/config";
import { formatPeopleCount } from "@/lib/format";
import { FEED_TOUR_STEPS } from "@/lib/tours";
import VibeSwitcher from "@/components/VibeSwitcher";
import FeedControls from "@/components/FeedControls";
import PostComposer from "@/components/PostComposer";
import PostCard from "@/components/PostCard";
import EmptyState from "@/components/EmptyState";
import SpotlightTour from "@/components/SpotlightTour";
import Link from "next/link";

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.seenProfileTour) redirect("/me");

  const cityParam = typeof params.city === "string" ? params.city : undefined;
  const city = cityParam === "all" ? null : cityParam || user.city;

  const scope: "mine" | "all" = params.scope === "all" ? "all" : "mine";
  const activeVibe: VibeCode = user.vibe;
  const vibeFilter: VibeCode | null = scope === "mine" ? user.vibe : null;

  const searchParamsString = new URLSearchParams(
    Object.entries(params).flatMap(([k, v]) =>
      typeof v === "string" ? [[k, v] as [string, string]] : []
    )
  ).toString();

  const [posts, activeCount] = await Promise.all([
    getFeedPosts({ city, vibe: vibeFilter, currentUserId: user.id }),
    getActiveCount(city, activeVibe),
  ]);

  const cityLabel = city ? cityInSentence(city) : "всех городах";

  return (
    <div>
      <SpotlightTour tourName="feed" initiallySeen={user.seenFeedTour} steps={FEED_TOUR_STEPS} finishLabel="Погнали →" />

      <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-5">
        <div
          className="card flex flex-col gap-3 p-4"
          style={{
            background: `color-mix(in srgb, var(${VIBE_COLOR_VAR[activeVibe]}) 8%, var(--bg-elevated))`,
            borderColor: `color-mix(in srgb, var(${VIBE_COLOR_VAR[activeVibe]}) 35%, var(--border))`,
          }}
        >
          <div id="tour-vibe-switcher">
            <VibeSwitcher active={activeVibe} isLoggedIn searchParamsString={searchParamsString} />
          </div>

          <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
            {activeCount === 0
              ? "Пока никого — ты первый"
              : `Сейчас в ${cityLabel} ${VIBE_COUNTER_PHRASE[activeVibe]} — ${formatPeopleCount(activeCount)}`}
          </p>

          <FeedControls isLoggedIn scope={scope} city={city} searchParamsString={searchParamsString} />
        </div>

        <div id="tour-composer">
          <PostComposer vibe={user.vibe} />
        </div>

        {posts.length === 0 ? (
          <EmptyState
            title={
              vibeFilter
                ? `Сейчас в ${cityLabel} никого на этом вайбе`
                : `Сейчас в ${cityLabel} ещё нет постов`
            }
            action={
              <Link href="/feed?city=all&scope=all" className="btn btn-primary">
                Показать все
              </Link>
            }
          />
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} currentUserId={user.id} isLoggedIn />)
        )}
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
