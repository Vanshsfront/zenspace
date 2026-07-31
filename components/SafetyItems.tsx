"use client";

import Image from "next/image";
import type { SafetyItemRow } from "@/lib/data";
import { useEditMode } from "@/lib/edit/context";
import { EditableText } from "@/lib/edit/EditableText";
import { EditableImage } from "@/lib/edit/EditableImage";
import { EditableCollection } from "@/lib/edit/EditableCollection";

/**
 * Only the four columns this section actually paints. The row's own `audience`
 * and `sort_order` are never read here — sort_order is already baked into the
 * order the query returns, and the audience a new row is stamped with comes
 * from the route, not from a sibling row. Keeping them out of the type is what
 * lets the page hand over a projection instead of the whole row, so they never
 * reach the flight payload.
 */
export type SafetyItemCard = Pick<SafetyItemRow, "id" | "title" | "body" | "photo">;

/**
 * `audience` is not rendered anywhere. It is here so a row added inline can be
 * stamped with the page it was added from, exactly like the admin screens do —
 * a safety item with the wrong audience simply disappears from both pages.
 */
export function SafetyItems({ items, audience }: { items: SafetyItemCard[]; audience: "kids" | "adults" }) {
  const editing = useEditMode();
  // The whole section disappears when it is empty, which would leave no way to
  // add the first item. In edit mode it stays so the add affordance is reachable.
  if (items.length === 0 && !editing) return null;
  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-10 text-center">What makes us safe?</h2>
      <div className="space-y-8">
        <EditableCollection
          table="safety_items"
          items={items}
          // title and body are NOT NULL, so a new row needs copy to start from.
          newItem={{ audience, title: "New safety point", body: "Say what makes this safe." }}
          addLabel="Add a safety point"
          itemLabel="safety point"
        >
          {(it) => (
            <div key={it.id} className="grid md:grid-cols-[260px_1fr] gap-6 items-start">
              <EditableImage table="safety_items" id={it.id}>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100">
                  {it.photo && (
                    <Image src={it.photo} alt={it.title} fill className="object-cover" sizes="(min-width: 768px) 260px, 100vw" />
                  )}
                </div>
              </EditableImage>
              <div>
                <EditableText
                  as="h3"
                  table="safety_items"
                  field="title"
                  id={it.id}
                  className="font-serif text-xl text-stone-900 mb-2"
                >
                  {it.title}
                </EditableText>
                <EditableText
                  as="p"
                  table="safety_items"
                  field="body"
                  id={it.id}
                  className="text-stone-600 leading-relaxed whitespace-pre-wrap"
                >
                  {it.body}
                </EditableText>
              </div>
            </div>
          )}
        </EditableCollection>
      </div>
    </section>
  );
}
