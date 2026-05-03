"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "./Toast";
import { useConfirm } from "./ConfirmDialog";
import { ChevronUp, ChevronDown, Plus, Search } from "lucide-react";

type Column<T> = {
  key: keyof T & string;
  label: string;
  /** True if this column is an image URL — renders a 12x12 thumbnail. */
  image?: boolean;
  /** Truncate to one line and clamp to a max width. */
  truncate?: boolean;
};

type Props<T> = {
  table: string;
  title: string;
  basePath: string;
  columns: Column<T>[];
  /** Server-side search field key — passed to the API as ?q=. */
  searchable?: boolean;
};

export function EntityList<T extends { id: string; sort_order?: number | null }>({
  table,
  title,
  basePath,
  columns,
  searchable = true,
}: Props<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const toast = useToast();
  const { confirm } = useConfirm();

  const load = useCallback(async (q?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL(`/api/admin/${table}`, window.location.origin);
      if (q) url.searchParams.set("q", q);
      const r = await fetch(url.toString(), { cache: "no-store" });
      const body = await r.json().catch(() => null);
      if (!r.ok) {
        setItems([]);
        setError((body && body.error) || `HTTP ${r.status}`);
      } else if (Array.isArray(body)) {
        setItems(body);
      } else {
        setItems([]);
        setError("Unexpected response");
      }
    } catch (e: any) {
      setItems([]);
      setError(e?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }, [table]);

  // Single debounced effect handles both initial load and search-as-you-type;
  // a separate mount-only fetch would race the debounced one on every render.
  useEffect(() => {
    const t = setTimeout(() => load(search), search ? 250 : 0);
    return () => clearTimeout(t);
  }, [search, load]);

  async function remove(row: T) {
    const ok = await confirm({
      title: "Delete this record?",
      message: "This action cannot be undone.",
      destructive: true,
      confirmLabel: "Delete",
    });
    if (!ok) return;
    const r = await fetch(`/api/admin/${table}`, { method: "DELETE", body: JSON.stringify({ id: row.id }) });
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      toast.push("error", j.error || "Delete failed");
      return;
    }
    toast.push("success", "Deleted");
    load(search);
  }

  async function move(row: T, direction: -1 | 1) {
    const idx = items.findIndex((it) => it.id === row.id);
    const swap = items[idx + direction];
    if (!swap) return;
    const a = row.sort_order ?? idx;
    const b = swap.sort_order ?? idx + direction;
    // Optimistic update
    const next = [...items];
    next[idx + direction] = row;
    next[idx] = swap;
    setItems(next);
    await Promise.all([
      fetch(`/api/admin/${table}`, { method: "PATCH", body: JSON.stringify({ id: row.id, sort_order: b }) }),
      fetch(`/api/admin/${table}`, { method: "PATCH", body: JSON.stringify({ id: swap.id, sort_order: a }) }),
    ]);
  }

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl">{title}</h1>
        <Link
          href={`${basePath}/new`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-900 text-white text-sm hover:bg-stone-800 shadow-md"
        >
          <Plus size={16} /> New
        </Link>
      </div>

      {searchable && (
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className="w-full pl-11 pr-4 py-2.5 rounded-full border bg-white text-sm"
          />
        </div>
      )}

      {loading ? (
        <p className="text-stone-500">Loading…</p>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700 text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span><strong>Couldn't load.</strong> {error}</span>
          <button onClick={() => load(search)} className="self-start px-4 py-2 rounded-full bg-red-600 text-white text-xs">Retry</button>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-dashed border-stone-300 rounded-2xl p-10 text-center text-stone-500">
          Nothing here yet. Click <span className="font-medium text-stone-800">New</span> to add one.
        </div>
      ) : (
        <>
          {/* Mobile: card list. Desktop: table. */}
          <div className="md:hidden space-y-3">
            {items.map((row, idx) => (
              <div key={row.id} className="bg-white rounded-2xl shadow-sm p-4">
                <div className="flex items-start gap-3">
                  {columns.find((c) => c.image) && (() => {
                    const imgCol = columns.find((c) => c.image)!;
                    const v = (row as any)[imgCol.key];
                    return v ? (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                        <Image src={v} alt="" fill className="object-cover" sizes="64px" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-stone-100 shrink-0" />
                    );
                  })()}
                  <div className="min-w-0 flex-1 space-y-1">
                    {columns.filter((c) => !c.image).map((c) => {
                      const val = (row as any)[c.key];
                      return (
                        <div key={c.key} className="text-sm">
                          <span className="text-stone-500 mr-2 text-xs uppercase tracking-wide">{c.label}:</span>
                          <span className="text-stone-800 break-words">{val || "—"}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
                  <div className="flex items-center gap-1">
                    <button onClick={() => move(row, -1)} disabled={idx === 0} className="p-1.5 rounded hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Move up">
                      <ChevronUp size={16} />
                    </button>
                    <button onClick={() => move(row, 1)} disabled={idx === items.length - 1} className="p-1.5 rounded hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Move down">
                      <ChevronDown size={16} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link href={`${basePath}/${row.id}`} className="text-sm text-stone-700 hover:underline">Edit</Link>
                    <button onClick={() => remove(row)} className="text-sm text-red-600 hover:underline">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 text-left text-xs uppercase tracking-widest text-stone-500">
                <tr>
                  <th className="px-4 py-3 w-20">Order</th>
                  {columns.map((c) => (
                    <th key={c.key} className="px-4 py-3">{c.label}</th>
                  ))}
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {items.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <button onClick={() => move(row, -1)} disabled={idx === 0} className="p-1 rounded hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Move up">
                          <ChevronUp size={14} />
                        </button>
                        <button onClick={() => move(row, 1)} disabled={idx === items.length - 1} className="p-1 rounded hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Move down">
                          <ChevronDown size={14} />
                        </button>
                      </div>
                    </td>
                    {columns.map((c) => {
                      const val = (row as any)[c.key];
                      return (
                        <td key={c.key} className="px-4 py-3 align-middle">
                          {c.image ? (
                            val ? (
                              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-stone-100">
                                <Image src={val} alt="" fill className="object-cover" sizes="48px" />
                              </div>
                            ) : (
                              <span className="text-xs text-stone-400">—</span>
                            )
                          ) : c.truncate ? (
                            <span className="text-sm text-stone-700 line-clamp-1 max-w-md inline-block">{val || <span className="text-stone-400">—</span>}</span>
                          ) : (
                            <span className="text-sm text-stone-800">{val || <span className="text-stone-400">—</span>}</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <Link href={`${basePath}/${row.id}`} className="text-sm text-stone-700 hover:underline mr-4">Edit</Link>
                      <button onClick={() => remove(row)} className="text-sm text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
