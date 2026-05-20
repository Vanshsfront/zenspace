/**
 * Seeds local photos (already copied to /public/assets/photos at their original
 * resolution) into the DB so the home page, studio gallery, piercing gallery,
 * artists, categories and reviews all show real images.
 *
 * Run with:  npx tsx prisma/seed.ts
 */
import { config as loadEnv } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

loadEnv({ path: ".env.local" });
loadEnv();

const STUDIO = "/assets/photos/studio-1.png";
const TATTOOS = [
  "/assets/photos/tattoo-1.jpeg",
  "/assets/photos/tattoo-2.jpeg",
  "/assets/photos/tattoo-3.jpeg",
  "/assets/photos/tattoo-4.jpeg",
  "/assets/photos/tattoo-5.jpeg",
  "/assets/photos/tattoo-6.jpeg",
  "/assets/photos/tattoo-7.jpeg",
];

const WHATSAPP = "+917208388209";

function pick(i: number) {
  return TATTOOS[i % TATTOOS.length];
}

async function main() {
  const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL/DIRECT_URL not set");
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });

  // 1) Site settings: hero image + whatsapp number.
  const heroImage = pick(0);
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: { id: 1, hero_image: heroImage, whatsapp: WHATSAPP },
    update: { hero_image: heroImage, whatsapp: WHATSAPP },
  });
  console.log("✓ site_settings hero_image + whatsapp");

  // 2) Studio photo — only seed if none exist.
  const studioCount = await prisma.studioPhoto.count();
  if (studioCount === 0) {
    await prisma.studioPhoto.create({
      data: { photo: STUDIO, caption: "Inside Zenspace", sort_order: 0 },
    });
    // also add a couple of tattoo shots so the marquee feels populated
    for (let i = 0; i < 4; i++) {
      await prisma.studioPhoto.create({
        data: { photo: pick(i + 1), caption: null, sort_order: i + 1 },
      });
    }
    console.log("✓ studio_photos seeded");
  } else {
    console.log("• studio_photos already seeded — skipped");
  }

  // 3) Piercing photos — only seed if none exist.
  const piercingCount = await prisma.piercingPhoto.count();
  if (piercingCount === 0) {
    for (let i = 0; i < 6; i++) {
      await prisma.piercingPhoto.create({
        data: { photo: pick(i + 2), sort_order: i },
      });
    }
    console.log("✓ piercing_photos seeded");
  } else {
    console.log("• piercing_photos already seeded — skipped");
  }

  // 4) Backfill any artist / category / category_photo / review with no photo.
  const artists = await prisma.artist.findMany({ where: { photo: null } });
  for (let i = 0; i < artists.length; i++) {
    await prisma.artist.update({ where: { id: artists[i].id }, data: { photo: pick(i) } });
  }
  if (artists.length) console.log(`✓ filled photo on ${artists.length} artist(s)`);

  const cats = await prisma.category.findMany({ where: { photo: null } });
  for (let i = 0; i < cats.length; i++) {
    await prisma.category.update({ where: { id: cats[i].id }, data: { photo: pick(i + 3) } });
  }
  if (cats.length) console.log(`✓ filled photo on ${cats.length} categor(ies)`);

  const reviews = await prisma.review.findMany({ where: { photo: "" } });
  for (let i = 0; i < reviews.length; i++) {
    await prisma.review.update({ where: { id: reviews[i].id }, data: { photo: pick(i + 5) } });
  }
  if (reviews.length) console.log(`✓ filled photo on ${reviews.length} review(s)`);

  // 5) Earring options — 3 metals × kids/adults. Only seed if none exist.
  const earringCount = await prisma.earringOption.count();
  if (earringCount === 0) {
    const METALS = [
      {
        metal: "Stainless Steel",
        kids: "Implant-grade surgical stainless steel, hypoallergenic and gentle on delicate young skin. Ideal for a first piercing.",
        adults: "Durable, low-maintenance surgical stainless steel that keeps its shine and resists everyday wear.",
      },
      {
        metal: "Gold",
        kids: "Skin-friendly solid gold studs, soft, non-reactive and a beautiful keepsake for your child's first piercing.",
        adults: "Solid gold for a warm, premium finish that ages gracefully and suits every outfit.",
      },
      {
        metal: "Silver",
        kids: "Lightweight sterling silver, gentle for little ears with a classic, understated sparkle.",
        adults: "Bright sterling silver, a versatile, timeless choice for any style.",
      },
    ];
    for (let i = 0; i < METALS.length; i++) {
      const m = METALS[i];
      await prisma.earringOption.create({
        data: { audience: "kids", metal: m.metal, benefits: m.kids, photo: pick(i + 2), sort_order: i },
      });
      await prisma.earringOption.create({
        data: { audience: "adults", metal: m.metal, benefits: m.adults, photo: pick(i + 4), sort_order: i },
      });
    }
    console.log("✓ earring_options seeded");
  } else {
    console.log("• earring_options already seeded — skipped");
  }

  await prisma.$disconnect();
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
