import { NextRequest, NextResponse } from "next/server";
import {
  readSite,
  writeSite,
  readProjects,
  writeProjects,
  readExperience,
  writeExperience,
  readBlog,
  writeBlogPost,
  deleteBlogPost,
  readLocales,
  writeLocales,
} from "@/lib/admin-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authed(req: NextRequest): boolean {
  const token = process.env.ADMIN_TOKEN ?? "";
  return req.cookies.get("rb_admin")?.value === token;
}

export async function GET(req: NextRequest) {
  if (!authed(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const [site, projects, experience, blog, locales] = await Promise.all([
    readSite(),
    readProjects(),
    readExperience(),
    readBlog(),
    readLocales(),
  ]);
  return NextResponse.json({ site, projects, experience, blog, locales });
}

export async function PUT(req: NextRequest) {
  if (!authed(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  if (!body || typeof body.section !== "string") {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  const { section, data } = body as { section: string; data: any };
  try {
    switch (section) {
      case "site":
        await writeSite(data);
        break;
      case "projects":
        await writeProjects(data);
        break;
      case "experience":
        await writeExperience(data);
        break;
      case "blog":
        if (data?.action === "delete") {
          await deleteBlogPost(data.slug);
        } else {
          await writeBlogPost(data.post);
        }
        break;
      case "locales":
        await writeLocales(data);
        break;
      default:
        return NextResponse.json({ error: "unknown section" }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
