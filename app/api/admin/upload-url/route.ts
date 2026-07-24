import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase/server";

// Mints a short-lived signed upload URL so the browser can PUT the file
// straight to Supabase Storage — bypassing the ~4.5MB serverless body limit
// that broke large photo + video uploads.
export async function POST(req: Request) {
  const c = await cookies();
  if (c.get("admin")?.value !== "1") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { filename } = await req.json().catch(() => ({}));
  if (!filename || typeof filename !== "string") {
    return NextResponse.json({ error: "filename required" }, { status: 400 });
  }
  const safe = filename.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const path = `${Date.now()}-${safe}`;
  const sb = createServiceClient();
  const { data, error } = await sb.storage.from("media").createSignedUploadUrl(path);
  if (error || !data) {
    return NextResponse.json({ error: error?.message || "could not sign upload" }, { status: 500 });
  }
  const { data: pub } = sb.storage.from("media").getPublicUrl(path);
  return NextResponse.json({ path: data.path, token: data.token, publicUrl: pub.publicUrl });
}
