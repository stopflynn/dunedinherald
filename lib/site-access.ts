export const ACCESS_COOKIE_NAME = "dh_site_access";
export const ACCESS_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

const GATE_CACHE_MS = 30_000;
const encoder = new TextEncoder();

let gateCache: { enabled: boolean; expiresAt: number } | undefined;

function accessPassword() {
  return process.env.SITE_ACCESS_PASSWORD?.trim() || "";
}

function cookieSecret() {
  return process.env.SITE_ACCESS_COOKIE_SECRET?.trim() || "";
}

export function hasAccessSecrets() {
  return accessPassword().length >= 12 && cookieSecret().length >= 32;
}

async function hmacKey() {
  const secret = cookieSecret();
  if (!secret) return null;

  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function toBase64Url(value: ArrayBuffer) {
  const bytes = new Uint8Array(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

function fromBase64Url(value: string) {
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");

  try {
    const binary = atob(padded);
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  } catch {
    return null;
  }
}

async function sign(value: string) {
  const key = await hmacKey();
  if (!key) return null;
  return crypto.subtle.sign("HMAC", key, encoder.encode(value));
}

async function passwordFingerprint() {
  const password = accessPassword();
  const signature = password ? await sign(password) : null;
  return signature ? toBase64Url(signature).slice(0, 18) : null;
}

export async function verifyAccessPassword(candidate: string) {
  const password = accessPassword();
  const key = await hmacKey();
  if (!password || !key || candidate.length > 256) return false;

  const expectedSignature = await crypto.subtle.sign("HMAC", key, encoder.encode(password));
  return crypto.subtle.verify("HMAC", key, expectedSignature, encoder.encode(candidate));
}

export async function createAccessToken() {
  if (!hasAccessSecrets()) return null;

  const expiresAt = Math.floor(Date.now() / 1000) + ACCESS_COOKIE_MAX_AGE;
  const fingerprint = await passwordFingerprint();
  if (!fingerprint) return null;

  const payload = `v1.${expiresAt}.${fingerprint}`;
  const signature = await sign(payload);
  return signature ? `${payload}.${toBase64Url(signature)}` : null;
}

export async function isAccessTokenValid(token?: string) {
  if (!token || !hasAccessSecrets()) return false;

  const [version, expiresAtText, fingerprint, encodedSignature, ...extra] = token.split(".");
  if (version !== "v1" || extra.length || !expiresAtText || !fingerprint || !encodedSignature) return false;

  const expiresAt = Number(expiresAtText);
  const now = Math.floor(Date.now() / 1000);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= now || expiresAt > now + ACCESS_COOKIE_MAX_AGE + 300) return false;
  if (fingerprint !== await passwordFingerprint()) return false;

  const signature = fromBase64Url(encodedSignature);
  const key = await hmacKey();
  if (!signature || !key) return false;

  return crypto.subtle.verify(
    "HMAC",
    key,
    signature,
    encoder.encode(`${version}.${expiresAtText}.${fingerprint}`),
  );
}

export async function isPasswordProtectionEnabled() {
  const now = Date.now();
  if (gateCache && gateCache.expiresAt > now) return gateCache.enabled;

  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET || "production";
  const apiVersion = process.env.SANITY_API_VERSION || "2026-08-01";
  const token = process.env.SANITY_READ_TOKEN;
  if (!projectId) return hasAccessSecrets();

  const url = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`);
  url.searchParams.set(
    "query",
    `*[_id == "siteSettings"][0]{"enabled": passwordProtectionEnabled}`,
  );

  try {
    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Unable to read access setting");

    const data = (await response.json()) as { result?: { enabled?: unknown } | null };
    if (!data.result || (data.result.enabled !== null && data.result.enabled !== undefined && typeof data.result.enabled !== "boolean")) {
      throw new Error("Invalid access setting");
    }

    const enabled = data.result.enabled === true;
    gateCache = { enabled, expiresAt: now + GATE_CACHE_MS };
    return enabled;
  } catch {
    // Once credentials are configured, a CMS outage must not expose a protected site.
    return gateCache?.enabled === true || hasAccessSecrets();
  }
}
