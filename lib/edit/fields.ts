/**
 * The field registry: the single source of truth for what every editable piece
 * of content is called and how long it may be.
 *
 * Both editing surfaces read from here — the inline editors on the real site
 * routes (lib/edit/Editable*.tsx) and the existing form screens under
 * app/admin. Keeping the limits in one place is the only thing stopping the two
 * from drifting apart and letting a value through one surface that would break
 * the layout the other surface protects.
 *
 * Limits are HARD caps, chosen per field so the layout cannot break: they are
 * what the tightest place that renders the value can take. Where the same
 * column appears in two spots with different room (site_settings.address is in
 * both the footer and the contact page), the smaller of the two wins.
 *
 * `max: 0` means "no character cap" — media URLs, booleans, dates and enums,
 * which are constrained by their widget rather than by length.
 */

export type FieldKind =
  | "text"
  | "textarea"
  | "image"
  | "video"
  | "pdf"
  | "url"
  | "number"
  | "enum"
  | "boolean"
  | "date";

export type FieldMeta = {
  /** Plain-language name, shown in the inline editor and on the admin forms. */
  label: string;
  /** Hard character cap. 0 = not a length-limited field. */
  max: number;
  kind: FieldKind;
  /** One-line explanation of where the value shows up, when it isn't obvious. */
  help?: string;
  /** Allowed values for `kind: "enum"`. */
  options?: readonly string[];
};

/** Registry key. Always `<table>.<column>`. */
export type FieldKey = string;

/**
 * Blocks live inside a jsonb column on blog_posts / legal_pages rather than in
 * their own table, so they get this pseudo-table prefix. The shape mirrors
 * app/admin/_components/BlockEditor.tsx.
 */
export const BLOCKS_TABLE = "blocks";

