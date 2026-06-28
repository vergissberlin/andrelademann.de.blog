# blog.andrelademann.de

Personal engineering blog about cloud architecture, software development, and modern tooling.

**Live site:** [blog.andrelademann.de](https://blog.andrelademann.de)

Built with [Astro](https://astro.build/) on the [AstroPaper](https://github.com/satnaing/astro-paper) theme.

## Tech stack

| Area                | Tools                                                                                  |
|---------------------|----------------------------------------------------------------------------------------|
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
|---------------------|---------------------------------------------------|
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

Page views and client-side errors are tracked with [Swetrix](https://swetrix.com) (cookieless, respects Do Not Track). The production project is **andrelademann.blog** (`6LH65qU3KYkF`), scoped to `blog.andrelademann.de`.

**Local setup:** copy [`.env.example`](./.env.example) to `.env` and set `PUBLIC_SWETRIX_PID`. Tracking is disabled in dev (`import.meta.env.DEV`).

**Production:** add the repository secret `PUBLIC_SWETRIX_PID` in GitHub (Settings → Secrets → Actions). The deploy workflow passes it into the build so the project ID is baked into the static output.

Dashboard: [swetrix.com/projects](https://swetrix.com/projects)

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
