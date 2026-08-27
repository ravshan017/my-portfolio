import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!password || password !== expected) {
    return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
  }
  const token = process.env.ADMIN_TOKEN ?? "";
  const res = NextResponse.json({ ok: true });
  res.cookies.set("rb_admin", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
