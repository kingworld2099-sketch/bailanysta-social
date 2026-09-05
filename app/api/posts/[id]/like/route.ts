import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { apiError } from "@/lib/api";
import { NotFoundError } from "@/lib/errors";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id: postId } = await params;

    const post = await prisma.post.findUnique({ where: { id: postId }, select: { id: true } });
    if (!post) throw new NotFoundError("Пост не найден");

    const existing = await prisma.like.findUnique({
      where: { userId_postId: { userId: user.id, postId } },
    });

    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
    } else {
      await prisma.like.create({ data: { userId: user.id, postId } });
    }

    const count = await prisma.like.count({ where: { postId } });

    return NextResponse.json({ liked: !existing, count });
  } catch (e) {
    return apiError(e);
  }
}
