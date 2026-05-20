import type { FieldDef } from "./EntityForm";

export const ARTIST_FIELDS: FieldDef[] = [
  { key: "name", label: "Name", required: true },
  { key: "slug", label: "Slug (optional)", help: "Becomes /our-artist/<slug>. Auto-generated from name if blank. e.g. avinash-kumar" },
  { key: "photo", label: "Profile photo", type: "image" },
  { key: "role", label: "Role / Title", placeholder: "e.g. Tattoo Artist" },
  { key: "specialty", label: "Specialty", placeholder: "e.g. Realistic, Cover-up" },
  { key: "experience", label: "Experience", placeholder: "e.g. 8 years" },
  { key: "bio", label: "Bio", type: "textarea" },
  { key: "portfolio_url", label: "External portfolio URL (optional)", type: "url" },
];

export const CATEGORY_FIELDS: FieldDef[] = [
  { key: "name", label: "Name", required: true },
  { key: "slug", label: "Slug (optional)", help: "Becomes /category/<slug>. Auto-generated from name if blank. e.g. realistic, small-minimal, religious" },
  { key: "photo", label: "Cover photo", type: "image" },
  { key: "description", label: "Description", type: "textarea" },
];

export const REVIEW_FIELDS: FieldDef[] = [
  { key: "client_name", label: "Client name", required: true },
  { key: "photo", label: "Client photo", type: "image", required: false, help: "Optional if a video is uploaded." },
  { key: "video", label: "Client video (optional)", type: "url", help: "Paste a public video URL (e.g. an uploaded file's URL)." },
  { key: "rating", label: "Rating (1–5)", type: "number" },
  { key: "review", label: "Review text", type: "textarea" },
];

export const EARRING_CATEGORY_FIELDS: FieldDef[] = [
  { key: "name", label: "Name", required: true, placeholder: "Stainless Steel, Gold, Silver …" },
  { key: "slug", label: "Slug (optional)", help: "Becomes /piercing/earrings/<slug>. Auto-generated from name if blank." },
  { key: "audience", label: "Audience (kids / adults / both)", required: true, placeholder: "kids" },
  { key: "photo", label: "Cover photo", type: "image" },
  { key: "description", label: "Description", type: "textarea" },
];

export const EARRING_PRODUCT_FIELDS: FieldDef[] = [
  { key: "name", label: "Name", required: true },
  { key: "photo", label: "Photo", type: "image" },
  { key: "price_inr", label: "Price (₹ INR)", type: "number" },
  { key: "description", label: "Description", type: "textarea" },
];

export const SERVICE_FORM_FIELDS: FieldDef[] = [
  { key: "title", label: "Form title", required: true },
  { key: "intro", label: "Intro text", type: "textarea" },
];

export const SERVICE_FORM_FIELD_FIELDS: FieldDef[] = [
  { key: "label", label: "Label (shown to user)", required: true },
  { key: "key", label: "Key (machine name)", required: true, help: "lowercase + underscores; changing breaks past submissions referring to this key" },
  { key: "type", label: "Type", required: true, help: "text | tel | email | textarea | select | file | date" },
  { key: "required", label: "Required (true / false)", help: "Type 'true' or 'false'" },
  { key: "options", label: "Options for select (comma-separated)", help: "Only used when type is 'select'" },
  { key: "sort_order", label: "Sort order", type: "number" },
];

export const SAFETY_ITEM_FIELDS: FieldDef[] = [
  { key: "audience", label: "Audience (kids / adults / both)", required: true, placeholder: "both" },
  { key: "title", label: "Title", required: true },
  { key: "body", label: "Body", type: "textarea", required: true },
  { key: "photo", label: "Photo", type: "image" },
  { key: "sort_order", label: "Sort order", type: "number" },
];
