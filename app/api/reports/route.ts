import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { apiError } from "@/lib/api";
import { ValidationError, NotFoundError } from "@/lib/errors";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await req.json();

    const reportedUserId = typeof body.reportedUserId === "string" ? body.reportedUserId : null;
    if (!reportedUserId) throw new ValidationError("Не указан пользователь");
    if (reportedUserId === user.id) throw new ValidationError("Нельзя пожаловаться на себя");

    const context = typeof body.context === "string" ? body.context.slice(0, 200) : "";
    const reason =
      typeof body.reason === "string" && body.reason.trim().length > 0
        ? body.reason.trim().slice(0, 500)
        : null;

    const reportedUser = await prisma.user.findUnique({ where: { id: reportedUserId }, select: { id: true } });
    if (!reportedUser) throw new NotFoundError("Пользователь не найден");

    await prisma.report.create({
      data: { reporterId: user.id, reportedUserId, context, reason },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    return apiError(e);
  }
}
