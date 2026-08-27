export type Sfx = "tick" | "toggle" | "open" | "close" | "success" | "error" | "unlock";

type Ctx = AudioContext;

let ctx: Ctx | null = null;
let muted = false;

export function setSfxMuted(value: boolean): void {
  muted = value;
}

export function isSfxMuted(): boolean {
  return muted;
}

function getCtx(): Ctx | null {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

interface Note {
  freq: number;
  dur: number;
  type?: OscillatorType;
  gain?: number;
  at?: number;
  slideTo?: number;
}

function playNotes(ac: Ctx, notes: Note[]): void {
  const now = ac.currentTime;
  for (const n of notes) {
    const start = now + (n.at ?? 0);
    const osc = ac.createOscillator();
    const env = ac.createGain();
    const peak = n.gain ?? 0.12;
    osc.type = n.type ?? "triangle";
    osc.frequency.setValueAtTime(n.freq, start);
    if (n.slideTo) osc.frequency.exponentialRampToValueAtTime(n.slideTo, start + n.dur);
    env.gain.setValueAtTime(0.0001, start);
    env.gain.exponentialRampToValueAtTime(peak, start + 0.008);
    env.gain.exponentialRampToValueAtTime(0.0001, start + n.dur);
    osc.connect(env).connect(ac.destination);
    osc.start(start);
    osc.stop(start + n.dur + 0.02);
  }
}

const RECIPES: Record<Sfx, Note[]> = {
  tick: [{ freq: 880, dur: 0.05, type: "triangle", gain: 0.08 }],
  toggle: [{ freq: 620, dur: 0.09, type: "sine", gain: 0.1, slideTo: 990 }],
  open: [{ freq: 520, dur: 0.13, type: "triangle", gain: 0.1, slideTo: 800 }],
  close: [{ freq: 800, dur: 0.13, type: "triangle", gain: 0.1, slideTo: 520 }],
  success: [
    { freq: 523, dur: 0.12, type: "sine", gain: 0.12, at: 0 },
    { freq: 659, dur: 0.12, type: "sine", gain: 0.12, at: 0.1 },
    { freq: 784, dur: 0.18, type: "sine", gain: 0.12, at: 0.2 },
  ],
  error: [{ freq: 220, dur: 0.18, type: "sawtooth", gain: 0.09 }],
  unlock: [
    { freq: 880, dur: 0.1, type: "triangle", gain: 0.1, slideTo: 1320, at: 0 },
    { freq: 1320, dur: 0.12, type: "triangle", gain: 0.1, slideTo: 1760, at: 0.09 },
    { freq: 1760, dur: 0.16, type: "sine", gain: 0.09, at: 0.2 },
  ],
};

export function playSfx(type: Sfx): void {
  if (muted) return;
  const ac = getCtx();
  if (!ac) return;
  playNotes(ac, RECIPES[type]);
}
