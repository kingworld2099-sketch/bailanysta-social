import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { PHOTO_EXPIRY_HOURS } from "@/lib/config";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - PHOTO_EXPIRY_HOURS * 60 * 60 * 1000);

  const expired = await prisma.post.findMany({
    where: { photoUrl: { not: null }, createdAt: { lt: cutoff } },
    select: { id: true, photoUrl: true },
  });

  for (const post of expired) {
    if (!post.photoUrl) continue;
    try {
      await del(post.photoUrl);
    } catch {
      // already gone — fine, we still clear the reference below
    }
  }

  if (expired.length > 0) {
    await prisma.post.updateMany({
      where: { id: { in: expired.map((p) => p.id) } },
      data: { photoUrl: null },
    });
  }

  return NextResponse.json({ cleaned: expired.length });
}
