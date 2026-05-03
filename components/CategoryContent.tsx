"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

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

        {categories.length === 0 ? (
          <p className="text-center text-stone-500 italic">Categories will appear here once they're added in the admin panel.</p>
        ) : (
          <motion.div
            variants={STAGGER_CONTAINER}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 gap-10"
          >
            {categories.map((c) => (
              <motion.div key={c.id} variants={STAGGER_CHILD}>
                <Link
                  href={c.slug ? `/category/${c.slug}` : "/category"}
                  prefetch
                  className="group block rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all bg-white/40 border border-stone-200/60"
                >
                  <div className="relative aspect-[4/3] bg-stone-200">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
                  </div>
                  <div className="p-6 flex items-center justify-between">
                    <h2 className="font-serif text-3xl text-stone-900">{c.name}</h2>
                    <span className="inline-flex items-center gap-2 text-sm text-stone-500 group-hover:text-stone-900 transition-colors">
                      Explore <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
