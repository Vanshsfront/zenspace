import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Tells the browser whether the current visitor is signed in as admin.
 *
 * The public site can't answer this itself: calling cookies() in a (site) page
 * or layout would opt every route into dynamic rendering and throw away the ISR
 * model. So the pages stay static and the editor asks here instead — and only
 * ever after the URL has ?edit=1, so ordinary visitors never make this request.
 */
export async function GET() {
  try {
    const c = await cookies();
    // Same check as guard() in app/api/admin/[table]/route.ts. The cookie is
    // httpOnly, so this endpoint is the only way client JS can learn the answer.
    return NextResponse.json(
      { admin: c.get("admin")?.value === "1" },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    // Never 500. A failure here should read as "not an admin" and leave the
    // visitor with the normal page, not with a broken request in the console.
    return NextResponse.json({ admin: false }, { headers: { "Cache-Control": "no-store" } });
  }
}
