import { NextResponse, type NextRequest } from "next/server";
import { getSiteUrl } from "@/lib/site-url";

const INTERNAL_ORIGIN = "https://internal.invalid";

export function safeInternalPath(value: unknown, fallback = "/") {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  try {
    const url = new URL(value, INTERNAL_ORIGIN);
    if (url.origin !== INTERNAL_ORIGIN) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

export function redirectToInternalPath(path: string, status: 303 | 307) {
  return new NextResponse(null, {
    status,
    headers: { Location: safeInternalPath(path) },
  });
}

function firstForwardedValue(value: string | null) {
  return value?.split(",")[0]?.trim() || "";
}

function publicRequestOrigin(request: NextRequest) {
  const host = firstForwardedValue(request.headers.get("x-forwarded-host"))
    || firstForwardedValue(request.headers.get("host"));
  const forwardedProtocol = firstForwardedValue(request.headers.get("x-forwarded-proto"));
  const protocol = forwardedProtocol === "http" || forwardedProtocol === "https"
    ? forwardedProtocol
    : request.nextUrl.protocol.replace(":", "");

  if (host) {
    try {
      const origin = new URL(`${protocol}://${host}`);
      if (origin.hostname !== "0.0.0.0" && origin.hostname !== "[::]") return origin;
    } catch {
      // Fall back to the configured public site URL below.
    }
  }

  return new URL(getSiteUrl());
}

export function redirectRequestToInternalPath(
  request: NextRequest,
  path: string,
  status: 303 | 307,
) {
  const url = new URL(safeInternalPath(path), publicRequestOrigin(request));
  return NextResponse.redirect(url, status);
}
