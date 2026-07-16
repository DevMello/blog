---
title: This website
description: A colourful, markdown-driven home for everything I'm building — designed to make writing the path of least resistance.
date: 2026-07-16
tags: ["astro", "design", "meta"]
status: shipped
stack: ["Astro", "TypeScript", "Markdown", "Shiki", "GitHub Pages"]
accent: green
---

The site you're reading. Built because every previous attempt at a blog died the moment writing a
post required more effort than opening a text file.

## The constraint

One rule drove every decision: **publishing a post must mean adding a markdown file and nothing
else.** No CMS, no database, no admin panel to keep patched. Drop a `.md` into
`src/content/blog/`, commit, done — the card, the colour, the tag pages, the RSS entry and the
sitemap all follow automatically.

## How it's built

Astro renders everything to static HTML at build time. Content collections give the frontmatter a
typed schema, so a typo in a date or a misspelled status fails the build instead of quietly
producing a broken page.

The markdown pipeline is where most of the work went:

| Concern | Approach |
| --- | --- |
| Highlighting | Shiki at build time — no client-side JS |
| Headings + TOC | `rehype-slug` and `rehype-autolink-headings` |
| GFM | `remark-gfm` for tables, footnotes and task lists |
| Wide tables | A small custom rehype plugin wrapping each table in a scroll container |

The table of contents highlights the section you're reading using an `IntersectionObserver`, and
the reading-progress bar is the only other client-side script on a post page.

## The design

The visual language is adapted from [Studio Modular's insights page](https://studiomodular.be/insights):
a warm beige ground, near-black strokes, pill buttons, generous corner radii and a rotating set of
soft accent colours that keep a grid of cards from feeling uniform.

Two details worth calling out:

- **Deterministic colour.** Each entry hashes its filename to pick an accent, so a post looks the
  same on the homepage, its tag page and the related-posts rail. Set `accent:` in frontmatter to
  override.
- **Generated covers.** A post without a `cover` image gets a seeded abstract SVG built from the
  same palette. It means the grid never has a hole in it, and I never have to find stock imagery.

Their site uses PolySans, which is commercially licensed, so this one substitutes Space Grotesk —
close enough in character, and free to serve.

## How it's deployed

There's no server. `npm run build` writes plain HTML into `dist/`, and that directory *is* the
site — it's hosted on GitHub Pages at this domain, with nothing running behind it. No adapter, no
Node process, no container to keep patched. The whole thing is 288K.

The part I didn't expect: the build ships **zero JavaScript files**. Every client-side script here
is small enough that Astro inlines it straight into the HTML, so the TOC highlighting, the
progress bar and the tag filter cost no extra requests. The only asset the browser fetches is one
stylesheet. That's less a clever optimisation than a consequence of not doing much — but it's the
kind of consequence I'd like more of.

Deployment is a GitHub Actions workflow: push to `main`, it runs `npm ci && npm run build`, and
uploads `dist/` to Pages. Writing a post and deploying a post are the same action, which was the
whole point.

### The half hour I lost to an empty file

GitHub Pages runs your output through Jekyll unless you tell it not to. Jekyll **ignores any
directory whose name starts with an underscore** — that's a Jekyll convention for source
directories that shouldn't be published.

Astro puts its compiled CSS in `_astro/`.

So the deploy succeeds. Every page is there. Every link works. And the entire site renders as
naked unstyled HTML, because the one stylesheet 404s. Nothing in the build output or the Actions
log hints at this; the failure only exists on the other side of the deploy.

The fix is a single empty file at `public/.nojekyll`, which tells Pages to skip Jekyll entirely:

```bash
touch public/.nojekyll
```

Astro copies `public/` to the root of `dist/`, so it lands where Pages looks for it. It's the
highest-leverage zero-byte file I've ever written, and it looks so much like clutter that the
real risk now is someone tidying it away.

There's a matching one — `public/CNAME`, holding the custom domain so it survives each deploy.
Same idea: a file that looks like debris and isn't.

## What I'd do differently

The client-side tag filter on the writing index duplicates what the tag pages already do. It's
nice for browsing, but it's the one piece of the site that would break if JS failed, and I went
back and forth on whether it earned its place. It stays for now.

The other loose thread is that every internal link is root-relative — `/blog`, `/rss.xml`. That's
correct on a domain root, and it's why moving here from a `github.io/blog` subpath would mean
setting a `base` and threading it through every link in the site. I picked the domain first and
sidestepped the problem rather than solving it, which I'm choosing to call scope control.
