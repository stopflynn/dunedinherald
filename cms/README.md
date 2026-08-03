# Dunedin Herald Newsroom

This folder contains the private editorial CMS. It is deliberately separate from the public website so the public bundle stays small and the login is handled by Sanity instead of custom password code.

## One-time setup

1. Create a Sanity project with a **private** `production` dataset.
2. Copy `.env.example` to `.env` and add the project ID.
3. Run `npm install`, then `npm run dev` to test the editor.
4. Invite only the writers who need access. Enable multi-factor authentication on their login provider accounts.
5. Run `npm run deploy` to publish the Studio at its separate `*.sanity.studio/newsroom` address. Do not link that address from the public website.
6. Create a read-only viewer token in Sanity and set it as `SANITY_READ_TOKEN` on the website host. Never prefix that token with `NEXT_PUBLIC_` or commit it to Git.

The public website will show its bundled launch articles until the Sanity environment variables are configured. It then reads only published CMS articles, with a 60-second cache.
