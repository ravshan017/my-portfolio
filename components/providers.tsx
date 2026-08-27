"use client";

import { MotionConfig } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { I18nProvider } from "@/lib/i18n";
import { initScrollReveals, initSmoothScroll } from "@/lib/smooth-scroll";
import { Konami } from "@/components/konami";
import { SoundProvider } from "@/components/sound-provider";
import { SwRegister } from "@/components/sw-register";
import { ThemeProvider } from "@/components/theme-provider";

/**
 * Клиентская обвязка: язык + плавный скролл + reveal-анимации.
 * reducedMotion="never" — анимации сайта не зависят от настроек Windows.
 * Скролл и reveal стартуют после сигнала `rb:ready` от прелоадера.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <MotionConfig reducedMotion="never">
        <ThemeProvider>
          <SoundProvider>
            <Boot>{children}</Boot>
            <Konami />
            <SwRegister />
          </SoundProvider>
        </ThemeProvider>
      </MotionConfig>
    </I18nProvider>
  );
}

function Boot({ children }: { children: ReactNode }) {
  useEffect(() => {
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      initSmoothScroll();
      initScrollReveals();
      window.dispatchEvent(new Event("rb:boot"));
    };

    window.addEventListener("rb:ready", start, { once: true });
    const fallback = setTimeout(start, 5000);
    return () => {
      window.removeEventListener("rb:ready", start);
      clearTimeout(fallback);
    };
  }, []);

  return <>{children}</>;
}
