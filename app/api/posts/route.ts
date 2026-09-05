import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { apiError } from "@/lib/api";
import { validatePostText, normalizeOptional, normalizeVibe, normalizePhotoUrl } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const text = validatePostText(body.text);
    const place = normalizeOptional(body.place, "place", "Место");
    const plannedAt = normalizeOptional(body.plannedAt, "plannedAt", "Время");
    const photoUrl = normalizePhotoUrl(body.photoUrl);
    const vibe = body.vibe !== undefined ? normalizeVibe(body.vibe) : user.vibe;

    if (vibe !== user.vibe) {
      await prisma.user.update({
        where: { id: user.id },
        data: { vibe, vibeUpdatedAt: new Date() },
      });
    }

    const post = await prisma.post.create({
      data: {
        authorId: user.id,
        text,
        vibe,
        place,
        plannedAt,
        photoUrl,
      },
      include: {
        author: { select: { id: true, name: true, city: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (e) {
    return apiError(e);
  }
}
