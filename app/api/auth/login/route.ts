import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { createSessionCookie } from "@/lib/session";
import { apiError } from "@/lib/api";
import { publicUser } from "@/lib/serialize";
import { ValidationError } from "@/lib/errors";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username = typeof body.username === "string" ? body.username.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!username || !password) {
      throw new ValidationError("Введите логин и пароль");
    }

    const user = await prisma.user.findUnique({ where: { username } });
    const valid = user ? await verifyPassword(password, user.passwordHash) : false;

    if (!user || !valid) {
      throw new ValidationError("Неверный логин или пароль");
    }

    await createSessionCookie(user.id);

    return NextResponse.json({ user: publicUser(user) });
  } catch (e) {
    return apiError(e);
  }
}
