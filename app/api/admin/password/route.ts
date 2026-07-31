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

  const { username, password } = await req.json().catch(() => ({}));
  const nextPassword = typeof password === "string" ? password.trim() : "";
  const nextUsername = typeof username === "string" ? username.trim() : "";

  // Either can be changed on its own, so a blank field means "leave this one
  // alone" rather than "set it to empty", which would lock the owner out.
  if (!nextPassword && !nextUsername) {
    return NextResponse.json({ error: "Enter a new username or password" }, { status: 400 });
  }

  const data: Record<string, string> = {};
  if (nextPassword) data.password = nextPassword;
  if (nextUsername) data.username = nextUsername;

  try {
    await (prisma as any).adminAuth.upsert({
      where: { id: 1 },
      create: { id: 1, ...data },
      update: data,
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Could not update the login" }, { status: 500 });
  }
}
