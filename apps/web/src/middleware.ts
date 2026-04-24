import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/for-parents", "/faq", "/privacy", "/terms", "/contact"];
const PUBLIC_PREFIXES = ["/compare/"];
const APP_PATHS = ["/parent-dashboard", "/dashboard", "/diagnostic", "/session", "/profile", "/start", "/subscribe"];

export function middleware(request: NextRequest) {
  // Redirect www → apex (301 permanent).
  // Build the target from a fixed canonical base — do NOT mutate request.url,
  // because behind Railway's proxy it carries the internal port ($PORT=8080),
  // which would leak into the Location header (e.g. https://upwise.com.au:8080/).
  const host = request.headers.get("host")?.split(":")[0] ?? "";
  if (host === "www.upwise.com.au") {
    const { pathname, search } = request.nextUrl;
    return NextResponse.redirect(
      `https://upwise.com.au${pathname}${search}`,
      301,
    );
  }

  const { pathname } = request.nextUrl;

  if (
    PUBLIC_PATHS.includes(pathname) ||
    PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    APP_PATHS.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
