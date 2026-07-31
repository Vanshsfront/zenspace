"use client";

import { AlertCircle, Check, Loader2, PencilLine, Settings2, X } from "lucide-react";
import { useEditContext } from "./context";
import { endEditingSession } from "./session";

/**
 * The only chrome edit mode adds. Fixed to the bottom-left so it never sits
 * under the WhatsApp button, and mounted inside the provider so it can report
 * what the last save did.
 */
export function EditToolbar() {
  const edit = useEditContext();
  if (!edit) return null;

  const { state, error } = edit;

  function exit() {
    // Ending the session first, or the boot would read the stored flag on the
    // next page and put the editor straight back.
    endEditingSession();
    // A full navigation rather than router.replace: dropping ?edit=1 should give
    // back the same static page a visitor gets, editor JS and all unmounted.
    const url = new URL(window.location.href);
    url.searchParams.delete("edit");
    window.location.href = url.toString();
  }

  return (
    <div
      style={{ zIndex: 10000 }}
      className="fixed bottom-6 left-6 flex items-center gap-2 pl-4 pr-2 h-12 rounded-full bg-stone-900/95 text-stone-50 shadow-2xl backdrop-blur-md border border-stone-700"
    >
      <span className="inline-flex items-center gap-2 text-sm font-medium">
        <PencilLine size={15} /> Editing
      </span>

      <span className="w-px h-5 bg-stone-700" />

      <span
        className="inline-flex items-center gap-1.5 text-xs min-w-[7.5rem]"
        title={error ?? undefined}
      >
        {state === "saving" ? (
          <>
            <Loader2 size={13} className="animate-spin" /> Saving…
          </>
        ) : state === "saved" ? (
          <>
            <Check size={13} className="text-emerald-400" /> All changes saved
          </>
        ) : state === "error" ? (
          <span className="inline-flex items-center gap-1.5 text-red-300 truncate">
            <AlertCircle size={13} className="shrink-0" />
            <span className="truncate">{error ?? "Save failed"}</span>
          </span>
        ) : (
          <span className="text-stone-400">Changes save as you go</span>
        )}
      </span>

      <a
        href="/admin"
        className="inline-flex items-center gap-1.5 px-3 h-8 rounded-full text-xs font-medium bg-stone-800 hover:bg-stone-700"
      >
        <Settings2 size={13} /> Admin
      </a>
      <button
        type="button"
        onClick={exit}
        className="inline-flex items-center gap-1.5 px-3 h-8 rounded-full text-xs font-medium bg-stone-50 text-stone-900 hover:bg-white"
      >
        <X size={13} /> Done
      </button>
    </div>
  );
}
