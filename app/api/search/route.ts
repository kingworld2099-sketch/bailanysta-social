import { NextRequest, NextResponse } from "next/server";
import { searchPosts } from "@/lib/feed";
import { getCurrentUser } from "@/lib/session";
import { apiError } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    const q = (req.nextUrl.searchParams.get("q") ?? "").trim();
    if (!q) return NextResponse.json({ posts: [], q: "" });

    const user = await getCurrentUser();
    const posts = await searchPosts(q, user?.id ?? null);

    return NextResponse.json({ posts, q });
  } catch (e) {
    return apiError(e);
  }
}
