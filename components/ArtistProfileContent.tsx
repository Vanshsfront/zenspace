"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const STAGGER_CHILD = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

interface ArtistProfileProps {
  name: string;
  role: string;
  experience: string;
  specialty: string;
  bio: string;
  photo: string;
  works: string[];
}

export function ArtistProfileContent({ name, role, experience, specialty, bio, photo, works }: ArtistProfileProps) {
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
            <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl">
              <Image src={photo} alt={name} fill className="object-cover" priority />
            </div>
          </motion.div>

          {/* Right: Info */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:col-span-7"
          >
            <h1 className="font-serif text-5xl md:text-7xl text-stone-900 tracking-tight mb-2">
              {name}
            </h1>
            <p className="text-xl md:text-2xl font-serif italic text-stone-500 mb-10">
              {role}
            </p>

            <div className="space-y-8 text-lg text-stone-600 leading-relaxed max-w-2xl">
              <div className="bg-white/60 backdrop-blur-md border border-stone-200 p-6 rounded-2xl shadow-sm space-y-4">
                <p><span className="font-bold text-stone-900">Experience:</span> {experience}</p>
                <p><span className="font-bold text-stone-900">Specialty:</span> {specialty}</p>
              </div>
              <p>{bio}</p>
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
          <div className="grid md:grid-cols-3 gap-8">
            {works.map((workUrl, i) => (
              <motion.div 
                key={i} 
                variants={STAGGER_CHILD}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-lg group"
              >
                <Image src={workUrl} alt={`Work ${i + 1} by ${name}`} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors duration-500" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
