"use client";
import { useEffect, useState } from "react";
import { ImageUpload } from "./ImageUpload";

type Settings = Record<string, any>;

export default function SiteSettingsAdmin() {
  const [s, setS] = useState<Settings | null>(null);
  const [msg, setMsg] = useState("");
  useEffect(() => { fetch("/api/admin/site_settings").then(r => r.json()).then(d => setS(d[0] || { id: 1 })); }, []);
  if (!s) return <p>Loading…</p>;

  async function save() {
    const r = await fetch("/api/admin/site_settings", { method: "PATCH", body: JSON.stringify(s) });
    setMsg(r.ok ? "Saved" : "Error");
    setTimeout(() => setMsg(""), 2000);
  }
  const field = (k: string, label: string, type: "text" | "textarea" = "text") => (
    <label key={k} className="block">
      <span className="text-sm font-medium">{label}</span>
      {type === "textarea" ? (
        <textarea value={s[k] || ""} onChange={(e) => setS({ ...s, [k]: e.target.value })} rows={3} className="w-full mt-1 px-3 py-2 rounded border bg-white" />
      ) : (
        <input value={s[k] || ""} onChange={(e) => setS({ ...s, [k]: e.target.value })} className="w-full mt-1 px-3 py-2 rounded border bg-white" />
      )}
    </label>
  );
  return (
    <div className="max-w-3xl space-y-5">
      <h1 className="font-serif text-3xl">Site settings</h1>
      {field("hero_title", "Hero title")}
      {field("hero_subtitle", "Hero subtitle")}
      {field("hero_description", "Hero description", "textarea")}
      <div>
        <span className="text-sm font-medium">Hero image</span>
        <div className="mt-1"><ImageUpload value={s.hero_image} onChange={(url) => setS({ ...s, hero_image: url })} /></div>
      </div>
      {field("cta_title", "Closing CTA title")}
      {field("cta_subtitle", "Closing CTA subtitle", "textarea")}
      <hr />
      {field("address", "Address", "textarea")}
      {field("email", "Email")}
      {field("phone", "Phone")}
      {field("instagram", "Instagram URL")}
      {field("facebook", "Facebook URL")}
      {field("pinterest", "Pinterest URL")}
      <div className="flex items-center gap-3 pt-4">
        <button onClick={save} className="px-6 py-2.5 rounded-full bg-[#1a1613] text-white">Save</button>
        {msg && <span className="text-sm text-green-700">{msg}</span>}
      </div>
    </div>
  );
}
