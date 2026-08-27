"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/icons";
import { useI18n, type Lang } from "@/lib/i18n";
import { scrollToId, scrollToTop } from "@/lib/smooth-scroll";
import { useSound } from "@/components/sound-provider";
import { useTheme } from "@/components/theme-provider";
import { site } from "@/data/site.config";

const SECTIONS = [
  ["about", "nav.about"],
  ["projects", "nav.projects"],
  ["experience", "nav.experience"],
  ["blog", "nav.blog"],
  ["media", "nav.media"],
  ["contact", "nav.contact"],
] as const;

export function Header() {
  const { t, lang, setLang } = useI18n();
  const { play } = useSound();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line/60 bg-sky/85 backdrop-blur-md">
        <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5">
          <button
            type="button"
            onClick={() => {
              play("tick");
              scrollToTop();
            }}
            aria-label={site.nameRu}
            className="group flex items-center gap-3"
          >
            <span className="relative grid size-9 place-items-center border border-sora/50 font-display text-sm font-bold text-sora-bright transition-colors group-hover:border-sakura group-hover:text-sakura-bright">
              РБ
              <span className="absolute -right-1 -bottom-1 size-1.5 bg-sakura" />
            </span>
            <span className="hidden font-mono text-[10px] tracking-[0.28em] text-muted uppercase sm:block">
              burnashev.dev
            </span>
          </button>

          <div className="hidden items-center gap-8 md:flex">
            {SECTIONS.map(([id, key]) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                play("tick");
                go(id);
              }}
              className="text-sm font-medium text-muted transition-colors hover:text-mist"
            >
              {t(key)}
            </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                play("toggle");
                toggle();
              }}
              aria-label={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
              title={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
              className="grid size-9 place-items-center border border-line text-mist transition-colors hover:border-sakura hover:text-sakura-bright"
            >
              {theme === "dark" ? (
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
                </svg>
              )}
            </button>
            <LangSwitch lang={lang} setLang={setLang} label={t("nav.langSwitch")} />
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={t("nav.menu")}
              aria-expanded={open}
              className="grid size-9 place-items-center border border-line text-mist transition-colors hover:border-sakura hover:text-sakura-bright md:hidden"
            >
              <MenuIcon className="size-5" />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[110] flex flex-col bg-sky/[0.98] px-6 pt-20 pb-10 backdrop-blur-xl md:hidden"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("nav.close")}
              className="absolute top-4 right-5 grid size-9 place-items-center border border-line text-mist"
            >
              <CloseIcon className="size-5" />
            </button>

            <nav className="flex flex-col">
              {SECTIONS.map(([id, key], i) => (
                 <button
                  key={id}
                  type="button"
                  onClick={() => {
                    play("tick");
                    go(id);
                  }}
                  className="flex items-baseline gap-4 border-b border-line/60 py-4 text-left"
                >
                  <span className="font-mono text-xs text-sakura">
                    0{i + 1}
                  </span>
                  <span className="font-display text-3xl font-semibold tracking-tight text-mist uppercase">
                    {t(key)}
                  </span>
                </button>
              ))}
            </nav>

            <div className="mt-auto pt-10">
              <LangSwitch lang={lang} setLang={setLang} label={t("nav.langSwitch")} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function LangSwitch({
  lang,
  setLang,
  label,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  label: string;
}) {
  const { play } = useSound();
  return (
    <div
      role="group"
      aria-label={label}
      className="flex overflow-hidden rounded-full border border-line font-mono text-xs"
    >
      {(["ru", "uz"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => {
            play("toggle");
            setLang(code);
          }}
          aria-pressed={lang === code}
          className={`px-3 py-1.5 tracking-wider uppercase transition-colors ${
            lang === code
              ? "bg-panel text-mist"
              : "text-muted hover:text-mist"
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
