import { NextResponse, type NextRequest } from "next/server";
import {
  ACCESS_COOKIE_MAX_AGE,
  ACCESS_COOKIE_NAME,
  createAccessToken,
  hasAccessSecrets,
  isPasswordProtectionEnabled,
  verifyAccessPassword,
} from "@/lib/site-access";

const ATTEMPT_LIMIT = 5;
const ATTEMPT_WINDOW_MS = 5 * 60 * 1000;
const attempts = new Map<string, { count: number; resetAt: number }>();

function clientKey(request: NextRequest) {
  return request.headers.get("cf-connecting-ip")
    || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || "unknown";
}

function safeReturnTo(value: FormDataEntryValue | null) {
  const path = typeof value === "string" ? value : "/";
  return path.startsWith("/") && !path.startsWith("//") ? path : "/";
}

function redirectToAccess(request: NextRequest, error: string, returnTo: string) {
  const url = new URL("/access", request.url);
  url.searchParams.set("error", error);
  url.searchParams.set("returnTo", returnTo);
  return NextResponse.redirect(url, 303);
}

function isRateLimited(key: string) {
  const now = Date.now();
  const attempt = attempts.get(key);
  if (!attempt || attempt.resetAt <= now) {
    attempts.set(key, { count: 0, resetAt: now + ATTEMPT_WINDOW_MS });
    return false;
  }
  return attempt.count >= ATTEMPT_LIMIT;
}

function recordFailure(key: string) {
  const attempt = attempts.get(key);
  if (attempt) attempt.count += 1;
  if (attempts.size > 2_000) {
    const now = Date.now();
    for (const [storedKey, storedAttempt] of attempts) {
      if (storedAttempt.resetAt <= now) attempts.delete(storedKey);
    }
  }
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 4_096) return new NextResponse("Request too large", { status: 413 });

  const form = await request.formData();
  const returnTo = safeReturnTo(form.get("returnTo"));

  if (!(await isPasswordProtectionEnabled())) {
    return NextResponse.redirect(new URL(returnTo, request.url), 303);
  }
  if (!hasAccessSecrets()) return redirectToAccess(request, "configuration", returnTo);

  const key = clientKey(request);
  if (isRateLimited(key)) return redirectToAccess(request, "limited", returnTo);

  const password = form.get("password");
  const valid = typeof password === "string" && await verifyAccessPassword(password);
  if (!valid) {
    recordFailure(key);
    await new Promise((resolve) => setTimeout(resolve, 350));
    return redirectToAccess(request, "invalid", returnTo);
  }

  attempts.delete(key);
  const token = await createAccessToken();
  if (!token) return redirectToAccess(request, "configuration", returnTo);

  const response = NextResponse.redirect(new URL(returnTo, request.url), 303);
  response.cookies.set({
    name: ACCESS_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_COOKIE_MAX_AGE,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
