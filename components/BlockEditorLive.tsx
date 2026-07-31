"use client";

import { useCallback, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ArrowDown, ArrowUp, ImagePlus, ImageUp, Loader2, Trash2, Type } from "lucide-react";
import type { Block } from "@/lib/blocks";
import { uploadMediaLazy } from "@/lib/edit/uploadLazy";
import { useAnchorRect, useHostTarget } from "@/lib/edit/anchor";
import { useEditContext } from "@/lib/edit/context";
import { BLOCKS_TABLE, fieldMeta } from "@/lib/edit/fields";
import { useRowPatch } from "@/lib/edit/useSave";
import { InlineEditable } from "./InlineEditable";
import { CAPTION_CLASS, H2_CLASS, H3_CLASS, P_CLASS } from "./blockStyles";
import type { BlocksOwner } from "./BlockRenderer";

/**
 * The editing half of the rich-text body, split out of BlockRenderer so that it
 * is only ever fetched by an admin.
 *
 * Everything in here (the block tools, the shell, the add row, the image picker
 * and InlineEditable) used to sit in the same module as the read-only renderer,
 * which meant every visitor to /blog, /privacy and /terms downloaded the whole
 * editor to render text they cannot change. BlockRenderer now lazy()s this file,
 * so it lands in its own chunk.
 *
 * The type-only import of BlocksOwner above is erased at build time, so the two
 * modules do not form a runtime cycle.
 */

const HEADING_MAX = fieldMeta(BLOCKS_TABLE, "heading")?.max ?? 0;
const PARAGRAPH_MAX = fieldMeta(BLOCKS_TABLE, "paragraph")?.max ?? 0;
const CAPTION_MAX = fieldMeta(BLOCKS_TABLE, "caption")?.max ?? 0;

export default function EditableBlocks({ blocks, owner }: { blocks: Block[]; owner: BlocksOwner }) {
  const patch = useRowPatch();

  // One write per edit, and it carries the entire array. That also makes a
  // delete here undoable, unlike a row delete in EditableCollection: the
  // previous array is the whole of what was lost, so the toast can put it back.
  const save = useCallback(
    (next: Block[], message: string) =>
      patch({
        table: owner.table,
        id: owner.id,
        values: { blocks: next },
        previous: { blocks },
        undoMessage: message,
      }),
    [patch, owner.table, owner.id, blocks]
  );

  const replaceAt = useCallback(
    (index: number, block: Block, message: string) =>
      save(blocks.map((b, i) => (i === index ? block : b)), message),
    [blocks, save]
  );

  const removeAt = useCallback(
    (index: number) => save(blocks.filter((_, i) => i !== index), "Block deleted"),
    [blocks, save]
  );

  const moveBy = useCallback(
    (index: number, delta: number) => {
      const to = index + delta;
      if (to < 0 || to >= blocks.length) return;
      const next = blocks.slice();
      const [moved] = next.splice(index, 1);
      next.splice(to, 0, moved);
      return save(next, "Block moved");
    },
    [blocks, save]
  );

  const append = useCallback((block: Block) => save([...blocks, block], "Block added"), [blocks, save]);

  return (
    <div className="max-w-2xl mx-auto">
      {blocks.map((b, i) => (
        // Keyed by position because that is the only identity a block has.
        <BlockShell
          key={i}
          index={i}
          count={blocks.length}
          tools={<BlockTools block={b} index={i} onChange={replaceAt} />}
          onMove={moveBy}
          onDelete={removeAt}
        >
          {b.type === "heading" ? (
            <InlineEditable
              as={b.level === "h3" ? "h3" : "h2"}
              className={b.level === "h3" ? H3_CLASS : H2_CLASS}
              value={b.text}
              max={HEADING_MAX}
              label="Heading"
              onCommit={(text) => replaceAt(i, { ...b, text }, "Heading updated")}
            />
          ) : b.type === "paragraph" ? (
            <InlineEditable
              as="p"
              className={P_CLASS}
              value={b.text}
              max={PARAGRAPH_MAX}
              label="Paragraph"
              multiline
              onCommit={(text) => replaceAt(i, { ...b, text }, "Paragraph updated")}
            />
          ) : (
            <figure className="my-8">
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-stone-100">
                <Image src={b.url} alt={b.caption || ""} fill className="object-cover" sizes="(min-width: 768px) 672px, 100vw" />
              </div>
              {/* A visitor sees no figcaption until there is a caption, so edit
                  mode always renders it, with enough height to aim at. The
                  caption doubles as the image's alt text (there is no separate
                  column for one), which is worth knowing before leaving it blank. */}
              <InlineEditable
                as="figcaption"
                className={`${CAPTION_CLASS} empty:min-h-[1.25em]`}
                value={b.caption || ""}
                max={CAPTION_MAX}
                label="Image caption"
                onCommit={(caption) => replaceAt(i, { ...b, caption }, "Caption updated")}
              />
            </figure>
          )}
        </BlockShell>
      ))}
      <AddBlockRow onAdd={append} />
    </div>
  );
}

