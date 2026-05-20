import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidateTag, revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { TAGS } from "@/lib/data";

const TABLE_TAGS: Record<string, string> = {
  site_settings: TAGS.settings,
  artists: TAGS.artists,
  categories: TAGS.categories,
  category_photos: TAGS.categories,
  studio_photos: TAGS.studio,
  piercing_photos: TAGS.piercing,
  reviews: TAGS.reviews,
  portfolio_items: TAGS.artists,
  short_videos: TAGS.shortVideos,
  earring_options: TAGS.earringOptions,
  earring_categories: TAGS.earrings,
  earring_products: TAGS.earrings,
  custom_requests: TAGS.customRequests,
  service_forms: TAGS.serviceForms,
  service_form_fields: TAGS.serviceForms,
  safety_items: TAGS.safety,
};

function bust(table: string) {
  const tag = TABLE_TAGS[table];
  // expire: 0 — admin wants immediate read-your-own-writes after edits
  if (tag) revalidateTag(tag, { expire: 0 });
  // Also revalidate paths so the [slug] dynamic routes & list pages re-render
  // for visitors immediately (without this, freshly added categories/artists
  // would only appear after the unstable_cache revalidate window).
  if (table === "categories") {
    revalidatePath("/category");
    revalidatePath("/category/[slug]", "page");
    revalidatePath("/", "layout");
  }
  if (table === "artists") {
    revalidatePath("/our-artist");
    revalidatePath("/our-artist/[slug]", "page");
    revalidatePath("/", "layout");
  }
  if (table === "category_photos") {
    revalidatePath("/category/[slug]", "page");
  }
  if (table === "portfolio_items") {
    revalidatePath("/our-artist/[slug]", "page");
  }
  if (table === "studio_photos" || table === "reviews" || table === "site_settings") {
    revalidatePath("/", "layout");
    revalidatePath("/");
  }
  if (table === "studio_photos" || table === "site_settings") {
    revalidatePath("/about");
  }
  if (table === "piercing_photos" || table === "earring_options" || table === "site_settings") {
    revalidatePath("/piercing");
    revalidatePath("/piercing/kids");
    revalidatePath("/piercing/adults");
  }
  if (table === "earring_categories" || table === "earring_products") {
    revalidateTag("earrings", { expire: 0 });
    revalidatePath("/piercing/kids");
    revalidatePath("/piercing/adults");
    revalidatePath("/piercing/earrings/[slug]", "page");
  }
  if (table === "safety_items") {
    revalidateTag("safety", { expire: 0 });
    revalidatePath("/piercing/kids");
    revalidatePath("/piercing/adults");
  }
  if (table === "short_videos") {
    revalidatePath("/");
  }
  if (table === "site_settings") {
    revalidatePath("/about");
  }
}

type ModelKey =
  | "site_settings"
  | "artists"
  | "categories"
  | "category_photos"
  | "studio_photos"
  | "piercing_photos"
  | "reviews"
  | "portfolio_items"
  | "short_videos"
  | "earring_options"
  | "earring_categories"
  | "earring_products"
  | "custom_requests"
  | "service_forms"
  | "service_form_fields"
  | "service_form_submissions"
  | "safety_items";

const MODELS: Record<ModelKey, { delegate: string; orderBy: any }> = {
  site_settings:      { delegate: "siteSettings",     orderBy: { id: "asc" } },
  artists:            { delegate: "artist",           orderBy: [{ sort_order: "asc" }, { name: "asc" }] },
  categories:         { delegate: "category",         orderBy: [{ sort_order: "asc" }, { name: "asc" }] },
  category_photos:    { delegate: "categoryPhoto",    orderBy: { sort_order: "asc" } },
  studio_photos:      { delegate: "studioPhoto",      orderBy: { sort_order: "asc" } },
  piercing_photos:    { delegate: "piercingPhoto",    orderBy: { sort_order: "asc" } },
  reviews:            { delegate: "review",           orderBy: { sort_order: "asc" } },
  portfolio_items:    { delegate: "portfolioItem",    orderBy: { sort_order: "asc" } },
  short_videos:       { delegate: "shortVideo",       orderBy: { sort_order: "asc" } },
  earring_options:    { delegate: "earringOption",    orderBy: { sort_order: "asc" } },
  earring_categories: { delegate: "earringCategory", orderBy: [{ sort_order: "asc" }, { name: "asc" }] },
  earring_products:   { delegate: "earringProduct",  orderBy: [{ sort_order: "asc" }, { name: "asc" }] },
  custom_requests:    { delegate: "customRequest",    orderBy: { created_at: "desc" } },
  service_forms:           { delegate: "serviceForm",           orderBy: [{ sort_order: "asc" }, { title: "asc" }] },
  service_form_fields:     { delegate: "serviceFormField",      orderBy: { sort_order: "asc" } },
  service_form_submissions:{ delegate: "serviceFormSubmission", orderBy: { created_at: "desc" } },
  safety_items:       { delegate: "safetyItem",       orderBy: { sort_order: "asc" } },
};

function isModelKey(t: string): t is ModelKey {
  return Object.prototype.hasOwnProperty.call(MODELS, t);
}

async function guard() {
  const c = await cookies();
  return c.get("admin")?.value === "1";
}

