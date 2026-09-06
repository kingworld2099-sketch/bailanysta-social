import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { apiError } from "@/lib/api";
import { ValidationError, NotFoundError } from "@/lib/errors";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id: targetId } = await params;
    const body = await req.json().catch(() => ({}));
    const block = typeof body.block === "boolean" ? body.block : true;

    if (targetId === user.id) throw new ValidationError("Нельзя заблокировать себя");

    const target = await prisma.user.findUnique({ where: { id: targetId }, select: { id: true } });
    if (!target) throw new NotFoundError("Пользователь не найден");

    if (block) {
      await prisma.block.upsert({
        where: { blockerId_blockedId: { blockerId: user.id, blockedId: targetId } },
        create: { blockerId: user.id, blockedId: targetId },
        update: {},
      });
    } else {
      await prisma.block.deleteMany({ where: { blockerId: user.id, blockedId: targetId } });
    }

    return NextResponse.json({ blocked: block });
  } catch (e) {
    return apiError(e);
  }
}
