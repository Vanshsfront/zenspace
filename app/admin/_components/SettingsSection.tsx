"use client";
import { useEffect, useState } from "react";
import { ImageUpload } from "../ImageUpload";
import { FileUpload } from "./FileUpload";

export type SettingsField = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "image" | "pdf";
  help?: string;
};

/**
 * Edits a subset of the single-row site_settings record. Each admin section
 * page (Home, Piercing, About) renders only its own fields so the panel is
 * cleanly divided per website section.
 */
export function SettingsSection({ fields }: { fields: SettingsField[] }) {
  const [s, setS] = useState<Record<string, any> | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("/api/admin/site_settings", { cache: "no-store" });
        if (cancelled) return;
        const d = r.ok ? await r.json() : [];
        setS(Array.isArray(d) ? d[0] || { id: 1 } : d || { id: 1 });
      } catch {
        if (!cancelled) setS({ id: 1 });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!s) return <p className="text-stone-500">Loading…</p>;

  async function save() {
    const r = await fetch("/api/admin/site_settings", { method: "PATCH", body: JSON.stringify(s) });
    setMsg(r.ok ? "Saved" : "Error");
    setTimeout(() => setMsg(""), 2000);
  }

  return (
    <div className="max-w-3xl space-y-5">
      {fields.map((f) => (
        <label key={f.key} className="block">
          <span className="text-sm font-medium">{f.label}</span>
          {f.help && <span className="block text-xs text-stone-500 mb-1">{f.help}</span>}
          <div className="mt-1">
            {f.type === "image" ? (
              <ImageUpload value={s![f.key]} onChange={(url) => setS({ ...s!, [f.key]: url })} />
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
      ))}
      <div className="flex items-center gap-3 pt-2">
        <button onClick={save} className="px-6 py-2.5 rounded-full bg-stone-900 text-white hover:bg-stone-800">
          Save
        </button>
        {msg && <span className="text-sm text-green-700">{msg}</span>}
      </div>
    </div>
  );
}