function model(table: ModelKey) {
  return (prisma as any)[MODELS[table].delegate];
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// Strip blank strings to null so unique columns (slug) don't collide on "".
function normalizeBody(table: ModelKey, body: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = { ...body };
  for (const k of Object.keys(out)) {
    if (typeof out[k] === "string" && out[k].trim() === "") out[k] = null;
  }
  // Auto-derive a slug from name when the admin didn't provide one — both for
  // create and patch. Ensures /category/[slug] and /our-artist/[slug] resolve.
  if ((table === "categories" || table === "artists" || table === "earring_categories") && !out.slug && typeof out.name === "string") {
    out.slug = slugify(out.name);
  }
  // The admin field UI types primitive strings. service_form_fields has
  // String[] (options) and Boolean (required) and Int (sort_order) columns
  // that Prisma rejects when handed a raw string — coerce here.
  if (table === "service_form_fields") {
    if (typeof out.options === "string") {
      out.options = out.options.split(",").map((s: string) => s.trim()).filter(Boolean);
    } else if (!Array.isArray(out.options)) {
      // Don't clobber an absent key on PATCH — only fill on create-time inputs
      // where the form sent something non-string-non-array. Leaving undefined
      // lets Prisma keep the existing value on update.
      if (out.options !== undefined) out.options = [];
    }
    if (typeof out.required === "string") {
      out.required = out.required.trim().toLowerCase() === "true";
    } else if (out.required === null) {
      // normalizeBody above blanks "" → null, but Prisma's Boolean column is
      // non-nullable. Coerce back to false. Leave undefined alone so PATCH
      // requests that omit the key keep the existing row value.
      out.required = false;
    }
    if (typeof out.sort_order === "string") {
      const n = Number(out.sort_order);
      out.sort_order = Number.isFinite(n) ? n : 0;
    }
  }
  return out;
}

// site_settings is a single row — clients PATCH it without an id and we coerce
function normalizeSettingsBody(body: any) {
  const { id: _id, ...rest } = body;
  return rest;
}

function searchFilter(table: ModelKey, q: string): any {
  const fields: Record<ModelKey, string[]> = {
    site_settings: [],
    artists: ["name", "role", "specialty"],
    categories: ["name", "slug"],
    category_photos: ["caption"],
    studio_photos: ["caption"],
    piercing_photos: ["caption"],
    reviews: ["client_name", "review"],
    portfolio_items: ["title"],
    short_videos: ["caption"],
    earring_options: ["audience", "metal", "benefits"],
    earring_categories: ["name", "slug", "audience", "description"],
    earring_products: ["name", "description"],
    custom_requests: ["name", "phone", "email", "description"],
    service_forms: ["slug", "title", "intro"],
    service_form_fields: ["key", "label", "type"],
    service_form_submissions: ["status"],
    safety_items: ["title"],
  };
  const cols = fields[table];
  if (!cols.length) return undefined;
  return { OR: cols.map((c) => ({ [c]: { contains: q, mode: "insensitive" } })) };
}

function friendlyError(table: ModelKey, e: any): string {
  // Prisma unique-constraint violation
  if (e?.code === "P2002") {
    const field = Array.isArray(e?.meta?.target) ? e.meta.target.join(", ") : (e?.meta?.target || "value");
    if (String(field).includes("slug")) {
      const label = table === "categories" ? "category" : table === "earring_categories" ? "earring category" : "record";
      return `A ${label} with that slug already exists. Pick another slug.`;
    }
    return `Duplicate ${field}.`;
  }
  return e?.message || "Request failed";
}

export async function GET(req: Request, ctx: { params: Promise<{ table: string }> }) {
  if (!(await guard())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { table } = await ctx.params;
  if (!isModelKey(table)) return NextResponse.json({ error: "bad table" }, { status: 400 });

  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim();
  const where = q ? searchFilter(table, q) : undefined;

  try {
    const data = await model(table).findMany({ where, orderBy: MODELS[table].orderBy });
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: friendlyError(table, e) }, { status: 500 });
  }
}

export async function POST(req: Request, ctx: { params: Promise<{ table: string }> }) {
  if (!(await guard())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { table } = await ctx.params;
  if (!isModelKey(table)) return NextResponse.json({ error: "bad table" }, { status: 400 });
  const body = await req.json();

  try {
    if (table === "site_settings") {
      // Upsert the singleton row.
      const data = normalizeSettingsBody(body);
      const row = await (prisma as any).siteSettings.upsert({
        where: { id: 1 },
        create: { id: 1, ...data },
        update: data,
      });
      bust(table);
      return NextResponse.json(row);
    }
    const data = normalizeBody(table, body);
    const row = await model(table).create({ data });
    bust(table);
    return NextResponse.json(row);
  } catch (e: any) {
    return NextResponse.json({ error: friendlyError(table, e) }, { status: 400 });
  }
}

export async function PATCH(req: Request, ctx: { params: Promise<{ table: string }> }) {
  if (!(await guard())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { table } = await ctx.params;
  if (!isModelKey(table)) return NextResponse.json({ error: "bad table" }, { status: 400 });
  const body = await req.json();

  try {
    if (table === "site_settings") {
      const data = normalizeSettingsBody(body);
      const row = await (prisma as any).siteSettings.upsert({
        where: { id: 1 },
        create: { id: 1, ...data },
        update: data,
      });
      bust(table);
      return NextResponse.json(row);
    }
    const { id, ...patch } = body;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const data = normalizeBody(table, patch);
    const row = await model(table).update({ where: { id }, data });
    bust(table);
    return NextResponse.json(row);
  } catch (e: any) {
    return NextResponse.json({ error: friendlyError(table, e) }, { status: 400 });
  }
}

export async function DELETE(req: Request, ctx: { params: Promise<{ table: string }> }) {
  if (!(await guard())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { table } = await ctx.params;
  if (!isModelKey(table)) return NextResponse.json({ error: "bad table" }, { status: 400 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  try {
    await model(table).delete({ where: { id } });
    bust(table);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: friendlyError(table, e) }, { status: 400 });
  }
}
