import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

function isValidToken(token: string): boolean {
  const expected = createHmac("sha256", process.env.ADMIN_COOKIE_SECRET!)
    .update(process.env.ADMIN_PASSWORD!)
    .digest("hex");
  return token === expected;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect /admin routes, but allow /admin/login and its API
  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login") &&
    !pathname.startsWith("/api/admin/login")
  ) {
    const token = req.cookies.get("admin_session")?.value;

    if (!token || !isValidToken(token)) {
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
