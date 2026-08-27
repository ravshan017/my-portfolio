"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { ArrowUpRightIcon } from "@/components/icons";
import { useTilt } from "@/hooks/use-tilt";
import { useI18n } from "@/lib/i18n";
import { useSound } from "@/components/sound-provider";
import type { Project } from "@/lib/projects";

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.25 } },
} as const;

export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const { t } = useI18n();
  const tiltRef = useRef<HTMLDivElement | null>(null);
  const tilt = useTilt(tiltRef);
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.article
      layout
      variants={cardVariants}
      initial="hidden"
      whileInView="show"
      exit="exit"
      viewport={{ once: true, margin: "-40px" }}
      className="relative"
    >
      <div
        ref={tiltRef}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        className="corner-ticks group relative flex h-full flex-col border border-line bg-panel transition-colors duration-300 will-change-transform hover:border-sora/50"
      >
        {/* Блик, следующий за курсором */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(340px at var(--gx, 50%) var(--gy, 50%), rgba(240,97,158,0.13), transparent 65%)",
          }}
        />

        {/* Превью */}
        <div className="bg-hatch relative aspect-[16/10] overflow-hidden border-b border-line bg-panel-2">
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <>
              <span className="text-outline-sora absolute inset-0 grid place-items-center font-display text-7xl font-bold opacity-70 select-none">
                {num}
              </span>
              <span className="absolute right-3 bottom-2 font-mono text-[10px] tracking-widest text-muted">
                {project.year}
              </span>
            </>
          )}

          {project.placeholder && (
            <span className="absolute top-3 left-3 z-20 border border-sakura/50 bg-sakura/15 px-2 py-1 font-mono text-[10px] tracking-wider text-sakura-bright uppercase">
              {t("projects.placeholderBadge")}
            </span>
          )}
          {!project.placeholder && (
            <span className="absolute top-3 left-3 z-20 border border-line bg-panel/90 px-2 py-1 font-mono text-[10px] tracking-wider text-sora-bright uppercase">
              {t(`projects.filters.${project.category}`)}
            </span>
          )}
        </div>

        {/* Тело карточки */}
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-lg leading-snug font-semibold text-mist">
            {project.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {project.description}
          </p>

          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="stack">
            {project.stack.map((tech) => (
              <li
                key={tech}
                className="border border-line bg-sora/5 px-2 py-0.5 font-mono text-[11px] text-sora-bright"
              >
                {tech}
              </li>
            ))}
          </ul>

          <div className="mt-auto flex gap-5 pt-5">
            <ProjectLink label={t("projects.demo")} url={project.demoUrl} todoTitle={t("projects.demoTodo")} />
            <ProjectLink label={t("projects.code")} url={project.codeUrl} todoTitle={t("projects.demoTodo")} />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function ProjectLink({
  label,
  url,
  todoTitle,
}: {
  label: string;
  url: string;
  todoTitle: string;
}) {
  const { play } = useSound();
  const empty = url === "#";
  if (empty) {
    return (
      <span
        onClick={() => play("error")}
        title={todoTitle}
        aria-disabled="true"
        className="inline-flex cursor-not-allowed items-center gap-1 font-mono text-xs tracking-wider text-muted/45 uppercase"
      >
        {label}
        <ArrowUpRightIcon className="size-3.5" />
      </span>
    );
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => play("open")}
      className="inline-flex items-center gap-1 font-mono text-xs tracking-wider text-sora-bright uppercase underline-offset-4 transition-colors hover:text-sakura-bright hover:underline"
    >
      {label}
      <ArrowUpRightIcon className="size-3.5" />
    </a>
  );
}
