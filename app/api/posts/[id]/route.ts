import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { apiError } from "@/lib/api";
import { NotFoundError, ForbiddenError } from "@/lib/errors";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundError("Пост не найден");
    if (post.authorId !== user.id) throw new ForbiddenError("Можно удалять только свои посты");

    await prisma.post.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}
