interface SectionHeadingProps {
  fig: string;
  tag: string;
  title: string;
  subtitle?: string;
  /** Декоративная катакана-подпись в стиле аниме-интерфейсов */
  kana?: string;
}

export function SectionHeading({ fig, tag, title, subtitle, kana }: SectionHeadingProps) {
  return (
    <div data-reveal>
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs tracking-[0.25em] text-sakura">
          {fig}
        </span>
        <span className="font-mono text-xs tracking-[0.25em] text-muted uppercase">
          {tag}
        </span>
        <span className="h-px flex-1 bg-gradient-to-r from-line via-sora/40 to-transparent" />
        {kana ? (
          <span className="font-mono text-xs text-sora/70">{kana}</span>
        ) : null}
      </div>
      <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-mist uppercase md:text-5xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 max-w-xl leading-relaxed text-muted">{subtitle}</p>
      ) : null}
    </div>
  );
}
