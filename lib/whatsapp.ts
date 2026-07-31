/**
 * Single source of truth for wa.me links. Previously each component built its
 * own href, and the home page hard-coded the studio's number — so changing
 * "WhatsApp number" in the admin panel updated every page except the home page.
 */

/** Used only when site_settings has no WhatsApp number saved yet. */
export const FALLBACK_WHATSAPP_DIGITS = "917208388209";

/**
 * Builds a wa.me link from the raw admin-entered number (which may contain
 * '+', spaces or dashes).
 *
 * Returns `null` when there is no usable number, so call sites can hide the
 * button rather than link somewhere broken. Pass `fallback: true` for the
 * always-visible entry points (home page, floating button) that must render a
 * working link even before the studio fills the field in.
 */
export function whatsappHref(
  raw: string | null | undefined,
  message: string,
  opts?: { fallback?: boolean },
): string | null {
  const digits = (raw || "").replace(/\D/g, "") || (opts?.fallback ? FALLBACK_WHATSAPP_DIGITS : "");
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
