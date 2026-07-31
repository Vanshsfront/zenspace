import type { SiteSettings, PiercingPhoto, EarringCategoryRow, SafetyItemRow } from "@/lib/data";
import type {
  PiercingSettings,
  PiercingPhotoCard,
  EarringCategoryCard,
} from "@/components/PiercingAudienceContent";
import type { SafetyItemCard } from "@/components/SafetyItems";

/**
 * PiercingAudienceContent is a client component, so every field these pages
 * hand it is serialized into the prerendered HTML a second time, next to the
 * markup it already rendered. The projections below cut each row down to the
 * columns the component reads. They live here rather than next to the
 * component because a "use client" module cannot export a plain function a
 * server component is allowed to call — only the types cross that way, and
 * types are erased.
 *
 * Type-only imports, so nothing here pulls the client module into the server
 * graph.
 */

/** Six of site_settings' thirty columns reach the piercing pages. */
export function piercingSettings(s: SiteSettings | null): PiercingSettings | null {
  if (!s) return null;
  return {
    piercing_kids_title: s.piercing_kids_title,
    piercing_kids_intro: s.piercing_kids_intro,
    piercing_adults_title: s.piercing_adults_title,
    piercing_adults_intro: s.piercing_adults_intro,
    whatsapp: s.whatsapp,
    phone: s.phone,
  };
}

export function piercingPhotoCards(rows: PiercingPhoto[]): PiercingPhotoCard[] {
  return rows.map((p) => ({ id: p.id, photo: p.photo, caption: p.caption }));
}

export function earringCategoryCards(rows: EarringCategoryRow[]): EarringCategoryCard[] {
  return rows.map((e) => ({
    id: e.id,
    slug: e.slug,
    name: e.name,
    photo: e.photo,
    description: e.description,
  }));
}

export function safetyItemCards(rows: SafetyItemRow[]): SafetyItemCard[] {
  return rows.map((s) => ({ id: s.id, title: s.title, body: s.body, photo: s.photo }));
}
