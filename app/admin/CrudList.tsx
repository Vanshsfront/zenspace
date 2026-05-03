"use client";
import { useEffect, useMemo, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { ImageUpload } from "./ImageUpload";
import { useToast } from "./_components/Toast";
import { useConfirm } from "./_components/ConfirmDialog";

export type FieldDef = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "image" | "select";
  options?: { value: string; label: string }[];
  hidden?: boolean;
};

type Props = {
  table: string;
  title: string;
  fields: FieldDef[];
  /** Filter the list by a foreign-key column, e.g. { key: "artist_id", value: "<uuid>" }. */
  filter?: { key: string; value: string };
  /** Hide the standalone search bar (e.g., when this list is already scoped). */
  disableSearch?: boolean;
  /** External "reload" trigger from the parent (e.g., right after a multi-upload). */
  reloadKey?: number;
};

export function CrudList({ table, title, fields, filter, disableSearch, reloadKey }: Props) {
  const [items, setItems] = useState<any[]>([]);
  const [draft, setDraft] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const toast = useToast();
  const { confirm } = useConfirm();

  const visibleFields = useMemo(() => fields.filter((f) => !f.hidden), [fields]);

  async function load(q?: string) {
    setLoading(true);
    const url = new URL(`/api/admin/${table}`, window.location.origin);
    if (q) url.searchParams.set("q", q);
    const r = await fetch(url.toString());
    const data = await r.json();
    const list = Array.isArray(data) ? data : [];
    setItems(filter ? list.filter((it) => it[filter.key] === filter.value) : list);
    setLoading(false);
  }

  useEffect(() => {
    const t = setTimeout(() => load(search), search ? 250 : 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filter?.value, reloadKey]);

  async function create() {
    const body = filter ? { ...draft, [filter.key]: filter.value } : draft;
    const r = await fetch(`/api/admin/${table}`, { method: "POST", body: JSON.stringify(body) });
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      toast.push("error", j.error || "Create failed");
      return;
    }
    toast.push("success", "Added");
    setDraft({});
    load(search);
  }

  async function update(id: string, patch: any) {
    const r = await fetch(`/api/admin/${table}`, { method: "PATCH", body: JSON.stringify({ id, ...patch }) });
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      toast.push("error", j.error || "Update failed");
    }
    load(search);
  }

  async function remove(id: string) {
    const ok = await confirm({ title: "Delete this row?", message: "This action cannot be undone.", destructive: true, confirmLabel: "Delete" });
    if (!ok) return;
    const r = await fetch(`/api/admin/${table}`, { method: "DELETE", body: JSON.stringify({ id }) });
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      toast.push("error", j.error || "Delete failed");
      return;
    }
    toast.push("success", "Deleted");
    load(search);
  }

  async function move(idx: number, direction: -1 | 1) {
    const row = items[idx];
    const swap = items[idx + direction];
    if (!row || !swap) return;
    const a = row.sort_order ?? idx;
    const b = swap.sort_order ?? idx + direction;
    const next = [...items];
    next[idx + direction] = row;
    next[idx] = swap;
    setItems(next);
    await Promise.all([
      fetch(`/api/admin/${table}`, { method: "PATCH", body: JSON.stringify({ id: row.id, sort_order: b }) }),
      fetch(`/api/admin/${table}`, { method: "PATCH", body: JSON.stringify({ id: swap.id, sort_order: a }) }),
    ]);
  }

  const renderField = (val: any, onChange: (v: any) => void, f: FieldDef) => {
    if (f.type === "image") return <ImageUpload value={val} onChange={onChange} />;
    if (f.type === "textarea") return <textarea value={val ?? ""} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg border bg-white" />;
    if (f.type === "number") return <input type="number" value={val ?? ""} onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border bg-white" />;
    if (f.type === "select")
      return (
        <select value={val ?? ""} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-white">
          <option value="">— Select —</option>
          {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      );
    return <input value={val ?? ""} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-white" />;
  };

  return (
    <div className="max-w-5xl">
      {(title || !disableSearch) && (
        <div className="flex items-center justify-between mb-6 gap-4">
          {title ? <h1 className="font-serif text-3xl">{title}</h1> : <span />}
          {!disableSearch && (
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="px-4 py-2 rounded-full border bg-white w-64 text-sm"
            />
          )}
        </div>
      )}

      <div className="bg-white p-5 rounded-xl mb-8 space-y-3 shadow-sm">
        <h2 className="font-medium">Add new</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {visibleFields.map((f) => (
            <label key={f.key} className="block">
              <span className="text-xs text-stone-600">{f.label}</span>
              <div className="mt-1">{renderField(draft[f.key], (v) => setDraft({ ...draft, [f.key]: v }), f)}</div>
            </label>
          ))}
        </div>
        <button onClick={create} className="px-5 py-2 rounded-full bg-stone-900 text-white text-sm hover:bg-stone-800">Add</button>
      </div>

      {loading ? (
        <p className="text-stone-500">Loading…</p>
      ) : (
        <div className="space-y-4">
          {items.map((it, idx) => (
            <div key={it.id} className="bg-white p-5 rounded-xl shadow-sm">
              <div className="grid md:grid-cols-2 gap-3">
                {visibleFields.map((f) => (
                  <label key={f.key} className="block">
                    <span className="text-xs text-stone-600">{f.label}</span>
                    <div className="mt-1">{renderField(it[f.key], (v) => update(it.id, { [f.key]: v }), f)}</div>
                  </label>
                ))}
              </div>
              <div className="flex justify-between items-center pt-3 mt-3 border-t border-stone-100">
                <div className="flex items-center gap-1">
                  <button onClick={() => move(idx, -1)} disabled={idx === 0} className="p-1.5 rounded hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Move up">
                    <ChevronUp size={16} />
                  </button>
                  <button onClick={() => move(idx, 1)} disabled={idx === items.length - 1} className="p-1.5 rounded hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Move down">
                    <ChevronDown size={16} />
                  </button>
                </div>
                <button onClick={() => remove(it.id)} className="text-sm text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-stone-500">No items yet.</p>}
        </div>
      )}
    </div>
  );
}
