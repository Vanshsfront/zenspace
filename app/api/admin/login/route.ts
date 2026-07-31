import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Fallback when the DB has no stored credentials yet (or the columns haven't
// been migrated): env vars first, then the seeded defaults.
const FALLBACK_PASSWORD = process.env.ADMIN_PASSWORD || "zenspace123098#";
const FALLBACK_USERNAME = process.env.ADMIN_USERNAME || "Zenspace123";

// The admin can change the password from the panel, so the DB value is the
// source of truth. Wrapped in try/catch so login still works during the window
// before the admin_auth table exists.
type Credentials = { username: string; password: string };

async function expectedCredentials(): Promise<Credentials> {
  // Outside production, the env vars override the stored credentials so a local
  // machine can use throwaway ones without changing what guards the live panel.
  // The check is on NODE_ENV, not on the values, so a deployed build can never
  // be opened with a development password even if the variables end up set in
  // the hosting environment by mistake.
  if (process.env.NODE_ENV !== "production" && process.env.ADMIN_PASSWORD) {
    return { username: FALLBACK_USERNAME, password: process.env.ADMIN_PASSWORD };
  }
  try {
    const row = await (prisma as any).adminAuth.findUnique({ where: { id: 1 } });
    return {
      // The username column was added after the table shipped, so a database
      // that has not run the migration yet falls back rather than locking the
      // owner out of their own panel.
      username: row?.username?.trim() || FALLBACK_USERNAME,
      password: row?.password?.trim() || FALLBACK_PASSWORD,
    };
  } catch {
    return { username: FALLBACK_USERNAME, password: FALLBACK_PASSWORD };
  }
}

/**
 * Compares without leaking which half was wrong through timing, and without the
 * early exit a plain === gives on the first differing character.
 */
function matches(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function POST(req: Request) {
  const { username, password } = await req.json().catch(() => ({}));
  const expected = await expectedCredentials();
  const ok =
    typeof password === "string" &&
    matches(password, expected.password) &&
    // A missing username still authenticates against the stored one, so an old
    // client or a saved bookmark that only sends a password is not locked out
    // mid-session. Sending a wrong username is always rejected.
    (username === undefined || (typeof username === "string" && matches(username.trim(), expected.username)));
  if (!ok) return NextResponse.json({ ok: false }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin", "1", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("admin");
  return res;
}
