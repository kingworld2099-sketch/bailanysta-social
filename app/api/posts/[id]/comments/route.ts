import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { apiError } from "@/lib/api";
import { NotFoundError } from "@/lib/errors";
import { validateCommentText } from "@/lib/validation";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id: postId } = await params;
    const body = await req.json();
    const text = validateCommentText(body.text);

    const post = await prisma.post.findUnique({ where: { id: postId }, select: { id: true } });
    if (!post) throw new NotFoundError("Пост не найден");

    const comment = await prisma.comment.create({
      data: { authorId: user.id, postId, text },
      include: { author: { select: { id: true, name: true, lastName: true, username: true } } },
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (e) {
    return apiError(e);
  }
}
