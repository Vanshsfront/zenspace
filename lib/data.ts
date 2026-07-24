import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

/**
 * Public read tags. The admin write routes call revalidateTag(<tag>) after any
 * insert/update/delete, so edits show up on the public site within one request
 * without taking the latency hit of a fresh DB round-trip on every visitor.
 */
export const TAGS = {
  settings: "site_settings",
  artists: "artists",
  artist: (slug: string) => `artist:${slug}`,
  categories: "categories",
  category: (slug: string) => `category:${slug}`,
  studio: "studio_photos",
  piercing: "piercing_photos",
  reviews: "reviews",
  shortVideos: "short_videos",
  earringOptions: "earring_options",
  earrings: "earrings",
  customRequests: "custom_requests",
  serviceForms: "service-forms",
  safety: "safety",
} as const;

export type SiteSettings = {
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_description: string | null;
  hero_image: string | null;
  hero_video: string | null;
  home_piercing_kids_image: string | null;
  home_piercing_adults_image: string | null;
  cta_title: string | null;
  cta_subtitle: string | null;
  address: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  instagram: string | null;
  facebook: string | null;
  pinterest: string | null;
  piercing_title: string | null;
  piercing_intro: string | null;
  piercing_baby_blurb: string | null;
  aftercare_pdf: string | null;
  piercing_kids_title: string | null;
  piercing_kids_intro: string | null;
  piercing_adults_title: string | null;
  piercing_adults_intro: string | null;
  about_title: string | null;
  about_heading: string | null;
  about_body: string | null;
  about_photo_1: string | null;
  about_photo_2: string | null;
  google_review_count: number | null;
  google_reviews_url: string | null;
};

export type Artist = {
  id: string;
  name: string;
  slug: string | null;
  role: string | null;
  photo: string | null;
  portfolio_url: string | null;
  experience: string | null;
  specialty: string | null;
  bio: string | null;
};

export type Category = { id: string; name: string; slug: string | null; photo: string | null; description: string | null };
export type CategoryPhoto = { id: string; category_id: string | null; photo: string; caption: string | null };
export type StudioPhoto = { id: string; photo: string; caption: string | null };
export type PiercingPhoto = { id: string; photo: string; caption: string | null };
export type Review = { id: string; client_name: string; photo: string | null; video: string | null; review: string | null; rating: number | null };
export type ShortVideo = { id: string; video: string; poster: string | null; caption: string | null };
export type EarringOption = { id: string; audience: string; metal: string; photo: string | null; benefits: string | null };
export type CustomRequest = { id: string; name: string; phone: string; email: string | null; description: string; reference: string | null; created_at: string | null };
export type PortfolioItem = { id: string; artist_id: string | null; photo: string; title: string | null };

export type ArtistWithPortfolio = Artist & { portfolio: PortfolioItem[] };
export type CategoryWithPhotos = Category & { photos: CategoryPhoto[] };

/**
 * Race a query against a 5s timeout so a stuck pgbouncer connection bails out
 * with the fallback instead of hanging the page render. We rely on the
 * outer revalidateTag call for cache freshness; serving an empty fallback
 * for one request is preferable to an infinite-loading page.
 *
 * The thunk-style API (rather than `Promise<T>`) means timeout cancellation
 * doesn't fire the pending DB call — it just resolves the race. The DB
 * call still runs to completion in the background; that's fine.
 */
