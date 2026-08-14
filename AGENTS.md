# AGENTS.md

Static, SEO-focused React SPA ("AI World Hub") — 19 in-browser prompt tools, blog, prompt library. Vite 7 + React 19 + TypeScript + Tailwind CSS 4, deployed on Cloudflare Pages from the `production-replit` branch.

## Commands

- `npm run dev` — dev server on `localhost:5173` (strict port).
- `npm run typecheck` — `tsc --noEmit`. Run this plus `npm run build` before finishing.
- `npm run build` — THE verification gate (no lint, no test suite exists). Chain: validate `public/sitemap.xml` → `vite build` to `dist/public` → `node prerender.mjs` (writes per-route `index.html`) → validate `dist/public/sitemap.xml`. **A broken sitemap fails the build.**
- No formatter/linter configured — match existing style.

## Adding a new page (or tool)

Every route exists in multiple places that must stay in sync; a build failure or silent SEO regression awaits if you miss one:

1. `src/App.tsx` — `<Route>` + `TOOL_PAGES` entry (tools also need a `ToolContainer`).
2. `src/seoConfig.ts` — client-side `SEO_MAP` entry (SPA uses `useSeo()`).
3. `prerender.mjs` — `routes` array (static prerender; ~87 pages).
4. `public/sitemap.xml` — must contain the URL. Validator enforces: `https://aiworldhub.site` host only, unique `<loc>`, valid `<lastmod>`/`<changefreq>`/`<priority>`. Validator does NOT check sitemap↔prerender parity; keep them consistent manually.
5. `index.html` — JSON-LD blocks (ItemList of 19 tools, etc.).
6. Blog posts live in `src/data/blogPosts.ts` (imports `NEW_SEO_POSTS` from `src/data/newBlogPosts.ts`). Content for categories/templates in `src/data/categories.ts`, `src/data/templates.ts`.

## Prerender gotchas

- `prerender.mjs` reads `dist/public/index.html` and does **string replacement** on `<title>`, `<meta name="description" ...>`, canonical/OG/Twitter tags. If you rename/remove any of those tags in `index.html`, replacements silently no-op and pages ship without SEO — no build error. Keep those tag patterns intact.
- Site URL is hardcoded as `https://aiworldhub.site` (prerender `SITE` const, canonicals, sitemap validator).

## Framework quirks

- **Tailwind 4** via `@tailwindcss/vite`; theme tokens are `@theme` in `src/index.css`. `tailwind.config.js` is legacy and is NOT loaded (no `@config` directive) — don't add colors/fonts there; use `@theme` in `index.css`.
- Path alias `@/*` → `src/*` (both `tsconfig.json` and `vite.config.ts`).
- Core tool logic is pure, in-browser functions in `src/lib/toolkit.ts` — no API calls anywhere.

## Deploy & branch

- Default/deployed branch is `production-replit` (origin HEAD points at it). Pushing to it triggers the Cloudflare Pages deploy — don't push experimental work there.
- Cloudflare Pages: build `npm run build`, output `dist/public`, `NODE_VERSION=20`.
- `build-for-cloudflare.sh` (used by the legacy Pages project rooted at `artifacts/ai-prompt-toolkit`) builds at repo root then copies `dist/public` into `artifacts/ai-prompt-toolkit/dist/public`. Do not hand-edit `artifacts/`; it only contains build-compat files.
- `public/_redirects` → `/* /index.html 200` (SPA fallback); `public/_headers` sets sitemap `Content-Type`/cache. `index.html` redirects `*.pages.dev` hosts to `aiworldhub.site`.

## Ads

Monetag-only (global tag in `index.html` zone `264272` + `MonetagAd`/`AdBanner` components). A prior commit removed malicious popunder/ninja ad scripts — do not reintroduce other ad networks or inline scripts without explicit request.
