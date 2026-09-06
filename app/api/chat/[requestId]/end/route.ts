import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { apiError } from "@/lib/api";
import { getActiveChat } from "@/lib/connect";

export async function POST(_req: Request, { params }: { params: Promise<{ requestId: string }> }) {
  try {
    const user = await requireUser();
    const { requestId } = await params;
    const request = await getActiveChat(requestId, user.id);

    const otherId = request.fromUserId === user.id ? request.toUserId : request.fromUserId;

    await prisma.connectRequest.update({
      where: { id: request.id },
      data: { expiresAt: new Date() },
    });

    await prisma.block.upsert({
      where: { blockerId_blockedId: { blockerId: user.id, blockedId: otherId } },
      create: { blockerId: user.id, blockedId: otherId },
      update: {},
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}
