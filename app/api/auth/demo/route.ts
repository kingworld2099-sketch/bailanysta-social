import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSessionCookie } from "@/lib/session";
import { apiError } from "@/lib/api";
import { NotFoundError } from "@/lib/errors";

export async function POST(req: NextRequest) {
  try {
    const user = await prisma.user.findUnique({ where: { username: "demo" } });
    if (!user) throw new NotFoundError("Демо-аккаунт не найден");

    await createSessionCookie(user.id);

    return NextResponse.redirect(new URL("/feed?onboarding=tips", req.url), { status: 303 });
  } catch (e) {
    return apiError(e);
  }
}
