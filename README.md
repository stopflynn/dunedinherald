# The Dunedin Herald

A lightweight satire publication website with a separately deployed, managed-auth newsroom.

## Architecture

- `app/`, `components/`, `lib/`: public site built with Next.js and deployed to GoDaddy Node.js Hosting.
- `server.mjs`: production Node.js entry point. It listens on the `PORT` assigned by GoDaddy.
- `cms/`: Sanity Studio. Sanity manages editor authentication, drafts, image storage and publishing permissions.
- `public/news/`: bundled launch stories used as a fallback before the CMS is connected.

The public site has no database, upload endpoint or write API. This keeps the attack surface and maintenance burden small. CMS credentials stay on Sanity; the website receives only a server-side, read-only content token. An optional shared-password gate can be enabled for private previews.

## Local website

```sh
npm install
npm run dev
```

Copy `.env.example` to `.env.local` when connecting Sanity. Keep the dataset private and use a read-only viewer token.

`SITE_URL` is the canonical public origin used for `robots.txt` and `sitemap.xml`. Local overrides belong in `.env.local`; configure the production value in the GoDaddy app settings.

## GoDaddy Node.js deployment

Deploy the repository root as a Next.js application using [GoDaddy Node.js Hosting](https://www.godaddy.com/help/godaddy-nodejs-hosting-faq-42915). Ordinary static-file hosting cannot run the server-rendered pages, access API or password gate.

1. Run `npm install`, `npm run lint` and `npm test` locally.
2. In GoDaddy Node.js Hosting, either connect this Git repository or upload a ZIP of the repository root. Do not include `node_modules`, `.next`, `.env*` or generated CMS files in a ZIP.
3. Configure the environment variables from `.env.example` in the app settings. Secret values must remain server-only.
4. Deploy to GoDaddy's private preview and verify the home page, an article, a category, `/sitemap.xml` and the optional access gate.
5. Publish the preview, connect `dunedinherald.com`, and only then switch the domain's DNS away from the old host.

GoDaddy installs the packages and runs the existing `build` and `start` scripts. The production server binds to GoDaddy's `PORT` automatically. The root package is the only app GoDaddy runs; the nested `cms/` project remains an independently deployed Sanity Studio.

### Production environment

Set these values in GoDaddy before publishing:

```sh
SITE_URL=https://dunedinherald.com
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production
SANITY_API_VERSION=2026-08-01
SANITY_READ_TOKEN=your-read-only-viewer-token
```

`SANITY_READ_TOKEN` is required when the Sanity dataset is private. Never commit the real token or upload an `.env` file.

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
