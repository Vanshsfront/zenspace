/**
 * Idempotent seed for Batch 2:
 *  - 3 ServiceForms + their default ServiceFormFields
 *  - Backfill EarringCategory rows from existing EarringOption rows
 *  - Set site_settings.aftercare_pdf to /assets/aftercare.pdf if currently NULL
 *
 * Safe to re-run. Run with: npx tsx scripts/seed-batch-2.ts
 */
import { config as loadEnv } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

loadEnv({ path: ".env.local" });
loadEnv();

const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL/DIRECT_URL not set");
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });

type FieldSeed = {
  key: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
  sort_order: number;
};

const COMMON: FieldSeed[] = [
  { key: "name",      label: "Name",            type: "text",     required: true,  sort_order: 1 },
  { key: "phone",     label: "Phone",           type: "tel",      required: true,  sort_order: 2 },
  { key: "reference", label: "Reference image", type: "file",     required: false, sort_order: 3 },
];

const FORMS: Array<{ slug: string; title: string; intro: string; extras: FieldSeed[] }> = [
  {
    slug: "custom-design",
    title: "Tell us about your custom design",
    intro: "A few details help us prep the right artist and time. We'll get back on WhatsApp.",
    extras: [
      { key: "idea",       label: "Idea description", type: "textarea", required: true,  sort_order: 4 },
      { key: "style",      label: "Style preference", type: "select",   required: false, sort_order: 5, options: ["Minimal", "Realistic", "Blackwork", "Colour", "Other"] },
      { key: "placement",  label: "Placement on body", type: "text",    required: false, sort_order: 6 },
      { key: "size",       label: "Approx size",       type: "text",    required: false, sort_order: 7 },
    ],
  },
  {
    slug: "cover-up",
    title: "Tell us about your cover-up",
    intro: "Send us a clear photo of the existing tattoo and what you'd like to cover it with.",
    extras: [
      { key: "current_photo", label: "Photo of existing tattoo",  type: "file",     required: true,  sort_order: 4 },
      { key: "cover_idea",    label: "What you'd like to cover with", type: "textarea", required: true, sort_order: 5 },
      { key: "placement",     label: "Placement on body",         type: "text",     required: false, sort_order: 6 },
    ],
  },
  {
    slug: "piercing",
    title: "Book your piercing",
    intro: "Tell us who it's for and what you'd like done — we'll confirm a slot.",
    extras: [
      { key: "piercing_type",  label: "Which piercing",   type: "select", required: true,  sort_order: 4, options: ["Ear lobe","Cartilage","Helix","Nose","Lip","Navel","Other"] },
      { key: "audience",       label: "For whom",         type: "select", required: true,  sort_order: 5, options: ["Kids","Adults"] },
      { key: "preferred_date", label: "Preferred date",   type: "date",   required: false, sort_order: 6 },
    ],
  },
];

async function seedServiceForms() {
  for (const f of FORMS) {
    const existing = await db.serviceForm.findUnique({ where: { slug: f.slug } });
    const form = existing
      ? await db.serviceForm.update({ where: { id: existing.id }, data: { title: f.title, intro: f.intro } })
      : await db.serviceForm.create({ data: { slug: f.slug, title: f.title, intro: f.intro } });
    const desired = [...COMMON, ...f.extras];
    for (const fd of desired) {
      await db.serviceFormField.upsert({
        where: { form_id_key: { form_id: form.id, key: fd.key } },
        create: { form_id: form.id, key: fd.key, label: fd.label, type: fd.type, required: !!fd.required, options: fd.options ?? [], sort_order: fd.sort_order },
        update: { label: fd.label, type: fd.type, required: !!fd.required, options: fd.options ?? [], sort_order: fd.sort_order },
      });
    }
  }
}

async function backfillEarringCategories() {
  const opts = await db.earringOption.findMany();
  for (const o of opts) {
    const slug = (o.metal || "").toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    if (!slug) continue;
    const existing = await db.earringCategory.findUnique({ where: { slug } });
    if (existing) continue;
    await db.earringCategory.create({
      data: {
        slug,
        name: o.metal || slug,
        audience: o.audience || "both",
        description: o.benefits ?? null,
        photo: o.photo ?? null,
        sort_order: o.sort_order ?? 0,
      },
    });
  }
}

async function setAftercarePdfDefault() {
  const s = await db.siteSettings.findUnique({ where: { id: 1 } });
  if (!s) return;
  if (s.aftercare_pdf) return;
  await db.siteSettings.update({ where: { id: 1 }, data: { aftercare_pdf: "/assets/aftercare.pdf" } });
}

async function main() {
  await seedServiceForms();
  await backfillEarringCategories();
  await setAftercarePdfDefault();
  console.log("[seed-batch-2] complete");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => db.$disconnect());
