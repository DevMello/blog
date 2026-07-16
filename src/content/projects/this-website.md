---
title: This website
description: A colourful, markdown-driven home for everything I'm building — designed to make writing the path of least resistance.
date: 2026-07-16
tags: ["astro", "design", "meta"]
status: shipped
stack: ["Astro", "TypeScript", "Markdown", "Shiki"]
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

## What I'd do differently

The client-side tag filter on the writing index duplicates what the tag pages already do. It's
nice for browsing, but it's the one piece of the site that would break if JS failed, and I went
back and forth on whether it earned its place. It stays for now.
