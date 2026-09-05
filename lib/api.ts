import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { ValidationError, NotFoundError, ForbiddenError } from "./errors";
import { UnauthorizedError } from "./session";

export function apiError(e: unknown): NextResponse {
  if (e instanceof ValidationError) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
  if (e instanceof UnauthorizedError) {
    return NextResponse.json({ error: "Нужно войти" }, { status: 401 });
  }
  if (e instanceof ForbiddenError) {
    return NextResponse.json({ error: e.message }, { status: 403 });
  }
  if (e instanceof NotFoundError) {
    return NextResponse.json({ error: e.message }, { status: 404 });
  }
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
    return NextResponse.json({ error: "Такой логин уже занят" }, { status: 409 });
  }

  console.error(e);
  return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
}
