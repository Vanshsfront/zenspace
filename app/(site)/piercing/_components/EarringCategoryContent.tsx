"use client";

import Image from "next/image";
import Link from "next/link";
import type { EarringCategoryRow, EarringProductRow } from "@/lib/data";
import { useEditMode } from "@/lib/edit/context";
import { EditableText } from "@/lib/edit/EditableText";
import { EditableImage } from "@/lib/edit/EditableImage";
import { EditableCollection } from "@/lib/edit/EditableCollection";

/**
 * The body of /piercing/earrings/<slug>.
 *
 * Split out of page.tsx only so it can ask whether edit mode is on: almost
 * everything on this page is optional and renders nothing when it is empty,
 * which would leave the admin no element to click in order to fill it in for the
 * first time. The page itself stays a server component and keeps its
 * force-static rendering.
 */
export function EarringCategoryContent({
  category,
  products,
}: {
  category: EarringCategoryRow;
  products: EarringProductRow[];
}) {
  const editing = useEditMode();
  // Gives an empty optional field enough height to aim at. Appended only in edit
  // mode so a visitor's class attributes are byte for byte what they were.
  const emptySlot = editing ? " empty:block empty:min-h-[1.5em]" : "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/40 via-white to-violet-50/40">
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-12 text-center">
        <p className="text-sm text-stone-500 mb-2">
          <Link href="/piercing" className="hover:text-stone-700">Piercing</Link> · {category.audience === "kids" ? "Kids" : category.audience === "adults" ? "Adults" : "All ages"}
        </p>
        <EditableText
          as="h1"
          table="earring_categories"
          field="name"
          id={category.id}
          className="font-serif text-5xl md:text-6xl text-stone-900 tracking-tight"
        >
          {category.name}
        </EditableText>
        {(category.description || editing) && (
          <EditableText
            as="p"
            table="earring_categories"
            field="description"
            id={category.id}
            className={`text-stone-600 max-w-2xl mx-auto mt-4 leading-relaxed${emptySlot}`}
          >
            {category.description || ""}
          </EditableText>
        )}
        {(category.photo || editing) && (
          <EditableImage table="earring_categories" id={category.id}>
            <div className="relative w-full max-w-3xl mx-auto aspect-[16/9] mt-10 rounded-[2rem] overflow-hidden shadow-lg">
              {category.photo && (
                <Image src={category.photo} alt={category.name} fill className="object-cover" sizes="(min-width: 768px) 768px, 100vw" />
              )}
            </div>
          </EditableImage>
        )}
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        {products.length === 0 && !editing ? (
          <p className="text-center text-stone-500 italic">More designs coming soon.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            <EditableCollection
              table="earring_products"
              items={products}
              // category_id is stamped from the route, and name is NOT NULL.
              newItem={{ category_id: category.id, name: "New design" }}
              addLabel="Add a design"
              itemLabel="design"
            >
              {(p) => (
                <div key={p.id} className="bg-white/80 backdrop-blur-md border border-stone-200/60 rounded-[2rem] overflow-hidden shadow-lg flex flex-col">
                  <EditableImage table="earring_products" id={p.id}>
                    <div className="relative aspect-square bg-stone-100">
                      {p.photo ? (
                        <Image src={p.photo} alt={p.name} fill className="object-cover" sizes="(min-width: 768px) 30vw, 100vw" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-stone-400">No image</div>
                      )}
                    </div>
                  </EditableImage>
                  <div className="p-6 flex-1 flex flex-col">
                    <EditableText
                      as="h3"
                      table="earring_products"
                      field="name"
                      id={p.id}
                      className="font-serif text-xl text-stone-900 mb-1"
                    >
                      {p.name}
                    </EditableText>
                    {/* price_inr is an Int column and the inline text editor only
                        writes strings, which Prisma rejects. It stays on the
                        /admin form until there is a number primitive. */}
                    {p.price_inr != null && (
                      <p className="text-stone-700 text-sm font-medium mb-2">₹{p.price_inr.toLocaleString("en-IN")}</p>
                    )}
                    {(p.description || editing) && (
                      <EditableText
                        as="p"
                        table="earring_products"
                        field="description"
                        id={p.id}
                        className={`text-stone-600 leading-relaxed text-sm${emptySlot}`}
                      >
                        {p.description || ""}
                      </EditableText>
                    )}
                  </div>
                </div>
              )}
            </EditableCollection>
          </div>
        )}
      </section>
    </div>
  );
}
