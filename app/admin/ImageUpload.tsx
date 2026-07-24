"use client";
import { useState } from "react";
import { uploadMedia } from "@/lib/uploadMedia";

export function ImageUpload({ value, onChange }: { value?: string | null; onChange: (url: string) => void }) {
  const [busy, setBusy] = useState(false);
  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    try {
      const url = await uploadMedia(f);
      onChange(url);
    } catch (err: any) {
      alert(err?.message || "Upload failed");
    } finally {
      setBusy(false);
    }
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
