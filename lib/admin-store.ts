import { promises as fs } from "fs";
import path from "path";

const ROOT = process.cwd();
const DATA = path.join(ROOT, "data");
const LOCALES = path.join(ROOT, "locales");
const BLOG_DIR = path.join(DATA, "blog");

/* ---------- GitHub-backed persistence (Vercel / serverless) ---------- */
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO; // "owner/repo"
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";
const GITHUB_BACKED = Boolean(
  GITHUB_TOKEN && GITHUB_REPO !== undefined && GITHUB_REPO.includes("/"),
);
const [REPO_OWNER, REPO_NAME] = GITHUB_BACKED
  ? (GITHUB_REPO as string).split("/")
  : [undefined, undefined];

export const isGithubBacked = GITHUB_BACKED;

function repoPath(abs: string): string {
  return path.relative(ROOT, abs).split(path.sep).join("/");
}

function ghHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-admin",
  };
}

// Записывает файл в репозиторий через GitHub Contents API.
// При обновлении передаём sha текущей версии, чтобы не перезаписать
// чужие правки (конкурентная запись).
async function githubPut(abs: string, data: unknown): Promise<void> {
  const rel = repoPath(abs);
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${rel}?ref=${GITHUB_BRANCH}`;
  const headers = ghHeaders();
  const content = Buffer.from(
    JSON.stringify(data, null, 2) + "\n",
    "utf8",
  ).toString("base64");

  let sha: string | undefined;
  try {
    const cur = await fetch(url, { headers });
    if (cur.ok) sha = (await cur.json()).sha as string;
  } catch {
    /* новый файл — sha нет */
  }

  const res = await fetch(url, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `admin: update ${rel}`,
      content,
      branch: GITHUB_BRANCH,
      ...(sha ? { sha } : {}),
    }),
  });
  if (!res.ok) {
    throw new Error(`GitHub PUT ${rel}: ${res.status} ${await res.text()}`);
  }
}

async function githubDelete(abs: string): Promise<void> {
  const rel = repoPath(abs);
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${rel}?ref=${GITHUB_BRANCH}`;
  const headers = ghHeaders();
  const cur = await fetch(url, { headers });
  if (!cur.ok) return; // уже нет
  const sha = (await cur.json()).sha as string;
  const res = await fetch(url, {
    method: "DELETE",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `admin: delete ${rel}`,
      branch: GITHUB_BRANCH,
      sha,
    }),
  });
  if (!res.ok) {
    throw new Error(`GitHub DELETE ${rel}: ${res.status} ${await res.text()}`);
  }
}

async function writeFileAnywhere(abs: string, data: unknown): Promise<void> {
  if (GITHUB_BACKED) {
    await githubPut(abs, data);
  } else {
    await fs.writeFile(abs, JSON.stringify(data, null, 2) + "\n", "utf8");
  }
}

async function deleteFileAnywhere(abs: string): Promise<void> {
  if (GITHUB_BACKED) {
    await githubDelete(abs);
  } else {
    await fs.unlink(abs).catch(() => {});
  }
}

function file(...segments: string[]) {
  return path.join(...segments);
}

async function readJson<T>(p: string): Promise<T> {
  const raw = await fs.readFile(p, "utf8");
  return JSON.parse(raw) as T;
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
  return readJson<import("@/data/site.config").SiteConfig>(
    file(DATA, "site.json"),
  );
}
export function writeSite(data: unknown) {
  return writeFileAnywhere(file(DATA, "site.json"), data);
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
  return writeFileAnywhere(file(DATA, "projects.json"), data);
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
  return writeFileAnywhere(file(DATA, "experience.json"), data);
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
    return await readJson<BlogRow>(
      file(BLOG_DIR, `${sanitizeSlug(slug)}.json`),
    );
  } catch {
    return null;
  }
}

export async function writeBlogPost(post: BlogRow): Promise<string> {
  const slug = sanitizeSlug(post.slug || post.title || "post");
  const row: BlogRow = { ...post, slug };
  await writeFileAnywhere(file(BLOG_DIR, `${slug}.json`), row);
  return slug;
}

export async function deleteBlogPost(slug: string): Promise<void> {
  const safe = sanitizeSlug(slug);
  await deleteFileAnywhere(file(BLOG_DIR, `${safe}.json`));
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
    writeFileAnywhere(file(LOCALES, "ru.json"), data.ru),
    writeFileAnywhere(file(LOCALES, "uz.json"), data.uz),
  ]);
}
