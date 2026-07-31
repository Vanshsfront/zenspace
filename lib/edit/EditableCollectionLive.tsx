"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { useAnchorRect, useHostTarget } from "./anchor";
import { useRowMutations } from "./useSave";
import type { CollectionItem } from "./EditableCollection";

/**
 * The interactive half of EditableCollection.
 *
 * Each item is wrapped in a `display: contents` host so the grid or flex row it
 * sits in is unchanged; the delete button and drag handle are portaled on top
 * of it. The whole item is the drag target — the handle is the affordance that
 * says so, which is far less code than a synthetic pointer-drag and behaves
 * correctly with keyboard-free mouse users.
 */

type Props = {
  table: string;
  items: readonly CollectionItem[];
  newItem?: Record<string, unknown>;
  addLabel?: string;
  itemLabel?: string;
  render: (item: CollectionItem, index: number) => ReactNode;
};

export default function EditableCollectionLive({
  table,
  items,
  newItem,
  addLabel = "Add",
  itemLabel = "item",
  render,
}: Props) {
  const { create, remove, reorder } = useRowMutations();
  // Local order so a drag lands instantly; the server order takes over again on
  // the next render after router.refresh().
  const [order, setOrder] = useState<string[]>(() => items.map((i) => i.id));
  const dragging = useRef<string | null>(null);

  const serverOrder = items.map((i) => i.id).join(",");
  useEffect(() => {
    // Compared as a string so a fresh array with the same ids (every server
    // render produces one) doesn't churn state.
    setOrder((prev) => (prev.join(",") === serverOrder ? prev : serverOrder.split(",").filter(Boolean)));
  }, [serverOrder]);

  const byId = new Map(items.map((i) => [i.id, i] as const));
  const ordered = order.map((id) => byId.get(id)).filter((i): i is CollectionItem => Boolean(i));

  const onDrop = useCallback(
    (targetId: string) => {
      const sourceId = dragging.current;
      dragging.current = null;
      if (!sourceId || sourceId === targetId) return;
      const before = order;
      const next = order.filter((id) => id !== sourceId);
      const at = next.indexOf(targetId);
      next.splice(at < 0 ? next.length : at, 0, sourceId);
      setOrder(next);
      void reorder(table, next).then((ok) => {
        // Put the old order back rather than leaving the screen showing an
        // arrangement the database never accepted. reorder() also refreshes on
        // failure, so a partially applied order resolves to the server's truth
        // on the next render.
        if (!ok) setOrder(before);
      });
    },
    [order, reorder, table]
  );

  const onDelete = useCallback(
    (id: string) => {
      // Deletes cascade (a category takes its photos with it) so they can't be
      // undone by re-creating the row. Ask first instead of offering an Undo
      // that would quietly lose data.
      if (!window.confirm(`Delete this ${itemLabel}? This cannot be undone.`)) return;
      const before = order;
      setOrder((prev) => prev.filter((x) => x !== id));
      void remove(table, id).then((ok) => {
        // A failed delete used to leave the row gone from the screen while it was
        // still in the database, until a hard reload.
        if (!ok) setOrder(before);
      });
    },
    [itemLabel, order, remove, table]
  );

  return (
    <>
      {ordered.map((item, index) => (
        <CollectionItemShell
          key={item.id}
          onDragStart={() => (dragging.current = item.id)}
          onDropItem={() => onDrop(item.id)}
          onDelete={() => onDelete(item.id)}
        >
          {render(item, index)}
        </CollectionItemShell>
      ))}
      <button
        type="button"
        onClick={() =>
          void create(table, { ...(newItem ?? {}), sort_order: ordered.length })
        }
        className="min-h-[8rem] w-full flex flex-col items-center justify-center gap-2 rounded-[1.5rem] border-2 border-dashed border-stone-300 text-stone-500 hover:border-stone-500 hover:text-stone-700 transition-colors"
      >
        <Plus size={22} />
        <span className="text-sm font-medium">{addLabel}</span>
      </button>
    </>
  );
}

function CollectionItemShell({
  children,
  onDragStart,
  onDropItem,
  onDelete,
}: {
  children: ReactNode;
  onDragStart: () => void;
  onDropItem: () => void;
  onDelete: () => void;
}) {
  const host = useRef<HTMLSpanElement | null>(null);
  const { target, hovered, overlayProps } = useHostTarget(host);
  const rect = useAnchorRect(target, hovered);

  // Drag is wired imperatively because the element belongs to the page, not to
  // this component — it has whatever props the site already gave it.
  useEffect(() => {
    if (!target) return;
    target.draggable = true;
    const start = (e: DragEvent) => {
      e.dataTransfer?.setData("text/plain", "");
      onDragStart();
    };
    const over = (e: DragEvent) => e.preventDefault();
    const drop = (e: DragEvent) => {
      e.preventDefault();
      onDropItem();
    };
    target.addEventListener("dragstart", start);
    target.addEventListener("dragover", over);
    target.addEventListener("drop", drop);
    return () => {
      target.draggable = false;
      target.removeEventListener("dragstart", start);
      target.removeEventListener("dragover", over);
      target.removeEventListener("drop", drop);
    };
  }, [target, onDragStart, onDropItem]);

  return (
    <span ref={host} style={{ display: "contents" }}>
      {children}
      {rect &&
        createPortal(
          <div
            {...overlayProps}
            style={{ top: rect.top + 8, left: rect.left + rect.width - 8, zIndex: 10001 }}
            className="fixed -translate-x-full flex items-center gap-1"
          >
            <span
              title="Drag the item to reorder"
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-stone-900/85 text-stone-50 cursor-grab"
            >
              <GripVertical size={15} />
            </span>
            <button
              type="button"
              onClick={onDelete}
              title="Delete"
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-stone-900/85 text-stone-50 hover:bg-red-600"
            >
              <Trash2 size={15} />
            </button>
          </div>,
          document.body
        )}
    </span>
  );
}
