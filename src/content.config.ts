import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { rssSchema } from "@astrojs/rss";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/posts" }),
  schema: rssSchema.extend({
    date: z.coerce.date(),
    author: z.string(),
  }),
});

export const collections = { posts };
