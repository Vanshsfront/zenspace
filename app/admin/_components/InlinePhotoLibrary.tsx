"use client";

import { useCallback, useEffect, useState } from "react";
import { MultiImageUpload } from "./MultiImageUpload";
import { useToast } from "./Toast";
import { useConfirm } from "./ConfirmDialog";
import { Trash2 } from "lucide-react";

type Item = {
  id: string;
  photo: string;
  caption: string | null;
  sort_order: number | null;
  [k: string]: any;
};

type Props = {
  /** API table name, e.g. "portfolio_items" or "category_photos". */
  table: string;
  /** FK column on `table` that points at the parent record. */
  parentField: string;
  /** Parent record id (artist or category UUID). */
  parentId: string;
  /** Optional title shown above the gallery. */
  title?: string;
  /** Optional helper line below the title. */
  description?: string;
};

/**
 * Drop-in gallery editor used on the artist / category edit screens.
 * Bundles a multi-image dropzone and a lightweight grid with delete +
 * caption editing so admins don't have to navigate to a second screen.
 */
export function InlinePhotoLibrary({ table, parentField, parentId, title, description }: Props) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const { confirm } = useConfirm();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`/api/admin/${table}`, { cache: "no-store" });
      const body = await r.json().catch(() => null);
      if (!r.ok || !Array.isArray(body)) {
        setItems([]);
        setError((body && body.error) || "Couldn't load photos");
        return;
      }
      // Filter to only the rows for this parent — the list endpoint returns all.
      const mine = (body as Item[]).filter((it) => it[parentField] === parentId);
      setItems(mine);
    } catch (e: any) {
      setItems([]);
      setError(e?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }, [table, parentField, parentId]);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(it: Item) {
    const ok = await confirm({
      title: "Delete this photo?",
      message: "This action cannot be undone.",
      destructive: true,
      confirmLabel: "Delete",
    });
    if (!ok) return;
    const r = await fetch(`/api/admin/${table}`, {
      method: "DELETE",
      body: JSON.stringify({ id: it.id }),
    });
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      toast.push("error", j.error || "Delete failed");
      return;
    }
    toast.push("success", "Deleted");
    setItems((prev) => prev.filter((x) => x.id !== it.id));
  }

  async function updateCaption(it: Item, caption: string) {
    setItems((prev) => prev.map((x) => (x.id === it.id ? { ...x, caption } : x)));
    await fetch(`/api/admin/${table}`, {
      method: "PATCH",
      body: JSON.stringify({ id: it.id, caption: caption || null }),
    });
  }

  return (
    <div className="space-y-5">
      {(title || description) && (
        <div>
          {title && <h2 className="font-serif text-xl text-stone-900">{title}</h2>}
          {description && <p className="text-sm text-stone-500 mt-1">{description}</p>}
        </div>
      )}

      <MultiImageUpload
        table={table}
        extraFields={{ [parentField]: parentId }}
        onUploaded={load}
      />

      {loading ? (
        <p className="text-stone-500 text-sm">Loading photos…</p>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm flex items-center justify-between gap-3">
          <span>{error}</span>
          <button onClick={load} className="px-3 py-1.5 rounded-full bg-red-600 text-white text-xs">Retry</button>
        </div>
      ) : items.length === 0 ? (
        <p className="text-stone-500 text-sm">No photos yet. Drop some above to add them.</p>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {items.map((it) => (
            <li key={it.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-stone-100">
              <div className="relative aspect-square bg-stone-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.photo} alt={it.caption || ""} className="absolute inset-0 w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => remove(it)}
                  aria-label="Delete photo"
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 hover:bg-red-600 hover:text-white text-stone-700 flex items-center justify-center shadow"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <input
                type="text"
                defaultValue={it.caption ?? ""}
                placeholder="Caption (optional)"
                onBlur={(e) => {
                  if (e.target.value !== (it.caption ?? "")) updateCaption(it, e.target.value);
                }}
                className="block w-full px-3 py-2 text-xs border-t border-stone-100 outline-none focus:bg-stone-50"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
