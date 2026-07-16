import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { accents } from "./site.config";

const baseFields = {
  title: z.string(),
  description: z.string(),
  /** Coerced so `date: 2026-03-14` in frontmatter works unquoted. */
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  /** Path under /public, e.g. "/images/foo.jpg". Optional — cards fall back to a generated pattern. */
  cover: z.string().optional(),
  coverAlt: z.string().optional(),
  /** Pin to the top of its index and feature on the homepage. */
  featured: z.boolean().default(false),
  /** Hidden from indexes and RSS, but still builds at its URL. */
  draft: z.boolean().default(false),
  /** Override the auto-assigned card colour. */
  accent: z.enum(accents).optional(),
};

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: z.object(baseFields),
});

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    ...baseFields,
    status: z.enum(["shipped", "building", "exploring", "archived"]).default("building"),
    /** Short label for the stack, shown on the card. */
    stack: z.array(z.string()).default([]),
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
  }),
});

export const collections = { blog, projects };
