import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

function signPassword(password: string): string {
  return createHmac("sha256", process.env.ADMIN_COOKIE_SECRET!)
    .update(password)
    .digest("hex");
}

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = signPassword(password);
  const res = NextResponse.json({ ok: true });

  res.cookies.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });

  return res;
}
