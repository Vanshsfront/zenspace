"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EditableCollection } from "@/lib/edit/EditableCollection";
import { EditableImage } from "@/lib/edit/EditableImage";
import { EditableText } from "@/lib/edit/EditableText";
import { useEditMode } from "@/lib/edit/context";

/**
 * The whole card is a link, so in edit mode a click meant for the name or the
 * media controls would navigate away instead. Editable regions mark themselves
 * with a data attribute, which is enough to tell the two apart. Outside edit
 * mode nothing carries the attribute and the link behaves normally.
 */
function swallowEditClicks(e: React.MouseEvent<HTMLAnchorElement>) {
  if ((e.target as HTMLElement).closest("[data-edit-field],[data-edit-media]")) e.preventDefault();
}

const STAGGER_CHILD = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

type Cat = { id: string; name: string; slug: string | null; photo: string | null };

export function CategoryContent({ categories }: { categories: Cat[] }) {
  const editing = useEditMode();

  return (
    <div className="bg-paper-texture min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="font-serif text-5xl md:text-7xl mb-6 text-stone-900 tracking-tight">Our Specialties</h1>
          <p className="text-xl md:text-2xl text-stone-500 font-serif italic premium-gradient-text max-w-2xl mx-auto">
            Crafted with precision, designed for longevity.
          </p>
        </motion.div>

        {/* The empty state replaces the grid, so in edit mode the grid wins and
            the Add card has somewhere to live. */}
        {categories.length === 0 && !editing ? (
          <p className="text-center text-stone-500 italic">Categories will appear here once they're added in the admin panel.</p>
        ) : (
          <motion.div
            variants={STAGGER_CONTAINER}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 gap-10"
          >
            <EditableCollection
              table="categories"
              items={categories}
              // name is NOT NULL and the slug is derived from it server-side.
              newItem={{ name: "New category" }}
              addLabel="Add category"
              itemLabel="category"
            >
              {(c) => (
                <motion.div key={c.id} variants={STAGGER_CHILD}>
                  <Link
                    href={c.slug ? `/category/${c.slug}` : "/category"}
                    prefetch
                    onClick={swallowEditClicks}
                    className="group block rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all bg-white/40 border border-stone-200/60"
                  >
                    <div className="relative aspect-[4/3] bg-stone-200">
                      <EditableImage table="categories" id={c.id}>
                        {c.photo ? (
                          <Image
                            src={c.photo}
                            alt={c.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-stone-200 to-stone-400 flex items-center justify-center">
                            <span className="font-serif text-stone-600 text-2xl">{c.name}</span>
                          </div>
                        )}
                      </EditableImage>
                      {/* Purely decorative, so it must never eat the pointer:
                          stacked over the image it would swallow the hover that
                          reveals the Replace and Remove controls. */}
                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-stone-900/60 to-transparent" />
                    </div>
                    <div className="p-6 flex items-center justify-between">
                      <EditableText table="categories" field="name" id={c.id} as="h2" className="font-serif text-3xl text-stone-900">
                        {c.name}
                      </EditableText>
                      <span className="inline-flex items-center gap-2 text-sm text-stone-500 group-hover:text-stone-900 transition-colors">
                        Explore <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              )}
            </EditableCollection>
          </motion.div>
        )}
      </div>
    </div>
  );
}
