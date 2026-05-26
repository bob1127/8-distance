import { NextResponse } from "next/server";

/**
 * Wix 舊站內部 API（如 /_api/v1/access-tokens）不應被索引。
 * 回傳 410 Gone，讓 Google 比 404 更快從索引中移除。
 */
export function middleware(request) {
  if (request.nextUrl.pathname.startsWith("/_api")) {
    return new NextResponse(null, {
      status: 410,
      headers: {
        "Cache-Control": "public, max-age=86400",
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/_api/:path*"],
};
