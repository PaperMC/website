import type { MDXComponents } from "mdx/types";
import Link from "next/link";

import { Callout } from "@/components/blog/Callout";
import { Changelog } from "@/components/blog/Changelog";
import { ReleaseBanner } from "@/components/blog/ReleaseBanner";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: (props) => <Link href={String(props.href)}>{props.children}</Link>,
    h2: (p) => <h2 className="mt-10 text-2xl font-extrabold tracking-tight" {...p} />,
    h3: (p) => <h3 className="mt-8 text-xl font-bold" {...p} />,
    ul: (p) => <ul className="my-4 list-disc pl-6 marker:text-emerald-500" {...p} />,
    ol: (p) => <ol className="my-4 list-decimal pl-6" {...p} />,
    blockquote: (p) => <blockquote className="my-6 border-l-4 border-emerald-500/60 pl-4 italic opacity-90" {...p} />,
    Callout,
    ReleaseBanner,
    Changelog,
    ...components,
  };
}
