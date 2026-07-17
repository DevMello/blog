---
title: Pulse Analytics
description: A privacy-first analytics tool built because every option I liked needed a server I didn't want to run.
date: 2026-07-16
tags: ["analytics", "nextjs", "supabase", "privacy"]
status: building
stack: ["Next.js", "TypeScript", "Supabase", "React"]
accent: blue
---

What I realised is I don't want an application like Google Analytics which requires so much data

(If you just want the short version, [skip to the TLDR](#tldr).)

What I realised is I don't want an application like Google Analytics which requires so much data
and only gets away with being free because it uses the data your website collects for themselves
to monetize. I don't really like this business practice, or how obtrusively it runs.

However, analytics aren't something I can just give up on. Every product or business needs
analytics, otherwise how are you supposed to gauge how your product is doing, right? So if we
need analytics but options like Google Analytics and Adobe Analytics feel too intrusive or go
against our morals, what do we do?

## The alternatives

There are plenty of privacy-focused alternatives out there. The ones I recommend and have used in
the past are:

**[Umami](https://umami.is/) (the one I used before).** Open source, you can self host, as simple as a Docker
container. They came out with Umami Cloud which honestly is great because up to a million events
is free (very solid). Umami is a great option if you are looking for something very simple. The
downside is it requires a server to run on, meaning you either self host and port forward your
computer to the internet, or rent a PaaS like Railway and host it online (leading to monthly or
yearly costs).

**[Plausible](https://plausible.io/).** Similar to Umami as you can self host with a Docker container, but you still need
compute which leads to monthly or yearly costs in either electricity or PaaS services.

**[Matomo](https://matomo.org/).** I honestly haven't done much research on it but have heard loads of solid things
about it and it's also open source, yet it has the same problem as the two above.

## My issue

I am not willing to pay money to a PaaS or self host (and trust me I self hosted for a long time,
it's just a pain). I also moved and it has been a pain to set everything up again to this new IP
address, and I wanted to look for a better solution. So for that reason all the existing
solutions don't really work out for me.

On top of all that I am just a simple small developer and don't need large amounts of events. I
also am very into open source and building my own things instead of relying on others (also
because I don't like spending money on services tbh, call me stingy 😂) so for that reason I
decided why not just build my own.

## The architecture I decided on

Okay let's understand who I am. I am a teenager entering college and my projects are all
relatively small.

**Backend.** For that reason, I will not have millions, not even thousands of users using my
projects. So I can just go with something as simple as a Postgres database. I also don't really
have a requirement for realtime anything. So what is the best online database hoster? Well, I
love me some Supabase so that's what I decided on. The free tier of Supabase is extremely solid
and works very well for a small scale project like this. Similarly, another great option would
be PocketBase (SQLite based). Using a provider like PocketHost (which is OMG super duper
generous) can get you similar results.

**Edit:** PocketHost no longer offers a free tier which is sad because it was ~~one of the greatest~~
the best free tier I have seen.

**Frontend.** One of the best free web hosting options for React is none other than Vercel,
which is quite generous in their offerings (though it can get expensive for bigger projects if
you are getting a TON of traffic) so it only made sense to go with it (and a stack of Next.js
and Supabase is one of the most common around).

## The goal

Create a very minimal and simple to use SDK which is tiny and can be used for all the basic
things (I voluntarily choose to give up on more advanced features since I don't need those
insights yet 🙏). The insights should be public so that everyone can see how my projects are
doing (I am very open to sharing). Compliant-by-design with GDPR/CCPA/PECR so no consent banner
is needed. It should be easy for others to fork and set up their own instance (so they can host
and own their data).

## Implementation

The setup process:

1. I identified all the features I really wanted my project to track (no cookies).
2. I understood this should be extremely simple to implement analytics for the end user.
3. Planned how this would operate for multiple projects and how to track multiple projects.
4. Figured out how the public page (can be disabled) would work and the auth (though small, it
   must exist).
5. Initialized the Supabase project (I just asked Claude to make the project and initialize my
   schema for me using the MCP 😍).
6. Gathered the design elements and colours for my frontend.
7. Waited for Claude credits to reset.

The SDK ended up being a small script. A GET request to a Next.js API route that records the
event and returns a 1x1 transparent pixel. No localStorage, no fetch to some third-party domain
you don't recognise. Drop a script tag in your head and boom, it works.

The Supabase schema is pretty straightforward. A projects table with a unique API key per
project. An events table for page views (path, referrer, user agent, timestamp, country).
Row-level security so one project can't see another's data. The dashboard is a private page
behind Supabase Auth (magic-link only, no passwords to store or leak). The public dashboard
renders the same data minus the settings panel.

One thing I'm glad I added early is an AI skill for the SDK. Since I use AI assistants for a lot
of my project scaffolding, having a skill file means the assistant can wire up Pulse Analytics
into any new project without me remembering where the script tag lives. Small thing but it's the
kind of friction that stops you from actually using your own tools.

## Random features I thought of along the way

- An AI skill so AI assistants can add this analytics SDK to any project you already have (done)
- A public API so people can pull their analytics data and do whatever they want with it
- Webhook support so you can get notified when you hit certain milestones for traffic

## What I'd change

The auth model works but it's minimal (magic-link only, no roles or team support). If someone
forks this and wants team access they'd have to build that themselves. I also went back and forth
on whether to use a database at all. A log-file approach would be simpler and cheaper. Write
events to a file, rotate daily, generate stats from the logs. I chose Postgres because it makes
the dashboard queries trivial, but the simplicity of log files keeps calling my name.

The public dashboard is a good feature though. Making it opt-out rather than opt-in was
intentional (the whole point is transparency). But I expect someone will want it private and
I'll need to build a toggle. Schema supports it. I just haven't built the UI yet.

## TLDR

A minimal, cookie-free analytics SDK built on Supabase and Next.js. Public by default,
compliant-by-design with GDPR/CCPA/PECR, and easy to fork. Tracks page views, referrers,
devices, and countries. Nothing more.
