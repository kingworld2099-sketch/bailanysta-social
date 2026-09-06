import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { apiError } from "@/lib/api";
import { NotFoundError } from "@/lib/errors";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id: commentId } = await params;

    const comment = await prisma.comment.findUnique({ where: { id: commentId }, select: { id: true } });
    if (!comment) throw new NotFoundError("Комментарий не найден");

    const existing = await prisma.commentLike.findUnique({
      where: { userId_commentId: { userId: user.id, commentId } },
    });

    if (existing) {
      await prisma.commentLike.delete({ where: { id: existing.id } });
    } else {
      await prisma.commentLike.create({ data: { userId: user.id, commentId } });
    }

    const count = await prisma.commentLike.count({ where: { commentId } });

    return NextResponse.json({ liked: !existing, count });
  } catch (e) {
    return apiError(e);
  }
}
