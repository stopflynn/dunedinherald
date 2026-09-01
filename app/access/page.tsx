import type { Metadata } from "next";
import { safeInternalPath } from "@/lib/internal-redirect";

export const metadata: Metadata = {
  title: "Private edition",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const errorMessages: Record<string, string> = {
  invalid: "That password was not recognised.",
  limited: "Too many attempts. Wait a few minutes before trying again.",
  configuration: "Password protection is enabled but its server secrets are not configured.",
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const error = first(params.error);
  const returnTo = safeInternalPath(first(params.returnTo));

  return (
    <main className="access-page">
      <section className="access-card" aria-labelledby="access-title">
        <img src="/brand-mark.jpg" alt="" className="access-mark" />
        <h1 id="access-title">Coming Soon...</h1>
        <p className="access-intro">If you have a password enter it here:</p>

        {error && errorMessages[error] && (
          <p className="access-error" role="alert">{errorMessages[error]}</p>
        )}

        <form className="access-form" action="/api/access" method="post">
          <input type="hidden" name="returnTo" value={returnTo} />
          <label htmlFor="site-password">Password</label>
          <input
            id="site-password"
            name="password"
            type="password"
            autoComplete="current-password"
            maxLength={256}
            required
            autoFocus
          />
          <button type="submit">Enter site</button>
        </form>
      </section>
    </main>
  );
}
