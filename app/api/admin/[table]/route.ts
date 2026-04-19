import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase/server";

const ALLOWED = new Set(["site_settings", "artists", "categories", "studio_photos", "reviews", "portfolio_items"]);

async function guard() {
  const c = await cookies();
  return c.get("admin")?.value === "1";
}

export async function GET(_: Request, ctx: { params: Promise<{ table: string }> }) {
  if (!(await guard())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { table } = await ctx.params;
  if (!ALLOWED.has(table)) return NextResponse.json({ error: "bad table" }, { status: 400 });
  const sb = createServiceClient();
  const { data, error } = await sb.from(table).select("*").order(table === "site_settings" ? "id" : "sort_order");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request, ctx: { params: Promise<{ table: string }> }) {
  if (!(await guard())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { table } = await ctx.params;
  if (!ALLOWED.has(table)) return NextResponse.json({ error: "bad table" }, { status: 400 });
  const body = await req.json();
  const sb = createServiceClient();
  const { data, error } = await sb.from(table).insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: Request, ctx: { params: Promise<{ table: string }> }) {
  if (!(await guard())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { table } = await ctx.params;
  if (!ALLOWED.has(table)) return NextResponse.json({ error: "bad table" }, { status: 400 });
  const { id, ...patch } = await req.json();
  const sb = createServiceClient();
  const { data, error } = await sb.from(table).update(patch).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: Request, ctx: { params: Promise<{ table: string }> }) {
  if (!(await guard())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { table } = await ctx.params;
  if (!ALLOWED.has(table)) return NextResponse.json({ error: "bad table" }, { status: 400 });
  const { id } = await req.json();
  const sb = createServiceClient();
  const { error } = await sb.from(table).delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
