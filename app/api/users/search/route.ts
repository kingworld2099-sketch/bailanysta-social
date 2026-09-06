import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { apiError } from "@/lib/api";
import { trustedUserIds } from "@/lib/connect";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser();
    const q = (req.nextUrl.searchParams.get("q") ?? "").trim();
    if (!q) return NextResponse.json({ users: [] });

    const connected = await trustedUserIds(user.id);
    if (connected.size === 0) return NextResponse.json({ users: [] });

    const users = await prisma.user.findMany({
      where: {
        id: { in: [...connected] },
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { lastName: { contains: q, mode: "insensitive" } },
          { username: { contains: q, mode: "insensitive" } },
        ],
      },
      select: { id: true, name: true, lastName: true, username: true },
      orderBy: { username: "asc" },
      take: 6,
    });

    return NextResponse.json({ users });
  } catch (e) {
    return apiError(e);
  }
}
