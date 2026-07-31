"use client";

import { Suspense, lazy, type ElementType, type ReactNode } from "react";
import { useEditMode } from "./context";
import { fieldMeta } from "./fields";

/**
 * Makes one text column editable in place.
 *
 * For a visitor there is no provider, so this renders exactly the markup the
 * page would have rendered without it and nothing else is downloaded. Only when
 * the admin has switched edit mode on does the interactive shell get fetched.
 *
 *   <EditableText table="site_settings" field="hero_title" as="span" className="font-bold">
 *     {settings?.hero_title || "We help you choose the right tattoo"}
 *   </EditableText>
 */

// Lazy so the contentEditable machinery ships in the editor chunk, not in the
// bundle every visitor downloads.
const EditableTextLive = lazy(() => import("./EditableTextLive"));

export type EditableTextProps = {
  table: string;
  field: string;
  /** Row id. Omitted for site_settings, which the API upserts as a singleton. */
  id?: string;
  /** Overrides the registry cap. Almost never needed — prefer fixing fields.ts. */
  max?: number;
  as?: ElementType;
  className?: string;
  /**
   * The rendered text. When the surrounding markup decorates it (quotes, a "+"
   * suffix) pass the raw column value as `value` so the editor writes back only
   * what belongs in the database.
   */
  children?: ReactNode;
  value?: string;
  /** Allows line breaks. Defaults to true for textarea fields in the registry. */
  multiline?: boolean;
};

export function EditableText({
  table,
  field,
  id,
  max,
  as: As = "span",
  className,
  children,
  value,
  multiline,
}: EditableTextProps) {
  const editing = useEditMode();

  // The visitor path: one element, no state, no effects, no editor code.
  if (!editing) return <As className={className}>{children}</As>;

  const meta = fieldMeta(table, field);
  const text = value ?? (typeof children === "string" ? children : "");

  return (
    <Suspense fallback={<As className={className}>{children}</As>}>
      <EditableTextLive
        table={table}
        field={field}
        id={id}
        as={As}
        className={className}
        value={text}
        max={max ?? meta?.max ?? 0}
        label={meta?.label ?? field}
        multiline={multiline ?? meta?.kind === "textarea"}
      />
    </Suspense>
  );
}
