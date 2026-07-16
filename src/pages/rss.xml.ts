import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { site } from "../site.config";
import { urlFor } from "../lib/content";

export async function GET(context: APIContext) {
  // Query directly rather than via getPosts() so drafts are excluded even in dev.
  const [posts, projects] = await Promise.all([
    getCollection("blog", ({ data }) => !data.draft),
    getCollection("projects", ({ data }) => !data.draft),
  ]);

  const items = [...posts, ...projects]
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.date,
      link: urlFor(entry),
      categories: entry.data.tags,
    }));

  return rss({
    title: site.title,
    description: site.description,
    site: context.site ?? site.url,
    items,
    customData: `<language>${site.locale}</language>`,
  });
}
