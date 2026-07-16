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
| `accent` | no | `orange` \| `blue` \| `pink` \| `purple` \| `yellow` \| `green` |

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

`npm run build` emits a static site to `dist/`. It'll drop onto Netlify, Vercel, Cloudflare Pages
or GitHub Pages with no adapter. Two things to do first:

1. Set `url` in `src/site.config.ts` to the real domain.
2. Update the `Sitemap:` line in `public/robots.txt` to match.

## Design credit

The visual language — warm beige ground, near-black strokes, pill buttons, large corner radii and
a rotating accent palette — is adapted from [Studio Modular's insights page](https://studiomodular.be/insights).
Their PolySans is commercially licensed, so this site uses [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) instead.
