import raw from "@/data/projects.json";

export type ProjectCategory = "site" | "app" | "study";

export interface Project {
  id: string;
  category: ProjectCategory;
  /** true → на карточке появится плашка «заглушка» */
  placeholder?: boolean;
  title: string;
  description: string;
  stack: string[];
  /** путь в /public/images или null — тогда рисуется стилизованная заглушка */
  image: string | null;
  demoUrl: string;
  codeUrl: string;
  year: string;
}

export const projects: Project[] = raw as Project[];

export const categoryOrder: ProjectCategory[] = ["site", "app", "study"];

const EXTRA_KEY = "rb-extra-projects";

/** Проекты, добавленные самим пользователем прямо на сайте (хранятся в браузере). */
export function loadExtraProjects(): Project[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(EXTRA_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? (arr as Project[]) : [];
  } catch {
    return [];
  }
}

export function saveExtraProject(p: Project): Project[] {
  const next = [p, ...loadExtraProjects()];
  try {
    localStorage.setItem(EXTRA_KEY, JSON.stringify(next));
  } catch {
    /* приватный режим — не критично */
  }
  return next;
}
