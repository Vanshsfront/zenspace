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
 *
 * The `blocks` array reaching a client component means the body travels twice,
 * once as HTML and once as this component's serialized props. That looks like
 * something moving the reading path back into a server component would fix, and
 * it is not: an RSC page always ships its flight payload beside its HTML, so the
 * body goes twice either way, and the only question is which encoding is
 * cheaper. Measured on a 6.3 KB body (build output, 16 headings/paragraphs):
 * as props the second copy is 7.1 KB, because a block is `{"type","text"}`; as a
 * server-rendered element tree it is 9.4 KB, because every node carries its
 * className again. Prerendered page totals: 43,324 vs 45,953 bytes of HTML and
 * 18,853 vs 21,166 bytes of .rsc, the server version larger in both, and still
 * larger after gzip and with the image block removed. Against that it saves
 * 1.6 KB of shared, cached JS once, and it would need edit mode to re-fetch the
 * row over the wire because a server component cannot be told edit mode is on
 * without cookies(). So this is the smaller of the two, not the larger.
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
