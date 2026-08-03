# The Dunedin Herald

A lightweight satire publication website with a separately deployed, managed-auth newsroom.

## Architecture

- `app/`, `components/`, `lib/`: public site built with Next-compatible Vinext and deployed to Cloudflare.
- `cms/`: Sanity Studio. Sanity manages editor authentication, drafts, image storage and publishing permissions.
- `public/news/`: bundled launch stories used as a fallback before the CMS is connected.

The public site has no database, upload endpoint, admin password or write API. This keeps the attack surface and maintenance burden small. CMS credentials stay on Sanity; the website receives only a server-side, read-only content token.

## Local website

```sh
npm install
npm run dev
```

Copy `.env.example` to `.env.local` when connecting Sanity. Keep the dataset private and use a read-only viewer token.

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
