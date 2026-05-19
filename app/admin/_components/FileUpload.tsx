"use client";
import { useState } from "react";

/**
 * Generic file uploader (video, PDF, etc.) — same /api/admin/upload endpoint
 * as ImageUpload, but accepts non-image types and shows a filename/preview
 * appropriate to the kind instead of an <img>.
 */
export function FileUpload({
  value,
  onChange,
  accept = "*/*",
  kind = "file",
}: {
  value?: string | null;
  onChange: (url: string) => void;
  accept?: string;
  kind?: "video" | "pdf" | "file";
}) {
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
      {value && kind === "video" && (
        <video src={value} className="w-20 h-28 rounded object-cover bg-stone-900" muted />
      )}
      {value && kind !== "video" && (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-xs text-stone-700 underline max-w-[160px] truncate">
          {value.split("/").pop()}
        </a>
      )}
      <label className="px-3 py-2 bg-stone-200 rounded cursor-pointer text-sm">
        {busy ? "Uploading…" : "Upload"}
        <input type="file" accept={accept} onChange={upload} className="hidden" />
      </label>
      {value && (
        <button type="button" onClick={() => onChange("")} className="text-xs text-red-600">
          Remove
        </button>
      )}
    </div>
  );
}
