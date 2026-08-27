"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/data/site.config";
import { useI18n } from "@/lib/i18n";

const FACT_KEYS = ["university", "faculty", "specialty", "course", "languages"] as const;

/** Слоты «созвездия» навыков в процентах от контейнера */
const SLOTS: Array<[number, number]> = [
  [10, 22], [32, 10], [56, 20], [80, 12], [92, 40],
  [72, 52], [48, 46], [22, 54], [38, 82], [66, 86],
  [88, 72], [8, 84],
];

const LINKS: Array<[number, number]> = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 7], [4, 5], [5, 6],
  [6, 7], [6, 10], [7, 8], [8, 9], [9, 10], [10, 11], [1, 6],
];

export function About() {
  const { t } = useI18n();

  return (
    <section id="about" className="relative scroll-mt-20 py-28 md:py-36">
      <div className="mx-auto grid w-full max-w-6xl gap-14 px-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* Портретная карточка */}
        <figure data-reveal className="mx-auto w-full max-w-sm lg:mx-0">
          <div className="corner-ticks group relative aspect-[4/5] overflow-hidden border border-line bg-panel">
            <Image
              src="/images/ravshan.png"
              alt={site.nameRu}
              fill
              sizes="(min-width: 1024px) 40vw, (min-width: 640px) 384px, 90vw"
              className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
              priority
            />
            {/* Градиент для читабельности подписи */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0b0e1a]/85 to-transparent"
            />
            <figcaption className="absolute inset-x-0 bottom-0 px-3 py-2 font-mono text-[10px] tracking-[0.2em] text-mist/90 uppercase">
              {t("about.photoCaption")}
            </figcaption>
            <span className="absolute top-3 right-3 size-1.5 bg-sakura" aria-hidden="true" />
          </div>
        </figure>

        {/* Текстовая часть */}
        <div>
          <SectionHeading
            fig={t("about.fig")}
            tag={t("about.tag")}
            title={t("about.title")}
            kana={t("about.kana")}
          />

          <p data-reveal data-reveal-delay="0.05" className="mt-6 max-w-2xl leading-relaxed text-muted">
            {t("about.lead")}
          </p>

          <h3
            data-reveal
            className="mt-10 font-mono text-xs tracking-[0.3em] text-sora-bright uppercase"
          >
            {t("about.factsLabel")}
          </h3>

          <dl data-reveal data-reveal-delay="0.05" className="mt-4">
            {FACT_KEYS.map((key) => (
              <div
                key={key}
                className="grid grid-cols-[110px_1fr] gap-4 border-b border-line/60 py-3 sm:grid-cols-[140px_1fr]"
              >
                <dt className="font-mono text-[11px] tracking-wider text-muted uppercase">
                  {t(`about.facts.${key}.label`)}
                </dt>
                <dd className="text-sm text-mist">{t(`about.facts.${key}.value`)}</dd>
              </div>
            ))}
          </dl>

          <h3
            data-reveal
            className="mt-12 font-mono text-xs tracking-[0.3em] text-sora-bright uppercase"
          >
            {t("about.skillsLabel")}
          </h3>

          {/* Созвездие навыков вместо progress-баров */}
          <div
            data-reveal
            className="relative mt-5 h-48 w-full overflow-hidden border border-line/60 bg-panel-2/60 sm:h-56"
          >
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {LINKS.map(([a, b], i) => (
                <line
                  key={i}
                  x1={SLOTS[a][0]}
                  y1={SLOTS[a][1]}
                  x2={SLOTS[b][0]}
                  y2={SLOTS[b][1]}
                  stroke="rgba(34, 211, 238, 0.15)"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </svg>

            {site.skills.map((skill, i) => {
              const slot = SLOTS[i % SLOTS.length];
              return (
                <motion.span
                  key={skill}
                  className="absolute -translate-x-1/2 -translate-y-1/2 border border-line bg-panel px-2 py-1 font-mono text-[10px] whitespace-nowrap text-mist shadow-[0_4px_16px_rgba(39,75,192,0.14)] sm:text-[11px]"
                  style={{ left: `${slot[0]}%`, top: `${slot[1]}%` }}
                  animate={{ y: [0, -5, 0], opacity: [0.85, 1, 0.85] }}
                  transition={{
                    duration: 3 + ((i * 0.37) % 1.6),
                    repeat: Infinity,
                    delay: i * 0.21,
                    ease: "easeInOut",
                  }}
                >
                  {skill}
                </motion.span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
