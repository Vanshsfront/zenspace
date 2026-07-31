"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BlockEditor } from "../_components/BlockEditor";
import { useToast } from "../_components/Toast";
import type { Block } from "@/lib/blocks";

type Initial = { id?: string; slug: string; title: string; blocks: Block[] };

/**
 * Edits one legal page. Handles both creating a page (no `id`) and editing an
 * existing one — the public /terms and /privacy routes look the row up by slug,
 * so without a create path a missing row left those pages permanently empty.
 */
export function LegalForm({ initial }: { initial: Initial }) {
  const router = useRouter();
  const toast = useToast();
  const [title, setTitle] = useState(initial.title);
  const [blocks, setBlocks] = useState<Block[]>(initial.blocks);
  const [saving, setSaving] = useState(false);
  const isNew = !initial.id;

  async function save() {
    if (!title.trim()) { toast.push("error", "Title is required"); return; }
    setSaving(true);
    const r = await fetch("/api/admin/legal_pages", {
      method: isNew ? "POST" : "PATCH",
      body: JSON.stringify(
        isNew ? { slug: initial.slug, title, blocks } : { id: initial.id, title, blocks },
      ),
    });
    setSaving(false);
    if (!r.ok) { const j = await r.json().catch(() => ({})); toast.push("error", j.error || "Save failed"); return; }
    toast.push("success", "Saved");
    router.push("/admin/legal");
  }

  return (
    <div className="max-w-3xl space-y-5">
      <p className="text-sm text-stone-500">
        Published at <code>/{initial.slug}</code>
      </p>
      <label className="block">
        <span className="text-sm font-medium">Page title</span>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border bg-white" />
      </label>
      <div>
        <span className="text-sm font-medium">Content</span>
        <div className="mt-2"><BlockEditor value={blocks} onChange={setBlocks} /></div>
      </div>
      <div className="flex items-center gap-3 pt-2">
        <button onClick={save} disabled={saving} className="px-6 py-2.5 rounded-full bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-50">{saving ? "Saving…" : "Save"}</button>
        <button onClick={() => router.push("/admin/legal")} className="text-sm text-stone-500">Cancel</button>
      </div>
    </div>
  );
}
