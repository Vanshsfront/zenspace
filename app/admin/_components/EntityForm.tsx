"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "../ImageUpload";
import { useToast } from "./Toast";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export type FieldDef = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "image" | "url";
  required?: boolean;
  placeholder?: string;
  help?: string;
};

type Props = {
  table: string;
  id?: string;
  fields: FieldDef[];
  /** Where to navigate after a successful save / cancel. */
  returnTo: string;
  /** Initial values for /new screens (used to pre-fill defaults like sort_order). */
  defaults?: Record<string, any>;
};

export function EntityForm({ table, id, fields, returnTo, defaults }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [data, setData] = useState<Record<string, any>>(defaults ?? {});
  const [loading, setLoading] = useState<boolean>(Boolean(id));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      const r = await fetch(`/api/admin/${table}/${id}`);
      if (!r.ok) {
        toast.push("error", "Could not load record");
        router.push(returnTo);
        return;
      }
      const d = await r.json();
      if (!cancelled) {
        setData(d);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, table]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      // Auto-derive a URL slug from name when the user left it blank.
      // The admin can override; this is just a safety net so /category/[slug]
      // and /our-artist/[slug] always resolve.
      const payload: Record<string, any> = { ...data };
      if (
        fields.some((f) => f.key === "slug") &&
        !payload.slug &&
        typeof payload.name === "string"
      ) {
        payload.slug = slugify(payload.name);
      }

      // Validate required fields after slug auto-fill so users don't have to type it.
      for (const f of fields) {
        if (f.required && !payload[f.key]) {
          toast.push("error", `${f.label} is required`);
          setSaving(false);
          return;
        }
      }
      const r = await fetch(`/api/admin/${table}`, {
        method: id ? "PATCH" : "POST",
        body: JSON.stringify(id ? { id, ...payload } : payload),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        toast.push("error", j.error || "Save failed");
        setSaving(false);
        return;
      }
      toast.push("success", id ? "Saved" : "Created");
      router.push(returnTo);
      router.refresh();
    } catch (err: any) {
      toast.push("error", err?.message || "Save failed");
      setSaving(false);
    }
  }

  if (loading) return <p className="text-stone-500">Loading…</p>;

  const set = (k: string, v: any) => setData((prev) => ({ ...prev, [k]: v }));

  const renderField = (f: FieldDef) => {
    const v = data[f.key];
    if (f.type === "image") return <ImageUpload value={v} onChange={(u) => set(f.key, u)} />;
    if (f.type === "textarea")
      return <textarea value={v ?? ""} placeholder={f.placeholder} onChange={(e) => set(f.key, e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl border bg-white" />;
    if (f.type === "number")
      return <input type="number" value={v ?? ""} placeholder={f.placeholder} onChange={(e) => set(f.key, e.target.value === "" ? null : Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border bg-white" />;
    if (f.type === "url")
      return <input type="url" value={v ?? ""} placeholder={f.placeholder} onChange={(e) => set(f.key, e.target.value)} className="w-full px-4 py-3 rounded-xl border bg-white" />;
    return <input value={v ?? ""} placeholder={f.placeholder} onChange={(e) => set(f.key, e.target.value)} className="w-full px-4 py-3 rounded-xl border bg-white" />;
  };

  return (
    <form onSubmit={save} className="max-w-2xl space-y-5">
      {fields.map((f) => (
        <label key={f.key} className="block">
          <span className="text-sm font-medium text-stone-800">
            {f.label}
            {f.required && <span className="text-red-600 ml-1">*</span>}
          </span>
          {f.help && <span className="block text-xs text-stone-500 mb-1">{f.help}</span>}
          <div className="mt-1">{renderField(f)}</div>
        </label>
      ))}
      <div className="flex items-center gap-2 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-full bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-60"
        >
          {saving ? "Saving…" : id ? "Save changes" : "Create"}
        </button>
        <button
          type="button"
          onClick={() => router.push(returnTo)}
          className="px-5 py-2.5 rounded-full text-stone-700 hover:bg-stone-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
