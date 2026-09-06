import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { apiError } from "@/lib/api";
import { NotFoundError, ForbiddenError, ValidationError } from "@/lib/errors";
import { CONNECT_CHAT_HOURS } from "@/lib/config";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;

    const request = await prisma.connectRequest.findUnique({ where: { id } });
    if (!request) throw new NotFoundError("Запрос не найден");
    if (request.toUserId !== user.id) throw new ForbiddenError("Это не ваш запрос");
    if (request.status !== "PENDING") throw new ValidationError("Запрос уже обработан");

    const updated = await prisma.connectRequest.update({
      where: { id },
      data: {
        status: "ACCEPTED",
        expiresAt: new Date(Date.now() + CONNECT_CHAT_HOURS * 60 * 60 * 1000),
      },
    });

    return NextResponse.json({ request: updated });
  } catch (e) {
    return apiError(e);
  }
}
