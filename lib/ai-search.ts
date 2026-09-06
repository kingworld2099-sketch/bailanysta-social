import { AI_SEARCH_MODEL, AI_SEARCH_TIMEOUT_MS } from "./config";
import { getSearchCandidates, searchPosts, type FeedPost } from "./feed";

async function rankPostsBySemantic(
  query: string,
  candidates: { id: string; text: string }[]
): Promise<string[] | null> {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey || candidates.length === 0) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), AI_SEARCH_TIMEOUT_MS);

  try {
    const list = candidates
      .map((c) => `[${c.id}] ${c.text.replace(/\s+/g, " ").slice(0, 300)}`)
      .join("\n");

    const prompt = `Пользователь ищет посты в социальной сети по смыслу запроса: "${query}"

Список постов (id в квадратных скобках):
${list}

Верни JSON-массив id постов, подходящих запросу по смыслу (не только по точному совпадению слов), отсортированный от самого релевантного к менее релевантному. Если ничего не подходит — верни []. Ответь только JSON-массивом, без пояснений и без markdown-разметки.`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: AI_SEARCH_MODEL,
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
      signal: controller.signal,
    });

    if (!res.ok) return null;

    const data = await res.json();
    const text = data.content?.[0]?.text ?? "";
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) return null;

    const parsed = JSON.parse(match[0]);
    if (!Array.isArray(parsed)) return null;

    const validIds = new Set(candidates.map((c) => c.id));
    return parsed.filter((id): id is string => typeof id === "string" && validIds.has(id));
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function aiSearchPosts(
  query: string,
  currentUserId: string
): Promise<{ posts: FeedPost[]; usedAi: boolean }> {
  const candidates = await getSearchCandidates(currentUserId);
  const rankedIds = await rankPostsBySemantic(
    query,
    candidates.map((p) => ({ id: p.id, text: p.text }))
  );

  if (rankedIds === null) {
    const posts = await searchPosts(query, currentUserId);
    return { posts, usedAi: false };
  }

  const byId = new Map(candidates.map((p) => [p.id, p]));
  const posts = rankedIds.map((id) => byId.get(id)).filter((p): p is FeedPost => !!p);
  return { posts, usedAi: true };
}
