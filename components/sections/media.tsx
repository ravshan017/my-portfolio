"use client";

import { ArrowUpRightIcon, socialIcons } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/data/site.config";
import { useI18n } from "@/lib/i18n";
import { useSound } from "@/components/sound-provider";

export function Media() {
  const { t } = useI18n();
  const { play } = useSound();

  return (
    <section id="media" className="relative scroll-mt-20 py-28 md:py-36">
      <div className="mx-auto w-full max-w-6xl px-5">
        <SectionHeading
          fig={t("media.fig")}
          tag={t("media.tag")}
          title={t("media.title")}
          subtitle={t("media.subtitle")}
          kana={t("media.kana")}
        />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {site.socials.map((social, i) => {
            const Icon = socialIcons[social.id];
            const creative = social.kind === "creative";
            return (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => play("open")}
                aria-label={`${social.label} — ${social.handle}`}
                data-reveal
                data-reveal-delay={`${i * 0.08}`}
                className="corner-ticks group relative flex min-h-[220px] flex-col gap-4 border border-line bg-panel p-6 transition-colors duration-300 hover:border-sakura/60"
              >
                <span className="grid size-12 place-items-center border border-line bg-panel-2 transition-colors duration-300 group-hover:border-sakura/50">
                  <Icon
                    className={`size-6 transition-colors ${
                      creative
                        ? "text-sakura-bright"
                        : "text-sora-bright group-hover:text-sakura-bright"
                    }`}
                  />
                </span>

                <span>
                  <span className="block font-display text-xl font-semibold text-mist">
                    {t(`media.cards.${social.id}.name`)}
                  </span>
                  <span className="mt-1 block font-mono text-xs text-muted">
                    {social.handle}
                  </span>
                </span>

                <span className="flex-1 text-sm leading-relaxed text-muted">
                  {t(`media.cards.${social.id}.desc`)}
                </span>

                <span className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs tracking-wider text-sora-bright uppercase transition-colors group-hover:text-sakura-bright">
                    {t("media.visit")}
                    <ArrowUpRightIcon className="size-3.5" />
                  </span>
                  {creative && (
                    <span className="border border-sakura/50 px-2 py-0.5 font-mono text-[10px] tracking-wider text-sakura-bright uppercase">
                      {t("media.creativeBadge")}
                    </span>
                  )}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
