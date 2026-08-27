"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Полоса прогресса скролла под шапкой — как HUD-индикатор в играх. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[95] h-[3px] origin-left bg-gradient-to-r from-sora via-sakura to-sora-bright"
    />
  );
}
