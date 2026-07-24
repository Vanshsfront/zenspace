"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BlockEditor } from "../_components/BlockEditor";
import { useToast } from "../_components/Toast";
import type { Block } from "@/lib/blocks";

export function LegalForm({ initial }: { initial: { id: string; title: string; blocks: Block[] } }) {
  const router = useRouter();
  const toast = useToast();
  const [title, setTitle] = useState(initial.title);
  const [blocks, setBlocks] = useState<Block[]>(initial.blocks);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const r = await fetch("/api/admin/legal_pages", {
      method: "PATCH",
      body: JSON.stringify({ id: initial.id, title, blocks }),
    });
    setSaving(false);
    if (!r.ok) { const j = await r.json().catch(() => ({})); toast.push("error", j.error || "Save failed"); return; }
    toast.push("success", "Saved");
    router.push("/admin/legal");
  }

  return (
    <div className="max-w-3xl space-y-5">
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
