import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/blog";
import { formatDate } from "@/lib/format";
import ru from "@/locales/ru.json";

export const dynamic = "force-dynamic";

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const { title, date, excerpt, readingTime, html } = post;

  return (
    <main className="relative min-h-[100svh] px-5 py-28 md:py-36">
      <div className="bg-sora-grid absolute inset-0" aria-hidden="true" />
      <article className="relative mx-auto w-full max-w-3xl">
        <Link
          href="/#blog"
          className="inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.2em] uppercase text-muted transition-colors hover:text-sakura-bright"
        >
          <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
          {ru.blog.back}
        </Link>

        <header className="mt-8 border-b border-line pb-8">
          <span className="font-medium tracking-[0.2em] text-muted uppercase">
            {formatDate(date, "ru")} · {readingTime} {ru.blog.minRead}
          </span>
          <h1 className="mt-3 font-display text-[clamp(1.8rem,5vw,3rem)] leading-tight font-bold text-mist">
            {title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted">{excerpt}</p>
        </header>

        <div
          className="mdx-prose mt-10"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </main>
  );
}
