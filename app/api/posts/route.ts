import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { apiError } from "@/lib/api";
import { validatePostText } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const text = validatePostText(body.text);

    const post = await prisma.post.create({
      data: {
        authorId: user.id,
        text,
        vibe: user.vibe,
      },
      include: {
        author: { select: { id: true, name: true, city: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (e) {
    return apiError(e);
  }
}
