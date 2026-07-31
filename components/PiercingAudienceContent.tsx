"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Baby, MessageCircle, Phone as PhoneIcon, Sparkles, Gem, ShieldCheck, Smile, UserCircle2, ArrowRight } from "lucide-react";
import { whatsappHref } from "@/lib/whatsapp";
import type { SiteSettings, PiercingPhoto, EarringCategoryRow, SafetyItemRow } from "@/lib/data";
import { SafetyItems } from "./SafetyItems";

const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const STAGGER_CHILD = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

const WA_MESSAGE = {
  kids: "Hi Zenspace, I'd like to book a piercing for my child.",
  adults: "Hi Zenspace, I'd like to book a piercing.",
} as const;

const COPY = {
  kids: {
    title: "Piercings for Little Stars",
    intro:
      "Gentle, sterile piercings for babies and children, done with calm hands, hypoallergenic jewellery, parent-friendly aftercare and a quiet, clean space.",
    badges: [
      { Icon: Baby, t: "Expert Child Care" },
      { Icon: ShieldCheck, t: "Safe & Hygienic" },
      { Icon: Smile, t: "Painless Experience" },
    ],
    accent: "from-pink-500 to-rose-500",
    accentText: "text-pink-600",
    accentRing: "ring-pink-200/70",
  },
  adults: {
    title: "Piercings for everyone",
    intro:
      "Sterile, single-use needles and hypoallergenic jewellery in a calm, walk-in friendly studio. Ears, nose, navel and more, for first-timers and seasoned collectors.",
    badges: [
      { Icon: Sparkles, t: "Trendy Designs" },
      { Icon: UserCircle2, t: "Expert Piercers" },
      { Icon: Gem, t: "Premium Experience" },
    ],
    accent: "from-violet-500 to-fuchsia-500",
    accentText: "text-violet-600",
    accentRing: "ring-violet-200/70",
  },
} as const;

export function PiercingAudienceContent({
  audience,
  settings,
  photos,
  earringCategories,
  safetyItems,
}: {
  audience: "kids" | "adults";
  settings: SiteSettings | null;
  photos: PiercingPhoto[];
  earringCategories: EarringCategoryRow[];
  safetyItems: SafetyItemRow[];
}) {
  const c = COPY[audience];
  const title =
    (audience === "kids" ? settings?.piercing_kids_title : settings?.piercing_adults_title) || c.title;
  const intro =
    (audience === "kids" ? settings?.piercing_kids_intro : settings?.piercing_adults_intro) || c.intro;
  const waHref = whatsappHref(settings?.whatsapp, WA_MESSAGE[audience]);
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
            <Sparkles size={14} /> {audience === "kids" ? "For Kids" : "For Adults"}
          </span>
          <h1 className="font-serif text-5xl md:text-7xl mb-6 text-stone-900 tracking-tight">{title}</h1>
          <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">{intro}</p>

          <ul className="mt-8 flex flex-wrap justify-center gap-3">
            {c.badges.map(({ Icon, t }) => (
              <li key={t} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-stone-200/60 text-sm text-stone-700">
                <Icon size={16} className={c.accentText} /> {t}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Earring options */}
        <section className="mb-20">
          <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-3 text-center">Choose your earrings</h2>
          <p className="text-stone-500 text-center mb-10">
            {audience === "kids"
              ? "Skin-friendly options picked for delicate young ears."
              : "Premium metals to match your style."}
          </p>
          {earringCategories.length > 0 ? (
            <motion.div
              variants={STAGGER_CONTAINER}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8"
            >
              {earringCategories.map((e) => (
                <motion.div
                  key={e.id}
                  variants={STAGGER_CHILD}
                  className="bg-white/80 backdrop-blur-md border border-stone-200/60 rounded-[2rem] overflow-hidden shadow-lg flex flex-col"
                >
                  <Link href={`/piercing/earrings/${e.slug}`} className="block">
                    <div className={`relative aspect-square bg-stone-100 ring-1 ${c.accentRing}`}>
                      {e.photo ? (
                        <Image src={e.photo} alt={e.name} fill className="object-cover" sizes="(min-width: 768px) 30vw, 100vw" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-stone-400">
                          <Gem size={40} />
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-serif text-2xl text-stone-900 mb-2">{e.name}</h3>
                      {e.description && <p className="text-stone-600 leading-relaxed text-sm flex-1">{e.description}</p>}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12 px-6 rounded-[2rem] bg-stone-100/60 border border-stone-200/60">
              <p className="text-stone-500 italic">Earring options are coming soon.</p>
            </div>
          )}
        </section>

        {/* What makes us safe? */}
        <SafetyItems items={safetyItems} />

        {/* Gallery */}
        {photos.length > 0 && (
          <section className="mb-20">
            <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-8 text-center">Recent work</h2>
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
          </section>
        )}

        {/* CTA + aftercare */}
        <div className="bg-white/70 backdrop-blur-md border border-stone-200/60 rounded-[2.5rem] p-8 md:p-12 shadow-xl text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-4">Ready to book?</h2>
          <p className="text-stone-600 leading-relaxed text-lg max-w-2xl mx-auto mb-8">
            Walk in or reach out. Our team will guide you through every step.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
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
            <Link
              href="/custom"
              prefetch
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r ${c.accent} text-white font-medium shadow-md hover:shadow-xl hover:scale-105 transition-all`}
            >
              Request a custom design <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
