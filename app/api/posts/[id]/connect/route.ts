import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { apiError } from "@/lib/api";
import { NotFoundError, ForbiddenError, ValidationError } from "@/lib/errors";
import { isBlockedPair } from "@/lib/connect";
import { MAX_CONNECT_REQUESTS_PER_DAY } from "@/lib/config";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id: postId } = await params;

    const post = await prisma.post.findUnique({ where: { id: postId }, select: { id: true, authorId: true } });
    if (!post) throw new NotFoundError("Пост не найден");
    if (post.authorId === user.id) throw new ValidationError("Нельзя отправить запрос на свой пост");

    if (await isBlockedPair(user.id, post.authorId)) {
      throw new ForbiddenError("Недоступно");
    }

    const existing = await prisma.connectRequest.findUnique({
      where: { fromUserId_postId: { fromUserId: user.id, postId } },
    });
    if (existing) throw new ValidationError("Вы уже отправляли запрос на этот пост");

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const sentToday = await prisma.connectRequest.count({
      where: { fromUserId: user.id, createdAt: { gte: since } },
    });
    if (sentToday >= MAX_CONNECT_REQUESTS_PER_DAY) {
      throw new ValidationError(`Не больше ${MAX_CONNECT_REQUESTS_PER_DAY} запросов в сутки`);
    }

    const request = await prisma.connectRequest.create({
      data: { fromUserId: user.id, toUserId: post.authorId, postId },
    });

    return NextResponse.json({ request }, { status: 201 });
  } catch (e) {
    return apiError(e);
  }
}
