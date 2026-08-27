"use client";

import { ArrowUpIcon, socialIcons } from "@/components/icons";
import { site } from "@/data/site.config";
import { useI18n } from "@/lib/i18n";
import { scrollToId, scrollToTop } from "@/lib/smooth-scroll";

const SECTIONS = [
  ["about", "nav.about"],
  ["projects", "nav.projects"],
  ["media", "nav.media"],
  ["contact", "nav.contact"],
] as const;

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line/70 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-8 px-5 md:flex-row md:items-start">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <button
            type="button"
            onClick={scrollToTop}
            aria-label={site.nameRu}
            className="relative grid size-9 place-items-center border border-sora/50 font-display text-sm font-bold text-sora-bright transition-colors hover:border-sakura hover:text-sakura-bright"
          >
              РБ
            <span className="absolute -right-1 -bottom-1 size-1.5 bg-sakura" aria-hidden="true" />
          </button>
          <p className="font-mono text-[11px] text-muted">
            В© {year} {site.nameRu}. {t("footer.rights")}.
          </p>
          <p className="font-mono text-[10px] tracking-[0.25em] text-muted/60 uppercase">
            {t("footer.madeWith")}
          </p>
        </div>

        <nav aria-label="footer" className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {SECTIONS.map(([id, key]) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollToId(id)}
              className="text-sm text-muted transition-colors hover:text-mist"
            >
              {t(key)}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ul className="flex gap-2">
            {site.socials.map((social) => {
              const Icon = socialIcons[social.id];
              return (
                <li key={social.id}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${social.label} — ${social.handle}`}
                    className="grid size-9 place-items-center border border-line text-muted transition-colors hover:border-sakura hover:text-sakura-bright"
                  >
                    <Icon className="size-4" />
                  </a>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            onClick={scrollToTop}
            aria-label={t("footer.top")}
            title={t("footer.top")}
            className="grid size-9 place-items-center border border-line text-muted transition-colors hover:border-sora hover:text-sora-bright"
          >
            <ArrowUpIcon className="size-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
