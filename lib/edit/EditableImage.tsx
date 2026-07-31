"use client";

import { Suspense, lazy, type ReactNode } from "react";
import { useEditMode } from "./context";
import { fieldMeta } from "./fields";

/**
 * Makes the image (or video) column behind some existing markup replaceable.
 *
 * It wraps the markup rather than replacing it, so the picture on screen is the
 * real <Image> the site ships with all its sizing and priority hints intact.
 * For a visitor it renders the children and nothing else.
 *
 *   <EditableImage table="site_settings" field="hero_image">
 *     <div className="relative aspect-[4/5]"><Image … /></div>
 *   </EditableImage>
 */

const EditableImageLive = lazy(() => import("./EditableImageLive"));

export type EditableImageProps = {
  table: string;
  /** Defaults to the conventional column name on the media tables. */
  field?: string;
  /** Row id. Omitted for site_settings. */
  id?: string;
  children: ReactNode;
  /**
   * Hides Remove for columns the row can't be without, e.g. studio_photos.photo
   * where an empty value would render a hole in the carousel.
   */
  removable?: boolean;
  /**
   * The raw column value. Pass it wherever the markup renders a stand-in for an
   * unset column (a bundled asset, or another row's photo), so Undo restores the
   * unset state instead of writing the stand-in's URL into the column.
   */
  value?: string | null;
};

export function EditableImage({
  table,
  field = "photo",
  id,
  children,
  removable = true,
  value,
}: EditableImageProps) {
  const editing = useEditMode();

  if (!editing) return <>{children}</>;

  const meta = fieldMeta(table, field);

  return (
    <Suspense fallback={<>{children}</>}>
      <EditableImageLive
        table={table}
        field={field}
        id={id}
        label={meta?.label ?? field}
        kind={meta?.kind === "video" ? "video" : "image"}
        removable={removable}
        value={value}
      >
        {children}
      </EditableImageLive>
    </Suspense>
  );
}
