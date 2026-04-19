"use client";
import { useState } from "react";

export function ImageUpload({ value, onChange }: { value?: string | null; onChange: (url: string) => void }) {
  const [busy, setBusy] = useState(false);
  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    const fd = new FormData();
    fd.append("file", f);
    const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const j = await r.json();
    if (j.url) onChange(j.url);
    else alert(j.error);
    setBusy(false);
  }
  return (
    <div className="flex items-center gap-3">
      {value && <img src={value} alt="" className="w-16 h-16 rounded object-cover" />}
      <label className="px-3 py-2 bg-stone-200 rounded cursor-pointer text-sm">
        {busy ? "Uploading…" : "Upload"}
        <input type="file" accept="image/*" onChange={upload} className="hidden" />
      </label>
      {value && <button type="button" onClick={() => onChange("")} className="text-xs text-red-600">Remove</button>}
    </div>
  );
}
