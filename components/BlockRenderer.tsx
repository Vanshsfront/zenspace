"use client";

import { Suspense, lazy, type ReactNode } from "react";
import Image from "next/image";
import type { Block } from "@/lib/blocks";
import { useEditMode } from "@/lib/edit/context";
import { CAPTION_CLASS, H2_CLASS, H3_CLASS, P_CLASS } from "./blockStyles";

/**
 * The rich-text body shared by /blog/[slug], /privacy and /terms.
 *
 * It is a client component only so it can ask whether edit mode is on. The
 * markup a visitor gets is exactly what it always was, and the pages that use
 * it stay cached server components that do all the fetching.
 *
 * Blocks are unusual: they live in one `blocks` jsonb column instead of a table
 * of their own, and lib/blocks.ts gives them no per-item id. So every edit
 * rewrites the whole array, items are keyed by position, and the primitives
 * from lib/edit (which each patch one column of one row) do not apply.
 *
 * Only the reading path lives here. The editor is a separate chunk behind the
 * lazy() below, because this module is on the visitor path for three routes and
 * a visitor must not download an editor to read a legal page.
 */

const BlockEditorLive = lazy(() => import("./BlockEditorLive"));

/** Which row the array belongs to. Absent when there is nothing to patch. */
export type BlocksOwner = { table: "blog_posts" | "legal_pages"; id: string };

export function BlockRenderer({
  blocks,
  owner,
  empty,
}: {
  blocks: Block[];
  owner?: BlocksOwner;
  /** What to show instead of an empty body, e.g. the legal pages' "Coming soon." */
  empty?: ReactNode;
}) {
  const editing = useEditMode();
  const items = blocks || [];

  if (editing && owner) {
    // The fallback is the read-only body, so the text stays on screen and in
    // place while the editor chunk loads instead of blinking out.
    return (
      <Suspense fallback={<div className="max-w-2xl mx-auto">{items.map(readOnlyBlock)}</div>}>
        <BlockEditorLive blocks={items} owner={owner} />
      </Suspense>
    );
  }
  // Without any blocks the pages that pass a placeholder show it instead. This
  // used to live in the pages themselves; it moved here so they could stay
  // server components while edit mode still gets somewhere to add the first
  // block.
  if (items.length === 0 && empty !== undefined) return <>{empty}</>;

  return <div className="max-w-2xl mx-auto">{items.map(readOnlyBlock)}</div>;
}

function readOnlyBlock(b: Block, i: number) {
  if (b.type === "heading") {
    return b.level === "h3" ? (
      <h3 key={i} className={H3_CLASS}>{b.text}</h3>
    ) : (
      <h2 key={i} className={H2_CLASS}>{b.text}</h2>
    );
  }
  if (b.type === "paragraph") {
    return <p key={i} className={P_CLASS}>{b.text}</p>;
  }
  if (b.type === "image") {
    return (
      <figure key={i} className="my-8">
        <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-stone-100">
          <Image src={b.url} alt={b.caption || ""} fill className="object-cover" sizes="(min-width: 768px) 672px, 100vw" />
        </div>
        {b.caption && <figcaption className={CAPTION_CLASS}>{b.caption}</figcaption>}
      </figure>
    );
  }
  return null;
}
