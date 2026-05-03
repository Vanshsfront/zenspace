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
  { key: "photo", label: "Client photo", type: "image", required: true, help: "Required — every review must have a face." },
  { key: "rating", label: "Rating (1–5)", type: "number" },
  { key: "review", label: "Review text", type: "textarea" },
];
