"use client";

import { SectionHeading } from "@/components/section-heading";
import { reviews, timeline } from "@/data/experience";
import { useI18n } from "@/lib/i18n";

export function Experience() {
  const { t, lang } = useI18n();

  return (
    <section id="experience" className="relative scroll-mt-20 py-28 md:py-36">
      <div className="mx-auto w-full max-w-6xl px-5">
        <SectionHeading
          fig={t("experience.fig")}
          tag={t("experience.tag")}
          title={t("experience.title")}
          subtitle={t("experience.subtitle")}
          kana={t("experience.kana")}
        />

        {/* Таймлайн */}
        <h3 className="mt-14 font-mono text-xs tracking-[0.3em] text-muted uppercase">
          {t("experience.timelineTitle")}
        </h3>

        <ol className="relative mt-8 border-l border-line pl-6 sm:pl-8">
          {timeline.map((item, i) => (
            <li key={item.id} data-reveal data-reveal-delay={`${i * 0.06}`} className="relative pb-10 last:pb-0">
              <span className="absolute -left-[1.45rem] top-1.5 grid size-4 place-items-center rounded-full border border-sora/60 bg-sky sm:-left-[1.95rem]">
                <span className="size-1.5 rounded-full bg-sora-bright" />
              </span>
              <div className="corner-ticks border border-line bg-panel p-5 transition-colors hover:border-sora/50">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-display text-lg font-semibold text-sora-bright">
                    {item.year}
                  </span>
                  <span className="font-mono text-[11px] tracking-wider text-muted uppercase">
                    {item.org[lang]}
                  </span>
                </div>
                <h4 className="mt-1.5 font-display text-base font-semibold text-mist">
                  {item.title[lang]}
                </h4>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {item.desc[lang]}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* Отзывы */}
        <h3 className="mt-16 font-mono text-xs tracking-[0.3em] text-muted uppercase">
          {t("experience.reviewsTitle")}
        </h3>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {reviews.map((r, i) => (
            <figure
              key={r.id}
              data-reveal
              data-reveal-delay={`${i * 0.06}`}
              className="corner-ticks relative flex flex-col border border-line bg-panel p-6"
            >
              <span aria-hidden="true" className="font-display text-4xl leading-none text-sakura-bright/70">
                “
              </span>
              <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-mist">
                {r.text[lang]}
              </blockquote>
              <figcaption className="mt-5 border-t border-line pt-4">
                <span className="block font-display text-sm font-semibold text-mist">
                  {r.name}
                </span>
                <span className="mt-0.5 block font-mono text-[11px] text-muted">
                  {r.role[lang]}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
