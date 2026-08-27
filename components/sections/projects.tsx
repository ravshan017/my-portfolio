"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import {
  loadExtraProjects,
  projects,
  saveExtraProject,
  type Project,
  type ProjectCategory,
} from "@/lib/projects";
import { useI18n } from "@/lib/i18n";
import { useSound } from "@/components/sound-provider";

type Filter = "all" | ProjectCategory;

interface FormState {
  title: string;
  category: ProjectCategory;
  description: string;
  stack: string;
  image: string;
  demoUrl: string;
  codeUrl: string;
  year: string;
}

const EMPTY: FormState = {
  title: "",
  category: "site",
  description: "",
  stack: "",
  image: "",
  demoUrl: "",
  codeUrl: "",
  year: String(new Date().getFullYear()),
};

export function Projects() {
  const { t } = useI18n();
  const { play } = useSound();
  const [filter, setFilter] = useState<Filter>("all");
  const [extras, setExtras] = useState<Project[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);

  useEffect(() => {
    // Гидрация локально добавленных проектов: на сервере и в первом рендере
    // их нет, поэтому подгружаем из localStorage после маунта (без гидрационного расхождения).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setExtras(loadExtraProjects());
  }, []);

  const all = [...extras, ...projects];
  const filters: Filter[] = ["all", "site", "app", "study"];
  const visible =
    filter === "all" ? all : all.filter((p) => p.category === filter);

  const openModal = () => {
    setForm(EMPTY);
    setModalOpen(true);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const project: Project = {
      id: `extra-${Date.now()}`,
      category: form.category,
      title: form.title.trim() || "Без названия",
      description: form.description.trim(),
      stack: form.stack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      image: form.image.trim() || null,
      demoUrl: form.demoUrl.trim() || "#",
      codeUrl: form.codeUrl.trim() || "#",
      year: form.year.trim() || String(new Date().getFullYear()),
    };
    setExtras(saveExtraProject(project));
    setModalOpen(false);
    play("success");
  };

  return (
    <section id="projects" className="relative scroll-mt-20 py-28 md:py-36">
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-1/2 hidden w-px bg-gradient-to-b from-transparent via-line/70 to-transparent lg:block"
      />

      <div className="mx-auto w-full max-w-6xl px-5">
        <SectionHeading
          fig={t("projects.fig")}
          tag={t("projects.tag")}
          title={t("projects.title")}
          subtitle={t("projects.subtitle")}
          kana={t("projects.kana")}
        />

        <div
          data-reveal
          data-reveal-delay="0.05"
          className="mt-9 flex flex-wrap items-center gap-2"
        >
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              onClick={() => {
                if (filter !== f) play("tick");
                setFilter(f);
              }}
              className={`border px-4 py-2 font-mono text-xs tracking-[0.15em] uppercase transition-colors ${
                filter === f
                  ? "border-sora bg-sora text-white shadow-[0_8px_22px_rgba(61,99,221,0.3)]"
                  : "border-line text-muted hover:border-sakura/60 hover:text-sakura-bright"
              }`}
            >
              {t(`projects.filters.${f}`)}
            </button>
          ))}

          <button
            type="button"
            onClick={() => {
              play("toggle");
              openModal();
            }}
            className="ml-auto inline-flex items-center gap-1.5 border border-dashed border-sora/60 px-4 py-2 font-mono text-xs tracking-[0.15em] uppercase text-sora-bright transition-colors hover:border-sakura hover:text-sakura-bright"
          >
            {t("projects.add.button")}
          </button>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </AnimatePresence>
        </div>

        {visible.length === 0 && (
          <p data-reveal className="mt-10 font-mono text-sm text-muted">
            {t("projects.empty")}
          </p>
        )}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[140] flex items-end justify-center bg-sky/80 p-4 backdrop-blur-sm sm:items-center"
            onClick={() => setModalOpen(false)}
          >
            <motion.form
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={submit}
              className="corner-ticks w-full max-w-lg border border-line bg-panel p-6"
            >
              <h3 className="font-display text-lg font-semibold text-mist">
                {t("projects.add.title")}
              </h3>

              <div className="mt-5 flex flex-col gap-4">
                <Field label={t("projects.add.name")}>
                  <input
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder={t("projects.add.namePlaceholder")}
                    className={inputCls}
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label={t("projects.add.category")}>
                    <select
                      value={form.category}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          category: e.target.value as ProjectCategory,
                        })
                      }
                      className={inputCls}
                    >
                      <option value="site">{t("projects.filters.site")}</option>
                      <option value="app">{t("projects.filters.app")}</option>
                      <option value="study">{t("projects.filters.study")}</option>
                    </select>
                  </Field>
                  <Field label={t("projects.add.year")}>
                    <input
                      value={form.year}
                      onChange={(e) => setForm({ ...form, year: e.target.value })}
                      placeholder={t("projects.add.yearPlaceholder")}
                      className={inputCls}
                    />
                  </Field>
                </div>

                <Field label={t("projects.add.description")}>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder={t("projects.add.descriptionPlaceholder")}
                    className={`${inputCls} resize-y`}
                  />
                </Field>

                <Field label={t("projects.add.stack")}>
                  <input
                    value={form.stack}
                    onChange={(e) => setForm({ ...form, stack: e.target.value })}
                    placeholder={t("projects.add.stackPlaceholder")}
                    className={inputCls}
                  />
                </Field>

                <Field label={t("projects.add.image")}>
                  <input
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder={t("projects.add.imagePlaceholder")}
                    className={inputCls}
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label={t("projects.add.demo")}>
                    <input
                      value={form.demoUrl}
                      onChange={(e) =>
                        setForm({ ...form, demoUrl: e.target.value })
                      }
                      placeholder="https://"
                      className={inputCls}
                    />
                  </Field>
                  <Field label={t("projects.add.code")}>
                    <input
                      value={form.codeUrl}
                      onChange={(e) =>
                        setForm({ ...form, codeUrl: e.target.value })
                      }
                      placeholder="https://"
                      className={inputCls}
                    />
                  </Field>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="border border-line px-4 py-2 font-mono text-xs tracking-[0.15em] uppercase text-muted transition-colors hover:text-mist"
                >
                  {t("projects.add.cancel")}
                </button>
                <button
                  type="submit"
                  className="bg-sora px-5 py-2 font-mono text-xs tracking-[0.15em] uppercase text-white transition-colors hover:bg-sora-bright"
                >
                  {t("projects.add.save")}
                </button>
              </div>
              <p className="mt-3 font-mono text-[10px] text-muted">
                {t("projects.add.saved")}
              </p>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

const inputCls =
  "w-full border border-line bg-panel-2 px-3 py-2 text-sm text-mist placeholder:text-muted/60 transition-colors focus:border-sora focus:outline-none";

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[11px] tracking-[0.2em] text-muted uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}
