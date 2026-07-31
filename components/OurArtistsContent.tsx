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
 * The photo sits inside the card link, so in edit mode a click meant for the
 * media controls would navigate away instead. Editable regions mark themselves
 * with a data attribute, which is enough to tell the two apart. Outside edit
 * mode nothing carries the attribute and the link behaves normally.
 */
function swallowEditClicks(e: React.MouseEvent<HTMLAnchorElement>) {
  if ((e.target as HTMLElement).closest("[data-edit-field],[data-edit-media]")) e.preventDefault();
}

const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const STAGGER_CHILD = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

type Artist = {
  id: string;
  name: string;
  slug: string | null;
  role: string | null;
  photo: string | null;
};

export function OurArtistsContent({ artists }: { artists: Artist[] }) {
  const editing = useEditMode();

  return (
    <div className="bg-paper-texture min-h-screen pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-stone-200/40 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center mb-20"
        >
          <p className="font-serif text-2xl md:text-3xl text-stone-700 leading-relaxed mb-10">
            Every tattoo is created with attention to placement, detail, and long-term clarity. The process is calm, precise, and guided from consultation to aftercare.
          </p>
          <h1 className="font-serif text-4xl md:text-6xl text-stone-900 tracking-tight">Meet our artists</h1>
        </motion.div>

        {/* The empty state replaces the grid, so in edit mode the grid wins and
            the Add card has somewhere to live. */}
        {artists.length === 0 && !editing ? (
          <p className="text-center text-stone-500">No artists yet. Add some from the admin panel.</p>
        ) : (
          <motion.div
            variants={STAGGER_CONTAINER}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-10"
          >
            <EditableCollection
              table="artists"
              items={artists}
              // name is NOT NULL and the slug is derived from it server-side.
              newItem={{ name: "New artist" }}
              addLabel="Add artist"
              itemLabel="artist"
            >
              {(a) => {
                const href = a.slug ? `/our-artist/${a.slug}` : "#";
                return (
                  <motion.div key={a.id} variants={STAGGER_CHILD} className="text-center group">
                    <Link href={href} prefetch onClick={swallowEditClicks}>
                      <motion.div
                        // The lift would slide the card out from under the
                        // pointer while the media controls are open.
                        whileHover={editing ? undefined : { scale: 1.03, y: -10 }}
                        className="relative aspect-[3/4] rounded-[2rem] overflow-hidden mb-6 shadow-lg hover:shadow-2xl transition-all duration-500 bg-stone-200"
                      >
                        <EditableImage table="artists" id={a.id}>
                          {a.photo ? (
                            <Image src={a.photo} alt={a.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(min-width: 768px) 33vw, 100vw" />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-stone-200 to-stone-400 flex items-center justify-center">
                              <span className="font-serif text-stone-600 text-2xl px-4 text-center">{a.name}</span>
                            </div>
                          )}
                        </EditableImage>
                        {/* Decorative tint only. Without pointer-events-none it
                            sits over the photo and blocks the hover that reveals
                            the Replace and Remove controls in edit mode. */}
                        <div className="absolute inset-0 pointer-events-none bg-stone-900/10 group-hover:bg-transparent transition-colors duration-500" />
                      </motion.div>
                    </Link>
                    <EditableText table="artists" field="name" id={a.id} as="h3" className="font-serif text-2xl group-hover:text-stone-600 transition-colors duration-300">
                      {a.name}
                    </EditableText>
                    {(a.role || editing) && (
                      <EditableText table="artists" field="role" id={a.id} as="p" className="text-sm text-stone-500 font-medium uppercase tracking-widest mt-2 mb-4">
                        {a.role}
                      </EditableText>
                    )}

                    <Link
                      href={href}
                      prefetch
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-stone-300 text-sm font-medium hover:bg-stone-900 hover:border-stone-900 hover:text-stone-50 transition-all duration-300 group/btn"
                    >
                      Portfolio <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                );
              }}
            </EditableCollection>
          </motion.div>
        )}
      </div>
    </div>
  );
}
