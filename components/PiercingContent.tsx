"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Baby, MessageCircle, Phone as PhoneIcon, Sparkles } from "lucide-react";
import type { SiteSettings, PiercingPhoto } from "@/lib/data";

const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const STAGGER_CHILD = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

function whatsappHref(raw?: string | null) {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent("Hi Zenspace, I'd like to ask about a piercing.")}`;
}

const DEFAULT_TITLE = "Piercings, done with care";
const DEFAULT_INTRO =
  "Sterile, single-use needles. Hypoallergenic jewellery. A calm, walk-in friendly studio in Andheri East. We pierce ears, nose, navel, and more — for first-timers and seasoned collectors.";
const DEFAULT_BABY =
  "We offer gentle, sterile piercings for babies and children — done with calm hands, parent-friendly aftercare, and a clean, quiet space. Walk in or book ahead.";

export function PiercingContent({
  settings,
  photos,
}: {
  settings: SiteSettings | null;
  photos: PiercingPhoto[];
}) {
  const waHref = whatsappHref(settings?.whatsapp);
  const tel = settings?.phone?.split(/[/,]/)[0]?.trim();

  return (
    <div className="bg-paper-texture min-h-screen pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-stone-200/40 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900 text-stone-50 text-xs uppercase tracking-widest mb-6">
            <Sparkles size={14} /> Service
          </span>
          <h1 className="font-serif text-5xl md:text-7xl mb-6 text-stone-900 tracking-tight">
            {settings?.piercing_title || DEFAULT_TITLE}
          </h1>
          <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
            {settings?.piercing_intro || DEFAULT_INTRO}
          </p>
        </motion.div>

        {/* Baby piercings callout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="bg-white/70 backdrop-blur-md border border-stone-200/60 rounded-[2.5rem] p-8 md:p-12 shadow-xl mb-20 grid md:grid-cols-[auto_1fr] gap-8 items-center"
        >
          <div className="w-20 h-20 rounded-full bg-stone-900 text-stone-50 flex items-center justify-center mx-auto md:mx-0 shrink-0">
            <Baby size={32} />
          </div>
          <div>
            <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-3">For babies & children</h2>
            <p className="text-stone-600 leading-relaxed text-lg">
              {settings?.piercing_baby_blurb || DEFAULT_BABY}
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              {waHref && (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white font-medium shadow-md hover:shadow-xl hover:scale-105 transition-all"
                >
                  <MessageCircle size={18} /> Ask on WhatsApp
                </a>
              )}
              {tel && (
                <a
                  href={`tel:${tel.replace(/\s+/g, "")}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-900 text-stone-50 font-medium shadow-md hover:shadow-xl hover:scale-105 transition-all"
                >
                  <PhoneIcon size={18} /> Call us
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Gallery */}
        {photos.length > 0 ? (
          <motion.div
            variants={STAGGER_CONTAINER}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8"
          >
            {photos.map((p) => (
              <motion.div
                key={p.id}
                variants={STAGGER_CHILD}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-lg group"
              >
                <Image src={p.photo} alt={p.caption || "Piercing"} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                {p.caption && (
                  <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-stone-900/80 to-transparent text-stone-50 text-sm">
                    {p.caption}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16 px-6 rounded-[2rem] bg-stone-100/60 border border-stone-200/60">
            <p className="text-stone-500 italic">A gallery of recent piercings is coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
