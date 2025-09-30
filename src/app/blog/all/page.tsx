import Link from "next/link";
import { loadAllPosts } from "@/lib/blog";

export const revalidate = false;

export default async function BlogAll() {
  const posts = await loadAllPosts();
  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20 space-y-10">
      <h1 className="text-3xl font-extrabold">All posts</h1>
      <ul className="divide-y divide-white/10 rounded-lg border border-white/10">
        {posts.map(({ slug, meta }) => (
          <li key={slug} className="p-4 hover:bg-white/5">
            <Link href={`/blog/${slug}`} className="block">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-semibold">{meta.title ?? slug}</h2>
                {meta.date && (
                  <time className="ml-4 text-sm opacity-70">{new Date(meta.date).toLocaleDateString()}</time>
                )}
              </div>
              {meta.summary && <p className="mt-1 text-sm opacity-80">{meta.summary}</p>}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
