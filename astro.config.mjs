// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import remarkGfm from "remark-gfm";
import { rehypeTableWrap } from "./src/plugins/rehype-table-wrap.mjs";
import { site } from "./src/site.config.ts";

// https://astro.build/config
export default defineConfig({
  site: site.url,
  integrations: [mdx(), sitemap()],
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
          content: { type: "text", value: "#" },
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
      // Light theme to sit on the warm beige ground.
      theme: "github-light",
      wrap: false,
    },
  },
});
