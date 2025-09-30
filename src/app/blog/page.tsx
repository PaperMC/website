import Image from "next/image";
import Link from "next/link";
import { loadAllPosts } from "@/lib/blog";

export const revalidate = false;

export default async function BlogHome() {
  const [hero, ...rest] = await loadAllPosts();

  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20 space-y-10">
      {hero && (
        <Link
          href={`/blog/${hero.slug}`}
          className="block overflow-hidden rounded-xl border border-white/10 hover:bg-white/5"
        >
          <div className="grid gap-0 md:grid-cols-5">
            <div className="md:col-span-2">
              <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                {hero.meta.hero ? (
                  <Image
                    src={hero.meta.hero}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 40vw, 100vw"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center bg-neutral-900 text-xs opacity-50">
                    No hero image
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 md:col-span-3">
              <div className="text-emerald-400">Latest</div>
              <h1 className="mt-2 text-3xl font-extrabold">{hero.meta.title ?? hero.slug}</h1>
              {hero.meta.summary && <p className="mt-3 opacity-90">{hero.meta.summary}</p>}
              <div className="mt-3 text-sm opacity-70">
                {hero.meta.date && <time>{new Date(hero.meta.date).toLocaleDateString()}</time>}
                {hero.meta.authors?.length ? <> • {hero.meta.authors.join(", ")}</> : null}
              </div>
            </div>
          </div>
        </Link>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Recent posts</h2>
        <Link href="/blog/all" className="text-sm underline decoration-dotted underline-offset-4">
          View all
        </Link>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map(({ slug, meta }) => (
          <li key={slug} className="rounded-lg border border-white/10 p-4 hover:bg-white/5">
            <Link href={`/blog/${slug}`}>
              <div className="line-clamp-2 text-lg font-semibold">{meta.title ?? slug}</div>
              {meta.summary && <p className="mt-2 line-clamp-3 text-sm opacity-80">{meta.summary}</p>}
              <div className="mt-3 text-xs opacity-70">
                {meta.date && <time>{new Date(meta.date).toLocaleDateString()}</time>}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
