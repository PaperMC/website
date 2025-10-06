/** @type {import('next-sitemap').IConfig} */
const fs = require("fs");
const path = require("path");

const dev = process.env.NODE_ENV !== "production";
const siteUrl = dev ? "http://localhost:3000" : "https://papermc.io";

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

function getBlogSlugs() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => f.replace(/\.mdx?$/, ""));
}

module.exports = {
  siteUrl,
  exclude: ["/downloads/all"],
  generateIndexSitemap: false,
  additionalPaths: async (config) => {
    const slugs = getBlogSlugs();
    return slugs.map((slug) => ({
      loc: `/blog/${slug}`,
      changefreq: "weekly",
      priority: 0.7,
    }));
  },
};
