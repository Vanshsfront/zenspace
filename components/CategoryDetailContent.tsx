"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const STAGGER_CHILD = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

type Photo = { id: string; photo: string; caption: string | null };

export function CategoryDetailContent({
  name,
  description,
  photos,
}: {
  name: string;
  description?: string;
  photos: Photo[];
}) {
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
          <h1 className="font-serif text-5xl md:text-7xl mb-6 text-stone-900 tracking-tight">{name}</h1>
          {description && (
            <p className="text-lg md:text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed">{description}</p>
          )}
        </motion.div>

        {photos.length === 0 ? (
          <p className="text-center text-stone-500 italic">Photos for this category coming soon — check back shortly.</p>
        ) : (
          <motion.div
            variants={STAGGER_CONTAINER}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-6 md:gap-8"
          >
            {photos.map((p) => (
              <motion.div
                key={p.id}
                variants={STAGGER_CHILD}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-lg group"
              >
                <Image
                  src={p.photo}
                  alt={p.caption || name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {p.caption && (
                  <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-stone-900/80 to-transparent text-stone-50 text-sm">
                    {p.caption}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
