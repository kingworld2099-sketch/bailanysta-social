import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { apiError } from "@/lib/api";
import { publicUser } from "@/lib/serialize";
import { normalizeName, normalizeCity, normalizeOptional } from "@/lib/validation";
import type { Prisma } from "@prisma/client";

export async function PATCH(req: NextRequest) {
  try {
    const currentUser = await requireUser();
    const body = await req.json();

    const data: Prisma.UserUpdateInput = {};

    if (body.name !== undefined) data.name = normalizeName(body.name);
    if (body.city !== undefined) data.city = normalizeCity(body.city, body.otherCity);
    if (body.occupation !== undefined) data.occupation = normalizeOptional(body.occupation, "occupation", "Чем занимаешься");
    if (body.bio !== undefined) data.bio = normalizeOptional(body.bio, "bio", "О себе");
    if (body.contact !== undefined) data.contact = normalizeOptional(body.contact, "contact", "Контакт");

    const user = await prisma.user.update({ where: { id: currentUser.id }, data });

    return NextResponse.json({ user: publicUser(user) });
  } catch (e) {
    return apiError(e);
  }
}