/** The buttons that only make sense for one kind of block. */
function BlockTools({
  block,
  index,
  onChange,
}: {
  block: Block;
  index: number;
  onChange: (index: number, block: Block, message: string) => void;
}) {
  const picker = useImagePicker(
    useCallback(
      (url: string) => {
        if (block.type === "image") onChange(index, { ...block, url }, "Image replaced");
      },
      [block, index, onChange]
    )
  );

  if (block.type === "heading") {
    return (
      <button
        type="button"
        onClick={() =>
          onChange(index, { ...block, level: block.level === "h3" ? "h2" : "h3" }, "Heading size changed")
        }
        title="Switch between a large and a small heading"
        className={`${TOOL_CLASS} text-[11px] font-semibold`}
      >
        {block.level === "h3" ? "H3" : "H2"}
      </button>
    );
  }

  if (block.type === "image") {
    return (
      <>
        {picker.field}
        <button type="button" onClick={picker.open} title="Replace this image" className={TOOL_CLASS}>
          {picker.busy ? <Loader2 size={15} className="animate-spin" /> : <ImageUp size={15} />}
        </button>
      </>
    );
  }

  return null;
}

const TOOL_CLASS =
  "inline-flex items-center justify-center w-8 h-8 rounded-lg bg-stone-900/85 text-stone-50 hover:bg-stone-800 disabled:opacity-40 disabled:hover:bg-stone-900/85";

/**
 * Wraps one block so its controls can be portaled over it. The host is
 * `display: contents`, so the block keeps the exact box it has on the live site.
 */
function BlockShell({
  children,
  tools,
  index,
  count,
  onMove,
  onDelete,
}: {
  children: ReactNode;
  tools: ReactNode;
  index: number;
  count: number;
  onMove: (index: number, delta: number) => void;
  onDelete: (index: number) => void;
}) {
  const host = useRef<HTMLSpanElement | null>(null);
  const { target, hovered, overlayProps } = useHostTarget(host);
  const rect = useAnchorRect(target, hovered);

  return (
    <span ref={host} style={{ display: "contents" }}>
      {children}
      {rect &&
        createPortal(
          <div
            {...overlayProps}
            style={{ top: rect.top + 4, left: rect.left + rect.width - 4, zIndex: 10001 }}
            className="fixed -translate-x-full flex items-center gap-1"
          >
            {tools}
            <button
              type="button"
              onClick={() => onMove(index, -1)}
              disabled={index === 0}
              title="Move up"
              className={TOOL_CLASS}
            >
              <ArrowUp size={15} />
            </button>
            <button
              type="button"
              onClick={() => onMove(index, 1)}
              disabled={index === count - 1}
              title="Move down"
              className={TOOL_CLASS}
            >
              <ArrowDown size={15} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(index)}
              title="Delete this block"
              className={`${TOOL_CLASS} hover:bg-red-600`}
            >
              <Trash2 size={15} />
            </button>
          </div>,
          document.body
        )}
    </span>
  );
}

function AddBlockRow({ onAdd }: { onAdd: (block: Block) => void }) {
  // An image block with no URL would throw inside next/image, so the file is
  // picked first and the block only appears once the upload has a URL.
  const picker = useImagePicker(useCallback((url: string) => onAdd({ type: "image", url }), [onAdd]));

  return (
    <div className="my-8 flex flex-wrap items-center justify-center gap-2 rounded-[1.5rem] border-2 border-dashed border-stone-300 p-4">
      {picker.field}
      <button
        type="button"
        onClick={() => onAdd({ type: "heading", level: "h2", text: "New heading" })}
        className={ADD_CLASS}
      >
        <span className="text-xs font-semibold">H2</span> Heading
      </button>
      <button
        type="button"
        onClick={() => onAdd({ type: "paragraph", text: "New paragraph" })}
        className={ADD_CLASS}
      >
        <Type size={15} /> Paragraph
      </button>
      <button type="button" onClick={picker.open} className={ADD_CLASS}>
        {picker.busy ? <Loader2 size={15} className="animate-spin" /> : <ImagePlus size={15} />} Image
      </button>
    </div>
  );
}

const ADD_CLASS =
  "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900/85 text-stone-50 text-sm font-medium hover:bg-stone-800";

/**
 * A hidden file input plus the upload. Uploads go browser to Supabase through
 * the signed URL in lib/uploadMedia.ts; they must never be proxied through a
 * serverless route, which photos blow straight past.
 */
function useImagePicker(onPicked: (url: string) => void) {
  const input = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const edit = useEditContext();

  const onChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = ""; // let the same file be picked again after a failure
      if (!file) return;
      setBusy(true);
      const settle = edit?.beginSave();
      try {
        const url = await uploadMediaLazy(file);
        settle?.();
        onPicked(url);
      } catch (err) {
        settle?.(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setBusy(false);
      }
    },
    [edit, onPicked]
  );

  return {
    busy,
    open: () => input.current?.click(),
    field: <input ref={input} type="file" accept="image/*" onChange={onChange} className="hidden" />,
  };
}
