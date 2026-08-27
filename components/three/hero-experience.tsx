"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { shouldUseStaticHero } from "@/lib/capabilities";
import { StaticMonogram } from "./static-monogram";

const HeroScene = dynamic(() => import("./hero-scene"), { ssr: false });

type Mode = "pending" | "scene" | "static";

/**
 * Выбирает между полноценной 3D-сценой и статичным CSS-fallback
 * (нет WebGL или слабое устройство). Анимации не зависят от ОС.
 */
export function HeroExperience() {
  const [mode, setMode] = useState<Mode>("pending");

  useEffect(() => {
    const decide = () => {
      if (shouldUseStaticHero()) {
        setMode("static");
        window.dispatchEvent(new Event("rb:scene-ready"));
      } else {
        setMode("scene");
      }
    };
    const id = window.setTimeout(decide, 0);
    return () => window.clearTimeout(id);
  }, []);

  if (mode === "pending") return null;
  if (mode === "static") return <StaticMonogram />;
  return <HeroScene />;
}
