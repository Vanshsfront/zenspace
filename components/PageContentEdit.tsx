"use client";

import { useRef, useState } from "react";
import { Loader2, Plus, Star } from "lucide-react";
import { useEditContext } from "@/lib/edit/context";
import { useRowMutations, useRowPatch } from "@/lib/edit/useSave";
import { uploadMediaLazy } from "@/lib/edit/uploadLazy";

/**
 * The two home-page controls that exist only in edit mode.
 *
 * They live here rather than in PageContent so the write path stays out of the
 * home page's bundle. PageContent already gated them behind an `if (!editing)`
 * return, but the import was still static, so every visitor to / downloaded the
 * save hook, the context and the upload wrapper to render stars they cannot
 * click. PageContent now lazy()s this module instead.
 */

export function RowStarsLive({ id, rating }: { id: string; rating: number }) {
  const patch = useRowPatch();
  return (
    <div className="flex gap-1 mt-1 mb-4" role="radiogroup" aria-label="Star rating (1 to 5)">
      {Array.from({ length: 5 }).map((_, i) => (
        <button
          key={i}
          type="button"
          role="radio"
          aria-checked={i + 1 === rating}
          aria-label={`${i + 1} star${i === 0 ? "" : "s"}`}
          onClick={() =>
            void patch({
              table: "reviews",
              id,
              // A number, not a string: the API coerces google_review_count but
              // leaves reviews.rating alone, and Prisma rejects "4" for an Int.
              values: { rating: i + 1 },
              previous: { rating },
              undoMessage: "Star rating updated",
            })
          }
          className="rounded-[2px] transition-shadow hover:shadow-[0_0_0_2px_rgba(120,113,108,0.35)]"
        >
          <Star
            size={15}
            className={i < rating ? "fill-stone-700 text-stone-700" : "text-stone-300"}
          />
        </button>
      ))}
    </div>
  );
}
export function AddFirstVideoLive() {
  const { create } = useRowMutations();
  const edit = useEditContext();
  const input = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);

  // Same order as everywhere else: the file goes browser -> Supabase first, and
  // the row is only created once there is a URL to put in its NOT NULL column.
  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // let the same file be picked again after a failure
    if (!file) return;
    setBusy(true);
    const settle = edit?.beginSave();
    try {
      const url = await uploadMediaLazy(file);
      settle?.();
      await create("short_videos", { video: url, sort_order: 0 });
    } catch (err) {
      settle?.(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex justify-center mt-6 px-6">
      <input ref={input} type="file" accept="video/*" onChange={onFile} className="hidden" />
      <button
        type="button"
        disabled={busy}
        onClick={() => input.current?.click()}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-dashed border-stone-300 text-sm font-medium text-stone-500 hover:border-stone-500 hover:text-stone-700 transition-colors"
      >
        {busy ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
        {busy ? "Uploading…" : "Add the first video"}
      </button>
    </div>
  );
}