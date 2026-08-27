"use client";

import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Monogram } from "./monogram-rb";
import { SakuraPetals } from "./sakura-petals";
import { pointer } from "@/lib/pointer";

/**
 * Корневая 3D-сцена hero. Монтируется только на клиенте (dynamic import),
 * не перехватывает события мыши — кнопки поверх остаются кликабельны.
 */
export default function HeroScene() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 7], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <Monogram />
      <SakuraPetals />
    </Canvas>
  );
}
