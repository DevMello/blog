---
title: typethru, or the slowest possible way to apply a diff
description: I shipped a tool that makes you retype everything your AI wrote before it counts. On purpose. People apparently want this, including me.
date: 2026-08-04
tags: ["git", "ai", "tooling", "typethru"]
accent: pink
---

I shipped a tool today called [typethru](https://github.com/DevMello/typethru). It takes the diff your coding agent just produced, **deletes it**, and then makes you type it back in, character by character, with every keystroke verified, until your working tree is byte-identical to what the AI wrote.

Yes. A typing test for your own pull request. Let me explain before you close the tab 😅

(If you just want the short version, [skip to the TLDR](#tldr).)

## Where this came from

Last week the internet collectively decided that the fix for AI coding is to type the code out yourself, like it's 1985 and the program came from the back pages of a magazine. Ankur Sethi's ["Prevent cognitive debt by manually retyping LLM-generated code"](https://ankursethi.com/blog/prevent-cognitive-debt-by-manually-retyping-llm-generated-code/) hit the front page of Hacker News with [461 points and 373 comments](https://news.ycombinator.com/item?id=49153374). His setup: he literally instructs his agents to *"show me every proposed edit in the chat so I can type it in manually"* and forbids them from touching his files. He trades a 10x speedup for a 2x one and in exchange he knows where everything in his codebase lives.

The same weekend, ["Don't be a meat proxy"](https://gruhn.me/blog/2026-08-03/) pulled [1,724 points](https://news.ycombinator.com/item?id=49151933) for describing the opposite lifestyle: developers as copy-paste couriers, ferrying code they haven't read from the AI to the reviewer and ferrying the reviewer's complaints back. One commenter (DenisM) nailed why this feels so bad: generating slop takes minutes, reviewing it takes hours, and there's *"no back pressure mechanism."* There's even a [TikTok with 148K views](https://www.tiktok.com/@youraveragetechbro/video/7664608749658672398) of a guy confessing he doesn't always review what the AI writes, he just looks at it and decides it's "overall kind of good." I have never felt so seen by an app I don't use.

And this isn't even a new wish. Ben Kamens (former Khan Academy dev lead) wrote up ["Code with AI the Hard Way"](https://kamens.com/blog/code-with-ai-the-hard-way) — his actual workflow is letting Claude Code generate the change, **reverting it without committing**, and retyping it from the diff. His words: *"I pine for ways to embrace the brilliance of AI coding tools while still typing things myself."* The man is doing the git dance by hand. [gittype](https://github.com/unhappychoice/gittype) (the typing game whose tagline is, no joke, "Show your AI who's boss") has had [an open issue asking for exactly a diff-typing mode](https://github.com/unhappychoice/gittype/issues/81) since September 2025. Nobody built it.

So: multiple adults, independently, doing revert-and-retype by hand, and pining. That's not a meme, that's a missing tool.

## The part where I'm a hypocrite

Here's the thing. I had Claude build most of typethru.

I'm aware of what I've done 😂. I now own a tool whose entire reason to exist is "you can't absorb code you didn't type," and I did not type it. It has 74 tests. I wrote approximately none of them 🙏. The README has a section called "Honesty note" and I'm honestly noting.

In my defence, this is also the funniest possible way for this tool to exist, and the first thing I'm doing with it is running `typethru practice` on its own commits. The snake can eat its tail *and* learn where the tail lives.

## What it actually does

The core loop:

1. Your agent finishes mangling four files.
2. You run `typethru`. It shows a plan screen — which hunks you'll type, which ones auto-apply — with my favourite sentence I've shipped this year 😍: **"Your working tree will be reverted while you type."** Consent screen for your own repo.
3. It backs up the agent's version into `.git/typethru/`, reverts everything, and feeds you the diff hunk by hunk. You retype the changed lines. Wrong character? It sits there in red until you fix it. Enter only advances when the line is exactly right.
4. When you're done, the tree is **byte-identical** to what the agent produced — CRLF endings, trailing whitespace, missing final newlines, all of it. Your typing is the gate, not the source of truth, so your typos can't corrupt anything.

The details are where the fun is:

- **Lockfiles auto-apply.** Nobody's mental model has ever improved by retyping `package-lock.json`. Same for binaries, whitespace-only hunks, and anything you glob in config. `typethru` respects your time, within the obvious constraint that it is a tool for retyping code you already have.
- **Ctrl-V does nothing.** Pasting is ignored at the bracketed-paste level. That's not a bug, that's the entire product.
- **No gamification.** No ranks, no streaks, no live WPM ticking in the corner while you sweat. gittype already does the game thing well. Accuracy and WPM show up once, at the end, in past tense, like a report card you can throw away.
- **Crash-safe.** `typethru restore` brings back the agent's version at any point — mid-session, after a crash, after you rage-quit. First rule of the design doc: recovery must be boring.
- **`typethru practice HEAD`** if you want the typing without the ceremony — read-only, never touches your tree.

Escape hatches exist (`Ctrl-A` applies a hunk without typing, `Ctrl-S` skips it), because a 400-line generated migration is a thing that happens and I'm not a monster. The summary counts what you actually typed versus what you waved through, so at least you're lying to yourself with accurate numbers.

## My favourite test result

During verification, the definition-of-done walk drives the real terminal app through a pipe — a script "types" every keystroke. Which means the first recorded typethru session in history clocked in at

```
accuracy 100.0% - 4,896 wpm
```

The only user to ever complete a session cheated. There is no leaderboard and it's already ruined 💀

The same walk also caught a real bug: if the input dies mid-session (terminal closed, `typethru < /dev/null`, CI being CI), the app used to exit with a raw EOFError traceback. Now it refuses non-interactive stdin with an actual error message, and a mid-session death ends as a quit with your backup intact. The robot typist earns its keep.

## Is retyping even real?

Contested! The [HN thread](https://news.ycombinator.com/item?id=49153374) is a genuine split. One commenter (phkahler) points out an entire generation learned to program by typing listings out of magazines. Another (danielvaughn) retyped an AI-generated TreeSitter grammar and was writing it unaided within hours. Meanwhile the sceptics: jolt42 says touch-typing without thinking teaches you nothing, and ablob mourns that *"we are reduced to code monkeys mindlessly re-typing what an LLM wrote."* There's also [research-flavoured pessimism](https://www.softwaremaxims.com/blog/reviewing-ai-code) about the review side generally — people reviewing AI code are *more confident* while finding *fewer* defects, and review effectiveness falls apart past ~400 lines an hour anyway.

typethru takes no position. It's ergonomics for a workflow people have already chosen, not a claim that the workflow works. If reading diffs works for you, use [hunk](https://github.com/modem-dev/hunk) — it's excellent, 8K stars, and it will not make you type anything. This tool is for the people in that thread doing it by hand anyway, with agent instructions and reverted commits and a split-pane diff, one clumsy step at a time.

(I almost named it `meatgate`, as a nod to the meat proxy essay. The design log's verdict: "joke outlives the joke." `typethru` it is.)

## What I'd change

The session can't tell your manual edits from the agent's — it gates everything pending against HEAD, so you run it when the diff *is* the thing you want to earn back. Renames show up as delete-plus-new-file, which is honest but slightly silly. And as a full-screen TUI it has no screen-reader story at all, which is the one limitation I actually feel bad about rather than finding funny.

Whether I'll still be retyping my diffs in a month, I genuinely don't know. Ask the version of me that knows where everything in his codebase lives. If he exists, it worked.

## TLDR

Everyone spent last week arguing that you should retype your AI's code by hand; several people were already doing it manually with git gymnastics. So I shipped [typethru](https://github.com/DevMello/typethru): it reverts your agent's diff and makes you type it back, keystroke-verified, byte-identical at the end, lockfiles exempt, pasting disabled, no gamification, crash-safe. Built largely by the AI it's designed to distrust. `pip install git+https://github.com/DevMello/typethru` if you'd like to feel your fingers again.
