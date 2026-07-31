"use client";

import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { endEditingSession, isEditingSession, startEditingSession } from "@/lib/edit/session";

/**
 * Turns the public site into the admin's edit surface, and does nothing at all
 * for everybody else.
 *
 * Three rules this file exists to keep:
 *  1. No page or layout may call cookies() — that would make every (site) route
 *     dynamic and throw away the ISR cache the whole site is built on. So the
 *     admin check is a client fetch to /api/admin/me, made only when asked for.
 *  2. Nothing happens for a visitor: no extra request, no editor JS. They arrive
 *     without ?edit=1 and with no edit session stored, so the effect returns
 *     before it touches the network.
 *  3. The query string is read off window.location rather than with
 *     useSearchParams(), which would opt the layout into client-side rendering
 *     up to the nearest Suspense boundary during prerendering.
 *
 * Edit mode survives navigation. ?edit=1 starts it, after which it is a property
 * of the tab rather than of the URL, because the admin needs to browse the site
 * to edit it: every internal link is a client-side navigation that drops the
 * query string, and ending the mode there meant only the entry page was ever
 * editable. The address bar is rewritten to keep ?edit=1 so a reload stays in
 * edit mode, and "Done" in the toolbar ends the session explicitly.
 *
 * Children are passed straight through until the editor loads, so the markup a
 * visitor receives is byte-identical either way.
 */
export function EditModeBoot({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [Shell, setShell] = useState<ComponentType<{ children: ReactNode }> | null>(null);

  useEffect(() => {
    const asked = new URLSearchParams(window.location.search).get("edit") === "1";
    // The visitor path ends here, having done nothing.
    if (!asked && !isEditingSession()) {
      setShell(null);
      return;
    }
    if (asked) startEditingSession();

    let cancelled = false;
    (async () => {
      try {
        // Re-checked on every navigation, which doubles as the session-expiry
        // check: a lapsed cookie takes the editor down instead of leaving it
        // mounted over a dead session.
        const r = await fetch("/api/admin/me", { cache: "no-store" });
        const j = (await r.json()) as { admin?: boolean };
        if (cancelled) return;
        if (!j.admin) {
          endEditingSession();
          setShell(null);
          return;
        }
        // Keep the address bar honest: a reload, a bookmark or a URL handed to
        // another admin should all still be in edit mode. replaceState rather
        // than a navigation so nothing re-renders.
        if (!asked) {
          const url = new URL(window.location.href);
          url.searchParams.set("edit", "1");
          window.history.replaceState(null, "", url.toString());
        }
        const mod = await import("@/lib/edit/EditModeShell");
        // Wrapped in a function so setState doesn't treat the component as an
        // updater callback.
        if (!cancelled) setShell(() => mod.default);
      } catch {
        // A failed check leaves the normal page on screen, which is the right
        // outcome: there is nothing to tell a visitor about.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  if (!Shell) return <>{children}</>;
  return <Shell>{children}</Shell>;
}
