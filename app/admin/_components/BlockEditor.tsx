"use client";
import { ImageUpload } from "../ImageUpload";
import { ChevronUp, ChevronDown, Trash2, Heading, Type, Image as ImageIcon } from "lucide-react";
import type { Block } from "@/lib/blocks";
import { BLOCKS_TABLE, fieldMax } from "@/lib/edit/fields";
import { CharCount } from "./EntityForm";

// Blocks live in a jsonb column, so the registry files them under a pseudo
// table. Same caps as the inline block editor on the public routes: a heading
// typed here has to fit the same page it does when typed there.
const HEADING_MAX = fieldMax(BLOCKS_TABLE, "heading");
const PARAGRAPH_MAX = fieldMax(BLOCKS_TABLE, "paragraph");
const CAPTION_MAX = fieldMax(BLOCKS_TABLE, "caption");

export function BlockEditor({ value, onChange }: { value: Block[]; onChange: (b: Block[]) => void }) {
  const blocks = value || [];
  const setBlock = (i: number, patch: Partial<Block>) =>
    onChange(blocks.map((b, j) => (j === i ? ({ ...b, ...patch } as Block) : b)));
  const add = (type: Block["type"]) => {
    const nb: Block =
      type === "heading" ? { type: "heading", level: "h2", text: "" }
      : type === "paragraph" ? { type: "paragraph", text: "" }
      : { type: "image", url: "", caption: "" };
    onChange([...blocks, nb]);
  };
  const remove = (i: number) => onChange(blocks.filter((_, j) => j !== i));
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= blocks.length) return;
    const next = [...blocks];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {blocks.map((b, i) => (
        <div key={i} className="bg-white border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wide text-stone-500">{b.type}</span>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="p-1.5 rounded hover:bg-stone-100 disabled:opacity-30" aria-label="Move up"><ChevronUp size={16} /></button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === blocks.length - 1} className="p-1.5 rounded hover:bg-stone-100 disabled:opacity-30" aria-label="Move down"><ChevronDown size={16} /></button>
              <button type="button" onClick={() => remove(i)} className="p-1.5 rounded hover:bg-red-50 text-red-600" aria-label="Delete block"><Trash2 size={16} /></button>
            </div>
          </div>

          {b.type === "heading" && (
            <div className="space-y-2">
              <select value={b.level} onChange={(e) => setBlock(i, { level: e.target.value as "h2" | "h3" })} className="px-3 py-2 rounded-lg border bg-white text-sm">
                <option value="h2">Large heading (H2)</option>
                <option value="h3">Small heading (H3)</option>
              </select>
              <input value={b.text} onChange={(e) => setBlock(i, { text: e.target.value })} maxLength={HEADING_MAX} placeholder="Heading text" className="w-full px-3 py-2 rounded-lg border bg-white" />
              {HEADING_MAX !== undefined && (
                <div className="flex justify-end"><CharCount length={b.text.length} max={HEADING_MAX} /></div>
              )}
            </div>
          )}
          {b.type === "paragraph" && (
            <div className="space-y-2">
              <textarea value={b.text} onChange={(e) => setBlock(i, { text: e.target.value })} maxLength={PARAGRAPH_MAX} rows={4} placeholder="Paragraph text" className="w-full px-3 py-2 rounded-lg border bg-white" />
              {PARAGRAPH_MAX !== undefined && (
                <div className="flex justify-end"><CharCount length={b.text.length} max={PARAGRAPH_MAX} /></div>
              )}
            </div>
          )}
          {b.type === "image" && (
            <div className="space-y-2">
              <ImageUpload value={b.url} onChange={(url) => setBlock(i, { url })} />
              <input value={b.caption ?? ""} onChange={(e) => setBlock(i, { caption: e.target.value })} maxLength={CAPTION_MAX} placeholder="Caption (optional)" className="w-full px-3 py-2 rounded-lg border bg-white text-sm" />
              {CAPTION_MAX !== undefined && (
                <div className="flex justify-end"><CharCount length={(b.caption ?? "").length} max={CAPTION_MAX} /></div>
              )}
            </div>
          )}
        </div>
      ))}

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => add("heading")} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-sm"><Heading size={14} /> Heading</button>
        <button type="button" onClick={() => add("paragraph")} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-sm"><Type size={14} /> Paragraph</button>
        <button type="button" onClick={() => add("image")} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-sm"><ImageIcon size={14} /> Image</button>
      </div>
    </div>
  );
}
