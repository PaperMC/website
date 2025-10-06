import fs from "node:fs";
import path from "node:path";

import type { MetadataRoute } from "next";

const isProd = process.env.NODE_ENV === "production";
const BASE_URL = isProd ? "https://papermc.io" : "http://localhost:3000";
const POSTS_DIR = path.join(process.cwd(), "content", "blog");

function getBlogEntries(): MetadataRoute.Sitemap {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => /\.mdx?$/i.test(f))
    .map((f) => {
      const slug = f.replace(/\.mdx?$/i, "");
      const stat = fs.statSync(path.join(POSTS_DIR, f));
      return {
        url: new URL(`/blog/${slug}`, BASE_URL).toString(),
        lastModified: stat.mtime,
        changeFrequency: "weekly",
        priority: 0.7,
      };
    });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "/community/guidelines",
    "/downloads",
    "/downloads/folia",
    "/downloads/velocity",
    "/",
    "/software/folia",
    "/javadocs",
    "/community",
    "/downloads/waterfall",
    "/software/paper",
    "/team",
    "/sponsors",
    "/software/waterfall",
    "/software/velocity",
    "/downloads/paper",
    "/contribute",
    "/blog",
    "/blog/all",
  ].map((route) => ({
    url: new URL(route, BASE_URL).toString(),
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const blogRoutes = getBlogEntries();

  const exclude = new Set([new URL("/downloads/all", BASE_URL).toString()]);

  return [...staticRoutes, ...blogRoutes].filter((item) => !exclude.has(item.url));
}
