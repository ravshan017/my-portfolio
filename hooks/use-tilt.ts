"use client";

import { useCallback, type MouseEvent, type RefObject } from "react";

export interface TiltApi {
  onMouseMove: (e: MouseEvent<HTMLElement>) => void;
  onMouseLeave: () => void;
}

/**
 * Лёгкий 3D-tilt для карточек: перспектива + поворот к курсору
 * + позиция блика через CSS-переменные --gx / --gy.
 * На тач-устройствах не активен.
 */
export function useTilt(
  ref: RefObject<HTMLElement | null>,
  maxDeg = 6
): TiltApi {
  const disabled = useCallback(() => {
    return (
      typeof window === "undefined" ||
      window.matchMedia("(pointer: coarse)").matches
    );
  }, []);

  const onMouseMove = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      const el = ref.current;
      if (!el || disabled()) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rx = (0.5 - py) * maxDeg * 2;
      const ry = (px - 0.5) * maxDeg * 2;
      el.style.transition = "transform 80ms linear";
      el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      el.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
    },
    [disabled, maxDeg, ref]
  );

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 500ms cubic-bezier(.22,1,.36,1)";
    el.style.transform = "";
  }, [ref]);

  return { onMouseMove, onMouseLeave };
}
