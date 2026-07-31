/**
 * Remembers that this tab is editing.
 *
 * Edit mode used to live entirely in the ?edit=1 query string, which meant it
 * ended the moment the admin followed any link: a client-side navigation drops
 * the query, so editing the home page and then clicking through to a category
 * silently turned the editor off. Editing the site is a mode you are in, not a
 * property of one URL.
 *
 * sessionStorage rather than localStorage so it lasts exactly as long as the
 * tab, and rather than a cookie so it can never reach the server and tempt a
 * page into reading it, which would make the (site) routes dynamic.
 *
 * This module is imported by EditModeBoot, which is on the visitor path, so it
 * must stay dependency-free and tiny. A visitor has no flag set, reads
 * undefined, and goes no further.
 */
const KEY = "zenspace:edit";

export function isEditingSession(): boolean {
  try {
    return window.sessionStorage.getItem(KEY) === "1";
  } catch {
    // Private browsing and blocked storage both throw. Falling back to "not
    // editing" keeps the visitor path working, and ?edit=1 still turns the
    // editor on for that page.
    return false;
  }
}

export function startEditingSession(): void {
  try {
    window.sessionStorage.setItem(KEY, "1");
  } catch {}
}

export function endEditingSession(): void {
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {}
}
