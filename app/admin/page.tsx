"use client";
import { useEffect, useState } from "react";
import { ImageUpload } from "./ImageUpload";
import { FileUpload } from "./_components/FileUpload";

type Settings = Record<string, any>;

export default function SiteSettingsAdmin() {
  const [s, setS] = useState<Settings | null>(null);
  const [msg, setMsg] = useState("");
  // Write-only: the current password is never loaded back from the server.
  // Left blank, it keeps the existing password on save.
  const [newPw, setNewPw] = useState("");

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
    let ok = r.ok;
    // The password lives in its own table — send it only when a new one was typed.
    if (ok && newPw.trim()) {
      const p = await fetch("/api/admin/password", { method: "POST", body: JSON.stringify({ password: newPw.trim() }) });
      ok = p.ok;
      if (p.ok) setNewPw("");
    }
    setMsg(ok ? "Saved" : "Error");
    setTimeout(() => setMsg(""), 2000);
  }

  const field = (k: string, label: string, type: "text" | "textarea" = "text", help?: string) => (
    <label key={k} className="block">
      <span className="text-sm font-medium">{label}</span>
      {help && <span className="block text-xs text-stone-500 mb-1">{help}</span>}
      {type === "textarea" ? (
        <textarea value={s[k] ?? ""} onChange={(e) => setS({ ...s, [k]: e.target.value })} rows={3} className="w-full mt-1 px-3 py-2 rounded-lg border bg-white" />
      ) : (
        <input value={s[k] ?? ""} onChange={(e) => setS({ ...s, [k]: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border bg-white" />
      )}
    </label>
  );

  return (
    <div className="max-w-3xl space-y-5">
      <h1 className="font-serif text-3xl">Home, contact &amp; social</h1>
      <p className="text-stone-600 text-sm">
        Hero, closing CTA and the global contact / social details. Piercing and About
        copy now live in their own sections in the sidebar.
      </p>

      <h2 className="font-serif text-xl text-stone-700 pt-4">Hero &amp; home</h2>
      {field("hero_title", "Hero title")}
      {field("hero_subtitle", "Hero subtitle")}
      {field("hero_description", "Hero description", "textarea")}
      <div>
        <span className="text-sm font-medium">Hero image</span>
        <div className="mt-1"><ImageUpload value={s.hero_image} onChange={(url) => setS({ ...s, hero_image: url })} /></div>
      </div>
      <div>
        <span className="text-sm font-medium">Hero video (optional)</span>
        <span className="block text-xs text-stone-500 mb-1">Home → hero. Plays muted & looping in place of the hero image. Leave empty to show the image.</span>
        <div className="mt-1"><FileUpload value={s.hero_video} onChange={(url) => setS({ ...s, hero_video: url })} kind="video" accept="video/*" /></div>
      </div>
      {field("cta_title", "Closing CTA title")}
      {field("cta_subtitle", "Closing CTA subtitle", "textarea")}

      <hr className="my-2" />
      <h2 className="font-serif text-xl text-stone-700">Contact</h2>
      {field("address", "Address", "textarea")}
      {field("email", "Email")}
      {field("phone", "Phone")}
      {field("whatsapp", "WhatsApp number", "text", "Use international format with country code, no '+', spaces or dashes. e.g., 917208388209")}

      <hr className="my-2" />
      <h2 className="font-serif text-xl text-stone-700">Social</h2>
      {field("instagram", "Instagram URL")}
      {field("facebook", "Facebook URL")}
      {field("pinterest", "Pinterest URL")}

      <hr className="my-2" />
      <h2 className="font-serif text-xl text-stone-700">Google reviews</h2>
      <p className="text-stone-500 text-xs -mt-2">Shown in the rating badge on the contact page. Update the count to match your live Google listing.</p>
      {field("google_review_count", "Number of reviews", "text", "Whole number, e.g. 193")}
      {field("google_reviews_url", "Google reviews link", "text", "Tapping the badge opens this URL")}

      <hr className="my-2" />
      <h2 className="font-serif text-xl text-stone-700">Admin password</h2>
      <label className="block">
        <span className="text-sm font-medium">New password</span>
        <span className="block text-xs text-stone-500 mb-1">Leave blank to keep the current password. Setting a new one takes effect on your next sign-in.</span>
        <input
          type="password"
          value={newPw}
          onChange={(e) => setNewPw(e.target.value)}
          autoComplete="new-password"
          placeholder="••••••••"
          className="w-full mt-1 px-3 py-2 rounded-lg border bg-white"
        />
      </label>

      <div className="flex items-center gap-3 pt-4">
        <button onClick={save} className="px-6 py-2.5 rounded-full bg-stone-900 text-white hover:bg-stone-800">Save</button>
        {msg && <span className="text-sm text-green-700">{msg}</span>}
      </div>
    </div>
  );
}
