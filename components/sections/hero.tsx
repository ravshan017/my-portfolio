"use client";

import { motion, type Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { HeroExperience } from "@/components/three/hero-experience";
import { useI18n } from "@/lib/i18n";
import { scrollToId } from "@/lib/smooth-scroll";

/**
 * Фазы появления текста. Начальная фаза одинакова на сервере и клиенте,
 * поэтому гидрация не ломается. Анимации работают всегда.
 */
type Phase = "hidden" | "stagger";

interface Burst {
  id: number;
  x: number;
  y: number;
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Hero() {
  const { t } = useI18n();
  const [phase, setPhase] = useState<Phase>("hidden");
  const [bursts, setBursts] = useState<Burst[]>([]);
  const sectionRef = useRef<HTMLElement | null>(null);
  const burstIdRef = useRef(0);

  useEffect(() => {
    const onReady = () => {
      if (fallback !== undefined) window.clearTimeout(fallback);
      setPhase("stagger");
    };
    window.addEventListener("rb:ready", onReady);
    const fallback = window.setTimeout(onReady, 4500);
    return () => {
      window.removeEventListener("rb:ready", onReady);
      if (fallback !== undefined) window.clearTimeout(fallback);
    };
  }, []);

  /** Вспышка-искра в точке клика по hero (как удар в аниме). */
  const onSectionClick = (e: React.MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).closest("a, button")) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const id = ++burstIdRef.current;
    setBursts((prev) => [
      ...prev.slice(-4),
      { id, x: e.clientX - rect.left, y: e.clientY - rect.top },
    ]);
    window.setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== id));
    }, 700);
  };

  return (
    <section
      id="top"
      ref={sectionRef}
      onClick={onSectionClick}
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* Сетка небосклона */}
      <div className="bg-sora-grid absolute inset-0" aria-hidden="true" />

      {/* Дрейфующие облака */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="animate-drift absolute left-[6%] top-[12%] h-24 w-72 rounded-full bg-sora/15 blur-3xl" />
        <div className="animate-drift-slow absolute right-[4%] top-[6%] h-32 w-96 rounded-full bg-sakura/10 blur-3xl" />
        <div className="animate-drift absolute left-[28%] top-[36%] h-20 w-80 rounded-full bg-sora/10 blur-3xl" />
        <div className="animate-drift-slow absolute bottom-[18%] left-[52%] h-16 w-64 rounded-full bg-sakura/[0.08] blur-3xl" />
      </div>

      {/* Сигнатурная 3D-сцена / CSS-fallback */}
      <div className="absolute inset-0" aria-hidden="true">
        <HeroExperience />
      </div>
      <p className="sr-only">{t("hero.sceneAlt")}</p>

      {/* Мягкое свечение неба у земли */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-sakura/[0.07] to-transparent"
      />
      <div
        aria-hidden="true"
        className="hero-left-fade pointer-events-none absolute inset-y-0 left-0 hidden w-1/2 md:block"
      />

      {/* Искры от кликов */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
        {bursts.map((b) => (
          <div key={b.id} className="absolute" style={{ left: b.x, top: b.y }}>
            <motion.div
              initial={{ scale: 0.3, opacity: 1 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="-translate-x-1/2 -translate-y-1/2"
            >
              <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sora shadow-[0_4px_14px_rgba(61,99,221,0.5)]" />
              {Array.from({ length: 8 }).map((_, i) => (
                <span
                  key={i}
                  className="absolute left-1/2 top-1/2 -ml-px -mt-2 h-4 w-[2px] bg-gradient-to-b from-sora-bright to-transparent"
                  style={{ transform: `rotate(${i * 45}deg)` }}
                />
              ))}
            </motion.div>
          </div>
        ))}
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate={phase === "stagger" ? "show" : "hidden"}
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 items-end px-5 pt-24 pb-24 md:items-center md:pt-16 md:pb-0"
      >
        <div className="max-w-xl">
          <motion.p
            variants={item}
            className="animate-breathe flex items-center gap-3 font-mono text-xs tracking-[0.3em] text-sora-bright"
          >
            {t("hero.label")}
            <span className="text-sakura">{t("hero.kana")}</span>
          </motion.p>

          <h1 className="mt-5 font-display text-[clamp(1.9rem,8vw,4.4rem)] leading-[1.08] font-bold tracking-tight uppercase">
            <motion.span
              variants={item}
              className="glitch block"
              data-text={t("hero.nameTop")}
            >
              {t("hero.nameTop")}
            </motion.span>
            <motion.span
              variants={item}
              className="text-outline-neon glitch block"
              data-text={t("hero.nameBottom")}
            >
              {t("hero.nameBottom")}
            </motion.span>
          </h1>

          <motion.p
            variants={item}
            className="mt-5 font-mono text-sm tracking-wide text-sakura-bright"
          >
            {t("hero.role")}
          </motion.p>

          <motion.p variants={item} className="mt-4 max-w-md leading-relaxed text-muted">
            {t("hero.pitch")}
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => scrollToId("projects")}
              className="corner-ticks bg-sora px-7 py-3.5 font-mono text-xs tracking-[0.2em] text-white uppercase transition-all hover:bg-sora-bright hover:shadow-[0_10px_30px_rgba(61,99,221,0.35)]"
            >
              {t("hero.ctaProjects")}
            </button>
            <button
              type="button"
              onClick={() => scrollToId("contact")}
              className="border border-line px-7 py-3.5 font-mono text-xs tracking-[0.2em] text-muted uppercase transition-all hover:border-sakura hover:text-sakura-bright hover:shadow-[0_10px_30px_rgba(240,97,158,0.2)]"
            >
              {t("hero.ctaContact")}
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Вертикальная аннотация справа */}
      <p className="absolute top-1/2 right-8 z-10 hidden origin-right -translate-y-1/2 rotate-90 font-mono text-[10px] tracking-[0.35em] text-sora/50 lg:block">
        {t("hero.annoSide")}
      </p>

      {/* Подсказка скролла */}
      <div className="absolute inset-x-0 bottom-6 z-10 hidden justify-center md:flex">
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-muted uppercase"
        >
          {t("hero.scrollHint")}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-3.5" aria-hidden="true">
            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
