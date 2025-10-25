import type { APIRoute } from "astro";
import rss from "@astrojs/rss";
import { getCollection, type CollectionEntry } from "astro:content";

export const GET: APIRoute = async ({ site }) => {
  const posts = await getCollection("posts");

  const items = posts.map((post: CollectionEntry<"posts">) => {
    const data = post.data;
    const pubDate = data.pubDate ?? data.date ?? undefined;

    return {
      title: data.title,
      pubDate,
      link: `/news/${post.id}`,
      author: data.author,
    };
  });

  return rss({
    title: "PaperMC News",
    description: "Updates and news from the PaperMC project",
    site: site?.toString() ?? "https://papermc.io",
    items,
    trailingSlash: false,
  });
};
