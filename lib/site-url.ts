const DEFAULT_SITE_URL = "https://dunedinherald.com";

export function getSiteUrl() {
  const configuredUrl = process.env.SITE_URL?.trim() || DEFAULT_SITE_URL;

  try {
    const url = new URL(configuredUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error();

    url.hash = "";
    url.search = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    throw new Error("SITE_URL must be a complete http:// or https:// URL.");
  }
}
