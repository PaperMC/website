import type { MetadataRoute } from "next";

const isProd = process.env.NODE_ENV === "production";
const BASE_URL = isProd ? "https://papermc.io" : "http://localhost:3000";

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
  ].map((route) => ({
    url: new URL(route, BASE_URL).toString(),
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const exclude = new Set([new URL("/downloads/all", BASE_URL).toString()]);

  return [...staticRoutes].filter((item) => !exclude.has(item.url));
}
