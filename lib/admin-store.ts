import { promises as fs } from "fs";
import path from "path";

const ROOT = process.cwd();
const DATA = path.join(ROOT, "data");
const LOCALES = path.join(ROOT, "locales");
const BLOG_DIR = path.join(DATA, "blog");

function file(...segments: string[]) {
  return path.join(...segments);
}

async function readJson<T>(p: string): Promise<T> {
  const raw = await fs.readFile(p, "utf8");
  return JSON.parse(raw) as T;
}

async function writeJson(p: string, data: unknown) {
  await fs.writeFile(p, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/* ---------- Site ---------- */
export function readSite() {
  return readJson<import("@/data/site.config").SiteConfig>(file(DATA, "site.json"));
}
export function writeSite(data: unknown) {
  return writeJson(file(DATA, "site.json"), data);
}

/* ---------- Projects ---------- */
export type ProjectRow = {
  id: string;
  category: "site" | "app" | "study";
  placeholder?: boolean;
  title: string;
  description: string;
  stack: string[];
  image: string | null;
  demoUrl: string;
  codeUrl: string;
  year: string;
};
export function readProjects() {
  return readJson<ProjectRow[]>(file(DATA, "projects.json"));
}
export function writeProjects(data: unknown) {
  return writeJson(file(DATA, "projects.json"), data);
}

/* ---------- Experience ---------- */
export interface ExperienceRow {
  timeline: unknown[];
  reviews: unknown[];
}
export function readExperience() {
  return readJson<ExperienceRow>(file(DATA, "experience.json"));
}
export function writeExperience(data: unknown) {
  return writeJson(file(DATA, "experience.json"), data);
}

/* ---------- Blog ---------- */
export interface BlogRow {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  readingTime: string;
  cover?: string | null;
  body: string;
}

export async function readBlog(): Promise<BlogRow[]> {
  let names: string[];
  try {
    names = await fs.readdir(BLOG_DIR);
  } catch {
    return [];
  }
  const rows = await Promise.all(
    names
      .filter((n) => n.endsWith(".json"))
      .map((n) => readJson<BlogRow>(file(BLOG_DIR, n))),
  );
  return rows.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function readBlogPost(slug: string): Promise<BlogRow | null> {
  try {
    return await readJson<BlogRow>(file(BLOG_DIR, `${sanitizeSlug(slug)}.json`));
  } catch {
    return null;
  }
}

export async function writeBlogPost(post: BlogRow): Promise<string> {
  const slug = sanitizeSlug(post.slug || post.title || "post");
  const row: BlogRow = { ...post, slug };
  await writeJson(file(BLOG_DIR, `${slug}.json`), row);
  return slug;
}

export async function deleteBlogPost(slug: string): Promise<void> {
  const safe = sanitizeSlug(slug);
  try {
    await fs.unlink(file(BLOG_DIR, `${safe}.json`));
  } catch {
    /* уже нет */
  }
}

/* ---------- Locales ---------- */
export interface LocalesRow {
  ru: Record<string, unknown>;
  uz: Record<string, unknown>;
}
export async function readLocales(): Promise<LocalesRow> {
  const [ru, uz] = await Promise.all([
    readJson<Record<string, unknown>>(file(LOCALES, "ru.json")),
    readJson<Record<string, unknown>>(file(LOCALES, "uz.json")),
  ]);
  return { ru, uz };
}
export function writeLocales(data: LocalesRow) {
  return Promise.all([
    writeJson(file(LOCALES, "ru.json"), data.ru),
    writeJson(file(LOCALES, "uz.json"), data.uz),
  ]);
}
