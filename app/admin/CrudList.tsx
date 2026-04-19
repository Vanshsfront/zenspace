"use client";
import { useEffect, useState } from "react";
import { ImageUpload } from "./ImageUpload";

export type FieldDef = { key: string; label: string; type?: "text" | "textarea" | "number" | "image" };

export function CrudList({ table, title, fields }: { table: string; title: string; fields: FieldDef[] }) {
  const [items, setItems] = useState<any[]>([]);
  const [draft, setDraft] = useState<any>({});
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const r = await fetch(`/api/admin/${table}`);
    setItems(await r.json());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function create() {
    await fetch(`/api/admin/${table}`, { method: "POST", body: JSON.stringify(draft) });
    setDraft({});
    load();
  }
  async function update(id: string, patch: any) {
    await fetch(`/api/admin/${table}`, { method: "PATCH", body: JSON.stringify({ id, ...patch }) });
    load();
  }
  async function remove(id: string) {
    if (!confirm("Delete?")) return;
    await fetch(`/api/admin/${table}`, { method: "DELETE", body: JSON.stringify({ id }) });
    load();
  }

  const renderField = (val: any, onChange: (v: any) => void, f: FieldDef) => {
    if (f.type === "image") return <ImageUpload value={val} onChange={onChange} />;
    if (f.type === "textarea") return <textarea value={val || ""} onChange={(e) => onChange(e.target.value)} rows={2} className="w-full px-3 py-2 rounded border bg-white" />;
    if (f.type === "number") return <input type="number" value={val ?? ""} onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))} className="w-full px-3 py-2 rounded border bg-white" />;
    return <input value={val || ""} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 rounded border bg-white" />;
  };

  return (
    <div className="max-w-5xl">
      <h1 className="font-serif text-3xl mb-6">{title}</h1>

      <div className="bg-white p-5 rounded-xl mb-8 space-y-3">
        <h2 className="font-medium">Add new</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {fields.map((f) => (
            <label key={f.key} className="block">
              <span className="text-xs text-stone-600">{f.label}</span>
              <div className="mt-1">{renderField(draft[f.key], (v) => setDraft({ ...draft, [f.key]: v }), f)}</div>
            </label>
          ))}
        </div>
        <button onClick={create} className="px-5 py-2 rounded-full bg-[#1a1613] text-white text-sm">Add</button>
      </div>

      {loading ? <p>Loading…</p> : (
        <div className="space-y-4">
          {items.map((it) => (
            <div key={it.id} className="bg-white p-5 rounded-xl grid md:grid-cols-2 gap-3">
              {fields.map((f) => (
                <label key={f.key} className="block">
                  <span className="text-xs text-stone-600">{f.label}</span>
                  <div className="mt-1">{renderField(it[f.key], (v) => update(it.id, { [f.key]: v }), f)}</div>
                </label>
              ))}
              <div className="md:col-span-2 flex justify-end">
                <button onClick={() => remove(it.id)} className="text-sm text-red-600">Delete</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-stone-500">No items yet.</p>}
        </div>
      )}
    </div>
  );
}
