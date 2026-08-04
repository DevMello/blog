---
title: typethru
description: A TUI that applies your AI agent's diff by making you retype it, keystroke-verified — nothing lands that didn't pass through your fingers.
date: 2026-08-04
tags: ["git", "ai", "tooling", "python"]
status: shipped
stack: ["Python", "prompt_toolkit", "git"]
repo: https://github.com/DevMello/typethru
accent: yellow
---

The elevator pitch is also the whole product: your coding agent edits your files, typethru reverts the diff and feeds it back to you hunk by hunk, and you retype the changed lines with every keystroke verified until the tree is byte-identical to what the agent produced.

It exists because a surprising number of people already do this **by hand** — reverting AI commits and typing them back from a split-pane diff to keep a mental model of their own codebase. [The full write-up](/blog/the-slowest-way-to-apply-a-diff) covers the research rabbit hole, the part where I had Claude build a tool about not trusting Claude, and the first recorded session clocking 4,896 WPM (the typist was a test harness).

The short feature list:

- **Gate mode** (`typethru`) — revert, retype, verify. Byte-exact reconstruction including CRLF and trailing whitespace; your typos can't corrupt anything.
- **Auto-apply** for lockfiles, binaries, whitespace-only hunks and configured globs. Pasting is ignored on purpose.
- **Crash-safe** — the agent's version is backed up under `.git/typethru/` before anything moves; `typethru restore` brings it back from any state.
- **Practice mode** (`typethru practice HEAD`) — the typing without the ceremony, read-only.
- No ranks, no streaks, no live WPM. Accuracy shows up once, at the end.

Python 3.10+, one dependency, works on Windows/macOS/Linux. Whether retyping actually builds comprehension is contested and the README says so — this is ergonomics for a chosen workflow, not a pedagogy claim.
