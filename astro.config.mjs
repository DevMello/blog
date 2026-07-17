// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import remarkGfm from "remark-gfm";
import { rehypeTableWrap } from "./src/plugins/rehype-table-wrap.mjs";
import { noindexPaths } from "./src/lib/wip-paths.mjs";
import { site } from "./src/site.config.ts";

// Drafts are noindex'd, so listing them in the sitemap would send search engines
// mixed signals. Resolved once at config time rather than per-URL.
const excluded = new Set(noindexPaths().map((path) => new URL(path, site.url).href));

// https://astro.build/config
export default defineConfig({
  site: site.url,
  // Astro ignores the PORT env var on its own; honouring it here lets tooling
  // assign a free port when the default is already taken.
  server: process.env.PORT ? { port: Number(process.env.PORT) } : {},
  integrations: [mdx(), sitemap({ filter: (page) => !excluded.has(page) })],
  markdown: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          properties: {
            className: ["heading-anchor"],
            ariaHidden: "true",
            tabIndex: -1,
          },
          // An empty span, with the "#" glyph supplied by CSS. A text node here
          // would be swept into Astro's heading list and show up in the TOC.
          content: {
            type: "element",
            tagName: "span",
            properties: { className: ["heading-anchor__glyph"] },
            children: [],
          },
        },
      ],
      [
        rehypeExternalLinks,
        {
          target: "_blank",
          rel: ["noopener", "noreferrer"],
          properties: { "data-external": "true" },
        },
      ],
      rehypeTableWrap,
    ],
    shikiConfig: {
      // Both themes are emitted as CSS custom properties (defaultColor off);
      // global.css activates whichever matches the current site theme.
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
      wrap: false,
    },
  },
});
