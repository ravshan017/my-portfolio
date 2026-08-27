"use client";

/** Есть ли вообще WebGL-контекст (без него весь 3D невозможен). */
export function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ?? canvas.getContext("webgl")
    );
  } catch {
    return false;
  }
}

declare global {
  interface Navigator {
    deviceMemory?: number;
  }
}

/**
 * Эвристика слабого устройства: мало ядер или мало памяти.
 * На таких показываем статичный hero вместо 3D.
 */
export function isLowPowerDevice(): boolean {
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = navigator.deviceMemory ?? 8;
  return cores <= 2 || memory <= 2;
}

export function shouldUseStaticHero(): boolean {
  return !hasWebGL() || isLowPowerDevice();
}
