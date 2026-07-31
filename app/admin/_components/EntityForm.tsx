"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "../ImageUpload";
import { useToast } from "./Toast";
import { fieldMax, isNearLimit } from "@/lib/edit/fields";

/**
 * Character caps come from lib/edit/fields.ts, the same registry the inline
 * editors on the public site and the site_settings screens read. A value the
 * inline editor refuses must not be typeable here either: the caps exist to
 * keep the layout from breaking, and it breaks the same way whichever surface
 * the text arrived through. Fields with no registry entry (slugs, sort orders,
 * the service-form builder) are left exactly as they were.
 */
export function CharCount({ length, max }: { length: number; max: number }) {
  return (
    <span
      className={`text-xs tabular-nums ${
        isNearLimit(length, max) ? "text-amber-600 font-medium" : "text-stone-400"
      }`}
    >
      {length}/{max}
    </span>
  );
}

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
  const [saveError, setSaveError] = useState<string | null>(null);

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
        // Hydrate String[] columns back into the free-text input format the
        // form uses (comma-separated). Currently only `options` on
        // service_form_fields needs this — the admin route re-splits on save.
        for (const f of fields) {
          if (f.key === "options" && Array.isArray(d[f.key])) {
            d[f.key] = (d[f.key] as unknown[]).join(", ");
          }
        }
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
    setSaveError(null);
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
          // Same panel as a server rejection, so there is one place to look
          // when a save doesn't go through.
          setSaveError(`${f.label} is required.`);
          setSaving(false);
          return;
        }
      }
      const r = await fetch(`/api/admin/${table}`, {
        method: id ? "PATCH" : "POST",
        body: JSON.stringify(id ? { id, ...payload } : payload),
      });
      if (!r.ok) {
        // The server rejects over-length values with a 400 naming the field and
        // its cap. That is too much to read inside a 3.5s toast, and it points
        // at a specific input the user has to go fix, so it stays on screen
        // next to the Save button instead.
        const j = await r.json().catch(() => ({}));
        setSaveError(j.error || `Save failed (${r.status})`);
        setSaving(false);
        return;
      }
      toast.push("success", id ? "Saved" : "Created");
      router.push(returnTo);
      router.refresh();
    } catch (err: any) {
      setSaveError(err?.message || "Save failed");
      setSaving(false);
    }
  }

  if (loading) return <p className="text-stone-500">Loading…</p>;

  const set = (k: string, v: any) => setData((prev) => ({ ...prev, [k]: v }));

  // `max` is the registry cap for this column, or undefined when the field has
  // none. Undefined means "behave exactly as before": no counter, no refusal.
  const renderField = (f: FieldDef, max: number | undefined) => {
    const v = data[f.key];
    if (f.type === "image") return <ImageUpload value={v} onChange={(u) => set(f.key, u)} />;
    if (f.type === "textarea")
      return <textarea value={v ?? ""} placeholder={f.placeholder} onChange={(e) => set(f.key, e.target.value)} maxLength={max} rows={4} className="w-full px-4 py-3 rounded-xl border bg-white" />;
    if (f.type === "number")
      // maxLength does nothing on a number input, so the digit count is capped
      // by hand: an over-long entry is dropped rather than truncated, which
      // would silently turn a mistyped price into a different one.
      return (
        <input
          type="number"
          value={v ?? ""}
          placeholder={f.placeholder}
          onChange={(e) => {
            const raw = e.target.value;
            if (max !== undefined && raw.length > max) return;
            set(f.key, raw === "" ? null : Number(raw));
          }}
          className="w-full px-4 py-3 rounded-xl border bg-white"
        />
      );
    if (f.type === "url")
      return <input type="url" value={v ?? ""} placeholder={f.placeholder} onChange={(e) => set(f.key, e.target.value)} maxLength={max} className="w-full px-4 py-3 rounded-xl border bg-white" />;
    return <input value={v ?? ""} placeholder={f.placeholder} onChange={(e) => set(f.key, e.target.value)} maxLength={max} className="w-full px-4 py-3 rounded-xl border bg-white" />;
  };

  return (
    <form onSubmit={save} className="max-w-2xl space-y-5">
      {fields.map((f) => {
        const max = fieldMax(table, f.key);
        // A "3/7" beside a rating or a price reads as a limit on the value
        // rather than on its digits, so the counter is for typed copy only.
        const showCount = max !== undefined && f.type !== "number";
        return (
          <label key={f.key} className="block">
            <span className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-medium text-stone-800">
                {f.label}
                {f.required && <span className="text-red-600 ml-1">*</span>}
              </span>
              {showCount && <CharCount length={String(data[f.key] ?? "").length} max={max} />}
            </span>
            {f.help && <span className="block text-xs text-stone-500 mb-1">{f.help}</span>}
            <div className="mt-1">{renderField(f, max)}</div>
          </label>
        );
      })}
      {saveError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-medium">Save failed.</p>
          <p className="mt-1 text-red-700">{saveError}</p>
        </div>
      )}
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
