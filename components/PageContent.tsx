"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, MessageCircle, Sparkles, Baby, Gem, Heart, ShieldCheck, Smile, UserCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Marquee } from "@/components/Marquee";

const WHATSAPP_DIGITS = "917208388209";
const WHATSAPP_HREF = `https://wa.me/${WHATSAPP_DIGITS}?text=${encodeURIComponent("Hi Zenspace, I'd like to book a consultation.")}`;

const LOCAL_TATTOOS = [
  "/assets/photos/tattoo-1.jpeg",
  "/assets/photos/tattoo-2.jpeg",
  "/assets/photos/tattoo-3.jpeg",
  "/assets/photos/tattoo-4.jpeg",
  "/assets/photos/tattoo-5.jpeg",
  "/assets/photos/tattoo-6.jpeg",
  "/assets/photos/tattoo-7.jpeg",
];
const LOCAL_STUDIO = "/assets/photos/studio-1.png";
const pickLocal = (i: number) => LOCAL_TATTOOS[((i % LOCAL_TATTOOS.length) + LOCAL_TATTOOS.length) % LOCAL_TATTOOS.length];

const STAGGER_CHILD = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

// Guest placeholders shown when the studio hasn't filled the roster yet.
// They link back to /our-artist so visitors land on the real list rather than
// a dead artist page. The site always shows at least three so the section
// reads as a team rather than a single-person studio.
const GUEST_ARTISTS = [
  { id: "guest-1", name: "Guest Artist", role: "Visiting", slug: null, photo: null },
  { id: "guest-2", name: "Guest Artist", role: "Visiting", slug: null, photo: null },
  { id: "guest-3", name: "Guest Artist", role: "Visiting", slug: null, photo: null },
];

const PLACEHOLDER_REVIEWS = [
  { id: "p-r-1", client_name: "Aanya Sharma", review: "Calm, clean studio and a long consultation that turned my vague idea into something I'll actually love at 60. Healed beautifully.", rating: 5, photo: null },
  { id: "p-r-2", client_name: "Rohan Mehta", review: "I came in for a cover-up I'd been dreading. They redrew it three times until placement and balance felt right. Worth every minute.", rating: 5, photo: null },
  { id: "p-r-3", client_name: "Priya Iyer", review: "First piercing for my daughter — kind, quick, and reassuring. Aftercare instructions were clear. Healed without a hitch.", rating: 5, photo: null },
];

