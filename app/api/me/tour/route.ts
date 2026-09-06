import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { apiError } from "@/lib/api";
import { ValidationError } from "@/lib/errors";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await req.json();

    if (body.tour === "profile") {
      await prisma.user.update({ where: { id: user.id }, data: { seenProfileTour: true } });
    } else if (body.tour === "feed") {
      await prisma.user.update({ where: { id: user.id }, data: { seenFeedTour: true } });
    } else {
      throw new ValidationError("Неизвестный тур");
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}
