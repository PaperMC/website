import type { Metadata } from "next";
import Image from "next/image";

import { listPostSlugs, loadPostModule } from "@/lib/blog";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const slugs = await listPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const mod = await loadPostModule(slug);
  const MDX = mod.default;
  const m = mod.metadata ?? {};

  return (
    <article className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-20">
      {m.hero && (
        <div className="mb-6 overflow-hidden rounded-xl border border-white/10">
          <div className="relative w-full" style={{ paddingTop: "42.5%" }}>
            <Image src={m.hero} alt="" fill className="object-cover" />
          </div>
        </div>
      )}

      <header className="mb-8">
        <div className="text-emerald-400">{m.tags?.[0] ?? "Update"}</div>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight">{m.title ?? slug}</h1>
        {m.summary && <p className="mt-3 text-lg opacity-90">{m.summary}</p>}
        <div className="mt-2 text-sm opacity-70">
          {m.date && <time>{new Date(m.date).toLocaleDateString()}</time>}
          {m.authors?.length ? <> • {m.authors.join(", ")}</> : null}
        </div>
      </header>

      <div className="prose prose-invert max-w-none">
        <MDX />
      </div>
    </article>
  );
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const mod = await loadPostModule(slug);
  const m = mod.metadata ?? {};
  return {
    title: m.title,
    description: m.summary,
    openGraph: { title: m.title, description: m.summary, type: "article" },
  };
}
