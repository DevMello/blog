import { getCollection, type CollectionEntry } from "astro:content";
import readingTime from "reading-time";

export type BlogPost = CollectionEntry<"blog">;
export type Project = CollectionEntry<"projects">;
export type AnyEntry = BlogPost | Project;

/** Drafts are visible while developing so you can preview them, hidden in production builds. */
const showDrafts = import.meta.env.DEV;

function byDateDesc(a: AnyEntry, b: AnyEntry) {
  return b.data.date.valueOf() - a.data.date.valueOf();
}

/** Featured entries float to the top, then newest first. */
function byFeaturedThenDate(a: AnyEntry, b: AnyEntry) {
  if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
  return byDateDesc(a, b);
}

/** Last meaningful activity — what /drafts sorts on, so the freshest work is on top. */
function lastTouched(entry: AnyEntry) {
  return (entry.data.updated ?? entry.data.date).valueOf();
}

/** Published posts only. WIP posts live on /drafts and are excluded here. */
export async function getPosts(): Promise<BlogPost[]> {
  const posts = await getCollection(
    "blog",
    ({ data }) => (showDrafts || !data.draft) && !data.wip,
  );
  return posts.sort(byDateDesc);
}

/** Posts marked `wip: true` — the /drafts shelf, most recently touched first. */
export async function getDrafts(): Promise<BlogPost[]> {
  const drafts = await getCollection(
    "blog",
    ({ data }) => (showDrafts || !data.draft) && data.wip,
  );
  return drafts.sort((a, b) => lastTouched(b) - lastTouched(a));
}

/**
 * Every post that should build a page — published *and* WIP. Route generation
 * uses this rather than getPosts(), otherwise WIP posts would 404 from /drafts.
 */
export async function getPostPaths(): Promise<BlogPost[]> {
  const [posts, drafts] = await Promise.all([getPosts(), getDrafts()]);
  return [...posts, ...drafts];
}

export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection("projects", ({ data }) => showDrafts || !data.draft);
  return projects.sort(byFeaturedThenDate);
}

/** Everything, newest first — used by the homepage and RSS. */
export async function getAllEntries() {
  const [posts, projects] = await Promise.all([getPosts(), getProjects()]);
  return {
    posts,
    projects,
    combined: [...posts, ...projects].sort(byDateDesc),
  };
}

/** Tag name -> number of entries, sorted by frequency then alphabetically. */
export async function getTags() {
  const { combined } = await getAllEntries();
  const counts = new Map<string, number>();
  for (const entry of combined) {
    for (const tag of entry.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, slug: tagSlug(tag), count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function tagSlug(tag: string) {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function readTime(entry: AnyEntry) {
  return readingTime(entry.body ?? "").text;
}

/** The collection an entry came from, used to build its URL. */
export function urlFor(entry: AnyEntry) {
  const base = entry.collection === "blog" ? "/blog" : "/projects";
  return `${base}/${entry.id}/`;
}

export function formatDate(date: Date, opts: Intl.DateTimeFormatOptions = {}) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
    ...opts,
  }).format(date);
}

export function isoDate(date: Date) {
  return date.toISOString();
}
