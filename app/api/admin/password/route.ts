import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

// Changes the admin login password. Cookie-gated like the rest of /api/admin.
// The password lives in admin_auth (not site_settings) so it stays off the
// publicly-readable Supabase tables. Read by api/admin/login on each sign-in.
async function guard() {
  const c = await cookies();
  return c.get("admin")?.value === "1";
}

export async function POST(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { password } = await req.json().catch(() => ({}));
  const next = typeof password === "string" ? password.trim() : "";
  if (!next) return NextResponse.json({ error: "Password cannot be blank" }, { status: 400 });

  try {
    await (prisma as any).adminAuth.upsert({
      where: { id: 1 },
      create: { id: 1, password: next },
      update: { password: next },
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Could not update password" }, { status: 500 });
  }
}
