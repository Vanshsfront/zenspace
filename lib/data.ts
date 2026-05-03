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
} as const;

export type SiteSettings = {
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_description: string | null;
  hero_image: string | null;
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
export type Review = { id: string; client_name: string; photo: string; review: string | null; rating: number | null };
export type PortfolioItem = { id: string; artist_id: string | null; photo: string; title: string | null };

/**
 * Wrap any DB query so a stuck pgbouncer connection bails out instead of hanging
 * the whole render. With revalidateTag's stale-while-revalidate, an empty fallback
 * is preferable to an infinite-loading page on a flaky cold start.
 */
const QUERY_TIMEOUT_MS = 5000;
async function withTimeout<T>(p: Promise<T>, fallback: T): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const t = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallback), QUERY_TIMEOUT_MS);
  });
  try {
    return await Promise.race([p, t]);
  } catch {
    return fallback;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export const getSiteSettings = unstable_cache(
  async (): Promise<SiteSettings | null> => {
    return withTimeout(
      prisma.siteSettings.findUnique({ where: { id: 1 } }).then((r) => r as SiteSettings | null).catch(() => null),
      null,
    );
  },
  ["site_settings"],
  { tags: [TAGS.settings], revalidate: 3600 }
);

export const getArtists = unstable_cache(
  async (): Promise<Artist[]> => {
    return withTimeout(
      prisma.artist.findMany({ orderBy: [{ sort_order: "asc" }, { name: "asc" }] }).then((r) => r as Artist[]).catch(() => [] as Artist[]),
      [] as Artist[],
    );
  },
  ["artists"],
  { tags: [TAGS.artists], revalidate: 3600 }
);

const _artistBySlug = unstable_cache(
  async (slug: string) => {
    return withTimeout(
      prisma.artist
        .findFirst({
          where: { slug },
          include: { portfolio: { orderBy: { sort_order: "asc" } } },
        })
        .catch(() => null),
      null,
    );
  },
  ["artist_by_slug"],
  { tags: [TAGS.artists], revalidate: 3600 }
);
export const getArtistBySlug = (slug: string) => _artistBySlug(slug);

export const getCategories = unstable_cache(
  async (): Promise<Category[]> => {
    return withTimeout(
      prisma.category.findMany({ orderBy: [{ sort_order: "asc" }, { name: "asc" }] }).then((r) => r as Category[]).catch(() => [] as Category[]),
      [] as Category[],
    );
  },
  ["categories"],
  { tags: [TAGS.categories], revalidate: 3600 }
);

const _categoryBySlug = unstable_cache(
  async (slug: string) => {
    return withTimeout(
      prisma.category
        .findFirst({
          where: { slug },
          include: { photos: { orderBy: { sort_order: "asc" } } },
        })
        .catch(() => null),
      null,
    );
  },
  ["category_by_slug"],
  { tags: [TAGS.categories], revalidate: 3600 }
);
export const getCategoryWithPhotos = (slug: string) => _categoryBySlug(slug);

export const getStudioPhotos = unstable_cache(
  async (): Promise<StudioPhoto[]> => {
    return withTimeout(
      prisma.studioPhoto.findMany({ orderBy: { sort_order: "asc" } }).then((r) => r as StudioPhoto[]).catch(() => [] as StudioPhoto[]),
      [] as StudioPhoto[],
    );
  },
  ["studio_photos"],
  { tags: [TAGS.studio], revalidate: 3600 }
);

export const getPiercingPhotos = unstable_cache(
  async (): Promise<PiercingPhoto[]> => {
    return withTimeout(
      prisma.piercingPhoto.findMany({ orderBy: { sort_order: "asc" } }).then((r) => r as PiercingPhoto[]).catch(() => [] as PiercingPhoto[]),
      [] as PiercingPhoto[],
    );
  },
  ["piercing_photos"],
  { tags: [TAGS.piercing], revalidate: 3600 }
);

export const getReviews = unstable_cache(
  async (): Promise<Review[]> => {
    return withTimeout(
      prisma.review.findMany({ orderBy: { sort_order: "asc" } }).then((r) => r as Review[]).catch(() => [] as Review[]),
      [] as Review[],
    );
  },
  ["reviews"],
  { tags: [TAGS.reviews], revalidate: 3600 }
);
