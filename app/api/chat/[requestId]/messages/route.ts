import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { apiError } from "@/lib/api";
import { getActiveChat } from "@/lib/connect";
import { validateMessageText } from "@/lib/validation";

export async function GET(req: NextRequest, { params }: { params: Promise<{ requestId: string }> }) {
  try {
    const user = await requireUser();
    const { requestId } = await params;
    const request = await getActiveChat(requestId, user.id);

    const messages = await prisma.message.findMany({
      where: { requestId: request.id },
      orderBy: { createdAt: "asc" },
      include: { author: { select: { id: true, name: true, lastName: true } } },
    });

    return NextResponse.json({ messages, expiresAt: request.expiresAt });
  } catch (e) {
    return apiError(e);
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ requestId: string }> }) {
  try {
    const user = await requireUser();
    const { requestId } = await params;
    const request = await getActiveChat(requestId, user.id);

    const body = await req.json();
    const text = validateMessageText(body.text);

    const message = await prisma.message.create({
      data: { requestId: request.id, authorId: user.id, text },
      include: { author: { select: { id: true, name: true, lastName: true } } },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (e) {
    return apiError(e);
  }
}
