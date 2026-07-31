"use client";

import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import { usePathname } from "next/navigation";

/**
 * Turns the public site into the admin's edit surface, and does nothing at all
 * for everybody else.
 *
 * Three rules this file exists to keep:
 *  1. No page or layout may call cookies() — that would make every (site) route
 *     dynamic and throw away the ISR cache the whole site is built on. So the
 *     admin check is a client fetch to /api/admin/me, made only when asked for.
 *  2. Nothing happens without ?edit=1, so a visitor's page issues no extra
 *     request and downloads no editor JS.
 *  3. The query string is read off window.location rather than with
 *     useSearchParams(), which would opt the layout into client-side rendering
 *     up to the nearest Suspense boundary during prerendering.
 *
 * Children are passed straight through until the editor loads, so the markup a
 * visitor receives is byte-identical either way.
 */
export function EditModeBoot({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [Shell, setShell] = useState<ComponentType<{ children: ReactNode }> | null>(null);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("edit") !== "1") {
      setShell(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("/api/admin/me", { cache: "no-store" });
        const j = (await r.json()) as { admin?: boolean };
        if (cancelled || !j.admin) return;
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
    // Re-checked per route: a client-side navigation drops the query string, and
    // edit mode should end with it.
  }, [pathname]);

  if (!Shell) return <>{children}</>;
  return <Shell>{children}</Shell>;
}
