import fs from "node:fs/promises";
import path from "node:path";

export type PostMeta = {
  title: string;
  date: string;
  authors?: string[];
  summary?: string;
  tags?: string[];
  hero?: string;
};

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

export async function listPostSlugs(): Promise<string[]> {
  const files = await fs.readdir(POSTS_DIR);
  return files.filter((f) => /\.mdx?$/.test(f)).map((f) => f.replace(/\.mdx?$/, ""));
}

export async function loadPostModule(slug: string) {
  return import(`../../content/blog/${slug}.mdx`);
}

export async function loadAllPosts() {
  const slugs = await listPostSlugs();
  const entries = await Promise.all(
    slugs.map(async (slug) => {
      const mod = await loadPostModule(slug);
      const meta: PostMeta = mod.metadata ?? {};
      return { slug, meta };
    }),
  );
  entries.sort((a, b) => (b.meta.date ?? "").localeCompare(a.meta.date ?? ""));
  return entries;
}
