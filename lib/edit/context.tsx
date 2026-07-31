"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
  /**
   * True once a write has come back 401. The admin cookie lasts a week, so this
   * is what a session running out mid-session looks like: every further edit
   * would fail the same way with nothing on screen explaining why.
   */
  sessionExpired: boolean;
  reportSessionExpired: () => void;
};

const EditContext = createContext<EditContextValue | null>(null);

/** How long the Undo offer stays on screen. */
const UNDO_MS = 8000;

export function EditProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [undos, setUndos] = useState<UndoItem[]>([]);
  const [sessionExpired, setSessionExpired] = useState(false);
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
      // A write landing proves the session is alive again, which is what happens
      // when the admin signs back in on another tab. Without this the banner is
      // a one-way latch that stays pinned over the navbar for the life of the
      // page even though everything is saving fine.
      setSessionExpired(false);
      // Leave the indicator on "saving" while anything else is still in flight,
      // otherwise a fast save would report "Saved" over a slow one.
      if (pending.current === 0) setState("saved");
    };
  }, []);

  // Tracked so unmounting the provider (which EditModeBoot does on every
  // client-side navigation) cannot leave timers firing setUndos on a dead tree.
  const undoTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => {
    const timers = undoTimers;
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  const showUndo = useCallback((message: string, onUndo: () => void | Promise<void>) => {
    const id = Date.now() + Math.random();
    setUndos((prev) => [...prev, { id, message, onUndo }]);
    undoTimers.current.push(
      setTimeout(() => setUndos((prev) => prev.filter((u) => u.id !== id)), UNDO_MS)
    );
  }, []);

  const reportSessionExpired = useCallback(() => setSessionExpired(true), []);

  const value = useMemo<EditContextValue>(
    () => ({ state, error, beginSave, showUndo, sessionExpired, reportSessionExpired }),
    [state, error, beginSave, showUndo, sessionExpired, reportSessionExpired]
  );

  return (
    <EditContext.Provider value={value}>
      {children}
      {sessionExpired && (
        // Without this a lapsed session just turns every keystroke into the word
        // "unauthorized" in the toolbar, with no way back. The link carries the
        // current page so signing in returns to what was being edited.
        <div
          role="alert"
          style={{ zIndex: 10002 }}
          className="fixed inset-x-0 top-0 flex flex-wrap items-center justify-center gap-3 px-4 py-3 bg-amber-500 text-stone-900 text-sm font-medium shadow-lg"
        >
          <span>Your admin session has expired, so nothing is being saved.</span>
          <a
            href={`/admin-login?next=${encodeURIComponent(
              typeof window === "undefined" ? "/" : window.location.pathname + window.location.search
            )}`}
            className="inline-flex items-center px-3 py-1.5 rounded-lg bg-stone-900 text-stone-50 hover:bg-stone-800"
          >
            Sign in again
          </a>
        </div>
      )}
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
