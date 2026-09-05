import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { createSessionCookie } from "@/lib/session";
import { apiError } from "@/lib/api";
import { publicUser } from "@/lib/serialize";
import {
  normalizeUsername,
  normalizeName,
  normalizeCity,
  validatePassword,
  normalizeOptional,
} from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const username = normalizeUsername(body.username);
    const name = normalizeName(body.name);
    const lastName = normalizeOptional(body.lastName, "lastName", "Фамилия");
    const city = normalizeCity(body.city, body.otherCity);
    const password = validatePassword(body.password);
    const occupation = normalizeOptional(body.occupation, "occupation", "Чем занимаешься");
    const bio = normalizeOptional(body.bio, "bio", "О себе");
    const contact = normalizeOptional(body.contact, "contact", "Контакт");

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: { username, name, lastName, city, occupation, bio, contact, passwordHash },
    });

    await createSessionCookie(user.id);

    return NextResponse.json({ user: publicUser(user) }, { status: 201 });
  } catch (e) {
    return apiError(e);
  }
}