const QUERY_TIMEOUT_MS = 5000;
async function withTimeout<T>(run: () => Promise<T>, fallback: T): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallback), QUERY_TIMEOUT_MS);
  });
  try {
    const result = await Promise.race([run().catch(() => fallback), timeout]);
    return result;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

// `prisma as any` keeps this file building cleanly even when `prisma generate`
// hasn't run yet (e.g. on first Vercel install before the postinstall hook
// completes). The runtime types are still correct because the Prisma adapter
// returns the row shape regardless.
const db = prisma as any;

export const getSiteSettings = unstable_cache(
  async (): Promise<SiteSettings | null> => {
    return withTimeout<SiteSettings | null>(
      async () => (await db.siteSettings.findUnique({ where: { id: 1 } })) as SiteSettings | null,
      null,
    );
  },
  ["site_settings"],
  { tags: [TAGS.settings], revalidate: 3600 }
);

export const getArtists = unstable_cache(
  async (): Promise<Artist[]> => {
    return withTimeout<Artist[]>(
      async () =>
        (await db.artist.findMany({
          orderBy: [{ sort_order: "asc" }, { name: "asc" }],
        })) as Artist[],
      [],
    );
  },
  ["artists"],
  { tags: [TAGS.artists], revalidate: 3600 }
);

const _artistBySlug = unstable_cache(
  async (slug: string): Promise<ArtistWithPortfolio | null> => {
    return withTimeout<ArtistWithPortfolio | null>(
      async () =>
        (await db.artist.findFirst({
          where: { slug },
          include: { portfolio: { orderBy: { sort_order: "asc" } } },
        })) as ArtistWithPortfolio | null,
      null,
    );
  },
  ["artist_by_slug"],
  { tags: [TAGS.artists], revalidate: 3600 }
);
export const getArtistBySlug = (slug: string) => _artistBySlug(slug);

export const getCategories = unstable_cache(
  async (): Promise<Category[]> => {
    return withTimeout<Category[]>(
      async () =>
        (await db.category.findMany({
          orderBy: [{ sort_order: "asc" }, { name: "asc" }],
        })) as Category[],
      [],
    );
  },
  ["categories"],
  { tags: [TAGS.categories], revalidate: 3600 }
);

const _categoryBySlug = unstable_cache(
  async (slug: string): Promise<CategoryWithPhotos | null> => {
    return withTimeout<CategoryWithPhotos | null>(
      async () =>
        (await db.category.findFirst({
          where: { slug },
          include: { photos: { orderBy: { sort_order: "asc" } } },
        })) as CategoryWithPhotos | null,
      null,
    );
  },
  ["category_by_slug"],
  { tags: [TAGS.categories], revalidate: 3600 }
);
export const getCategoryWithPhotos = (slug: string) => _categoryBySlug(slug);

export const getStudioPhotos = unstable_cache(
  async (): Promise<StudioPhoto[]> => {
    return withTimeout<StudioPhoto[]>(
      async () =>
        (await db.studioPhoto.findMany({ orderBy: { sort_order: "asc" } })) as StudioPhoto[],
      [],
    );
  },
  ["studio_photos"],
  { tags: [TAGS.studio], revalidate: 3600 }
);

export const getPiercingPhotos = unstable_cache(
  async (): Promise<PiercingPhoto[]> => {
    return withTimeout<PiercingPhoto[]>(
      async () =>
        (await db.piercingPhoto.findMany({ orderBy: { sort_order: "asc" } })) as PiercingPhoto[],
      [],
    );
  },
  ["piercing_photos"],
  { tags: [TAGS.piercing], revalidate: 3600 }
);

export const getReviews = unstable_cache(
  async (): Promise<Review[]> => {
    return withTimeout<Review[]>(
      async () =>
        (await db.review.findMany({ orderBy: { sort_order: "asc" } })) as Review[],
      [],
    );
  },
  ["reviews"],
  { tags: [TAGS.reviews], revalidate: 3600 }
);

export const getShortVideos = unstable_cache(
  async (): Promise<ShortVideo[]> => {
    return withTimeout<ShortVideo[]>(
      async () =>
        (await db.shortVideo.findMany({ orderBy: { sort_order: "asc" } })) as ShortVideo[],
      [],
    );
  },
  ["short_videos"],
  { tags: [TAGS.shortVideos], revalidate: 3600 }
);

const _earringOptions = unstable_cache(
  async (audience: string): Promise<EarringOption[]> => {
    return withTimeout<EarringOption[]>(
      async () =>
        (await db.earringOption.findMany({
          where: { audience },
          orderBy: { sort_order: "asc" },
        })) as EarringOption[],
      [],
    );
  },
  ["earring_options"],
  { tags: [TAGS.earringOptions], revalidate: 3600 }
);
export const getEarringOptions = (audience: "kids" | "adults") => _earringOptions(audience);

export type EarringCategoryRow = {
  id: string;
  slug: string;
  name: string;
  audience: string;
  description: string | null;
  photo: string | null;
  sort_order: number | null;
};
export type EarringProductRow = {
  id: string;
  category_id: string;
  name: string;
  photo: string | null;
  price_inr: number | null;
  description: string | null;
  sort_order: number | null;
};

export const getEarringCategories = unstable_cache(
  async (audience: "kids" | "adults"): Promise<EarringCategoryRow[]> => {
    return withTimeout<EarringCategoryRow[]>(
      async () => (await db.earringCategory.findMany({
        where: { audience: { in: [audience, "both"] } },
        orderBy: [{ sort_order: "asc" }, { name: "asc" }],
      })) as EarringCategoryRow[],
      [],
    );
  },
  ["earring_categories_by_audience"],
  { tags: [TAGS.earrings], revalidate: 3600 },
);

export const getEarringCategoryWithProducts = unstable_cache(
  async (slug: string): Promise<{ category: EarringCategoryRow; products: EarringProductRow[] } | null> => {
    return withTimeout<{ category: EarringCategoryRow; products: EarringProductRow[] } | null>(
      async () => {
        const cat = await db.earringCategory.findUnique({ where: { slug } });
        if (!cat) return null;
        const products = await db.earringProduct.findMany({
          where: { category_id: cat.id },
          orderBy: [{ sort_order: "asc" }, { name: "asc" }],
        });
        return { category: cat as EarringCategoryRow, products: products as EarringProductRow[] };
      },
      null,
    );
  },
  ["earring_category_with_products"],
  { tags: [TAGS.earrings], revalidate: 3600 },
);

export type ServiceFormFieldRow = {
  id: string;
  key: string;
  label: string;
  type: string;
  required: boolean;
  options: string[];
  sort_order: number | null;
};
export type ServiceFormRow = {
  id: string;
  slug: string;
  title: string;
  intro: string | null;
  fields: ServiceFormFieldRow[];
};

export const getServiceForm = unstable_cache(
  async (slug: string): Promise<ServiceFormRow | null> => {
    return withTimeout<ServiceFormRow | null>(
      async () => {
        const f = await db.serviceForm.findUnique({
          where: { slug },
          include: { fields: { orderBy: [{ sort_order: "asc" }] } },
        });
        return (f as unknown as ServiceFormRow) ?? null;
      },
      null,
    );
  },
  ["service_form_by_slug"],
  { tags: [TAGS.serviceForms], revalidate: 3600 },
);

export type SafetyItemRow = {
  id: string;
  audience: string;
  title: string;
  body: string;
  photo: string | null;
  sort_order: number | null;
};

export const getSafetyItems = unstable_cache(
  async (audience: "kids" | "adults"): Promise<SafetyItemRow[]> => {
    return withTimeout<SafetyItemRow[]>(
      async () => (await db.safetyItem.findMany({
        where: { audience: { in: [audience, "both"] } },
        orderBy: [{ sort_order: "asc" }],
      })) as SafetyItemRow[],
      [],
    );
  },
  ["safety_items_by_audience"],
  { tags: [TAGS.safety], revalidate: 3600 },
);
