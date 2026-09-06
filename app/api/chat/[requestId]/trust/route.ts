import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { apiError } from "@/lib/api";
import { NotFoundError, ForbiddenError, ValidationError } from "@/lib/errors";

export async function POST(_req: Request, { params }: { params: Promise<{ requestId: string }> }) {
  try {
    const user = await requireUser();
    const { requestId } = await params;

    const request = await prisma.connectRequest.findUnique({ where: { id: requestId } });
    if (!request) throw new NotFoundError("Запрос не найден");
    if (request.fromUserId !== user.id && request.toUserId !== user.id) {
      throw new ForbiddenError("Это не ваш чат");
    }
    if (request.status !== "ACCEPTED") {
      throw new ValidationError("Доверие можно отметить только после принятого запроса");
    }

    const isFrom = request.fromUserId === user.id;
    await prisma.connectRequest.update({
      where: { id: requestId },
      data: isFrom ? { fromTrusts: true } : { toTrusts: true },
    });

    return NextResponse.json({ trusted: true });
  } catch (e) {
    return apiError(e);
  }
}
