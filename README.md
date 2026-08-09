# blog.andrelademann.de

Personal engineering blog about cloud architecture, software development, and modern tooling.

**Live site:** [blog.andrelademann.de](https://blog.andrelademann.de)

Built with [Astro](https://astro.build/) on the [AstroPaper](https://github.com/satnaing/astro-paper) theme.

## Tech stack

| Area                | Tools                                                                                  |
| ------------------- | -------------------------------------------------------------------------------------- |
| Framework           | [Astro](https://astro.build/) 6                                                        |
| Styling             | [Tailwind CSS](https://tailwindcss.com/) 4                                             |
| Content             | Markdown / MDX via Astro Content Collections                                           |
| Syntax highlighting | [Shiki](https://shiki.style/)                                                          |
| Search              | [Pagefind](https://pagefind.app/)                                                      |
| Dynamic OG images   | [Satori](https://github.com/vercel/satori) + [Sharp](https://sharp.pixelplumbing.com/) |
| Package manager     | [pnpm](https://pnpm.io/)                                                               |
| Deployment          | GitHub Pages                                                                           |

## Requirements

- Node.js `>=22.12.0`
- pnpm `11.x` (recommended)

## Getting started

```bash
pnpm install
pnpm dev
```

The dev server runs at [localhost:4321](http://localhost:4321).

For background mode (recommended in agent workflows):

```bash
astro dev --background
astro dev status
astro dev logs
astro dev stop
```

## Commands

| Command             | Description                                       |
| ------------------- | ------------------------------------------------- |
| `pnpm dev`          | Start the local dev server                        |
| `pnpm build`        | Type-check, build the site, run Pagefind indexing |
| `pnpm preview`      | Preview the production build locally              |
| `pnpm sync`         | Generate Astro TypeScript types                   |
| `pnpm lint`         | Run ESLint                                        |
| `pnpm format`       | Format the codebase with Prettier                 |
| `pnpm format:check` | Check formatting without writing changes          |
| `pnpm astro …`      | Run Astro CLI commands                            |

## Project structure

```text
/
├── public/
│   ├── images/posts/     # Post images (hero + inline)
│   └── pagefind/         # Generated search index (after build)
├── scripts/
│   └── import-from-rss.mjs
├── src/
│   ├── components/
│   ├── content/
│   │   ├── pages/        # Static pages (e.g. about)
│   │   └── posts/        # Blog posts (.md / .mdx)
│   ├── layouts/
│   ├── pages/
│   ├── styles/
│   └── utils/
├── astro-paper.config.ts # Site title, URL, socials, features
└── astro.config.ts
```

Posts live in `src/content/posts/`. Post images go in `public/images/posts/<slug>/`.

## Writing posts

Create a Markdown file in `src/content/posts/` with frontmatter:

```yaml
---
author: André Lademann
pubDatetime: 2026-06-28T00:00:00.000Z
title: "Your post title"
slug: your-post-slug
featured: false
draft: true
tags:
  - astro
description: "Short summary for SEO and post cards."
ogImage: /images/posts/your-post-slug/hero.jpg
canonicalURL: https://blog.andrelademann.de/your-post-slug
---
```

Set `draft: false` when the post is ready to publish. Posts with `draft: true` are excluded from the build.

### Content conventions

- Write post content in **British English** (e.g. "colour", "organise", "-ise" suffixes).
- Give every image a descriptive **alt text**: `![Description](/images/posts/…/image.png)`.
- Set a **language** on fenced code blocks: ` ```bash `, ` ```javascript `, ` ```json `, etc.
- Hero images should be photorealistic when adding new visuals.

See also [`CLAUDE.md`](./CLAUDE.md) and [`AGENTS.md`](./AGENTS.md) for editor/agent guidelines.

## Configuration

Site-wide settings are in [`astro-paper.config.ts`](./astro-paper.config.ts):

- URL, title, description, author
- Posts per page, search, OG image generation
- Social and share links

Optional Google Site Verification via the `PUBLIC_GOOGLE_SITE_VERIFICATION` environment variable (see [`astro.config.ts`](./astro.config.ts)).

## Analytics (Swetrix)

Page views and client-side errors are tracked with [Swetrix](https://swetrix.com) (cookieless, respects Do Not Track). The production project is **andrelademann.blog** (`6LH65qU3KYkF`), scoped to `blog.andrelademann.de`, hosted on [analytics.kieks.me](https://analytics.kieks.me) with ingest at [analytics-api.kieks.me](https://analytics-api.kieks.me).

**Local setup:** copy [`.env.example`](./.env.example) to `.env` and set `PUBLIC_SWETRIX_PID`. Tracking is disabled in dev (`import.meta.env.DEV`). Override `PUBLIC_SWETRIX_API_URL` only when pointing at a different Swetrix instance.

**Production:** add the repository secret `PUBLIC_SWETRIX_PID` in GitHub (Settings → Secrets → Actions). The deploy workflow passes it into the build so the project ID is baked into the static output. The API URL defaults to `https://analytics-api.kieks.me/log`.

Dashboard: [analytics.kieks.me/projects/6LH65qU3KYkF](https://analytics.kieks.me/projects/6LH65qU3KYkF)

### Custom events

Fired from [`src/scripts/analytics-events.ts`](./src/scripts/analytics-events.ts):

| Event            | Meta               | Trigger                               |
| ---------------- | ------------------ | ------------------------------------- |
| `POST_READ`      | `slug`             | Automatic on any `/posts/<slug>` page |
| `DOWNLOAD_CLICK` | `file`, `fileType` | `DownloadCard` call to action         |
| `SHARE_CLICK`    | `platform`         | Share links below a post              |
| `SOCIAL_CLICK`   | `platform`         | Social icons                          |
| `RSS_CLICK`      | —                  | RSS link on the home page             |
| `SEARCH_USED`    | `query`            | Search input                          |

Any element can report a click by carrying `data-swetrix-event="EVENT_NAME"`. Attach meta with
`data-swetrix-meta-<key>` attributes — `data-swetrix-meta-file-type="PDF"` arrives as
`{ fileType: "PDF" }`. A delegated listener on `document` handles all of them, so no per-component
JavaScript is needed.

> Swetrix's SDK refuses to send anything from `localhost` unless `devMode` is set, so custom events
> cannot be observed with `pnpm preview` alone. Verify against production, or temporarily pass
> `devMode: true` to `init()` in [`src/scripts/analytics.ts`](./src/scripts/analytics.ts).

### Funnels

Funnel steps mix page paths and custom event names. `Download OKR cheatsheet` measures
`/posts/8-okr-introduction-mistakes-you-dont-need-to-make/` → `DOWNLOAD_CLICK`, deliberately using
the specific post path rather than `POST_READ` — the latter fires on every post and would dilute the
conversion rate with each unrelated article published.

## Downloads

A post can offer a file with a `download` block in its frontmatter. It works in plain `.md` — the
card is rendered by the post route, after the article and before the sources:

```yaml
download:
  file: /downloads/<post-slug>/<file>.pdf
  title: "What the reader gets"
  description: "One line on why it is worth the click."
```

The file lives in `public/downloads/<post-slug>/`. Its size is read from disk at build time, so the
announced size can never drift. A path that does not resolve to a readable file **fails the
production build** and warns in dev — a typo would otherwise ship as a 404.

For a card at a specific point in the text rather than at the end, import
[`DownloadCard`](./src/components/DownloadCard.astro) in an `.mdx` body instead, as
`8-okr-introduction-mistakes-you-dont-need-to-make.mdx` does. Both routes work.

### Cheat sheets

The printable PDFs are generated from data in [`scripts/cheatsheets/`](./scripts/cheatsheets/):
one file per sheet under `sheets/`, rendered through a shared A4/A5 `template.mjs`.

```bash
pnpm cheatsheets
```

Content is plain data so it stays reviewable in a diff, and a sheet whose content no longer fits its
page fails the run rather than silently losing its last section. Output is byte-stable, so re-running
without a content change rewrites nothing.

The script is deliberately **not** part of `pnpm build` — the PDFs are committed, so neither the
build nor the deploy needs a browser. That is also why the dependency is `playwright-core`, which
downloads no browser on install. Point it at one with `CHROME_PATH`, or set
`PLAYWRIGHT_BROWSERS_PATH` to a directory containing `chromium-<build>/chrome-linux/chrome`.

## CI / deployment

- **CI** (`.github/workflows/ci.yml`) — lint, format check, and build on pull requests.
- **Deploy** (`.github/workflows/deploy.yml`) — builds and publishes to GitHub Pages on pushes to `main`.

## Docker

Build and serve the static site with nginx:

```bash
docker build -t andrelademann-blog .
docker run --rm -p 8080:80 andrelademann-blog
```

Or use Docker Compose:

```bash
docker compose up --build
```

## Migration script

`scripts/import-from-rss.mjs` imports posts from the Hashnode RSS feed into Markdown files. One-time migration utility:

```bash
node scripts/import-from-rss.mjs
```

## Credits

Based on [AstroPaper](https://github.com/satnaing/astro-paper) by [Sat Naing](https://satnaing.dev).

Licensed under the MIT License — see [`LICENSE`](./LICENSE).
