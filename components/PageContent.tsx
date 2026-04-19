"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";

const FALLBACK = "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=800";

const STAGGER_CHILD = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

export function PageContent({ settings, artists, categories, studio, reviews }: any) {
  return (
    <div className="bg-paper-texture">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-36 pb-20 md:pt-48 md:pb-28 grid md:grid-cols-2 gap-12 items-center">
        <motion.div variants={STAGGER_CONTAINER} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <motion.h1 variants={STAGGER_CHILD} className="font-serif text-5xl md:text-6xl leading-tight tracking-tight text-stone-900">
            <span className="font-bold">{settings?.hero_title || "We help you choose the right tattoo"}</span>
            <br />
            <span className="italic premium-gradient-text">{settings?.hero_subtitle || "Not just any tattoo."}</span>
          </motion.h1>
          <motion.p variants={STAGGER_CHILD} className="mt-6 text-lg text-stone-600 max-w-lg leading-relaxed">
            {settings?.hero_description ||
              "A consultation-led process built around anatomy, symbolism and long term aesthetics."}
          </motion.p>
          <motion.div variants={STAGGER_CHILD} className="mt-8">
            <Link
              href="/contact"
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-stone-900 text-stone-100 overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(0,0,0,0.3)] hover:scale-105"
            >
              <span className="relative z-10 font-medium">Book a consultation</span>
              <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-stone-800 to-stone-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.02, rotate: 1 }}
          className="relative h-[420px] md:h-[560px] rounded-[2.5rem] overflow-hidden shadow-2xl"
        >
          <Image
            src={settings?.hero_image || FALLBACK}
            alt="Featured tattoo"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent mix-blend-overlay" />
        </motion.div>
      </section>

      {/* Studio photos */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="font-serif text-3xl md:text-4xl mb-12 text-center"
        >
          A place where we create your story
        </motion.h2>
        <motion.div
          variants={STAGGER_CONTAINER} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {(studio.length ? studio : Array.from({ length: 3 }).map((_, i) => ({ id: String(i), photo: FALLBACK, caption: "" }))).slice(0, 3).map((s: any) => (
            <motion.div
              key={s.id}
              variants={STAGGER_CHILD}
              whileHover={{ y: -10, scale: 1.03 }}
              className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-lg"
            >
              <Image src={s.photo} alt={s.caption || "studio"} fill className="object-cover transition-transform duration-700 hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Artists */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-stone-300 to-transparent" />
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="font-serif text-3xl md:text-4xl mb-12 text-center"
        >
          Meet our artists
        </motion.h2>
        <motion.div
          variants={STAGGER_CONTAINER} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-10"
        >
          {(artists?.length ? artists : [
            { id: "avinash-kumar", name: "Avinash Kumar", role: "Tattoo Artist", photo: FALLBACK, portfolio_url: "/our-artist/avinash-kumar" },
            { id: "suren", name: "Suren", role: "Founder & Tattoo Artist", photo: FALLBACK, portfolio_url: "/our-artist/suren" },
            { id: "artist-3", name: "Guest Artist", role: "Resident Artist", photo: FALLBACK, portfolio_url: "#" },
          ]).slice(0, 3).map((a: any) => (
            <motion.div
              key={a.id}
              variants={STAGGER_CHILD}
              className="text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.05, rotate: -2 }}
                className="relative aspect-[3/4] rounded-[2rem] overflow-hidden mb-6 shadow-xl"
              >
                <Image src={a.photo || FALLBACK} alt={a.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors duration-500" />
              </motion.div>
              <h3 className="font-serif text-2xl group-hover:premium-gradient-text transition-all duration-300">{a.name}</h3>
              {a.role && <p className="text-sm text-stone-500 mb-4 font-medium uppercase tracking-widest mt-1">{a.role}</p>}
              <Link href={a.portfolio_url || "/our-artist"} className="inline-block px-6 py-2.5 rounded-full border border-stone-300 text-sm hover:bg-stone-900 hover:border-stone-900 hover:text-stone-50 transition-all duration-300">
                Portfolio
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 py-20 bg-stone-100/50 rounded-[3rem] my-10 backdrop-blur-sm border border-stone-200/50">
        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="font-serif text-3xl md:text-4xl mb-12 text-center"
        >
          Our Categories
        </motion.h2>
        <motion.div
          variants={STAGGER_CONTAINER} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 gap-6"
        >
          {(categories.length ? categories : ["Realistic", "Small", "Religious", "Portrait", "Piercing", "Cover Up"].map((n, i) => ({ id: String(i), name: n, photo: FALLBACK })))
            .slice(0, 6)
            .map((c: any) => (
              <Link key={c.id} href="/category">
                <motion.div
                  variants={STAGGER_CHILD}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="group relative aspect-square rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
                >
                  <Image src={c.photo || FALLBACK} alt={c.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="absolute bottom-6 left-6 text-stone-50 font-serif text-2xl group-hover:translate-x-2 transition-transform duration-300">{c.name}</span>
                </motion.div>
              </Link>
            ))}
        </motion.div>
      </section>

      {/* Reviews */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 className="font-serif text-3xl md:text-4xl mb-4 text-center">
            Rated highly by <span className="premium-gradient-text font-bold">250+</span> clients
          </h2>
          <div className="flex justify-center gap-1.5 mb-14">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                <Star size={24} className="fill-stone-800 text-stone-800" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={STAGGER_CONTAINER} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {(reviews.length ? reviews : [1, 2, 3].map((i) => ({ id: String(i), client_name: "Happy Client", photo: FALLBACK, review: "Incredible experience from consultation to final piece. The team really listens and executes flawlessly.", rating: 5 })))
            .slice(0, 3)
            .map((r: any) => (
              <motion.div
                key={r.id}
                variants={STAGGER_CHILD}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100"
              >
                <div className="flex items-center gap-5 mb-6">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-stone-100 shadow-sm">
                    <Image src={r.photo || FALLBACK} alt={r.client_name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-serif text-lg text-stone-900">{r.client_name}</p>
                    <div className="flex gap-1 mt-1">
                      {Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={14} className="fill-stone-700 text-stone-700" />)}
                    </div>
                  </div>
                </div>
                <p className="text-stone-600 leading-relaxed italic">"{r.review}"</p>
              </motion.div>
            ))}
        </motion.div>
      </section>

      {/* Process */}
      <section className="max-w-7xl mx-auto px-6 py-24 relative overflow-hidden">
        <div className="absolute -left-20 top-20 w-72 h-72 bg-gradient-to-br from-stone-200 to-transparent rounded-full blur-[80px] -z-10" />
        <div className="absolute -right-20 bottom-20 w-96 h-96 bg-gradient-to-tl from-stone-300/50 to-transparent rounded-full blur-[100px] -z-10" />

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 className="font-serif text-3xl md:text-5xl mb-6 text-center">The Process</h2>
          <p className="text-center text-stone-500 mb-16 max-w-2xl mx-auto text-lg">
            From concept to healed skin — every step handled with ultimate care.
          </p>
        </motion.div>

        <motion.div
          variants={STAGGER_CONTAINER} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-6 relative"
        >
          {[
            { t: "Custom Design", d: "Personalized designs with attention to placement, proportions and skin tone." },
            { t: "Cover Up", d: "Thoughtfully planned cover-ups using strategic layering for clean results." },
            { t: "Piercing", d: "Professional piercings done with sterile equipment and precise placement." },
            { t: "After Care", d: "Clear aftercare instructions to support healing and help your tattoo stay sharp." },
          ].map((step, i) => (
            <motion.div
              key={i}
              variants={STAGGER_CHILD}
              whileHover={{ y: -10 }}
              className="relative bg-white/60 backdrop-blur-md p-8 rounded-[2rem] border border-stone-200/50 shadow-sm hover:shadow-xl transition-shadow duration-500 group"
            >
              <div className="w-12 h-12 rounded-full bg-stone-900 text-stone-50 flex items-center justify-center font-serif text-xl mb-6 group-hover:scale-110 group-hover:bg-gradient-to-r group-hover:from-stone-900 group-hover:to-stone-700 transition-all duration-300">
                {i + 1}
              </div>
              <h3 className="font-serif text-2xl mb-3">{step.t}</h3>
              <p className="text-stone-500 leading-relaxed text-sm">{step.d}</p>
              {i < 3 && (
                <ArrowRight className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 text-stone-300 group-hover:translate-x-2 group-hover:text-stone-900 transition-all duration-500" size={24} />
              )}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Closing CTA */}
      <section className="max-w-5xl mx-auto px-6 py-32 text-center relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="bg-stone-900 text-stone-50 p-16 md:p-24 rounded-[3rem] shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('/assets/bg.png')] opacity-10 mix-blend-overlay" />
          <h2 className="relative z-10 font-serif text-4xl md:text-6xl tracking-tight mb-8">
            {settings?.cta_title || "Where your story becomes timeless art"}
          </h2>
          <p className="relative z-10 text-xl text-stone-300 max-w-2xl mx-auto mb-12">
            {settings?.cta_subtitle || "Custom tattoos crafted with passion, precision and profound meaning."}
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative z-10 inline-block">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-stone-50 text-stone-900 font-medium hover:bg-white transition-colors shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            >
              Book an appointment <ArrowRight size={20} />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
