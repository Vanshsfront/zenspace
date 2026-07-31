"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { EditableCollection } from "@/lib/edit/EditableCollection";
import { EditableImage } from "@/lib/edit/EditableImage";
import { EditableText } from "@/lib/edit/EditableText";
import { useEditMode } from "@/lib/edit/context";

const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const STAGGER_CHILD = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

interface ArtistProfileProps {
  /** The artist row id. Every field on this page writes back to it. */
  id: string;
  name: string;
  role: string;
  experience: string;
  specialty: string;
  bio: string;
  photo: string;
  works: { id: string; photo: string }[];
}

export function ArtistProfileContent({ id, name, role, experience, specialty, bio, photo, works }: ArtistProfileProps) {
  const editing = useEditMode();

  return (
    <div className="bg-paper-texture min-h-screen pt-32 pb-24 px-6 relative overflow-hidden">
      {/* Background blurs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-stone-200/40 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-12 gap-12 md:gap-20 items-center mb-32">
          {/* Left: Photo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:col-span-5 relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-stone-300 to-transparent rounded-[3rem] blur-2xl opacity-50 -z-10" />
            <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl bg-stone-200">
              <EditableImage table="artists" id={id}>
                {photo ? (
                  <Image src={photo} alt={name} fill className="object-cover" priority sizes="(min-width: 768px) 40vw, 100vw" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-stone-300 to-stone-500 flex items-center justify-center">
                    <span className="font-serif text-stone-50 text-3xl px-6 text-center">{name}</span>
                  </div>
                )}
              </EditableImage>
            </div>
          </motion.div>

          {/* Right: Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:col-span-7"
          >
            <EditableText table="artists" field="name" id={id} as="h1" className="font-serif text-5xl md:text-7xl text-stone-900 tracking-tight mb-2">
              {name}
            </EditableText>
            {/* A blank value collapses to a zero-height box, so in edit mode it
                keeps a minimum size to aim at. Visitors never get the class. */}
            <EditableText
              table="artists"
              field="role"
              id={id}
              as="p"
              className={`text-xl md:text-2xl font-serif italic text-stone-500 mb-10${editing && !role ? " min-h-[1.5em]" : ""}`}
            >
              {role}
            </EditableText>

            <div className="space-y-8 text-lg text-stone-600 leading-relaxed max-w-2xl">
              <div className="bg-white/60 backdrop-blur-md border border-stone-200 p-6 rounded-2xl shadow-sm space-y-4">
                <p><span className="font-bold text-stone-900">Experience:</span> <EditableText table="artists" field="experience" id={id}>{experience}</EditableText></p>
                <p><span className="font-bold text-stone-900">Specialty:</span> <EditableText table="artists" field="specialty" id={id}>{specialty}</EditableText></p>
              </div>
              <EditableText
                table="artists"
                field="bio"
                id={id}
                as="p"
                className={editing && !bio ? "min-h-[1.5em]" : undefined}
              >
                {bio}
              </EditableText>
            </div>
          </motion.div>
        </div>

        {/* Works Section */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={STAGGER_CONTAINER}
        >
          <motion.h2 variants={STAGGER_CHILD} className="font-serif text-4xl text-stone-900 mb-10 text-center">Selected Works</motion.h2>
          {/* The empty state replaces the grid, so in edit mode the grid wins
              and the Add card has somewhere to live. */}
          {works.length === 0 && !editing ? (
            <p className="text-center text-stone-500 italic">Portfolio coming soon.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              <EditableCollection
                table="portfolio_items"
                items={works}
                newItem={{ artist_id: id }}
                uploadColumn="photo"
                addLabel="Add work"
                itemLabel="photo"
              >
                {(work, i) => (
                  <motion.div
                    key={work.id}
                    variants={STAGGER_CHILD}
                    // The lift would slide the card out from under the pointer
                    // while the media controls are open.
                    whileHover={editing ? undefined : { y: -10, scale: 1.02 }}
                    className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-lg group"
                  >
                    {/* Not removable: the column is NOT NULL, so an empty work
                        is a deleted work. */}
                    <EditableImage table="portfolio_items" id={work.id} removable={false}>
                      <Image src={work.photo} alt={`Work ${i + 1} by ${name}`} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(min-width: 768px) 33vw, 100vw" />
                    </EditableImage>
                    <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors duration-500" />
                  </motion.div>
                )}
              </EditableCollection>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
