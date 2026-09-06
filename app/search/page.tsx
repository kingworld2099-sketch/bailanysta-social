import { redirect } from "next/navigation";
import { searchPosts } from "@/lib/feed";
import { aiSearchPosts } from "@/lib/ai-search";
import { getCurrentUser } from "@/lib/session";
import SearchBox from "@/components/SearchBox";
import PostCard from "@/components/PostCard";
import EmptyState from "@/components/EmptyState";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; ai?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { q, ai } = await searchParams;
  const query = (q ?? "").trim();
  const wantsAi = ai === "1";

  let posts: Awaited<ReturnType<typeof searchPosts>> = [];
  let aiFellBack = false;

  if (query && wantsAi) {
    const result = await aiSearchPosts(query, user.id);
    posts = result.posts;
    aiFellBack = !result.usedAi;
  } else if (query) {
    posts = await searchPosts(query, user.id);
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-6">
      <SearchBox initialQuery={query} initialAi={wantsAi} />

      {aiFellBack && (
        <p className="text-xs" style={{ color: "var(--fg-muted)" }}>
          Умный поиск сейчас недоступен — показаны результаты обычного поиска
        </p>
      )}

      {!query && (
        <EmptyState title="Введите слово: кофе, зал, прогулка" />
      )}

      {query && posts.length === 0 && <EmptyState title={`По запросу «${query}» ничего не нашли`} />}

      {posts.map((post) => (
        <PostCard key={post.id} post={post} currentUserId={user.id} isLoggedIn />
      ))}
    </div>
  );
}

export const dynamic = "force-dynamic";
