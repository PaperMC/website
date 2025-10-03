import type { MetadataRoute } from "next";

const isProd = process.env.NODE_ENV === "production";
const BASE_URL = isProd ? "https://papermc.io" : "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/downloads/all", "/repository/", "/repo/", "/api/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
