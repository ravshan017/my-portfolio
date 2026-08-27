"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

export function initSmoothScroll(): void {
  if (lenis) return;
  lenis = new Lenis({
    lerp: 0.11,
    smoothWheel: true,
  });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

export function destroySmoothScroll(): void {
  lenis?.destroy();
  lenis = null;
}

export function scrollToId(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { offset: -64, duration: 1.1 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function scrollToTop(): void {
  if (lenis) {
    lenis.scrollTo(0, { duration: 1.1 });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

/**
 * Плавные появления секций: все элементы с атрибутом data-reveal
 * подъезжают при входе во вьюпорт. Работает всегда, независимо от ОС.
 */
export function initScrollReveals(): void {
  document.documentElement.classList.add("gsap-on");
  requestAnimationFrame(() => {
    const targets = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    for (const el of targets) {
      gsap.fromTo(
        el,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          delay: Number(el.dataset.revealDelay ?? 0),
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        }
      );
    }
    ScrollTrigger.refresh();
  });
}
