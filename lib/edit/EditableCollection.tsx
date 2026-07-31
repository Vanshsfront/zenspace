"use client";

import { Fragment, Suspense, lazy, type ReactNode } from "react";
import { useEditMode } from "./context";

/**
 * Makes a list on the page addable, deletable and re-orderable.
 *
 * It takes over the `items.map(...)` a page already does, so the markup for one
 * item stays exactly where it is and the surrounding grid keeps its own classes.
 * For a visitor it is a plain map with no wrapper element at all.
 *
 *   <EditableCollection table="studio_photos" items={studio}>
 *     {(s) => <StudioCard key={s.id} photo={s} />}
 *   </EditableCollection>
 */

const EditableCollectionLive = lazy(() => import("./EditableCollectionLive"));

export type CollectionItem = { id: string };

export type EditableCollectionProps<T extends CollectionItem> = {
  table: string;
  items: readonly T[];
  /**
   * Columns a new row needs beyond sort_order, e.g. { category_id } for
   * category_photos or { audience: "kids" } for safety_items. Required columns
   * without a default will fail the create, so give them a placeholder here.
   */
  newItem?: Record<string, unknown>;
  /** Copy for the trailing add affordance. Defaults to "Add". */
  addLabel?: string;
  /** What one row is called in the delete confirmation, e.g. "photo". */
  itemLabel?: string;
  /**
   * For galleries whose media column is NOT NULL. Names that column, and makes
   * the add affordance pick a file, upload it, and create the row with the real
   * URL already in place.
   *
   * Without it a new row has to be created with a placeholder image and then
   * corrected, which publishes a photo the studio never chose to the live site
   * in between. The column cannot simply be left empty because the database
   * rejects it.
   */
  uploadColumn?: string;
  /** What the file picker accepts. Defaults to images. */
  uploadKind?: "image" | "video";
  children: (item: T, index: number) => ReactNode;
};

export function EditableCollection<T extends CollectionItem>({
  table,
  items,
  newItem,
  addLabel,
  itemLabel,
  uploadColumn,
  uploadKind,
  children,
}: EditableCollectionProps<T>) {
  const editing = useEditMode();

  if (!editing) {
    return (
      <>
        {items.map((item, i) => (
          <Fragment key={item.id}>{children(item, i)}</Fragment>
        ))}
      </>
    );
  }

  const fallback = (
    <>
      {items.map((item, i) => (
        <Fragment key={item.id}>{children(item, i)}</Fragment>
      ))}
    </>
  );

  return (
    <Suspense fallback={fallback}>
      <EditableCollectionLive
        table={table}
        items={items as readonly CollectionItem[]}
        newItem={newItem}
        addLabel={addLabel}
        itemLabel={itemLabel}
        uploadColumn={uploadColumn}
        uploadKind={uploadKind}
        render={children as (item: CollectionItem, index: number) => ReactNode}
      />
    </Suspense>
  );
}
