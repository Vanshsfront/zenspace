"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";

const FALLBACK_STUDIO = "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=1200";

const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const STAGGER_CHILD = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export function ContactContent() {
  return (
    <div className="bg-paper-texture min-h-screen pt-32 pb-24 px-6 relative overflow-hidden">
      {/* Background blurs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-stone-200/40 blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial="hidden" 
          animate="show" 
          variants={STAGGER_CONTAINER}
          className="max-w-4xl mx-auto text-center mb-20"
        >
          <motion.h1 variants={STAGGER_CHILD} className="font-serif text-5xl md:text-7xl text-stone-900 tracking-tight mb-8">
            Contact Zenspace
          </motion.h1>
          <motion.p variants={STAGGER_CHILD} className="text-xl md:text-2xl font-serif text-stone-700 leading-relaxed mb-6">
            Looking for a professional tattoo studio in Andheri, Mumbai?
          </motion.p>
          <motion.p variants={STAGGER_CHILD} className="text-lg text-stone-600 leading-relaxed mb-6">
            At ZenSpace Tattoo Studio, we create custom, realistic, and minimal tattoos in a clean, comfortable, and hygienic environment. Our artists focus on quality work, clear communication, and tattoos that are designed to last.
          </motion.p>
          <motion.p variants={STAGGER_CHILD} className="text-lg text-stone-600 leading-relaxed font-medium">
            Contact us by phone or book an appointment to start your tattoo journey with confidence.
          </motion.p>
        </motion.div>

        {/* Location Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative w-full h-[40vh] md:h-[60vh] rounded-[3rem] overflow-hidden shadow-2xl mb-32 group"
        >
          <Image 
            src={FALLBACK_STUDIO} 
            alt="Zenspace Tattoo Studio Location" 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-1000"
            priority
          />
          <div className="absolute inset-0 bg-stone-900/20 mix-blend-overlay" />
        </motion.div>

        {/* Main Get In Touch Section */}
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={STAGGER_CONTAINER}
          className="bg-white/60 backdrop-blur-xl border border-stone-200/50 rounded-[3rem] shadow-2xl overflow-hidden grid lg:grid-cols-2"
        >
          {/* Left: Map & Info */}
          <motion.div variants={STAGGER_CHILD} className="bg-stone-900 text-stone-50 p-10 md:p-14 relative overflow-hidden h-full flex flex-col">
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-stone-700/30 blur-[60px] rounded-full pointer-events-none" />
            
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="w-14 h-14 bg-stone-800 rounded-full flex items-center justify-center shrink-0 border border-stone-700">
                <MapPin className="text-stone-300" size={24} />
              </div>
              <h3 className="font-serif text-2xl md:text-3xl tracking-wide leading-tight">
                ZENSPACE TATTOO AND PIERCING
              </h3>
            </div>
            
            <p className="text-stone-400 text-lg leading-relaxed mb-10 relative z-10">
              Shop No. 101, 1st Floor,<br />
              Zenspace Art And Tattoo,<br />
              Akruti Commercial Complex, MIDC Central Rd,<br />
              Near Akruti Centre Point, Gautam Nagar,<br />
              Chakala Industrial Area (MIDC), Andheri East,<br />
              Mumbai, Maharashtra 400093
            </p>

            <div className="flex flex-wrap items-center gap-3 bg-stone-800/80 w-fit px-6 py-3 rounded-full border border-stone-700 backdrop-blur-md relative z-10 mb-12">
              <span className="font-bold text-xl">5.0</span>
              <div className="flex text-yellow-500">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
              </div>
              <span className="text-stone-400 font-medium">— 336 reviews</span>
            </div>

            {/* Map Placeholder */}
            <div className="mt-auto bg-stone-800 rounded-[2rem] h-[250px] w-full border border-stone-700 overflow-hidden relative group cursor-pointer">
              <Image src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800" alt="Map View Placeholder" fill className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-stone-900/80 backdrop-blur-md text-stone-50 px-6 py-3 rounded-full font-medium text-sm shadow-xl flex items-center gap-2 group-hover:scale-105 transition-transform">
                  <MapPin size={16} /> Open in Google Maps
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div variants={STAGGER_CHILD} className="p-10 md:p-14 flex flex-col justify-center">
            <h2 className="text-sm font-bold tracking-widest text-stone-400 uppercase mb-3">Get In Touch</h2>
            <p className="font-serif text-3xl md:text-4xl text-stone-900 leading-tight mb-8">
              READY TO MAKE YOUR TATTOO DREAMS A REALITY? FILL OUT THE FORM AND LET’S MAKE IT HAPPEN!
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

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2 px-1">What Is The Good Time To Connect With You? (Required)</label>
                <select required className="w-full bg-white/50 border border-stone-200 rounded-2xl px-5 py-4 outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all appearance-none cursor-pointer font-medium">
                  <option value="">Select a time...</option>
                  <option value="morning">Morning (10 AM - 1 PM)</option>
                  <option value="afternoon">Afternoon (1 PM - 5 PM)</option>
                  <option value="evening">Evening (5 PM - 8 PM)</option>
                </select>
              </div>

              <button type="submit" className="w-full mt-2 bg-stone-900 text-stone-50 py-5 rounded-2xl font-bold uppercase tracking-widest hover:bg-stone-800 hover:shadow-lg transition-all hover:-translate-y-1">
                Submit
              </button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
