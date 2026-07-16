---
title: Every markdown feature this site supports
description: A reference page exercising headings, code, tables, footnotes, callouts and the rest — useful for checking the styling holds up.
date: 2026-07-14
tags: ["meta", "reference"]
accent: blue
---

This post exists to exercise the markdown pipeline. If something renders badly, it shows up here
first. Keep it around as a styling regression test.

## Text formatting

You get **bold**, *italic*, ***both at once***, ~~strikethrough~~, `inline code`, and
[links that highlight on hover](/blog). External links get a marker and open in a new tab, like
[the Astro docs](https://docs.astro.build).

Footnotes work too[^1], including ones with longer explanations[^why].

[^1]: This is a footnote. It lands at the bottom of the page with a link back.
[^why]: Footnotes are underrated for asides that would otherwise wreck a paragraph's rhythm.

## Headings

Headings from `h2` down are picked up by the table of contents on the right, and each one gets a
hover anchor for deep linking.

### A third-level heading

The TOC indents these under their parent.

#### A fourth-level heading

This one is styled but deliberately left out of the TOC — past three levels the rail gets noisy.

## Code

Inline code looks like `npm run dev`. Fenced blocks get syntax highlighting via Shiki, which
runs at build time, so there's no highlighting JavaScript shipped to the browser:

```ts
import { getCollection } from "astro:content";

export async function getPosts() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
```

Long lines scroll horizontally inside the block rather than pushing the page sideways:

```bash
npx astro build --config ./astro.config.mjs && npx serve dist --listen 4321 --single --no-clipboard
```

## Lists

Unordered:

- First item
- Second item with a nested list
  - Nested one
  - Nested two
- Third item

Ordered:

1. Install the thing
2. Configure the thing
3. Discover the thing needed configuring differently

Task lists:

- [x] Set up the content collections
- [x] Style the prose
- [ ] Write more posts

## Blockquote

> A quote gets a heavy left rule and a tinted background, sized up a little so it breaks the
> rhythm of the body text.
>
> Multiple paragraphs hold their spacing.

## Table

Wide tables scroll inside their own container so the page never scrolls sideways:

| Feature | Plugin | Runs at | Notes |
| --- | --- | --- | --- |
| Syntax highlighting | Shiki | Build | Zero client JS |
| Heading anchors | rehype-slug + autolink | Build | Powers the TOC |
| Tables, footnotes, task lists | remark-gfm | Build | GitHub-flavoured markdown |
| External link markers | rehype-external-links | Build | Adds `↗` and `rel` |
| Table scroll wrappers | custom plugin | Build | See `src/plugins/` |

## Details

<details>
<summary>Click to expand</summary>

Collapsible sections work, which is handy for long error output you don't want dominating a post.

</details>

## Horizontal rule

---

And that's the lot. If you add a markdown feature, add it here too.
