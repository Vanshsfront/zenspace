"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { EditableCollection } from "@/lib/edit/EditableCollection";
import { EditableImage } from "@/lib/edit/EditableImage";
import { EditableText } from "@/lib/edit/EditableText";
import { useEditMode } from "@/lib/edit/context";

const STAGGER_CHILD = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

/** Stand-in for a freshly added photo, since category_photos.photo is NOT NULL. */
const NEW_CATEGORY_PHOTO = "/assets/photos/tattoo-1.jpeg";

type Photo = { id: string; photo: string; caption: string | null };

export function CategoryDetailContent({
  id,
  name,
  description,
  photos,
}: {
  /** The category row id. The heading, the description and new photos need it. */
  id: string;
  name: string;
  description?: string;
  photos: Photo[];
}) {
  const editing = useEditMode();

  return (
    <div className="bg-paper-texture min-h-screen pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-stone-200/40 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto">
        <Link
          href="/category"
          prefetch
          className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 mb-10 transition-colors"
        >
          <ArrowLeft size={16} /> All categories
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <EditableText table="categories" field="name" id={id} as="h1" className="font-serif text-5xl md:text-7xl mb-6 text-stone-900 tracking-tight">
            {name}
          </EditableText>
          {/* Kept up in edit mode even when the category has no description, so
              one can be written. A blank value would otherwise collapse to a
              zero-height box, hence the minimum size for the admin only. */}
          {(description || editing) && (
            <EditableText
              table="categories"
              field="description"
              id={id}
              as="p"
              className={`text-lg md:text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed${
                editing && !description ? " min-h-[1.5em]" : ""
              }`}
            >
              {description}
            </EditableText>
          )}
        </motion.div>

        {/* The empty state replaces the grid, so in edit mode the grid wins and
            the Add card has somewhere to live. */}
        {photos.length === 0 && !editing ? (
          <p className="text-center text-stone-500 italic">Photos for this category coming soon. Check back shortly.</p>
        ) : (
          <motion.div
            variants={STAGGER_CONTAINER}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-6 md:gap-8"
          >
            <EditableCollection
              table="category_photos"
              items={photos}
              newItem={{ category_id: id, photo: NEW_CATEGORY_PHOTO }}
              addLabel="Add photo"
              itemLabel="photo"
            >
              {(p) => (
                <motion.div
                  key={p.id}
                  variants={STAGGER_CHILD}
                  // The lift would slide the card out from under the pointer
                  // while the media controls are open.
                  whileHover={editing ? undefined : { y: -8, scale: 1.02 }}
                  className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-lg group"
                >
                  {/* Not removable: the column is NOT NULL, so an empty photo
                      is a deleted photo. */}
                  <EditableImage table="category_photos" id={p.id} removable={false}>
                    <Image
                      src={p.photo}
                      alt={p.caption || name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </EditableImage>
                  {(p.caption || editing) && (
                    <EditableText
                      table="category_photos"
                      field="caption"
                      id={p.id}
                      as="div"
                      className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-stone-900/80 to-transparent text-stone-50 text-sm"
                    >
                      {p.caption}
                    </EditableText>
                  )}
                </motion.div>
              )}
            </EditableCollection>
          </motion.div>
        )}
      </div>
    </div>
  );
}
