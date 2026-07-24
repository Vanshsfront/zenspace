"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useToast } from "../_components/Toast";
import { useConfirm } from "../_components/ConfirmDialog";

export default function Page() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const { confirm } = useConfirm();

  async function load() {
    setLoading(true);
    const r = await fetch("/api/admin/blog_posts", { cache: "no-store" });
    const d = await r.json().catch(() => []);
    setPosts(Array.isArray(d) ? d : []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    const ok = await confirm({ title: "Delete this post?", message: "This cannot be undone.", destructive: true, confirmLabel: "Delete" });
    if (!ok) return;
    const r = await fetch("/api/admin/blog_posts", { method: "DELETE", body: JSON.stringify({ id }) });
    if (!r.ok) { toast.push("error", "Delete failed"); return; }
    toast.push("success", "Deleted");
    setPosts((p) => p.filter((x) => x.id !== id));
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl">Blog posts</h1>
        <Link href="/admin/blog/new" className="px-5 py-2 rounded-full bg-stone-900 text-white text-sm hover:bg-stone-800">New post</Link>
      </div>
      {loading ? <p className="text-stone-500">Loading…</p> : posts.length === 0 ? <p className="text-stone-500">No posts yet.</p> : (
        <div className="space-y-3">
          {posts.map((p) => (
            <div key={p.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-medium truncate">{p.title}</p>
                <p className="text-xs text-stone-500">/{p.slug} · {p.published ? "Published" : "Draft"}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link href={`/admin/blog/${p.id}`} className="text-sm text-stone-700 underline">Edit</Link>
                <button onClick={() => remove(p.id)} className="text-sm text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
