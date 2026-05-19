import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createServiceClient } from "@/lib/supabase/server";

const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8 MB

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form submission" }, { status: 400 });
  }

  const name = String(form.get("name") || "").trim();
  const phone = String(form.get("phone") || "").trim();
  const email = String(form.get("email") || "").trim();
  const description = String(form.get("description") || "").trim();

  if (!name || !phone || !description) {
    return NextResponse.json({ error: "Name, phone and description are required" }, { status: 400 });
  }

  let reference: string | null = null;
  const file = form.get("reference") as File | null;
  if (file && file.size > 0) {
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Reference must be an image" }, { status: 400 });
    }
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: "Reference image is too large (max 8 MB)" }, { status: 400 });
    }
    try {
      const sb = createServiceClient();
      const path = `custom-requests/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
      const buf = Buffer.from(await file.arrayBuffer());
      const { error } = await sb.storage.from("media").upload(path, buf, { contentType: file.type, upsert: false });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      reference = sb.storage.from("media").getPublicUrl(path).data.publicUrl;
    } catch (e: any) {
      return NextResponse.json({ error: e?.message || "Upload failed" }, { status: 500 });
    }
  }

  try {
    await (prisma as any).customRequest.create({
      data: { name, phone, email: email || null, description, reference },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Could not save your request" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
