"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Undo2 } from "lucide-react";

/**
 * Edit mode state, shared by the toolbar, the save hook and the primitives.
 *
 * The provider is mounted only for a signed-in admin who asked for it with
 * ?edit=1 (see components/EditModeBoot.tsx). Everyone else renders with no
 * provider at all, which is what makes useEditMode() return false and the
 * primitives collapse to plain markup.
 */

export type SaveState = "idle" | "saving" | "saved" | "error";

type UndoItem = {
  id: number;
  message: string;
  onUndo: () => void | Promise<void>;
};

type EditContextValue = {
  state: SaveState;
  error: string | null;
  /**
   * Marks one save as in flight. Returns the settle callback — call it with an
   * error message when the write failed, or with nothing when it succeeded.
   * Counting rather than flag-setting so overlapping saves can't clear the
   * indicator while a later one is still running.
   */
  beginSave: () => (error?: string | null) => void;
  /** Shows the Undo toast for a write that just landed. */
  showUndo: (message: string, onUndo: () => void | Promise<void>) => void;
};

const EditContext = createContext<EditContextValue | null>(null);

/** How long the Undo offer stays on screen. */
const UNDO_MS = 8000;

export function EditProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [undos, setUndos] = useState<UndoItem[]>([]);
  const pending = useRef(0);

  const beginSave = useCallback(() => {
    pending.current += 1;
    setState("saving");
    setError(null);
    let settled = false;
    return (err?: string | null) => {
      if (settled) return;
      settled = true;
      pending.current = Math.max(0, pending.current - 1);
      if (err) {
        setError(err);
        setState("error");
        return;
      }
      // Leave the indicator on "saving" while anything else is still in flight,
      // otherwise a fast save would report "Saved" over a slow one.
      if (pending.current === 0) setState("saved");
    };
  }, []);

  const showUndo = useCallback((message: string, onUndo: () => void | Promise<void>) => {
    const id = Date.now() + Math.random();
    setUndos((prev) => [...prev, { id, message, onUndo }]);
    setTimeout(() => setUndos((prev) => prev.filter((u) => u.id !== id)), UNDO_MS);
  }, []);

  const value = useMemo<EditContextValue>(
    () => ({ state, error, beginSave, showUndo }),
    [state, error, beginSave, showUndo]
  );

  return (
    <EditContext.Provider value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        // Above the WhatsApp FAB (z-index 9999) and left of it so the two never
        // sit on top of each other.
        style={{ zIndex: 10000 }}
        className="fixed bottom-24 left-6 flex flex-col gap-2 pointer-events-none"
      >
        {undos.map((u) => (
          <div
            key={u.id}
            className="pointer-events-auto flex items-center gap-4 pl-5 pr-3 py-3 rounded-xl bg-stone-900/95 text-stone-50 text-sm shadow-2xl backdrop-blur-md border border-stone-700"
          >
            <span>{u.message}</span>
            <button
              type="button"
              onClick={() => {
                setUndos((prev) => prev.filter((x) => x.id !== u.id));
                void u.onUndo();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-50 text-stone-900 font-medium hover:bg-white"
            >
              <Undo2 size={14} /> Undo
            </button>
          </div>
        ))}
      </div>
    </EditContext.Provider>
  );
}

/**
 * False when no provider is mounted, which is the case for every visitor. The
 * primitives branch on this to render inert markup with no editor JS attached.
 */
export function useEditMode(): boolean {
  return useContext(EditContext) !== null;
}

/**
 * The save state and helpers, or null outside edit mode. Returning null rather
 * than throwing keeps the primitives safe to render anywhere.
 */
export function useEditContext(): EditContextValue | null {
  return useContext(EditContext);
}
