"use client";
import { useEffect, useState } from "react";
import { useConfirm } from "../_components/ConfirmDialog";
import { useToast } from "../_components/Toast";

type Req = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  description: string;
  reference: string | null;
  created_at: string | null;
};

export default function Page() {
  const [items, setItems] = useState<Req[]>([]);
  const [loading, setLoading] = useState(true);
  const { confirm } = useConfirm();
  const toast = useToast();

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/custom_requests", { cache: "no-store" });
      const d = await r.json();
      setItems(Array.isArray(d) ? d : []);
    } catch {
      setItems([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: string) {
    const ok = await confirm({
      title: "Delete this request?",
      message: "This action cannot be undone.",
      destructive: true,
      confirmLabel: "Delete",
    });
    if (!ok) return;
    const r = await fetch("/api/admin/custom_requests", { method: "DELETE", body: JSON.stringify({ id }) });
    if (!r.ok) {
      toast.push("error", "Delete failed");
      return;
    }
    toast.push("success", "Deleted");
    load();
  }

  return (
    <div className="max-w-5xl">
      <h1 className="font-serif text-3xl mb-2">Custom design requests</h1>
      <p className="text-stone-600 mb-6">Submissions from the public “Request a custom design” form.</p>

      {loading ? (
        <p className="text-stone-500">Loading…</p>
      ) : items.length === 0 ? (
        <div className="bg-white border border-dashed border-stone-300 rounded-2xl p-10 text-center text-stone-500">
          No requests yet.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((it) => (
            <div key={it.id} className="bg-white p-5 rounded-xl shadow-sm flex gap-5">
              {it.reference && (
                // eslint-disable-next-line @next/next/no-img-element
                <a href={it.reference} target="_blank" rel="noopener noreferrer" className="shrink-0">
                  <img src={it.reference} alt="reference" className="w-24 h-24 rounded-lg object-cover bg-stone-100" />
                </a>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="font-medium text-stone-900">{it.name}</span>
                  <span className="text-sm text-stone-600">{it.phone}</span>
                  {it.email && <span className="text-sm text-stone-600">{it.email}</span>}
                  {it.created_at && (
                    <span className="text-xs text-stone-400">
                      {new Date(it.created_at).toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-stone-700 whitespace-pre-wrap break-words">{it.description}</p>
              </div>
              <button onClick={() => remove(it.id)} className="self-start text-sm text-red-600 hover:underline shrink-0">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
