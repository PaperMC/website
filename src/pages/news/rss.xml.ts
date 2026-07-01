import type { APIRoute } from "astro";
import rss from "@astrojs/rss";
import { getCollection, type CollectionEntry } from "astro:content";

const getPostDate = (post: CollectionEntry<"posts">) => post.data.pubDate ?? post.data.date;

export const GET: APIRoute = async ({ site }) => {
  const posts = await getCollection("posts");

  const items = posts
    .sort((a, b) => getPostDate(b).valueOf() - getPostDate(a).valueOf())
    .map((post) => {
      const data = post.data;
      const pubDate = getPostDate(post);

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