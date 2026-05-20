import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HITS = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 5 * 60 * 1000;
  const arr = (HITS.get(ip) ?? []).filter((t) => now - t < windowMs);
  arr.push(now);
  HITS.set(ip, arr);
  return arr.length > 5;
}

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const { slug } = await params;
  const form = await prisma.serviceForm.findUnique({
    where: { slug },
    include: { fields: { orderBy: [{ sort_order: "asc" }] } },
  });
  if (!form) return NextResponse.json({ error: "unknown form" }, { status: 404 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  for (const f of form.fields) {
    if (!f.required) continue;
    const v = (body as Record<string, unknown>)[f.key];
    if (v === undefined || v === null || (typeof v === "string" && v.trim() === "")) {
      return NextResponse.json({ error: `missing: ${f.key}` }, { status: 400 });
    }
  }

  const known = new Set(form.fields.map((f) => f.key));
  const payload: Record<string, unknown> = {};
  for (const k of known) payload[k] = (body as Record<string, unknown>)[k] ?? null;

  await prisma.serviceFormSubmission.create({
    data: { form_id: form.id, payload: payload as any },
  });

  return NextResponse.json({ ok: true });
}
