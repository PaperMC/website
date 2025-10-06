import { Feed } from "feed";

import { loadAllPosts } from "@/lib/blog";

export const dynamic = "force-static";

export async function GET() {
  const posts = await loadAllPosts();
  const siteUrl = "https://papermc.io";

  const feed = new Feed({
    title: "PaperMC Blog",
    description: "Latest updates from PaperMC",
    id: siteUrl,
    link: siteUrl,
    language: "en",
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, PaperMC`,
    feedLinks: { rss: `${siteUrl}/blog/rss.xml` },
    author: { name: "PaperMC", email: "contact@papermc.io", link: "https://papermc.io" },
  });

  posts.forEach(({ slug, meta }) => {
    const url = `${siteUrl}/blog/${slug}`;
    feed.addItem({
      title: meta.title ?? slug,
      id: url,
      link: url,
      description: meta.summary,
      date: new Date(meta.date),
      author: meta.authors?.map((name) => ({ name })),
      category: meta.tags?.map((name) => ({ name })),
      image: meta.hero ? `${siteUrl}${meta.hero}` : undefined,
    });
  });

  return new Response(feed.rss2(), {
    status: 200,
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
