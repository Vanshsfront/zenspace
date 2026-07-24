"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImageUpload } from "../ImageUpload";
import { BlockEditor } from "../_components/BlockEditor";
import { useToast } from "../_components/Toast";
import type { Block } from "@/lib/blocks";

type Post = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  published: boolean;
  published_at: string;
  blocks: Block[];
};

const EMPTY: Post = { title: "", slug: "", excerpt: "", cover_image: "", published: false, published_at: "", blocks: [] };

export function BlogForm({ initial }: { initial?: Partial<Post> }) {
  const router = useRouter();
  const toast = useToast();
  const [p, setP] = useState<Post>({ ...EMPTY, ...initial, blocks: (initial?.blocks as Block[]) || [] });
  const [saving, setSaving] = useState(false);
  const set = (patch: Partial<Post>) => setP((prev) => ({ ...prev, ...patch }));

  async function save() {
    if (!p.title.trim()) { toast.push("error", "Title is required"); return; }
    setSaving(true);
    const method = p.id ? "PATCH" : "POST";
    const body: any = {
      title: p.title,
      slug: p.slug || undefined,
      excerpt: p.excerpt,
      cover_image: p.cover_image,
      published: p.published,
      published_at: p.published_at || (p.published ? new Date().toISOString() : null),
      blocks: p.blocks,
    };
    if (p.id) body.id = p.id;
    const r = await fetch("/api/admin/blog_posts", { method, body: JSON.stringify(body) });
    setSaving(false);
    if (!r.ok) { const j = await r.json().catch(() => ({})); toast.push("error", j.error || "Save failed"); return; }
    toast.push("success", "Saved");
    router.push("/admin/blog");
  }

  return (
    <div className="max-w-3xl space-y-5">
      <label className="block">
        <span className="text-sm font-medium">Title</span>
        <input value={p.title} onChange={(e) => set({ title: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border bg-white" />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Slug</span>
        <span className="block text-xs text-stone-500 mb-1">Leave blank to auto-generate from the title.</span>
        <input value={p.slug} onChange={(e) => set({ slug: e.target.value })} placeholder="auto" className="w-full px-3 py-2 rounded-lg border bg-white" />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Excerpt</span>
        <textarea value={p.excerpt} onChange={(e) => set({ excerpt: e.target.value })} rows={2} className="w-full mt-1 px-3 py-2 rounded-lg border bg-white" />
      </label>
      <div>
        <span className="text-sm font-medium">Cover image</span>
        <div className="mt-1"><ImageUpload value={p.cover_image} onChange={(url) => set({ cover_image: url })} /></div>
      </div>
      <div>
        <span className="text-sm font-medium">Content</span>
        <div className="mt-2"><BlockEditor value={p.blocks} onChange={(blocks) => set({ blocks })} /></div>
      </div>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={p.published} onChange={(e) => set({ published: e.target.checked })} />
        <span className="text-sm font-medium">Published</span>
      </label>
      <div className="flex items-center gap-3 pt-2">
        <button onClick={save} disabled={saving} className="px-6 py-2.5 rounded-full bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-50">{saving ? "Saving…" : "Save"}</button>
        <button onClick={() => router.push("/admin/blog")} className="text-sm text-stone-500">Cancel</button>
      </div>
    </div>
  );
}
