import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { apiError } from "@/lib/api";
import { publicUser } from "@/lib/serialize";
import { normalizeVibe } from "@/lib/validation";

export async function PATCH(req: NextRequest) {
  try {
    const currentUser = await requireUser();
    const body = await req.json();
    const vibe = normalizeVibe(body.vibe);

    const user = await prisma.user.update({
      where: { id: currentUser.id },
      data: { vibe, vibeUpdatedAt: new Date() },
    });

    return NextResponse.json({ user: publicUser(user) });
  } catch (e) {
    return apiError(e);
  }
}
