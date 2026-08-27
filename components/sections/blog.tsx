"use client";

import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import type { Post } from "@/lib/blog";
import { formatDate } from "@/lib/format";
import { useI18n } from "@/lib/i18n";

export function BlogPreview({ posts }: { posts: Post[] }) {
  const { t, lang } = useI18n();

  return (
    <section id="blog" className="relative scroll-mt-20 py-28 md:py-36">
      <div className="mx-auto w-full max-w-6xl px-5">
        <SectionHeading
          fig={t("blog.fig")}
          tag={t("blog.tag")}
          title={t("blog.title")}
          subtitle={t("blog.subtitle")}
          kana={t("blog.kana")}
        />

        {posts.length === 0 ? (
          <p data-reveal className="mt-10 font-mono text-sm text-muted">
            {t("blog.empty")}
          </p>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {posts.map((post, i) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                data-reveal
                data-reveal-delay={`${i * 0.06}`}
                className="corner-ticks group flex flex-col border border-line bg-panel p-6 transition-colors hover:border-sora/50"
              >
                <span className="font-mono text-[11px] tracking-[0.2em] text-muted uppercase">
                  {formatDate(post.date, lang)} · {post.readingTime}{" "}
                  {t("blog.minRead")}
                </span>
                <h3 className="mt-3 font-display text-xl font-semibold text-mist transition-colors group-hover:text-sora-bright">
                  {post.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {post.excerpt}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs tracking-wider text-sora-bright uppercase transition-colors group-hover:text-sakura-bright">
                  {t("blog.readMore")}
                  <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
