import { NextResponse } from "next/server";

const CANONICAL_HOST = "www.8distance.com";
const LEGACY_HOSTS = new Set(["8distance.com", "8-distance.vercel.app"]);

/**
 * - 非 www 網域 → 301 到 www（避免重複網頁）
 * - Wix 舊站內部 API → 410 Gone
 */
export function middleware(request) {
  const host = (request.headers.get("host") || "").split(":")[0];
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/_api")) {
    return new NextResponse(null, {
      status: 410,
      headers: {
        "Cache-Control": "public, max-age=86400",
      },
    });
  }

  if (LEGACY_HOSTS.has(host)) {
    return NextResponse.redirect(
      new URL(`https://${CANONICAL_HOST}${pathname}${search}`),
      301,
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/_api/:path*",
    "/((?!_next/static|_next/image|.*\\.(?:ico|png|jpg|jpeg|gif|webp|svg|avif|mp4|xml|txt|js|css|woff2?)).*)",
  ],
};
