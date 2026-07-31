"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ImageUp, Loader2, Trash2 } from "lucide-react";
import { uploadMediaLazy } from "@/lib/edit/uploadLazy";
import { useAnchorRect, useHostTarget } from "./anchor";
import { useEditContext } from "./context";
import { useRowPatch } from "./useSave";

/**
 * The interactive half of EditableImage: a hover overlay with Replace and
 * Remove, anchored over the existing markup.
 *
 * The wrapper is `display: contents`, so it contributes no box of its own and
 * the page lays out identically to the live site. The overlay is portaled onto
 * <body> and positioned from the wrapped element's bounding box.
 *
 * Uploads go browser -> Supabase through the signed URL in lib/uploadMedia.ts.
 * They must never be proxied through a serverless route: the files are photos
 * and videos that blow past the request-body cap.
 */

type Props = {
  table: string;
  field: string;
  id?: string;
  label: string;
  kind: "image" | "video";
  removable: boolean;
  /**
   * The raw column value. Pass it wherever the markup can render a stand-in for
   * an unset column, so Undo restores null instead of the stand-in's URL.
   */
  value?: string | null;
  children: ReactNode;
};

export default function EditableImageLive({
  table,
  field,
  id,
  label,
  kind,
  removable,
  value,
  children,
}: Props) {
  const host = useRef<HTMLSpanElement | null>(null);
  const input = useRef<HTMLInputElement | null>(null);
  const { target, hovered, overlayProps } = useHostTarget(host);
  const [busy, setBusy] = useState(false);
  const rect = useAnchorRect(target, hovered || busy);
  const patch = useRowPatch();
  const edit = useEditContext();

  const write = useCallback(
    async (url: string | null) => {
      // `value` is the real column value and is authoritative, including when it
      // is null. Only fall back to reading the DOM for callers that cannot pass
      // it. Scraping alone was wrong: where the column is unset the markup shows
      // a stand-in, and Undo then wrote that stand-in into the column, so the
      // "is this set?" branches flipped permanently and null could never come
      // back.
      const previous = value !== undefined ? value : storedUrl(target);
      await patch({
        table,
        id,
        values: { [field]: url },
        // Always sent, so Undo can restore an unset column rather than skipping.
        previous: { [field]: previous ?? null },
        undoMessage: url ? `${label} replaced` : `${label} removed`,
      });
    },
    [patch, table, id, field, label, target, value]
  );

  const onFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = ""; // let the same file be picked again after a failure
      if (!file) return;
      setBusy(true);
      const settle = edit?.beginSave();
      try {
        const url = await uploadMediaLazy(file);
        settle?.();
        await write(url);
      } catch (err) {
        settle?.(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setBusy(false);
      }
    },
    [edit, write]
  );

  return (
    <span ref={host} style={{ display: "contents" }} data-edit-media={`${table}.${field}`}>
      {children}
      <input
        ref={input}
        type="file"
        accept={kind === "video" ? "video/*" : "image/*"}
        onChange={onFile}
        className="hidden"
      />
      {rect &&
        createPortal(
          <div
            {...overlayProps}
            style={{
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
              zIndex: 10001,
            }}
            className="fixed flex items-center justify-center gap-2 bg-stone-900/55 backdrop-blur-[2px] rounded-[inherit]"
          >
            {busy ? (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-50 text-stone-900 text-sm font-medium">
                <Loader2 size={15} className="animate-spin" /> Uploading…
              </span>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => input.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-50 text-stone-900 text-sm font-medium hover:bg-white"
                >
                  <ImageUp size={15} /> Replace
                </button>
                {removable && (
                  <button
                    type="button"
                    onClick={() => void write(null)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900/80 text-stone-50 text-sm font-medium border border-stone-500 hover:bg-red-600 hover:border-red-500"
                  >
                    <Trash2 size={15} /> Remove
                  </button>
                )}
              </>
            )}
          </div>,
          document.body
        )}
    </span>
  );
}

/**
 * Last-resort previous value for callers that cannot pass the column directly.
 *
 * Anything under /assets/ is a bundled stand-in shipped with the site, never a
 * stored value, so it must not be written back into the column on Undo.
 */
function storedUrl(el: HTMLElement | null): string | null {
  const raw = currentUrl(el);
  if (!raw || raw.startsWith("/assets/")) return null;
  return raw;
}

/** Reads the URL currently on screen so Undo has something to put back. */
function currentUrl(el: HTMLElement | null): string | null {
  if (!el) return null;
  const media = el.matches("img, video") ? el : el.querySelector("img, video");
  if (media instanceof HTMLVideoElement) return media.getAttribute("src");
  if (media instanceof HTMLImageElement) {
    // next/image rewrites src to /_next/image?url=… — the original is in the query.
    const src = media.getAttribute("src") || "";
    const encoded = /[?&]url=([^&]+)/.exec(src);
    return encoded ? decodeURIComponent(encoded[1]) : src || null;
  }
  return null;
}
