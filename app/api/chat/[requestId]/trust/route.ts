import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { apiError } from "@/lib/api";
import { NotFoundError, ForbiddenError, ValidationError } from "@/lib/errors";

export async function POST(req: Request, { params }: { params: Promise<{ requestId: string }> }) {
  try {
    const user = await requireUser();
    const { requestId } = await params;
    const body = await req.json().catch(() => ({}));
    const trust = typeof body.trust === "boolean" ? body.trust : true;

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
      data: isFrom ? { fromTrusts: trust } : { toTrusts: trust },
    });

    return NextResponse.json({ trusted: trust });
  } catch (e) {
    return apiError(e);
  }
}
