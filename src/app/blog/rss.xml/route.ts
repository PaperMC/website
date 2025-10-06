import { listPostSlugs, loadPostModule, type PostMeta } from "@/lib/blog";
export const dynamic = "force-static";

const SITE_URL = "https://papermc.io";

function xmlEscape(s: string | undefined | null): string {
  if (!s) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function rfc2822(dateStr?: string) {
  const d = dateStr ? new Date(dateStr) : new Date();
  return isNaN(d.getTime()) ? new Date().toUTCString() : d.toUTCString();
}

function buildRssXML(entries: Array<{ slug: string; meta: PostMeta }>) {
  const channelTitle = "PaperMC Blog";
  const channelDesc = "Latest posts from the PaperMC blog.";
  const channelLink = `${SITE_URL}/blog`;
  const selfHref = `${SITE_URL}/blog/rss.xml`;
  const lastBuildDate = new Date().toUTCString();

  const items = entries
    .map(({ slug, meta }) => {
      const url = `${SITE_URL}/blog/${slug}`;
      const title = xmlEscape(meta.title ?? slug);
      const description = meta.summary ?? "";
      const authors = Array.isArray(meta.authors) ? meta.authors.join(", ") : (meta.authors ?? "");
      const categories = (meta.tags ?? []).map((t) => `<category>${xmlEscape(t)}</category>`).join("");

      return `
  <item>
    <title>${title}</title>
    <link>${url}</link>
    <guid isPermaLink="true">${url}</guid>
    <pubDate>${rfc2822(meta.date)}</pubDate>
    ${authors ? `<author>${xmlEscape(authors)}</author>` : ""}
    ${categories}
    <description><![CDATA[${description}]]></description>
  </item>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(channelTitle)}</title>
    <link>${channelLink}</link>
    <description>${xmlEscape(channelDesc)}</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${selfHref}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;
}

export async function GET() {
  const slugs = await listPostSlugs();

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const mod = await loadPostModule(slug);
      const meta = (mod.metadata ?? {}) as PostMeta;
      return { slug, meta };
    }),
  );

  posts.sort((a, b) => (b.meta.date ?? "").localeCompare(a.meta.date ?? ""));

  const xml = buildRssXML(posts);

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
