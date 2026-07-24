"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Page() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const r = await fetch("/api/admin/legal_pages", { cache: "no-store" });
      const d = await r.json().catch(() => []);
      setPages(Array.isArray(d) ? d : []);
      setLoading(false);
    })();
  }, []);
  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-3xl mb-2">Terms &amp; Privacy</h1>
      <p className="text-stone-600 mb-6">Edit the two legal pages shown in the footer.</p>
      {loading ? <p className="text-stone-500">Loading…</p> : (
        <div className="space-y-3">
          {pages.map((p) => (
            <div key={p.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-xs text-stone-500">/{p.slug}</p>
              </div>
              <Link href={`/admin/legal/${p.id}`} className="text-sm text-stone-700 underline">Edit</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
