import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { rssSchema } from "@astrojs/rss";

const DEFAULT_AUTHOR = "Paper Team";
const DEFAULT_AVATAR = "https://assets.papermc.io/brand/papermc_logo.min.svg";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/posts" }),
  schema: rssSchema.extend({
    date: z.coerce.date(),
    description: z.string().optional(),
    author: z.string().default(DEFAULT_AUTHOR),
    authorAvatar: z.string().url().default(DEFAULT_AVATAR),
    cover: z
      .object({
        src: z.string().url(),
        alt: z.string().optional(),
        credit: z.string().optional(),
      })
      .optional(),
  }),
});

export const collections = { posts };
