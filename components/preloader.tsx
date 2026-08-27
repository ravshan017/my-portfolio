"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

/**
 * Прелоадер ≤2 сек: считает «сборку» и уезжает вверх ровно в тот момент,
 * когда частицы монограммы уже собираются в hero — без резкого обрыва.
 * Работает всегда, независимо от настроек ОС.
 */
const MIN_VISIBLE_MS = 1400;
const HARD_TIMEOUT_MS = 3200;

export function Preloader() {
  const { t } = useI18n();
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const html = document.documentElement;
    html.style.overflow = "hidden";
    const startedAt = performance.now();

    let current = 0;
    let target = 88;
    let released = false;

    const finish = () => {
      const wait = Math.max(0, MIN_VISIBLE_MS - (performance.now() - startedAt));
      window.setTimeout(() => {
        html.style.overflow = "";
        window.setTimeout(() => {
          setShow(false);
          window.dispatchEvent(new Event("rb:ready"));
        }, 300);
      }, wait);
    };

    const interval = window.setInterval(() => {
      current += Math.max(1, (target - current) * 0.16);
      if (current > 100) current = 100;
      setProgress(current);
      if (!released && current >= 100) {
        released = true;
        window.clearInterval(interval);
        finish();
      }
    }, 40);

    // Сцена готова → добиваем прогресс до 100
    const onSceneReady = () => {
      target = 100;
    };
    window.addEventListener("rb:scene-ready", onSceneReady);

    // Страховка: если событие сцены не пришло — завершаем сами
    const guard = window.setTimeout(() => {
      target = 100;
    }, HARD_TIMEOUT_MS);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(guard);
      window.removeEventListener("rb:scene-ready", onSceneReady);
      html.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-sky"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
        >
          <p className="font-mono text-[11px] tracking-[0.35em] text-sora-bright">
            {t("preloader.label")}
          </p>
          <p className="mt-2 font-mono text-[10px] tracking-[0.5em] text-sakura">
            {t("preloader.kana")}
          </p>

          <div className="mt-6 flex items-baseline gap-1 font-display text-7xl font-semibold tabular-nums">
            {Math.round(progress)}
            <span className="text-2xl text-sakura">%</span>
          </div>

          <div className="mt-8 h-px w-60 overflow-hidden bg-line">
            <div
              className="h-full bg-gradient-to-r from-sora to-sakura transition-[width] duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-4 font-mono text-[10px] tracking-[0.25em] text-muted uppercase">
            {t("preloader.hint")}
          </p>

          <span className="absolute bottom-6 left-6 font-mono text-[10px] tracking-[0.3em] text-muted/70">
            RB // BUILD SHEET
          </span>
          <span className="absolute right-6 bottom-6 font-mono text-[10px] tracking-[0.3em] text-muted/70">
            RU·UZ
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
