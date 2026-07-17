import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const BLOG_DIR = "./src/content/blog";

/**
 * URL paths that are `noindex` and so must stay out of the sitemap.
 *
 * The sitemap integration runs at config time and can't reach `astro:content`,
 * so this reads the frontmatter off disk instead. A dumb `wip: true` line match
 * is enough — the real schema validation still happens at build time, and the
 * only cost of a miss here is a sitemap entry, not a broken page.
 */
export function noindexPaths() {
  const paths = ["/drafts/"];

  for (const file of readdirSync(BLOG_DIR)) {
    if (!/\.mdx?$/.test(file)) continue;

    const source = readFileSync(join(BLOG_DIR, file), "utf8");
    const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
    if (!frontmatter) continue;

    if (/^wip:\s*true\s*$/m.test(frontmatter)) {
      paths.push(`/blog/${file.replace(/\.mdx?$/, "")}/`);
    }
  }

  return paths;
}
