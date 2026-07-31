import type { Block } from "@/lib/blocks";

/**
 * The two legal pages the public site renders, with placeholder copy so a newly
 * created page is never blank. Mirrors the seed rows in supabase/schema.sql.
 */
export const LEGAL_PAGE_TEMPLATES = {
  terms: {
    title: "Terms & Conditions",
    blocks: [
      {
        type: "paragraph",
        text: "These are placeholder Terms & Conditions. Replace this text from the admin panel.",
      },
    ] as Block[],
  },
  privacy: {
    title: "Privacy Policy",
    blocks: [
      {
        type: "paragraph",
        text: "This is a placeholder Privacy Policy. Replace this text from the admin panel.",
      },
    ] as Block[],
  },
} as const;

export type LegalSlug = keyof typeof LEGAL_PAGE_TEMPLATES;

export function isLegalSlug(s: string): s is LegalSlug {
  return Object.prototype.hasOwnProperty.call(LEGAL_PAGE_TEMPLATES, s);
}
