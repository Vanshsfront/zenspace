"use client";

import { useCallback, useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, ChevronUp, ChevronDown } from "lucide-react";
import { useToast } from "../../../_components/Toast";
import { useConfirm } from "../../../_components/ConfirmDialog";

type Product = {
  id: string;
  category_id: string;
  name: string;
  photo: string | null;
  price_inr: number | null;
  description: string | null;
  sort_order: number | null;
};

type Category = { id: string; name: string };

export default function ProductsListPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: categoryId } = use(params);
  const [items, setItems] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const { confirm } = useConfirm();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsRes, categoryRes] = await Promise.all([
        fetch(`/api/admin/earring_products`, { cache: "no-store" }),
        fetch(`/api/admin/earring_categories/${categoryId}`, { cache: "no-store" }),
      ]);
      const productsBody = await productsRes.json().catch(() => null);
      if (!productsRes.ok || !Array.isArray(productsBody)) {
        setItems([]);
        setError((productsBody && productsBody.error) || `HTTP ${productsRes.status}`);
      } else {
        const filtered = (productsBody as Product[]).filter((p) => p.category_id === categoryId);
        // Sort client-side by sort_order then name (mirrors the server orderBy)
        filtered.sort((a, b) => {
          const ao = a.sort_order ?? 0;
          const bo = b.sort_order ?? 0;
          if (ao !== bo) return ao - bo;
          return a.name.localeCompare(b.name);
        });
        setItems(filtered);
      }
      if (categoryRes.ok) {
        const catBody = await categoryRes.json().catch(() => null);
        if (catBody && catBody.id) setCategory(catBody as Category);
      }
    } catch (e: any) {
      setItems([]);
      setError(e?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(row: Product) {
    const ok = await confirm({
      title: "Delete this product?",
      message: "This action cannot be undone.",
      destructive: true,
      confirmLabel: "Delete",
    });
    if (!ok) return;
    const r = await fetch(`/api/admin/earring_products`, {
      method: "DELETE",
      body: JSON.stringify({ id: row.id }),
    });
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      toast.push("error", j.error || "Delete failed");
      return;
    }
    toast.push("success", "Deleted");
    load();
  }

  async function move(row: Product, direction: -1 | 1) {
    const idx = items.findIndex((it) => it.id === row.id);
    const swap = items[idx + direction];
    if (!swap) return;
    const a = row.sort_order ?? idx;
    const b = swap.sort_order ?? idx + direction;
    const next = [...items];
    next[idx + direction] = row;
    next[idx] = swap;
    setItems(next);
    await Promise.all([
      fetch(`/api/admin/earring_products`, { method: "PATCH", body: JSON.stringify({ id: row.id, sort_order: b }) }),
      fetch(`/api/admin/earring_products`, { method: "PATCH", body: JSON.stringify({ id: swap.id, sort_order: a }) }),
    ]);
  }

  return (
    <div className="max-w-5xl">
      <Link
        href={`/admin/earrings/${categoryId}`}
        className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 mb-6"
      >
        <ArrowLeft size={16} /> Back to category
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl">
          Products{category ? ` — ${category.name}` : ""}
        </h1>
        <Link
          href={`/admin/earrings/${categoryId}/products/new`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-900 text-white text-sm hover:bg-stone-800 shadow-md"
        >
          <Plus size={16} /> New product
        </Link>
      </div>

      {loading ? (
        <p className="text-stone-500">Loading…</p>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700 text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span><strong>Couldn't load.</strong> {error}</span>
          <button onClick={load} className="self-start px-4 py-2 rounded-full bg-red-600 text-white text-xs">Retry</button>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-dashed border-stone-300 rounded-2xl p-10 text-center text-stone-500">
          No products yet. Click <span className="font-medium text-stone-800">New product</span> to add one.
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50 text-left text-xs uppercase tracking-widest text-stone-500">
              <tr>
                <th className="px-4 py-3 w-20">Order</th>
                <th className="px-4 py-3">Photo</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Price</th>
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
                  <td className="px-4 py-3 align-middle">
                    {row.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={row.photo} alt="" className="w-12 h-12 rounded-lg object-cover bg-stone-100" />
                    ) : (
                      <span className="text-xs text-stone-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <span className="text-sm text-stone-800">{row.name}</span>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    {row.price_inr != null ? (
                      <span className="text-sm text-stone-800">₹{row.price_inr.toLocaleString("en-IN")}</span>
                    ) : (
                      <span className="text-stone-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Link
                      href={`/admin/earrings/${categoryId}/products/${row.id}`}
                      className="text-sm text-stone-700 hover:underline mr-4"
                    >
                      Edit
                    </Link>
                    <button onClick={() => remove(row)} className="text-sm text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
