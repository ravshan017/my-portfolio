"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { playSfx, setSfxMuted, type Sfx } from "@/lib/sfx";

interface SoundApi {
  play: (type: Sfx) => void;
  muted: boolean;
  toggle: () => void;
}

const SoundContext = createContext<SoundApi>({
  play: () => {},
  muted: false,
  toggle: () => {},
});

export function useSound(): SoundApi {
  return useContext(SoundContext);
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("rb-sound") === "off";
  });

  useEffect(() => {
    setSfxMuted(muted);
  }, [muted]);

  const toggle = () => {
    setMuted((prev) => {
      const next = !prev;
      localStorage.setItem("rb-sound", next ? "off" : "on");
      setSfxMuted(next);
      return next;
    });
  };

  const play = (type: Sfx) => playSfx(type);

  return (
    <SoundContext.Provider value={{ play, muted, toggle }}>
      {children}
      <SoundToggle muted={muted} onToggle={toggle} />
    </SoundContext.Provider>
  );
}

function SoundToggle({
  muted,
  onToggle,
}: {
  muted: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={muted}
      aria-label={muted ? "Включить звук" : "Выключить звук"}
      title={muted ? "Включить звук" : "Выключить звук"}
      className="corner-ticks fixed bottom-6 right-6 z-[120] grid size-11 place-items-center border border-line bg-panel text-mist transition-colors hover:border-sakura hover:text-sakura-bright"
    >
      {muted ? (
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M11 5 6 9H3v6h3l5 4z" />
          <path d="m17 9 4 6M21 9l-4 6" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M11 5 6 9H3v6h3l5 4z" />
          <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
        </svg>
      )}
    </button>
  );
}
