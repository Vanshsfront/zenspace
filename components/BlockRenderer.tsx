import Image from "next/image";
import type { Block } from "@/lib/blocks";

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="max-w-2xl mx-auto">
      {(blocks || []).map((b, i) => {
        if (b.type === "heading") {
          return b.level === "h3" ? (
            <h3 key={i} className="font-serif text-2xl mt-8 mb-3 text-stone-900">{b.text}</h3>
          ) : (
            <h2 key={i} className="font-serif text-3xl mt-10 mb-4 text-stone-900">{b.text}</h2>
          );
        }
        if (b.type === "paragraph") {
          return <p key={i} className="text-lg text-stone-700 leading-relaxed mb-5 whitespace-pre-wrap">{b.text}</p>;
        }
        if (b.type === "image") {
          return (
            <figure key={i} className="my-8">
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-stone-100">
                <Image src={b.url} alt={b.caption || ""} fill className="object-cover" sizes="(min-width: 768px) 672px, 100vw" />
              </div>
              {b.caption && <figcaption className="mt-2 text-sm text-stone-500 text-center">{b.caption}</figcaption>}
            </figure>
          );
        }
        return null;
      })}
    </div>
  );
}
