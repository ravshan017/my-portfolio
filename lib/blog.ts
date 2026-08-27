import { promises as fs } from "fs";
import path from "path";
import { marked } from "marked";

const BLOG_DIR = path.join(process.cwd(), "data", "blog");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  readingTime: string;
  cover?: string | null;
}

export type Post = PostMeta;

export interface BlogFile {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  readingTime: string;
  cover?: string | null;
  body: string;
}

export interface PostContent extends PostMeta {
  html: string;
  body: string;
}

async function readAll(): Promise<BlogFile[]> {
  let files: string[];
  try {
    files = await fs.readdir(BLOG_DIR);
  } catch {
    return [];
  }
  const posts = await Promise.all(
    files
      .filter((f) => f.endsWith(".json"))
      .map(async (f) => {
        const raw = await fs.readFile(path.join(BLOG_DIR, f), "utf8");
        return JSON.parse(raw) as BlogFile;
      }),
  );
  return posts;
}

export async function getAllPosts(): Promise<Post[]> {
  const posts = await readAll();
  const metas = posts.map(({ body, ...meta }) => meta);
  return metas.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPost(slug: string): Promise<PostContent | null> {
  const posts = await readAll();
  const found = posts.find((p) => p.slug === slug);
  if (!found) return null;
  const { body, ...meta } = found;
  const html = marked(body ?? "", { gfm: true }) as string;
  return { ...meta, html, body: body ?? "" };
}
