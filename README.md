# The Dunedin Herald

A lightweight satire publication website with a separately deployed, managed-auth newsroom.

## Architecture

- `app/`, `components/`, `lib/`: public site built with Next-compatible Vinext and deployed to Cloudflare.
- `cms/`: Sanity Studio. Sanity manages editor authentication, drafts, image storage and publishing permissions.
- `public/news/`: bundled launch stories used as a fallback before the CMS is connected.
- `wrangler.jsonc`: independent Cloudflare Worker configuration owned with the source code.

The public site has no database, upload endpoint or write API. This keeps the attack surface and maintenance burden small. CMS credentials stay on Sanity; the website receives only a server-side, read-only content token. An optional shared-password gate can be enabled for private previews.

## Local website

```sh
npm install
npm run dev
```

Copy `.env.example` to `.env.local` when connecting Sanity. Keep the dataset private and use a read-only viewer token.

`SITE_URL` is the canonical public origin used for `robots.txt` and `sitemap.xml`. Local overrides belong in `.env.local`; the production value lives in `wrangler.jsonc`.

## Independent Cloudflare deployment

The website has no dependency on OpenAI Sites. Its build and runtime configuration live in `wrangler.jsonc`.

```sh
npx wrangler login
npm run deploy:check
npm run deploy
```

Manage the Sanity connection values and optional access-gate values as Cloudflare Worker variables or secrets. `keep_vars` is enabled so a source deployment preserves values managed in the Cloudflare dashboard. Never place secret values in `wrangler.jsonc`.

## Optional whole-site password

The password itself is never stored in Sanity. Configure these as server-only secrets locally and on the website host:

```sh
SITE_ACCESS_PASSWORD=a-strong-shared-password
SITE_ACCESS_COOKIE_SECRET=a-random-secret-at-least-32-characters-long
```

Use at least 12 characters for the password and at least 32 random characters for the signing secret. Restart the local website after changing either value. Once both secrets exist, enable **Password-protect the website** in Sanity Site Settings and publish the setting. Successful entry creates a signed, HttpOnly cookie lasting seven days; changing either secret invalidates existing access cookies.

This is a lightweight shared-password gate for previews, not individual user authentication. For confidential or high-stakes material, use the hosting platform's identity-based access controls instead.

## CMS

See [`cms/README.md`](cms/README.md) for the one-time secure setup and deployment flow.

## Security checklist

- Keep the Sanity dataset private.
- Give the website a viewer token only; never an editor token.
- Keep CMS membership to named editors and remove old accounts promptly.
- Require multi-factor authentication on editor identity-provider accounts.
- Never commit `.env`, tokens or deployment credentials.
- Keep dependencies updated and review audit output before production releases.
- Upload only owned or properly licensed images and complete every credit field.
