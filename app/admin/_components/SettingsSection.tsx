"use client";
import { useEffect, useState } from "react";
import { ImageUpload } from "../ImageUpload";
import { FileUpload } from "./FileUpload";

export type SettingsField = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "image" | "video" | "pdf";
  help?: string;
  /** Renders a divider + subheading above this field, grouping what follows. */
  heading?: string;
};

/**
 * Edits a subset of the single-row site_settings record. Each admin section
 * page (Home, Piercing, About, Site-wide) renders only its own fields so the
 * panel is cleanly divided per website section.
 */
export function SettingsSection({ fields }: { fields: SettingsField[] }) {
  const [s, setS] = useState<Record<string, any> | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("/api/admin/site_settings", { cache: "no-store" });
        if (cancelled) return;
        if (!r.ok) {
          // Surface the reason instead of rendering an empty form. A blank form
          // reads as "these fields don't work" when the real cause is a failing
          // query (e.g. a column the database doesn't have yet).
          const j = await r.json().catch(() => ({}));
          setLoadError(j.error || `Request failed (${r.status})`);
          setS({ id: 1 });
          return;
        }
        const d = await r.json();
        setS(Array.isArray(d) ? d[0] || { id: 1 } : d || { id: 1 });
      } catch (e: any) {
        if (!cancelled) {
          setLoadError(e?.message || "Could not reach the server");
          setS({ id: 1 });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!s) return <p className="text-stone-500">Loading…</p>;

  async function save() {
    setSaveError(null);
    const r = await fetch("/api/admin/site_settings", { method: "PATCH", body: JSON.stringify(s) });
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      setSaveError(j.error || `Save failed (${r.status})`);
      return;
    }
    setMsg("Saved");
    setTimeout(() => setMsg(""), 2000);
  }

  return (
    <div className="max-w-3xl space-y-5">
      {loadError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-medium">Couldn’t load the saved settings.</p>
          <p className="mt-1 text-red-700">{loadError}</p>
          <p className="mt-2 text-red-700">
            The fields below are showing empty because of this, not because they’re unset. Saving
            will most likely fail until it’s resolved.
          </p>
        </div>
      )}

      {fields.map((f) => (
        <div key={f.key}>
          {f.heading && (
            <>
              <hr className="my-6" />
              <h2 className="font-serif text-xl text-stone-700 mb-4">{f.heading}</h2>
            </>
          )}
          <label className="block">
            <span className="text-sm font-medium">{f.label}</span>
            {f.help && <span className="block text-xs text-stone-500 mb-1">{f.help}</span>}
            <div className="mt-1">
              {f.type === "image" ? (
                <ImageUpload value={s![f.key]} onChange={(url) => setS({ ...s!, [f.key]: url })} />
              ) : f.type === "video" ? (
                <FileUpload value={s![f.key]} onChange={(url) => setS({ ...s!, [f.key]: url })} kind="video" accept="video/*" />
              ) : f.type === "pdf" ? (
                <FileUpload value={s![f.key]} onChange={(url) => setS({ ...s!, [f.key]: url })} kind="pdf" accept="application/pdf" />
              ) : f.type === "textarea" ? (
                <textarea
                  value={s![f.key] ?? ""}
                  onChange={(e) => setS({ ...s!, [f.key]: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border bg-white"
                />
              ) : (
                <input
                  value={s![f.key] ?? ""}
                  onChange={(e) => setS({ ...s!, [f.key]: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border bg-white"
                />
              )}
            </div>
          </label>
        </div>
      ))}

      {saveError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-medium">Save failed.</p>
          <p className="mt-1 text-red-700">{saveError}</p>
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button onClick={save} className="px-6 py-2.5 rounded-full bg-stone-900 text-white hover:bg-stone-800">
          Save
        </button>
        {msg && <span className="text-sm text-green-700">{msg}</span>}
      </div>
    </div>
  );
}
