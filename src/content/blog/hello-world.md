---
title: Hello, world — and what this site is for
description: Why I finally built a place to put the things I'm working on, and how it's put together.
date: 2026-07-16
tags: ["meta", "astro"]
featured: true
accent: orange
---

I've been meaning to do this for about three years. Every project I finish leaves behind a trail
of notes — half in a scratch file, half in commit messages, most of it lost. This is the place
those go now.

## What lives here

Two collections, both plain markdown:

- **Writing** is the long-form stuff: what broke, what I tried, what actually worked.
- **Projects** is the index of things themselves, each with a status so you can tell what's alive.

Nothing here is a tutorial. If something reads like advice, treat it as a note-to-self that
escaped.

## How the site works

Every post is a markdown file in `src/content/blog/`. Frontmatter drives everything — the title,
the date, the tags, even the colour the card picks up on the index page:

```yaml
---
title: Hello, world
description: A short summary for cards and search results.
date: 2026-07-16
tags: ["meta", "astro"]
featured: true
accent: orange
---
```

If I don't set `accent`, the card hashes the filename and picks a colour deterministically, so a
post keeps the same colour everywhere it appears. That was the one bit of the design I fussed
over most and nobody will ever notice.

## The writing rule

> Write it while it's still annoying. The frustration is the useful part — once a problem is
> solved it becomes obvious, and obvious things make terrible posts.

That's the whole editorial policy.

## What's next

I'm going to backfill a few of the older projects, then let it accumulate. If you want the
updates without checking back, the [RSS feed](/rss.xml) has everything.
