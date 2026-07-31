"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useEditContext } from "./context";

/**
 * The write path for inline editing.
 *
 * Every change is optimistic: the screen updates first, then the PATCH goes out
 * to the same generic admin API the form screens use, then an Undo toast holds
 * the previous value long enough to take the change back. A failure reverts the
 * local value and surfaces the reason in the toolbar. There is no draft or
 * publish step by design — what you see is what the site has.
 */

/** Rapid typing must not fire a request per keystroke. */
const DEBOUNCE_MS = 600;

/** site_settings is a singleton the API upserts, so it is patched without an id. */
function isSingleton(table: string): boolean {
  return table === "site_settings";
}

async function request(
  method: "POST" | "PATCH" | "DELETE",
  table: string,
  body: Record<string, unknown>
): Promise<unknown> {
  const r = await fetch(`/api/admin/${table}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const j = (await r.json().catch(() => ({}))) as { error?: string };
    throw new Error(j.error || `Save failed (${r.status})`);
  }
  return r.json().catch(() => ({}));
}

export type PatchArgs = {
  table: string;
  /** Omitted for site_settings; required for every other table. */
  id?: string;
  /** The columns to write. */
  values: Record<string, unknown>;
  /**
   * The same columns as they were before the change. Undo replays these, so
   * leaving it out means the change simply can't be taken back.
   */
  previous?: Record<string, unknown>;
  /** Toast copy, e.g. "Hero headline updated". */
  undoMessage?: string;
};

/**
 * One PATCH, with the Undo toast and the refresh around it. Images, single
 * choices and anything else that saves on a single click uses this directly;
 * text goes through useFieldSave below so it can debounce first.
 */
export function useRowPatch() {
  const router = useRouter();
  const edit = useEditContext();

  return useCallback(
    async ({ table, id, values, previous, undoMessage }: PatchArgs): Promise<boolean> => {
      const settle = edit?.beginSave();
      const body = isSingleton(table) ? { ...values } : { id, ...values };
      try {
        await request("PATCH", table, body);
        settle?.();
        if (previous && undoMessage) {
          edit?.showUndo(undoMessage, async () => {
            // The inverse write. No second Undo offer: undoing an undo just
            // means editing again, and a chain of toasts is confusing.
            const undoSettle = edit?.beginSave();
            try {
              await request("PATCH", table, isSingleton(table) ? { ...previous } : { id, ...previous });
              undoSettle?.();
              router.refresh();
            } catch (e) {
              undoSettle?.(e instanceof Error ? e.message : "Could not undo");
            }
          });
        }
        // The API already busted the cache tags; this pulls the fresh server
        // render so anything derived from the value (slugs, ordering) catches up.
        router.refresh();
        return true;
      } catch (e) {
        settle?.(e instanceof Error ? e.message : "Save failed");
        return false;
      }
    },
    [edit, router]
  );
}

export type FieldSaveArgs = {
  table: string;
  id?: string;
  field: string;
  /** The value as the server last rendered it. */
  value: string;
  /** Toast copy for the Undo offer. */
  label: string;
};

/**
 * A single text column: optimistic local value, debounced PATCH, flush on blur.
 *
 * `value` keeps winning after a router.refresh() as long as the user isn't
 * mid-edit, so a change made on another tab still shows up here.
 */
export function useFieldSave({ table, id, field, value, label }: FieldSaveArgs) {
  const patch = useRowPatch();
  const [local, setLocal] = useState(value);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dirty = useRef(false);
  // What the server is known to hold. Undo replays this, so it must only move
  // when a write actually lands.
  const committed = useRef(value);

  useEffect(() => {
    if (dirty.current) return; // don't yank the text out from under a typist
    committed.current = value;
    setLocal(value);
  }, [value]);

  const commit = useCallback(
    async (next: string) => {
      const previous = committed.current;
      if (next === previous) {
        dirty.current = false;
        return;
      }
      committed.current = next;
      dirty.current = false;
      const ok = await patch({
        table,
        id,
        values: { [field]: next },
        previous: { [field]: previous },
        undoMessage: `${label} updated`,
      });
      if (!ok) {
        // Put the old value back so the screen never claims a change that the
        // database refused.
        committed.current = previous;
        setLocal(previous);
      }
    },
    [patch, table, id, field, label]
  );

  /** Records a keystroke: updates the screen now, schedules the write. */
  const edit = useCallback(
    (next: string) => {
      dirty.current = true;
      setLocal(next);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        timer.current = null;
        void commit(next);
      }, DEBOUNCE_MS);
    },
    [commit]
  );

  /** Saves immediately, e.g. on blur or Enter. */
  const flush = useCallback(
    (next?: string) => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
      const value = next ?? local;
      if (!dirty.current && value === committed.current) return;
      void commit(value);
    },
    [commit, local]
  );

  /** Throws the pending edit away and returns to the last saved value. */
  const reset = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    dirty.current = false;
    setLocal(committed.current);
    return committed.current;
  }, []);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return { value: local, edit, flush, reset, committed };
}

/**
 * Row-level writes for EditableCollection: adding, deleting and reordering.
 * Deletes are not undoable — the row would come back with a new id and any
 * cascaded children (a category's photos, an artist's portfolio) would be gone
 * for good, so the primitive asks for confirmation up front instead.
 */
export function useRowMutations() {
  const router = useRouter();
  const edit = useEditContext();

  const create = useCallback(
    async (table: string, values: Record<string, unknown>): Promise<boolean> => {
      const settle = edit?.beginSave();
      try {
        await request("POST", table, values);
        settle?.();
        router.refresh();
        return true;
      } catch (e) {
        settle?.(e instanceof Error ? e.message : "Could not add");
        return false;
      }
    },
    [edit, router]
  );

  const remove = useCallback(
    async (table: string, id: string): Promise<boolean> => {
      const settle = edit?.beginSave();
      try {
        await request("DELETE", table, { id });
        settle?.();
        router.refresh();
        return true;
      } catch (e) {
        settle?.(e instanceof Error ? e.message : "Could not delete");
        return false;
      }
    },
    [edit, router]
  );

  /** Writes sort_order for every row whose position changed. */
  const reorder = useCallback(
    async (table: string, ids: string[]): Promise<boolean> => {
      const settle = edit?.beginSave();
      try {
        await Promise.all(
          ids.map((id, index) => request("PATCH", table, { id, sort_order: index }))
        );
        settle?.();
        router.refresh();
        return true;
      } catch (e) {
        settle?.(e instanceof Error ? e.message : "Could not save the new order");
        return false;
      }
    },
    [edit, router]
  );

  return { create, remove, reorder };
}