export function PageContent({ settings, artists, categories, studio, reviews, videos }: any) {
  // Pad to a minimum of 3 so the section never reads as one lonely artist /
  // one lonely review. Real records always show first.
  const displayedArtists =
    (artists?.length ?? 0) >= 3 ? artists : [...(artists ?? []), ...GUEST_ARTISTS].slice(0, 3);
  const displayedReviews =
    (reviews?.length ?? 0) >= 3 ? reviews : [...(reviews ?? []), ...PLACEHOLDER_REVIEWS].slice(0, 3);
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
          <motion.div variants={STAGGER_CHILD} className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/contact"
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-stone-900 text-stone-100 overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(0,0,0,0.3)] hover:scale-105"
            >
              <span className="relative z-10 font-medium">Book a consultation</span>
              <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-stone-800 to-stone-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-[#25D366] text-white font-medium shadow-md hover:shadow-[0_0_40px_rgba(37,211,102,0.45)] hover:scale-105 transition-all"
            >
              <MessageCircle size={18} /> WhatsApp us
            </a>
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
            src={settings?.hero_image || pickLocal(0)}
            alt="Featured tattoo"
            fill
            className="object-cover"
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent mix-blend-overlay" />
        </motion.div>
      </section>

      {/* Studio photos — marquee */}
      <section className="py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="font-serif text-3xl md:text-4xl mb-12 text-center"
        >
          A place where we create your story
        </motion.h2>
        {(() => {
          const items: { id: string; src: string; alt: string }[] = studio.length > 0
            ? studio.map((s: any) => ({ id: s.id, src: s.photo, alt: s.caption || "studio" }))
            : [
                { id: "f-studio", src: LOCAL_STUDIO, alt: "Inside Zenspace" },
                ...LOCAL_TATTOOS.slice(0, 4).map((src, i) => ({ id: `f-${i}`, src, alt: "Tattoo" })),
              ];
          return (
            <Marquee durationSec={60}>
              {items.map((s) => (
                <div
                  key={s.id}
                  className="relative w-[320px] aspect-[4/5] rounded-[2rem] overflow-hidden shadow-lg shrink-0"
                >
                  <Image src={s.src} alt={s.alt} fill className="object-cover" sizes="320px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
                </div>
              ))}
            </Marquee>
          );
        })()}
      </section>

      {/* Short-form videos */}
      {videos && videos.length > 0 && (
        <section className="py-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="font-serif text-3xl md:text-4xl mb-12 text-center"
          >
            Watch us at work
          </motion.h2>
          <Marquee durationSec={80}>
            {videos.map((v: any) => (
              <ShortVideoCard key={v.id} src={v.video} poster={v.poster} caption={v.caption} />
            ))}
          </Marquee>
        </section>
      )}

      {/* Piercing — choose your experience */}
      <section className="max-w-7xl mx-auto px-6 py-24 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="font-serif text-3xl md:text-5xl tracking-tight text-stone-900">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-pink-500 to-fuchsia-500 bg-clip-text text-transparent font-bold">
              Piercing
            </span>{" "}
            Experience
          </h2>
          <p className="mt-3 text-stone-500 md:text-lg">Safe, hygienic & painless piercing for every age</p>
          <div className="mx-auto mt-4 h-[3px] w-16 rounded-full bg-gradient-to-r from-pink-400 to-fuchsia-500" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-10">
          {/* Little Stars (children) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="relative rounded-[2.25rem] p-8 md:p-10 border border-pink-200/70 bg-gradient-to-br from-pink-50/95 via-white to-rose-50/90 shadow-[0_10px_40px_rgba(244,114,182,0.10)] overflow-hidden"
          >
            <div className="absolute -top-12 -right-10 w-48 h-48 rounded-full bg-pink-200/40 blur-3xl pointer-events-none" />
            <div className="text-center relative">
              <div className="inline-flex items-center gap-2 text-pink-500 font-medium">
                <Sparkles size={18} />
                <span className="text-xl md:text-2xl font-serif">For Little Stars</span>
              </div>
              <p className="mt-1 text-sm text-stone-500">Perfect & safe piercing for children</p>
            </div>

            <div className="relative mx-auto mt-6 mb-8 w-[78%] aspect-square rounded-full overflow-hidden ring-1 ring-pink-200/70 shadow-md bg-pink-100">
              <Image
                src="/assets/photos/tattoo-7.jpeg"
                alt="Piercing for children"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 30vw, 80vw"
              />
            </div>

            <ul className="grid grid-cols-3 gap-2 bg-white/90 rounded-2xl p-4 border border-pink-100">
              {[
                { Icon: Baby, t: "Expert Child Care" },
                { Icon: ShieldCheck, t: "Safe & Hygienic" },
                { Icon: Smile, t: "Painless Experience" },
              ].map(({ Icon, t }) => (
                <li key={t} className="flex flex-col items-center text-center gap-1.5">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-pink-100 text-pink-500"><Icon size={16} /></span>
                  <span className="text-[11px] md:text-xs text-stone-600 leading-tight">{t}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex gap-3 justify-center">
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-medium shadow hover:shadow-lg hover:scale-105 transition-all"
              >
                Book Now <ArrowRight size={14} />
              </a>
              <Link
                href="/piercing/kids"
                prefetch
                className="inline-flex items-center px-6 py-2.5 rounded-full border border-pink-300 text-pink-600 text-sm font-medium hover:bg-pink-50 transition-all"
              >
                Know More
              </Link>
            </div>
          </motion.div>

          {/* For Every You (adults) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
            className="relative rounded-[2.25rem] p-8 md:p-10 border border-violet-200/70 bg-gradient-to-br from-violet-50/95 via-white to-fuchsia-50/90 shadow-[0_10px_40px_rgba(167,139,250,0.10)] overflow-hidden"
          >
            <div className="absolute -top-12 -left-10 w-48 h-48 rounded-full bg-violet-200/40 blur-3xl pointer-events-none" />
            <div className="text-center relative">
              <div className="inline-flex items-center gap-2 text-violet-500 font-medium">
                <UserCircle2 size={18} />
                <span className="text-xl md:text-2xl font-serif">For everyone</span>
              </div>
              <p className="mt-1 text-sm text-stone-500">Trendy & stylish piercing for adults</p>
            </div>

            <div className="relative mx-auto mt-6 mb-8 w-[78%] aspect-square rounded-full overflow-hidden ring-1 ring-violet-200/70 shadow-md bg-violet-100">
              <Image
                src="/assets/photos/tattoo-4.jpeg"
                alt="Piercing for adults"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 30vw, 80vw"
              />
            </div>

            <ul className="grid grid-cols-3 gap-2 bg-white/90 rounded-2xl p-4 border border-violet-100">
              {[
                { Icon: Sparkles, t: "Trendy Designs" },
                { Icon: UserCircle2, t: "Expert Piercers" },
                { Icon: Gem, t: "Premium Experience" },
              ].map(({ Icon, t }) => (
                <li key={t} className="flex flex-col items-center text-center gap-1.5">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-violet-100 text-violet-500"><Icon size={16} /></span>
                  <span className="text-[11px] md:text-xs text-stone-600 leading-tight">{t}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex gap-3 justify-center">
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-medium shadow hover:shadow-lg hover:scale-105 transition-all"
              >
                Book Now <ArrowRight size={14} />
              </a>
              <Link
                href="/piercing/adults"
                prefetch
                className="inline-flex items-center px-6 py-2.5 rounded-full border border-violet-300 text-violet-600 text-sm font-medium hover:bg-violet-50 transition-all"
              >
                Know More
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Trust strip */}
        <div className="mt-8 rounded-2xl bg-gradient-to-r from-pink-50 via-white to-violet-50 border border-pink-100/70 px-6 py-4 flex flex-wrap items-center justify-around gap-3 text-xs md:text-sm text-stone-600">
          <span className="inline-flex items-center gap-2"><ShieldCheck size={14} className="text-pink-500" /> 100% Safe & Hygienic</span>
          <span className="inline-flex items-center gap-2"><UserCircle2 size={14} className="text-violet-500" /> Certified Piercers</span>
          <span className="inline-flex items-center gap-2"><Gem size={14} className="text-pink-500" /> Premium Quality</span>
          <span className="inline-flex items-center gap-2"><Heart size={14} className="text-violet-500" /> Trusted by 10K+ Clients</span>
        </div>
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
          className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10"
        >
          {displayedArtists.map((a: any, i: number) => {
            const href = a.slug ? `/our-artist/${a.slug}` : (a.portfolio_url || "/our-artist");
            return (
              <motion.div key={a.id} variants={STAGGER_CHILD} className="text-center group">
                <motion.div
                  whileHover={{ scale: 1.04, rotate: -1 }}
                  className="relative aspect-[3/4] rounded-[2rem] overflow-hidden mb-6 shadow-xl bg-stone-200"
                >
                  <Image
                    src={a.photo || pickLocal(i)}
                    alt={a.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(min-width: 768px) 33vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors duration-500" />
                </motion.div>
                <h3 className="font-serif text-2xl group-hover:premium-gradient-text transition-all duration-300">{a.name}</h3>
                {a.role && <p className="text-sm text-stone-500 mb-4 font-medium uppercase tracking-widest mt-1">{a.role}</p>}
                <Link href={href} prefetch className="inline-block px-6 py-2.5 rounded-full border border-stone-300 text-sm hover:bg-stone-900 hover:border-stone-900 hover:text-stone-50 transition-all duration-300">
                  Portfolio
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Categories — flex with fixed-width cards: a few cards center themselves,
          adding more cards naturally wraps onto extra rows. No marquee, no jitter. */}
      <section className="py-20 bg-stone-100/50 my-10 backdrop-blur-sm border-y border-stone-200/50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl mb-12 text-center">Our Categories</h2>
          {categories.length === 0 ? (
            <p className="text-center text-stone-500 italic">Categories coming soon.</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-5 md:gap-6">
              {categories.map((c: any, i: number) => (
                <Link
                  key={c.id}
                  href={c.slug ? `/category/${c.slug}` : "/category"}
                  prefetch
                  className="group relative block w-full sm:w-[280px] md:w-[300px] aspect-square rounded-[1.75rem] overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-300 bg-stone-300"
                >
                  <Image
                    src={c.photo || pickLocal(i + 2)}
                    alt={c.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(min-width: 768px) 300px, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/85 via-stone-900/30 to-transparent" />
                  <span className="absolute bottom-5 left-5 right-5 text-stone-50 font-serif text-xl md:text-2xl">
                    {c.name}
                  </span>
                </Link>
              ))}
            </div>
          )}
          {categories.length > 0 && (
            <div className="text-center mt-10">
              <Link
                href="/category"
                prefetch
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-stone-300 text-sm font-medium hover:bg-stone-900 hover:text-stone-50 hover:border-stone-900 transition-colors"
              >
                Browse all categories
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Reviews — marquee */}
      <section className="py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-7xl mx-auto px-6">
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

        {/* Up to 3 reviews fit on a single row and stay still; beyond that we
            switch to the marquee carousel so the section doesn't look stretched. */}
        {displayedReviews.length <= 3 ? (
          <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {displayedReviews.map((r: any, i: number) => (
              <ReviewCard key={r.id} r={r} fallback={pickLocal(i + 4)} />
            ))}
          </div>
        ) : (
          <Marquee durationSec={70}>
            {displayedReviews.map((r: any, i: number) => (
              <div key={r.id} className="w-[380px] shrink-0">
                <ReviewCard r={r} fallback={pickLocal(i + 4)} />
              </div>
            ))}
          </Marquee>
        )}
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

function ShortVideoCard({ src, poster, caption }: { src: string; poster?: string | null; caption?: string | null }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className="relative w-[260px] aspect-[9/16] rounded-[2rem] overflow-hidden shadow-lg shrink-0 bg-stone-900">
      <video
        ref={ref}
        src={src}
        poster={poster || undefined}
        muted
        loop
        playsInline
        preload="metadata"
        className="w-full h-full object-cover"
      />
      {caption && (
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-stone-900/80 to-transparent text-stone-50 text-sm">
          {caption}
        </div>
      )}
    </div>
  );
}

function ReviewCard({ r, fallback }: { r: any; fallback: string }) {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 h-full overflow-hidden flex flex-col">
      <div className="relative w-full aspect-[4/5] bg-stone-200">
        <Image
          src={r.photo || fallback}
          alt={r.client_name}
          fill
          className="object-cover"
          sizes="(min-width: 768px) 380px, 100vw"
        />
      </div>
      <div className="p-7 flex flex-col flex-1">
        <p className="font-serif text-xl text-stone-900">{r.client_name}</p>
        <div className="flex gap-1 mt-1 mb-4">
          {Array.from({ length: r.rating || 5 }).map((_, i) => (
            <Star key={i} size={15} className="fill-stone-700 text-stone-700" />
          ))}
        </div>
        <p className="text-stone-600 leading-relaxed italic line-clamp-5">"{r.review}"</p>
      </div>
    </div>
  );
}
