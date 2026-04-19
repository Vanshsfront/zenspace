"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const FALLBACK = "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=800";

const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const STAGGER_CHILD = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export function OurArtistsContent() {
  const artists = [
    {
      id: "avinash-kumar",
      name: "Avinash Kumar",
      role: "Tattoo Artist",
      photo: FALLBACK,
      portfolio_url: "/our-artist/avinash-kumar"
    },
    {
      id: "suren",
      name: "Suren",
      role: "Founder & Tattoo Artist",
      photo: FALLBACK,
      portfolio_url: "/our-artist/suren"
    },
    {
      id: "artist-3",
      name: "Guest Artist",
      role: "Resident Artist",
      photo: FALLBACK,
      portfolio_url: "#"
    }
  ];

  return (
    <div className="bg-paper-texture min-h-screen pt-32 pb-24 px-6 relative overflow-hidden">
      {/* Background blurs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-stone-200/40 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center mb-24"
        >
          <p className="font-serif text-2xl md:text-3xl text-stone-700 leading-relaxed mb-10">
            Every tattoo is created with attention to placement, detail, and long-term clarity. The process is calm, precise, and guided from consultation to aftercare.
          </p>
          <p className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-stone-900 to-stone-500 mb-16 inline-block">
            Trusted by 250+ clients.
          </p>
          <h1 className="font-serif text-4xl md:text-6xl text-stone-900 tracking-tight">Meet our artists</h1>
        </motion.div>

        <motion.div 
          variants={STAGGER_CONTAINER} 
          initial="hidden" 
          whileInView="show" 
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-10"
        >
          {artists.map((a) => (
            <motion.div 
              key={a.id} 
              variants={STAGGER_CHILD}
              className="text-center group"
            >
              <Link href={a.portfolio_url}>
                <motion.div 
                  whileHover={{ scale: 1.03, y: -10 }}
                  className="relative aspect-[3/4] rounded-[2rem] overflow-hidden mb-6 shadow-lg hover:shadow-2xl transition-all duration-500"
                >
                  <Image src={a.photo} alt={a.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors duration-500" />
                </motion.div>
              </Link>
              <h3 className="font-serif text-2xl group-hover:text-stone-600 transition-colors duration-300">{a.name}</h3>
              <p className="text-sm text-stone-500 font-medium uppercase tracking-widest mt-2 mb-4">{a.role}</p>
              
              <Link 
                href={a.portfolio_url} 
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-stone-300 text-sm font-medium hover:bg-stone-900 hover:border-stone-900 hover:text-stone-50 transition-all duration-300 group/btn"
              >
                Portfolio <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
