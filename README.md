# DevMello

A colourful, markdown-driven blog for projects and writing. Built with [Astro](https://astro.build).

## Running it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output to dist/
npm run preview  # serve the built site locally
```

## Writing a post

Add a markdown file to `src/content/blog/`. The filename becomes the URL, so
`src/content/blog/why-rust.md` publishes at `/blog/why-rust/`. Everything else — the card on the
index, the tag pages, the RSS entry, the sitemap — follows automatically.

```markdown
---
title: Why I rewrote it in Rust
description: One or two sentences. Used on cards and in search results.
date: 2026-07-16
tags: ["rust", "performance"]
---

Your content here.
```

### Frontmatter

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | |
| `description` | yes | Shown on cards, in search results and in social previews |
| `date` | yes | `YYYY-MM-DD`, no quotes needed |
| `updated` | no | Shown alongside the publish date |
| `tags` | no | Drives `/tags/<tag>/` pages and the filter on `/blog` |
| `cover` | no | Path under `public/`, e.g. `/images/foo.jpg`. Omit for generated art |
| `coverAlt` | no | Alt text for `cover`. Leave empty if the image is decorative |
| `featured` | no | Pins to the top of the homepage |
| `draft` | no | Visible in `npm run dev`, excluded from builds and RSS |
| `wip` | no | Blog only. Lists the post on `/drafts` — see below |
| `progress` | no | Blog only. `0`–`100`; draws a progress bar on the draft card |
| `accent` | no | `orange` \| `blue` \| `pink` \| `purple` \| `yellow` \| `green` |

#### `draft` vs `wip`

These sound alike and do opposite things:

- **`draft: true`** is *private*. The entry is hidden everywhere except `npm run dev`. Use it for
  something not ready to be seen at all.
- **`wip: true`** is *public*. The post gets a real page at `/blog/<slug>/` with a "still being
  written" banner, and is listed on `/drafts` — but stays out of `/blog`, tag pages, the homepage
  and RSS, and is `noindex`ed. Use it to think out loud in public.

Setting both means `draft` wins, since it's the stricter of the two. Drop `wip` when the post is
done and it moves to `/blog` and goes out over RSS — which is the one and only time subscribers
hear about it.

Projects live in `src/content/projects/` and take the same fields plus:

| Field | Notes |
| --- | --- |
| `status` | `building` \| `shipped` \| `exploring` \| `archived` — groups the projects index |
| `stack` | e.g. `["Astro", "TypeScript"]` |
| `repo` / `demo` | URLs; render as buttons on the project page |

The schema in `src/content.config.ts` is enforced at build time, so a typo in a date or a bad
`status` fails the build instead of quietly shipping a broken page.

### Markdown support

GitHub-flavoured markdown, plus:

- **Syntax highlighting** via Shiki, at build time — no highlighting JS is sent to the browser
- **Tables, footnotes, task lists and strikethrough** via `remark-gfm`
- **Heading anchors** and an auto-generated table of contents from `h2`/`h3`
- **External links** get an `↗` marker, `target="_blank"` and `rel="noopener noreferrer"`
- **Wide tables** scroll inside their own container so the page never scrolls sideways
- **MDX** is enabled — use `.mdx` if you need components in a post

`src/content/blog/markdown-kitchen-sink.md` exercises all of it. Keep it around as a styling
regression test.

## Customising

- **Site name, nav, social links, URL** — `src/site.config.ts`. Update `url` before deploying;
  it's used for canonical URLs, RSS and the sitemap.
- **Colours, type scale, spacing, radii** — the tokens at the top of `src/styles/global.css`.
- **Card colours** — assigned by hashing the filename, so an entry keeps its colour everywhere.
  Override per-entry with `accent:`.
- **Covers** — a post without a `cover` gets a seeded abstract SVG (`src/components/Pattern.astro`)
  built from the palette, so the grid never has a hole in it.

## Structure

```
src/
├── components/     Header, Footer, Card, Marquee, Pattern, TableOfContents
├── content/        blog/ and projects/ markdown — this is what you edit
├── layouts/        BaseLayout (shell + SEO), PostLayout, PageLayout
├── lib/            Content queries, sorting, dates, reading time
├── pages/          Routes, RSS and the about page
├── plugins/        Custom rehype plugin (table scroll wrappers)
├── styles/         global.css — all design tokens live here
├── content.config.ts
└── site.config.ts
```

## Deploying

Fully static — `npm run build` emits plain HTML to `dist/` with no adapter and no Node runtime.
All client scripts are small enough that Astro inlines them, so the build ships **zero JavaScript
files**; the only asset request is one stylesheet.

This repo is set up for **GitHub Pages at `blog.devmello.xyz`**, deployed by
`.github/workflows/deploy.yml` on every push to `main`.

### First-time setup

1. **Repo → Settings → Pages → Source: "GitHub Actions"** (not "Deploy from a branch").
   The workflow won't publish until this is set.
2. **DNS**: add a `CNAME` record for `blog` pointing at `devmello.github.io`.
3. **Settings → Pages → Custom domain**: enter `blog.devmello.xyz`, then tick
   *Enforce HTTPS* once the certificate is issued (can take a few minutes).

### Two files that matter more than they look

- **`public/.nojekyll`** — without it, GitHub Pages runs the output through Jekyll, which
  **ignores directories starting with `_`**. Astro puts its CSS in `_astro/`, so the whole site
  would render unstyled. Don't delete this.
- **`public/CNAME`** — carries the custom domain through each deploy.

### Moving to a different domain or host

The site reads its URL from one place. Change `url` in `src/site.config.ts`, update the
`Sitemap:` line in `public/robots.txt` and `public/CNAME` to match, and rebuild.

Everything also works as-is on Netlify, Vercel or Cloudflare Pages — build `npm run build`,
publish `dist/`. One caveat: internal links are root-relative (`/blog`, `/rss.xml`), so serving
the site from a **subpath** (e.g. `user.github.io/blog`) would need a `base` in
`astro.config.mjs` and those links made base-aware. A root domain needs none of that.

## Design credit

The visual language — warm beige ground, near-black strokes, pill buttons, large corner radii and
a rotating accent palette — is adapted from [Studio Modular's insights page](https://studiomodular.be/insights).
Their PolySans is commercially licensed, so this site uses [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) instead.
