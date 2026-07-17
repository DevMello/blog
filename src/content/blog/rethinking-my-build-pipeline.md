---
title: Rethinking my build pipeline
description: I've spent three weeks fighting my own CI config and I think the problem is me, not the YAML.
date: 2026-07-02
updated: 2026-07-15
tags: ["ci", "tooling"]
wip: true
progress: 45
---

## Where this started

The pipeline worked. That's the annoying part. It ran green for months and I never
thought about it once, right up until the day I needed to change something and
discovered I no longer understood any of it.

## What I've figured out so far

Most of the complexity isn't doing work — it's compensating for earlier decisions
that were themselves compensating for something else. Peeling it back:

- The matrix build exists because of one flaky test on one platform.
- The cache steps exist because the matrix build made everything slow.
- The cache invalidation logic exists because the cache steps were wrong.

Three of the four stages are scar tissue around a single bad test.

## Open questions

I don't have an ending for this yet. The honest version is that I'm not sure whether
the lesson is "delete the test" or something more general about how infrastructure
accretes when nobody is looking at it. Both feel true. Neither feels finished.

> TODO: rewrite the section above once I've actually done the migration and know
> whether the theory survives contact with reality.