export const FIELDS: Record<FieldKey, FieldMeta> = {
  // ---------------------------------------------------------------- home page
  "site_settings.hero_title": {
    label: "Hero headline (bold first line)",
    max: 60,
    kind: "text",
  },
  "site_settings.hero_subtitle": {
    label: "Hero second line (italic, gradient)",
    max: 40,
    kind: "text",
  },
  "site_settings.hero_description": {
    label: "Hero paragraph",
    max: 180,
    kind: "textarea",
  },
  "site_settings.hero_image": {
    label: "Hero photo (large image, right side)",
    max: 0,
    kind: "image",
    help: "Also used as the first frame when a hero video is set.",
  },
  "site_settings.hero_video": {
    label: "Hero video (optional, replaces the hero photo)",
    max: 0,
    kind: "video",
  },
  "site_settings.home_piercing_kids_image": {
    label: "Kids piercing card photo (round image, “For Little Stars”)",
    max: 0,
    kind: "image",
  },
  "site_settings.home_piercing_adults_image": {
    label: "Adults piercing card photo (round image, “For everyone”)",
    max: 0,
    kind: "image",
  },
  "site_settings.cta_title": {
    label: "Closing CTA headline",
    max: 70,
    kind: "text",
  },
  "site_settings.cta_subtitle": {
    label: "Closing CTA subtitle",
    max: 140,
    kind: "textarea",
  },
  "site_settings.google_review_count": {
    label: "Google review count",
    max: 5,
    kind: "number",
    help: "Whole number only. The “+” on the home page is added automatically.",
  },
  "site_settings.google_reviews_url": {
    label: "Google reviews link",
    max: 200,
    kind: "url",
  },

  // ------------------------------------------------------ piercing page copy
  "site_settings.piercing_title": {
    label: "Piercing landing headline",
    max: 48,
    kind: "text",
  },
  "site_settings.piercing_intro": {
    label: "Piercing landing intro",
    max: 200,
    kind: "textarea",
  },
  "site_settings.piercing_baby_blurb": {
    label: "Kids card blurb",
    max: 90,
    kind: "text",
  },
  "site_settings.piercing_kids_title": {
    label: "Kids page headline",
    max: 55,
    kind: "text",
  },
  "site_settings.piercing_kids_intro": {
    label: "Kids page intro",
    max: 220,
    kind: "textarea",
  },
  "site_settings.piercing_adults_title": {
    label: "Adults page headline",
    max: 55,
    kind: "text",
  },
  "site_settings.piercing_adults_intro": {
    label: "Adults page intro",
    max: 220,
    kind: "textarea",
  },
  "site_settings.aftercare_pdf": {
    label: "Aftercare guide (PDF)",
    max: 0,
    kind: "pdf",
    help: "Opened by the “After Care” process card on the home page.",
  },

  // --------------------------------------------------------------- about page
  "site_settings.about_title": {
    label: "About page title",
    max: 60,
    kind: "text",
  },
  "site_settings.about_heading": {
    label: "Section heading (above the paragraphs)",
    max: 40,
    kind: "text",
  },
  "site_settings.about_body": {
    label: "About paragraphs",
    max: 1200,
    kind: "textarea",
    help: "Separate paragraphs with a blank line.",
  },
  "site_settings.about_photo_1": {
    label: "About photo 1 (large, back)",
    max: 0,
    kind: "image",
  },
  "site_settings.about_photo_2": {
    label: "About photo 2 (overlapping, front)",
    max: 0,
    kind: "image",
  },

  // --------------------------------------------------------------- site-wide
  "site_settings.address": {
    label: "Studio address",
    // The contact page column is the tightest of the three places it renders.
    max: 200,
    kind: "textarea",
    help: "Footer, contact page and the map query.",
  },
  "site_settings.email": {
    label: "Contact email",
    max: 48,
    kind: "text",
  },
  "site_settings.phone": {
    label: "Phone number(s)",
    max: 40,
    kind: "text",
    help: "Separate two numbers with a “/”. The first one drives the Call button.",
  },
  "site_settings.whatsapp": {
    label: "WhatsApp number",
    max: 20,
    kind: "text",
    help: "Country code + digits, no “+”, spaces or dashes. e.g. 917208388209",
  },
  "site_settings.instagram": {
    label: "Instagram profile URL",
    max: 200,
    kind: "url",
  },
  "site_settings.facebook": {
    label: "Facebook page URL",
    max: 200,
    kind: "url",
  },
  "site_settings.pinterest": {
    label: "Pinterest profile URL",
    max: 200,
    kind: "url",
  },

  // ------------------------------------------------------------------ artists
  "artists.photo": { label: "Artist photo", max: 0, kind: "image" },
  "artists.name": { label: "Artist name", max: 28, kind: "text" },
  "artists.role": { label: "Artist role (small uppercase line)", max: 24, kind: "text" },
  "artists.experience": { label: "Experience", max: 40, kind: "text", help: "e.g. 8 years" },
  "artists.specialty": { label: "Specialty", max: 60, kind: "text", help: "e.g. Realistic, Cover-up" },
  "artists.bio": { label: "Artist bio", max: 900, kind: "textarea" },

  // --------------------------------------------------------------- categories
  "categories.photo": { label: "Category cover photo", max: 0, kind: "image" },
  "categories.name": { label: "Category name", max: 24, kind: "text" },
  "categories.description": { label: "Category description", max: 320, kind: "textarea" },
  "category_photos.photo": { label: "Category photo", max: 0, kind: "image" },
  "category_photos.caption": { label: "Photo caption", max: 70, kind: "text" },
  "portfolio_items.photo": { label: "Portfolio photo", max: 0, kind: "image" },

  // ------------------------------------------------------------------ studio
  "studio_photos.photo": { label: "Studio photo", max: 0, kind: "image" },
  "studio_photos.caption": {
    label: "Studio photo caption",
    max: 60,
    kind: "text",
    help: "Shown on the about page and used as the alt text in the home carousel.",
  },

  // ------------------------------------------------------------ short videos
  "short_videos.video": { label: "Short video clip (vertical 9:16)", max: 0, kind: "video" },
  "short_videos.poster": { label: "Short video poster image (first frame)", max: 0, kind: "image" },
  "short_videos.caption": { label: "Short video caption", max: 60, kind: "text" },

  // ----------------------------------------------------------------- reviews
  "reviews.photo": {
    label: "Review photo",
    max: 0,
    kind: "image",
    help: "Also used as the first frame when a review video is set.",
  },
  "reviews.video": { label: "Review video (optional, replaces the review photo)", max: 0, kind: "video" },
  "reviews.client_name": { label: "Client name", max: 32, kind: "text" },
  "reviews.rating": { label: "Star rating (1 to 5)", max: 1, kind: "number" },
  "reviews.review": { label: "Review text", max: 220, kind: "textarea" },

  // ---------------------------------------------------------------- piercing
  "piercing_photos.photo": { label: "Gallery photo", max: 0, kind: "image" },
  "piercing_photos.caption": { label: "Gallery photo caption", max: 70, kind: "text" },
  "safety_items.photo": { label: "Safety item photo", max: 0, kind: "image" },
  "safety_items.title": { label: "Safety item title", max: 60, kind: "text" },
  "safety_items.body": { label: "Safety item body", max: 400, kind: "textarea" },
  "safety_items.audience": {
    label: "Safety item audience",
    max: 6,
    kind: "enum",
    options: ["kids", "adults", "both"],
  },

  // ---------------------------------------------------------------- earrings
  "earring_categories.photo": { label: "Earring category cover photo", max: 0, kind: "image" },
  "earring_categories.name": { label: "Earring category name", max: 28, kind: "text" },
  "earring_categories.description": { label: "Earring category description", max: 160, kind: "textarea" },
  "earring_categories.audience": {
    label: "Earring category audience",
    max: 6,
    kind: "enum",
    options: ["kids", "adults", "both"],
  },
  "earring_products.photo": { label: "Earring product photo", max: 0, kind: "image" },
  "earring_products.name": { label: "Earring product name", max: 34, kind: "text" },
  "earring_products.price_inr": { label: "Earring product price (₹ INR)", max: 7, kind: "number" },
  "earring_products.description": { label: "Earring product description", max: 170, kind: "textarea" },

  // -------------------------------------------------------------------- blog
  "blog_posts.cover_image": { label: "Post cover image", max: 0, kind: "image" },
  "blog_posts.title": { label: "Post title", max: 70, kind: "text" },
  "blog_posts.excerpt": { label: "Post excerpt (card summary)", max: 160, kind: "textarea" },
  "blog_posts.slug": {
    label: "Post URL slug",
    max: 80,
    kind: "text",
    help: "Becomes /blog/<slug>. Auto-generated from the title if left blank.",
  },
  "blog_posts.published": {
    label: "Published",
    max: 0,
    kind: "boolean",
    help: "Unpublished posts are hidden from the blog list and their own page.",
  },
  "blog_posts.published_at": {
    label: "Publish date",
    max: 0,
    kind: "date",
    help: "Drives the order of the blog list.",
  },

  // ------------------------------------------------------------- legal pages
  "legal_pages.title": { label: "Page title", max: 48, kind: "text" },

  // --------------------------------------- rich-text blocks (jsonb, no table)
  "blocks.heading": {
    label: "Heading",
    max: 80,
    kind: "text",
    help: "Renders as a large (H2) or small (H3) heading.",
  },
  "blocks.level": {
    label: "Heading size",
    max: 0,
    kind: "enum",
    options: ["h2", "h3"],
  },
  "blocks.paragraph": { label: "Paragraph", max: 2000, kind: "textarea" },
  "blocks.image": { label: "Content image", max: 0, kind: "image" },
  "blocks.caption": { label: "Image caption", max: 120, kind: "text" },
};

/** Look a field up. Returns undefined for anything not in the registry. */
export function fieldMeta(table: string, field: string): FieldMeta | undefined {
  return FIELDS[`${table}.${field}`];
}

/**
 * The hard cap for a field, or undefined when the field has none. Callers use
 * the undefined case to mean "don't render a counter and don't refuse input".
 */
export function fieldMax(table: string, field: string): number | undefined {
  const m = fieldMeta(table, field);
  return m && m.max > 0 ? m.max : undefined;
}

/**
 * True once the value is close enough to the cap that the counter should warn.
 * Shared so the inline editor and the admin forms turn amber at the same point.
 */
export function isNearLimit(length: number, max: number): boolean {
  return max > 0 && length >= Math.ceil(max * 0.9);
}
