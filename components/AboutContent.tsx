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

const DEFAULT_BODY =
  "ZenSpace Tattoo Studio is a professional tattoo studio in Andheri, Mumbai, focused on custom, realistic, and minimal tattoo work. Our artists work closely with clients to turn ideas into tattoos that are meaningful, well-placed, and designed to age well on the skin.\n\nWe follow strict hygiene standards and use professional-grade equipment to ensure a safe and comfortable experience. Whether it's your first tattoo or an addition to your collection, we focus on clean execution, clear communication, and long-term quality.";

export function AboutContent({
  settings,
  studio,
}: {
  settings: SiteSettings | null;
  studio: StudioPhoto[];
}) {
  const photos: { id: string; src: string; caption: string | null }[] =
    studio.length > 0
      ? studio.map((s) => ({ id: s.id, src: s.photo, caption: s.caption }))
      : FALLBACK_STUDIO_PHOTOS.map((src, i) => ({ id: `fallback-${i}`, src, caption: null }));

  const title = settings?.about_title || "Workspace where we create magic";
  const heading = settings?.about_heading || "About Zenspace";
  const body = settings?.about_body || DEFAULT_BODY;
  const paragraphs = body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  // Two overlapped photos: prefer the dedicated About slots, else first studio shots.
  const photo1 = settings?.about_photo_1 || photos[0]?.src;
  const photo2 = settings?.about_photo_2 || photos[1]?.src || photos[0]?.src;

  return (
    <div className="bg-paper-texture min-h-screen pt-32 pb-20 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="font-serif text-5xl md:text-7xl text-stone-900 tracking-tight premium-gradient-text">
            {title}
          </h1>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center mb-24">
          {/* Two overlapped photos */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative w-full max-w-md mx-auto md:mx-0"
          >
            {photo1 && (
              <div className="relative aspect-[4/5] w-[82%] rounded-[2rem] overflow-hidden shadow-2xl bg-stone-200">
                <Image
                  src={photo1}
                  alt="Inside Zenspace studio"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 40vw, 80vw"
                  priority
                />
              </div>
            )}
            {photo2 && (
              <div className="absolute bottom-0 right-0 w-[55%] aspect-square rounded-[1.5rem] overflow-hidden shadow-2xl ring-4 ring-[#fafaf9] bg-stone-200">
                <Image
                  src={photo2}
                  alt="Zenspace studio detail"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 22vw, 45vw"
                />
              </div>
            )}
          </motion.div>

          {/* About Zenspace heading directly above the paragraph */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-6">{heading}</h2>
            <div className="space-y-6 text-lg text-stone-600 leading-relaxed">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
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
