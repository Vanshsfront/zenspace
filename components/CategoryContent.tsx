"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const FALLBACK = "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=800";

const STAGGER_CHILD = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

export function CategoryContent() {
  const categories = [
    {
      title: "Realistic Tattoos",
      description: "Detailed realistic tattoos created in Andheri, Mumbai, focusing on depth, accuracy, and long-lasting clarity.",
      photos: [FALLBACK, FALLBACK, FALLBACK]
    },
    {
      title: "Small & Minimal Tattoos",
      description: "Simple, clean tattoos designed with precise linework and balanced placement for a subtle, timeless look.",
      photos: [FALLBACK, FALLBACK, FALLBACK]
    }
  ];

  return (
    <div className="bg-paper-texture min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h1 className="font-serif text-5xl md:text-7xl mb-6 text-stone-900 tracking-tight">Our Specialties</h1>
          <p className="text-xl md:text-2xl text-stone-500 font-serif italic premium-gradient-text max-w-2xl mx-auto">
            Crafted with precision, designed for longevity.
          </p>
        </motion.div>

        <div className="space-y-48 md:space-y-64">
          {categories.map((category, idx) => (
            <motion.div 
              key={category.title}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={STAGGER_CONTAINER}
              className="relative"
            >
              {/* Subtle background glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-stone-200/50 blur-[100px] rounded-full pointer-events-none -z-10" />

              <div className="text-center max-w-3xl mx-auto mb-16">
                <motion.h2 variants={STAGGER_CHILD} className="font-serif text-4xl md:text-5xl text-stone-900 mb-6">
                  {category.title}
                </motion.h2>
                <motion.p variants={STAGGER_CHILD} className="text-lg text-stone-600 leading-relaxed">
                  {category.description}
                </motion.p>
              </div>

              <motion.div variants={STAGGER_CONTAINER} className="grid md:grid-cols-3 gap-6 md:gap-8">
                {category.photos.map((photo, pIdx) => (
                  <motion.div 
                    key={pIdx}
                    variants={STAGGER_CHILD}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-lg group"
                  >
                    <Image 
                      src={photo} 
                      alt={`${category.title} photo ${pIdx + 1}`} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors duration-500" />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
