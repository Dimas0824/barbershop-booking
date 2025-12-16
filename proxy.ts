import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isProtectedPath = (pathname: string) => {
  if (pathname.startsWith("/admin/login")) return false;
  if (pathname.startsWith("/api/admin/login")) return false;
  if (pathname.startsWith("/api/admin/logout")) return false;
  return pathname.startsWith("/admin");
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get("admin_auth")?.value;
  if (authCookie === "1") {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("redirect", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
