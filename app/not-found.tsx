"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

/** Страница 404 в стиле исекай: страница «ушла в другой мир». */
export default function NotFound() {
  const { t } = useI18n();

  return (
    <main className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Небо */}
      <div className="bg-sora-grid absolute inset-0" aria-hidden="true" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="animate-drift absolute left-[10%] top-[16%] h-24 w-72 rounded-full bg-sora/15 blur-3xl" />
        <div className="animate-drift-slow absolute right-[8%] top-[60%] h-28 w-80 rounded-full bg-sakura/10 blur-3xl" />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 font-mono text-sm tracking-[0.5em] text-sakura"
      >
        {t("notFound.kana")}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="text-outline-neon glitch relative z-10 mt-4 select-none font-display text-[clamp(6rem,26vw,15rem)] leading-none font-bold"
        data-text={t("notFound.title")}
      >
        {t("notFound.title")}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
        className="relative z-10 mt-6 font-display text-xl font-semibold text-mist md:text-2xl"
      >
        {t("notFound.line")}
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.6 }}
        className="relative z-10 mt-3 max-w-md text-sm leading-relaxed text-muted"
      >
        {t("notFound.hint")}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6 }}
        className="relative z-10 mt-10"
      >
        <Link
          href="/"
          className="corner-ticks inline-block bg-sora px-7 py-3.5 font-mono text-xs tracking-[0.2em] text-white uppercase transition-all hover:bg-sora-bright hover:shadow-[0_10px_30px_rgba(77,116,255,0.35)]"
        >
          {t("notFound.back")}
        </Link>
      </motion.div>

      <p className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] text-muted/60 uppercase">
        ERR // WORLD_SHIFT_EXCEPTION
      </p>
    </main>
  );
}
