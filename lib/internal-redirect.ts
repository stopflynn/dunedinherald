import { NextResponse } from "next/server";

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
