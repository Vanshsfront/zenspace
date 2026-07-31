"use client";

import { motion } from "framer-motion";
import { Star, MapPin, MessageCircle, Phone as PhoneIcon } from "lucide-react";
import { MapEmbed } from "@/components/MapEmbed";
import { whatsappHref } from "@/lib/whatsapp";
import type { SiteSettings } from "@/lib/data";

const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const STAGGER_CHILD = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

export function ContactContent({ settings }: { settings: SiteSettings | null }) {
  const waHref = whatsappHref(settings?.whatsapp, "Hi Zenspace, I'd like to book a consultation.");
  const tel = settings?.phone?.split(/[/,]/)[0]?.trim();
  const address = settings?.address || "Akruti Commercial Complex MIDC Andheri East Mumbai";

  return (
    <div className="bg-paper-texture min-h-screen pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-stone-200/40 blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        <motion.div initial="hidden" animate="show" variants={STAGGER_CONTAINER} className="max-w-4xl mx-auto text-center mb-14">
          <motion.h1 variants={STAGGER_CHILD} className="font-serif text-5xl md:text-7xl text-stone-900 tracking-tight mb-8">
            Contact &amp; Locate Us
          </motion.h1>
          <motion.p variants={STAGGER_CHILD} className="text-xl md:text-2xl font-serif text-stone-700 leading-relaxed mb-6">
            Looking for a professional tattoo studio in Andheri, Mumbai?
          </motion.p>
          <motion.p variants={STAGGER_CHILD} className="text-lg text-stone-600 leading-relaxed mb-8">
            We create custom, realistic, and minimal tattoos in a clean, comfortable, and hygienic environment. Quality work, clear communication, and tattoos that are designed to last.
          </motion.p>

          {/* Quick contact actions */}
          <motion.div variants={STAGGER_CHILD} className="flex flex-wrap justify-center gap-3">
            {waHref && (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#25D366] text-white font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <MessageCircle size={20} />
                Chat on WhatsApp
              </a>
            )}
            {tel && (
              <a
                href={`tel:${tel.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-stone-900 text-stone-50 font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <PhoneIcon size={20} />
                Call us
              </a>
            )}
            <a
              href="#map"
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-white/80 border border-stone-300 text-stone-900 font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <MapPin size={20} />
              See on map
            </a>
          </motion.div>
        </motion.div>

        {/* Get in touch */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={STAGGER_CONTAINER}
          className="bg-white/60 backdrop-blur-xl border border-stone-200/50 rounded-[3rem] shadow-2xl overflow-hidden grid lg:grid-cols-2 mb-16"
        >
          {/* Left: address */}
          <motion.div variants={STAGGER_CHILD} className="bg-stone-900 text-stone-50 p-10 md:p-14 relative overflow-hidden h-full flex flex-col">
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-stone-700/30 blur-[60px] rounded-full pointer-events-none" />

            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="w-14 h-14 bg-stone-800 rounded-full flex items-center justify-center shrink-0 border border-stone-700">
                <MapPin className="text-stone-300" size={24} />
              </div>
              <h3 className="font-serif text-2xl md:text-3xl tracking-wide leading-tight">ZENSPACE TATTOO AND PIERCING</h3>
            </div>

            <p className="text-stone-400 text-lg leading-relaxed mb-8 relative z-10 whitespace-pre-line">
              {settings?.address ||
                "Shop No. 101, 1st Floor,\nZenspace Art And Tattoo,\nAkruti Commercial Complex, MIDC Central Rd,\nAndheri East, Mumbai 400093"}
            </p>

            {waHref && (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 inline-flex items-center gap-3 self-start px-6 py-3 rounded-full bg-[#25D366] text-white font-medium shadow-lg hover:shadow-xl transition-all mb-6"
              >
                <MessageCircle size={18} />
                WhatsApp us
              </a>
            )}

            <a
              href={settings?.google_reviews_url || "https://share.google/pSxgjeACR2Lh3WI9P"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="See our Google reviews"
              className="flex flex-wrap items-center gap-3 bg-stone-800/80 w-fit px-6 py-3 rounded-full border border-stone-700 backdrop-blur-md relative z-10 mt-auto transition-all hover:bg-stone-700/80 hover:border-stone-600 hover:scale-[1.03]"
            >
              <span className="font-bold text-xl">5.0</span>
              <div className="flex text-yellow-500">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <span className="text-stone-400 font-medium">{settings?.google_review_count ?? 193} reviews</span>
            </a>
          </motion.div>

          {/* Right: form */}
          <motion.div variants={STAGGER_CHILD} className="p-10 md:p-14 flex flex-col justify-center">
            <h2 className="text-sm font-bold tracking-widest text-stone-400 uppercase mb-3">Get In Touch</h2>
            <p className="font-serif text-3xl md:text-4xl text-stone-900 leading-tight mb-8">
              READY TO MAKE YOUR TATTOO DREAMS A REALITY? FILL OUT THE FORM AND LET'S MAKE IT HAPPEN!
            </p>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2 px-1">Your Name (Required)</label>
                <input type="text" required className="w-full bg-white/50 border border-stone-200 rounded-2xl px-5 py-4 outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2 px-1">Your Email (Required)</label>
                <input type="email" required className="w-full bg-white/50 border border-stone-200 rounded-2xl px-5 py-4 outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2 px-1">Your Phone Number (Required)</label>
                <input type="tel" required className="w-full bg-white/50 border border-stone-200 rounded-2xl px-5 py-4 outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2 px-1">Do You Have A Design In Mind?</label>
                <select className="w-full bg-white/50 border border-stone-200 rounded-2xl px-5 py-4 outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all appearance-none cursor-pointer font-medium">
                  <option value="">Select an option...</option>
                  <option value="yes">Yes, I have a clear idea / reference</option>
                  <option value="no">No, I need help designing it</option>
                  <option value="maybe">I have a rough concept</option>
                </select>
              </div>
              <button type="submit" className="w-full mt-2 bg-stone-900 text-stone-50 py-5 rounded-2xl font-bold uppercase tracking-widest hover:bg-stone-800 hover:shadow-lg transition-all hover:-translate-y-1">
                Submit
              </button>
            </form>
          </motion.div>
        </motion.div>

        {/* Map (the merged 'Locate Us' block — /locate-us redirects here) */}
        <section id="map" className="scroll-mt-28">
          <h2 className="font-serif text-3xl md:text-4xl mb-6 text-stone-900">Find us</h2>
          <p className="text-stone-700 mb-6 max-w-2xl whitespace-pre-line">{address}</p>
          <MapEmbed query={address} />
        </section>
      </div>

      {/* Floating WhatsApp button — sticky on every contact-page scroll */}
      {waHref && (
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="fixed bottom-6 right-6 z-40 inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-110 transition-transform"
        >
          <MessageCircle size={26} />
        </a>
      )}
    </div>
  );
}
