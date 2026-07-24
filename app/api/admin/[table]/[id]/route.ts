import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const MODELS: Record<string, string> = {
  site_settings: "siteSettings",
  artists: "artist",
  categories: "category",
  category_photos: "categoryPhoto",
  studio_photos: "studioPhoto",
  piercing_photos: "piercingPhoto",
  reviews: "review",
  portfolio_items: "portfolioItem",
  short_videos: "shortVideo",
  earring_options: "earringOption",
  earring_categories: "earringCategory",
  earring_products: "earringProduct",
  custom_requests: "customRequest",
  service_forms: "serviceForm",
  service_form_fields: "serviceFormField",
  service_form_submissions: "serviceFormSubmission",
  safety_items: "safetyItem",
  blog_posts: "blogPost",
  legal_pages: "legalPage",
};

async function guard() {
  const c = await cookies();
  return c.get("admin")?.value === "1";
}

export async function GET(_: Request, ctx: { params: Promise<{ table: string; id: string }> }) {
  if (!(await guard())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { table, id } = await ctx.params;
  const delegate = MODELS[table];
  if (!delegate) return NextResponse.json({ error: "bad table" }, { status: 400 });
  try {
    const row = await (prisma as any)[delegate].findUnique({ where: { id } });
    if (!row) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json(row);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "query failed" }, { status: 500 });
  }
}
