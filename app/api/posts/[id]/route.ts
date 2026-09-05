import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { apiError } from "@/lib/api";
import { NotFoundError, ForbiddenError } from "@/lib/errors";
import { validatePostText, normalizeOptional } from "@/lib/validation";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const body = await req.json();
    const text = validatePostText(body.text);
    const place = normalizeOptional(body.place, "place", "Место");
    const plannedAt = normalizeOptional(body.plannedAt, "plannedAt", "Время");

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundError("Пост не найден");
    if (post.authorId !== user.id) throw new ForbiddenError("Можно редактировать только свои посты");

    const updated = await prisma.post.update({ where: { id }, data: { text, place, plannedAt } });

    return NextResponse.json({ post: updated });
  } catch (e) {
    return apiError(e);
  }
}

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
