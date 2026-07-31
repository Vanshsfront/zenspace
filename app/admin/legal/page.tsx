"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LEGAL_PAGE_TEMPLATES, type LegalSlug } from "./templates";

const SLUGS = Object.keys(LEGAL_PAGE_TEMPLATES) as LegalSlug[];

export default function Page() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/admin/legal_pages", { cache: "no-store" });
        const d = await r.json().catch(() => ({}));
        if (!r.ok) {
          setError(d?.error || `Request failed (${r.status})`);
        } else {
          setPages(Array.isArray(d) ? d : []);
        }
      } catch (e: any) {
        setError(e?.message || "Could not reach the server");
      }
      setLoading(false);
    })();
  }, []);

  const bySlug = new Map(pages.map((p) => [p.slug, p]));

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-3xl mb-2">Terms &amp; Privacy</h1>
      <p className="text-stone-600 mb-6 text-sm">
        The two legal pages linked from the footer. Each one has to exist here before{" "}
        <code>/terms</code> and <code>/privacy</code> show anything.
      </p>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 mb-6">
          <p className="font-medium">Couldn’t load the legal pages.</p>
          <p className="mt-1 text-red-700">{error}</p>
        </div>
      )}

      {loading ? (
        <p className="text-stone-500">Loading…</p>
      ) : (
        <div className="space-y-3">
          {SLUGS.map((slug) => {
            const p = bySlug.get(slug);
            return (
              <div key={slug} className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{p?.title || LEGAL_PAGE_TEMPLATES[slug].title}</p>
                  <p className="text-xs text-stone-500">
                    /{slug}
                    {!p && <span className="text-amber-700"> — not created yet, the page is empty</span>}
                  </p>
                </div>
                {p ? (
                  <Link href={`/admin/legal/${p.id}`} className="text-sm text-stone-700 underline shrink-0">
                    Edit
                  </Link>
                ) : (
                  <Link
                    href={`/admin/legal/new/${slug}`}
                    className="px-4 py-2 rounded-full bg-stone-900 text-white text-sm hover:bg-stone-800 shrink-0"
                  >
                    Create page
                  </Link>
                )}
              </div>
            );
          })}

          {/* Any extra rows someone added by hand. */}
          {pages
            .filter((p) => !SLUGS.includes(p.slug))
            .map((p) => (
              <div key={p.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{p.title}</p>
                  <p className="text-xs text-stone-500">/{p.slug} — not linked from the site</p>
                </div>
                <Link href={`/admin/legal/${p.id}`} className="text-sm text-stone-700 underline shrink-0">
                  Edit
                </Link>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
