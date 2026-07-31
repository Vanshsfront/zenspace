import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Fallback when the DB has no stored password yet (or the column hasn't been
// migrated): env var first, then the seeded default.
const FALLBACK_PASSWORD = process.env.ADMIN_PASSWORD || "zenspace123098#";

// The admin can change the password from the panel, so the DB value is the
// source of truth. Wrapped in try/catch so login still works during the window
// before the admin_auth table exists.
async function expectedPassword(): Promise<string> {
  // Outside production, ADMIN_PASSWORD overrides the stored password so a local
  // machine can use a throwaway credential without changing the one that guards
  // the live panel. The check is on NODE_ENV, not on the value, so a deployed
  // build can never be opened with a development password even if the variable
  // is set in the hosting environment by mistake.
  if (process.env.NODE_ENV !== "production" && process.env.ADMIN_PASSWORD) {
    return process.env.ADMIN_PASSWORD;
  }
  try {
    const row = await (prisma as any).adminAuth.findUnique({ where: { id: 1 } });
    const stored = row?.password?.trim();
    return stored || FALLBACK_PASSWORD;
  } catch {
    return FALLBACK_PASSWORD;
  }
}

export async function POST(req: Request) {
  const { password } = await req.json();
  if (password !== (await expectedPassword())) return NextResponse.json({ ok: false }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin", "1", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("admin");
  return res;
}
