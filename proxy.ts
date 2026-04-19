import { NextResponse, type NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const authed = req.cookies.get("admin")?.value === "1";
  if (req.nextUrl.pathname.startsWith("/admin") && !authed) {
    return NextResponse.redirect(new URL("/admin-login", req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
