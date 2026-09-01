import { NextResponse, type NextRequest } from "next/server";
import {
  ACCESS_COOKIE_NAME,
  isAccessTokenValid,
  isPasswordProtectionEnabled,
} from "@/lib/site-access";
import { redirectToInternalPath } from "@/lib/internal-redirect";

const alwaysPublicPaths = [
  "/access",
  "/api/access",
  "/_next/",
  "/assets/",
  "/brand-mark.jpg",
  "/favicon.ico",
];

function isAlwaysPublic(pathname: string) {
  return alwaysPublicPaths.some((path) => pathname === path || pathname.startsWith(path));
}

export async function proxy(request: NextRequest) {
  if (isAlwaysPublic(request.nextUrl.pathname)) return NextResponse.next();
  if (!(await isPasswordProtectionEnabled())) return NextResponse.next();

  const accessToken = request.cookies.get(ACCESS_COOKIE_NAME)?.value;
  if (await isAccessTokenValid(accessToken)) return NextResponse.next();

  const returnTo = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  const params = new URLSearchParams({ returnTo });
  return redirectToInternalPath(`/access?${params}`, 307);
}

export const config = {
  matcher: "/:path*",
};
