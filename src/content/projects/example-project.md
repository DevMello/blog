---
title: Example project
description: A template project entry — copy this file, change the frontmatter, and write. Delete it once you have real ones.
date: 2026-07-10
tags: ["template"]
status: exploring
stack: ["Your", "Stack", "Here"]
repo: https://github.com/devmello
accent: pink
draft: true
---

This is a placeholder so the projects index has something to show on day one. It's marked
`draft: true`, which means it's visible while running `npm run dev` but excluded from production
builds and the RSS feed. Delete it whenever.

## Frontmatter reference

Projects take everything a blog post takes, plus a few extras:

```yaml
---
title: Example project
description: One or two sentences — used on cards and in search results.
date: 2026-07-10
tags: ["template"]
status: exploring      # building | shipped | exploring | archived
stack: ["Astro", "TypeScript"]
repo: https://github.com/you/repo
demo: https://example.com
accent: pink           # optional — omit and one is picked for you
featured: false        # pins to the homepage
draft: true            # dev-only
---
```

`status` drives which section of the index the project lands in, and the schema will reject
anything outside those four values — a typo fails the build rather than silently creating a
fifth group.

## Structure that works

Most project write-ups do fine with three headings: what it is, how it's built, and what you'd
change. Anything more and it turns into documentation, which belongs in the repo.
