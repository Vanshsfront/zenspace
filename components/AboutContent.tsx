"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { SiteSettings, StudioPhoto } from "@/lib/data";

const FALLBACK_STUDIO_PHOTOS = [
  "/assets/photos/studio-1.png",
  "/assets/photos/tattoo-1.jpeg",
  "/assets/photos/tattoo-2.jpeg",
  "/assets/photos/tattoo-3.jpeg",
];

export function AboutContent({
  settings,
  studio,
}: {
  settings: SiteSettings | null;
  studio: StudioPhoto[];
}) {
  // Use real studio uploads when available; otherwise fall back to the bundled
  // studio/tattoo shots so the layout never reads as empty.
  const photos: { id: string; src: string; caption: string | null }[] =
    studio.length > 0
      ? studio.map((s) => ({ id: s.id, src: s.photo, caption: s.caption }))
      : FALLBACK_STUDIO_PHOTOS.map((src, i) => ({ id: `fallback-${i}`, src, caption: null }));

  const hero = photos[0];

  return (
    <div className="bg-paper-texture min-h-screen pt-32 pb-20 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="font-serif text-5xl md:text-7xl mb-6 text-stone-900 tracking-tight">About Zenspace</h1>
          <p className="text-2xl md:text-3xl text-stone-500 font-serif italic premium-gradient-text">
            Workspace where we create magic
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative w-full h-[50vh] md:h-[60vh] rounded-[3rem] overflow-hidden shadow-2xl mb-16 group bg-stone-200"
        >
          <Image
            src={hero.src}
            alt={hero.caption || "Inside Zenspace studio"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-1000"
            sizes="(min-width: 1024px) 1024px, 100vw"
            priority
          />
          <div className="absolute inset-0 bg-stone-900/10 mix-blend-overlay" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6 text-lg text-stone-600 leading-relaxed"
          >
            <p>
              ZenSpace Tattoo Studio is a professional tattoo studio in Andheri, Mumbai, focused on custom, realistic, and minimal tattoo work. Our artists work closely with clients to turn ideas into tattoos that are meaningful, well-placed, and designed to age well on the skin.
            </p>
            <p>
              We follow strict hygiene standards and use professional-grade equipment to ensure a safe and comfortable experience. Whether it's your first tattoo or an addition to your collection, we focus on clean execution, clear communication, and long-term quality.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-3 md:gap-4"
          >
            {photos.slice(1, 5).map((p, i) => (
              <div
                key={p.id}
                className="relative aspect-square rounded-2xl overflow-hidden shadow-md bg-stone-200"
              >
                <Image
                  src={p.src}
                  alt={p.caption || "Studio detail"}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(min-width: 768px) 25vw, 50vw"
                />
              </div>
            ))}
          </motion.div>
        </div>

        {photos.length > 1 && (
          <section>
            <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-8 text-center">
              Inside the studio
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {photos.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5 }}
                  className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-md bg-stone-200 group"
                >
                  <Image
                    src={p.src}
                    alt={p.caption || "Studio photo"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(min-width: 768px) 33vw, 50vw"
                  />
                  {p.caption && (
                    <div className="absolute inset-x-0 bottom-0 px-4 py-3 bg-gradient-to-t from-stone-900/80 to-transparent text-stone-50 text-xs">
                      {p.caption}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
