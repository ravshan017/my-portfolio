"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useSound } from "@/components/sound-provider";

/**
 * Пасхалка: код Konami (↑↑↓↓←→←→BA) включает «режим отаку» на 12 секунд —
 * шторм лепестков сакуры и ускоренный магический круг в 3D-сцене.
 */
const SEQUENCE = [
  "arrowup",
  "arrowup",
  "arrowdown",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "arrowleft",
  "arrowright",
  "b",
  "a",
] as const;

const OTAKU_MS = 12000;

export function Konami() {
  const { t } = useI18n();
  const { play } = useSound();
  const [active, setActive] = useState(false);

  // play стабилен по смыслу; переподписка слушателя при каждом рендере не нужна
  useEffect(() => {
    let buffer: string[] = [];
    let timer: number | undefined;

    const onKey = (e: KeyboardEvent) => {
      buffer.push(e.key.toLowerCase());
      buffer = buffer.slice(-SEQUENCE.length);
      if (
        buffer.length === SEQUENCE.length &&
        SEQUENCE.every((key, i) => key === buffer[i])
      ) {
        buffer = [];
        window.dispatchEvent(
          new CustomEvent("rb:otaku", { detail: { on: true } })
        );
        play("unlock");
        setActive(true);
        if (timer !== undefined) window.clearTimeout(timer);
        timer = window.setTimeout(() => {
          setActive(false);
          window.dispatchEvent(
            new CustomEvent("rb:otaku", { detail: { on: false } })
          );
        }, OTAKU_MS);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (timer !== undefined) window.clearTimeout(timer);
    };
    // play стабилен по смыслу — переподписка не нужна
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <div className="fixed bottom-6 left-1/2 z-[130] w-max max-w-[calc(100vw-32px)] -translate-x-1/2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            role="status"
            aria-live="polite"
            className="corner-ticks flex items-center gap-3 border border-sakura/50 bg-panel px-5 py-3 shadow-[0_10px_40px_rgba(240,97,158,0.25)]"
          >
            <span className="animate-breathe text-lg text-sakura-bright">✦</span>
            <span>
              <span className="block font-mono text-xs tracking-[0.25em] text-sakura-bright">
                オタクモード・起動
              </span>
              <span className="mt-0.5 block font-mono text-[11px] text-muted">
                {t("konami.toast")}
              </span>
            </span>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
