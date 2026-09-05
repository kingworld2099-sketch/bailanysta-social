import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/session";

export async function POST(req: NextRequest) {
  await clearSessionCookie();
  return NextResponse.redirect(new URL("/feed", req.url), { status: 303 });
}
