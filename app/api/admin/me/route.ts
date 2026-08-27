import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const token = process.env.ADMIN_TOKEN ?? "";
  const authed = req.cookies.get("rb_admin")?.value === token;
  return NextResponse.json({ authed });
}
