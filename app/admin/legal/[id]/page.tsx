"use client";
import { use, useEffect, useState } from "react";
import { LegalForm } from "../LegalForm";
import type { Block } from "@/lib/blocks";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [page, setPage] = useState<any | null>(null);
  const [missing, setMissing] = useState(false);
  useEffect(() => {
    (async () => {
      const r = await fetch(`/api/admin/legal_pages/${id}`, { cache: "no-store" });
      if (!r.ok) { setMissing(true); return; }
      setPage(await r.json());
    })();
  }, [id]);
  if (missing) return <p className="text-stone-500">Page not found.</p>;
  if (!page) return <p className="text-stone-500">Loading…</p>;
  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-3xl mb-6">Edit {page.title}</h1>
      <LegalForm initial={{ id: page.id, slug: page.slug ?? "", title: page.title ?? "", blocks: (Array.isArray(page.blocks) ? page.blocks : []) as Block[] }} />
    </div>
  );
}
