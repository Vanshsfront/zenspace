import { createClient } from "@/lib/supabase/server";

export type SiteSettings = {
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  hero_image: string | null;
  cta_title: string;
  cta_subtitle: string;
  address: string;
  email: string;
  phone: string;
  instagram: string | null;
  facebook: string | null;
  pinterest: string | null;
};

export type Artist = {
  id: string;
  name: string;
  role: string | null;
  photo: string | null;
  portfolio_url: string | null;
};

export type Category = { id: string; name: string; photo: string | null };
export type StudioPhoto = { id: string; photo: string; caption: string | null };
export type Review = { id: string; client_name: string; photo: string | null; review: string | null; rating: number };

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const sb = await createClient();
    const { data } = await sb.from("site_settings").select("*").eq("id", 1).single();
    return data as SiteSettings | null;
  } catch {
    return null;
  }
}

export async function getArtists(): Promise<Artist[]> {
  try {
    const sb = await createClient();
    const { data } = await sb.from("artists").select("*").order("sort_order");
    return (data as Artist[]) || [];
  } catch { return []; }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const sb = await createClient();
    const { data } = await sb.from("categories").select("*").order("sort_order");
    return (data as Category[]) || [];
  } catch { return []; }
}

export async function getStudioPhotos(): Promise<StudioPhoto[]> {
  try {
    const sb = await createClient();
    const { data } = await sb.from("studio_photos").select("*").order("sort_order");
    return (data as StudioPhoto[]) || [];
  } catch { return []; }
}

export async function getReviews(): Promise<Review[]> {
  try {
    const sb = await createClient();
    const { data } = await sb.from("reviews").select("*").order("sort_order");
    return (data as Review[]) || [];
  } catch { return []; }
}
