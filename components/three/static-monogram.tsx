"use client";

/**
 * CSS-fallback для слабых устройств и машин без WebGL:
 * та же монограмма, но типографикой, без канваса.
 */
export function StaticMonogram() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      aria-hidden="true"
    >
      <div className="relative translate-y-[-8%] md:translate-x-[24%] md:translate-y-[-4%]">
        <span className="absolute -left-5 -top-5 h-10 w-10 border-l border-t border-sora/60" />
        <span className="absolute -bottom-5 -right-5 h-10 w-10 border-b border-r border-sakura/60" />
        <span className="text-outline-sora select-none font-display text-[clamp(8rem,30vw,19rem)] leading-none font-bold">
          Р Р‘
        </span>
        <p className="mt-3 text-right font-mono text-[10px] tracking-[0.3em] text-muted">
          OBJ: RB-01 // STATIC MODE
        </p>
      </div>
    </div>
  );
}
