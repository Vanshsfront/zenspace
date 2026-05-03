"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { SiteSettings } from "@/lib/data";

export function AboutContent({ settings }: { settings: SiteSettings | null }) {
  const heroImage = settings?.hero_image;

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
          className="relative w-full h-[50vh] md:h-[60vh] rounded-[3rem] overflow-hidden shadow-2xl mb-24 group bg-stone-200"
        >
          {heroImage ? (
            <Image
              src={heroImage}
              alt="Zenspace Workspace"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-1000"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-stone-200 via-stone-300 to-stone-400 flex items-center justify-center">
              <span className="font-serif text-stone-600 text-3xl px-12 text-center">Studio photo coming soon</span>
            </div>
          )}
          <div className="absolute inset-0 bg-stone-900/10 mix-blend-overlay" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
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
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-stone-200 to-transparent rounded-[3rem] blur-2xl opacity-60 -z-10" />
            <motion.div
              whileHover={{ scale: 1.02, rotate: 1 }}
              className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-xl bg-stone-200"
            >
              {heroImage ? (
                <Image
                  src={heroImage}
                  alt="Zenspace founders"
                  fill
                  className="object-cover transition-transform duration-700"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-stone-300 to-stone-500 flex items-center justify-center">
                  <span className="font-serif text-stone-100 text-2xl px-8 text-center">Meet the team</span>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
