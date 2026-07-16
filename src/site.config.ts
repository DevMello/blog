/**
 * Single source of truth for site-wide metadata.
 * Edit this file to rebrand the site — nothing else hardcodes these values.
 */
export const site = {
  title: "DevMello",
  tagline: "Building things, breaking things, writing it down.",
  description:
    "A journal of the projects I'm building, the things I'm learning, and the occasional detour.",
  author: "DevMello",
  email: "pranavy2008@gmail.com",
  // Used for canonical URLs, RSS and sitemap. Update before deploying.
  url: "https://devmello.dev",
  locale: "en",
  nav: [
    { label: "Writing", href: "/blog" },
    { label: "Projects", href: "/projects" },
    { label: "About", href: "/about" },
  ],
  social: [
    { label: "GitHub", href: "https://github.com/devmello" },
    { label: "RSS", href: "/rss.xml" },
  ],
} as const;

/** Accent palette. Cards, tags and section blocks cycle through these. */
export const accents = [
  "orange",
  "blue",
  "pink",
  "purple",
  "yellow",
  "green",
] as const;

export type Accent = (typeof accents)[number];

/** Deterministically pick an accent so a given item keeps its colour across pages. */
export function accentFor(key: string, offset = 0): Accent {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return accents[(hash + offset) % accents.length];
}
