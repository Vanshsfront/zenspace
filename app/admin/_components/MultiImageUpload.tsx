"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import { useToast } from "./Toast";

type FileState = {
  id: string;
  file: File;
  status: "queued" | "uploading" | "done" | "error";
  url?: string;
  error?: string;
  preview: string;
};

type Props = {
  /** Table to insert rows into after a successful upload, e.g. "portfolio_items". */
  table: string;
  /** Extra fields merged into every created row, e.g. { artist_id }. */
  extraFields?: Record<string, any>;
  /** Called after each successful row insert so the parent can refresh its list. */
  onUploaded?: () => void;
  /** Field name on the destination table that holds the photo URL. Defaults to "photo". */
  photoField?: string;
};

/**
 * Drag-and-drop multi-image uploader. Uploads each file to /api/admin/upload
 * (Supabase storage via service role), then POSTs a row to /api/admin/[table]
 * with the public URL + any extraFields. Per-file progress; failures don't
 * block the others; toast feedback on completion.
 */
export function MultiImageUpload({ table, extraFields, onUploaded, photoField = "photo" }: Props) {
  const [files, setFiles] = useState<FileState[]>([]);
  const toast = useToast();

  const startUploads = useCallback(async (queued: FileState[]) => {
    let successCount = 0;
    let failCount = 0;

    await Promise.all(
      queued.map(async (state) => {
        setFiles((prev) => prev.map((f) => (f.id === state.id ? { ...f, status: "uploading" } : f)));
        try {
          const fd = new FormData();
          fd.append("file", state.file);
          const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
          const j = await r.json();
          if (!r.ok || !j.url) throw new Error(j.error || "Upload failed");

          // Insert the row in the target table.
          const create = await fetch(`/api/admin/${table}`, {
            method: "POST",
            body: JSON.stringify({ ...(extraFields || {}), [photoField]: j.url }),
          });
          if (!create.ok) {
            const cj = await create.json().catch(() => ({}));
            throw new Error(cj.error || "Saved upload but row insert failed");
          }

          setFiles((prev) => prev.map((f) => (f.id === state.id ? { ...f, status: "done", url: j.url } : f)));
          successCount++;
        } catch (e: any) {
          setFiles((prev) =>
            prev.map((f) => (f.id === state.id ? { ...f, status: "error", error: e.message || "Upload failed" } : f)),
          );
          failCount++;
        }
      }),
    );

    if (successCount > 0) toast.push("success", `${successCount} photo${successCount > 1 ? "s" : ""} added`);
    if (failCount > 0) toast.push("error", `${failCount} upload${failCount > 1 ? "s" : ""} failed`);
    if (successCount > 0) onUploaded?.();
  }, [table, extraFields, photoField, toast, onUploaded]);

  const onDrop = useCallback((accepted: File[]) => {
    const fresh: FileState[] = accepted.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      file,
      status: "queued",
      preview: URL.createObjectURL(file),
    }));
    setFiles((prev) => [...prev, ...fresh]);
    startUploads(fresh);
  }, [startUploads]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".avif"] },
    multiple: true,
  });

  const clearDone = () => {
    setFiles((prev) => {
      prev.forEach((f) => f.status === "done" && URL.revokeObjectURL(f.preview));
      return prev.filter((f) => f.status !== "done");
    });
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
          isDragActive ? "border-stone-900 bg-stone-50" : "border-stone-300 bg-white hover:border-stone-400"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto mb-3 text-stone-500" size={28} />
        <p className="font-medium text-stone-800">{isDragActive ? "Drop them here" : "Drop photos here, or click to choose"}</p>
        <p className="text-xs text-stone-500 mt-1">JPG, PNG, WebP, AVIF — multiple files OK</p>
      </div>

      {files.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-stone-700">Uploads</h3>
            <button onClick={clearDone} className="text-xs text-stone-500 hover:text-stone-900">Clear completed</button>
          </div>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {files.map((f) => (
              <li key={f.id} className="relative bg-stone-100 rounded-xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.preview} alt="" className="w-full aspect-square object-cover" />
                <div
                  className={`absolute inset-x-0 bottom-0 px-2 py-1 text-[11px] font-medium ${
                    f.status === "done"
                      ? "bg-emerald-600 text-white"
                      : f.status === "error"
                      ? "bg-red-600 text-white"
                      : "bg-stone-900/80 text-white"
                  }`}
                >
                  {f.status === "uploading" && "Uploading…"}
                  {f.status === "queued" && "Queued"}
                  {f.status === "done" && "✓ Saved"}
                  {f.status === "error" && (f.error || "Error")}
                </div>
                {f.status === "done" && (
                  <button
                    onClick={() => setFiles((prev) => prev.filter((x) => x.id !== f.id))}
                    aria-label="Dismiss"
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center text-stone-700 hover:bg-white"
                  >
                    <X size={12} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
