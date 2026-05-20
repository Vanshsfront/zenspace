import Link from "next/link";
import { Baby, UserCircle2, ArrowRight, Sparkles } from "lucide-react";

export const metadata = { title: "Piercings | Zenspace" };

export default function PiercingLandingPage() {
  return (
    <div className="bg-paper-texture min-h-screen pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-stone-200/40 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="max-w-5xl mx-auto text-center">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900 text-stone-50 text-xs uppercase tracking-widest mb-6">
          <Sparkles size={14} /> Service
        </span>
        <h1 className="font-serif text-5xl md:text-7xl mb-6 text-stone-900 tracking-tight">Piercings, done with care</h1>
        <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed mb-14">
          Safe, hygienic and gentle piercing for every age. Choose the experience that fits you.
        </p>

        <div className="grid md:grid-cols-2 gap-6 md:gap-10">
          <Link
            href="/piercing/kids"
            prefetch
            className="group relative rounded-[2.25rem] p-10 border border-pink-200/70 bg-gradient-to-br from-pink-50/95 via-white to-rose-50/90 shadow-[0_10px_40px_rgba(244,114,182,0.10)] transition-all hover:shadow-xl"
          >
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 text-pink-500 mb-5">
              <Baby size={30} />
            </span>
            <h2 className="font-serif text-3xl text-stone-900 mb-2">For Kids</h2>
            <p className="text-stone-600 mb-6">Gentle, sterile piercings for babies and children.</p>
            <span className="inline-flex items-center gap-2 text-pink-600 font-medium">
              Explore <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link
            href="/piercing/adults"
            prefetch
            className="group relative rounded-[2.25rem] p-10 border border-violet-200/70 bg-gradient-to-br from-violet-50/95 via-white to-fuchsia-50/90 shadow-[0_10px_40px_rgba(167,139,250,0.10)] transition-all hover:shadow-xl"
          >
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-100 text-violet-500 mb-5">
              <UserCircle2 size={30} />
            </span>
            <h2 className="font-serif text-3xl text-stone-900 mb-2">For Adults</h2>
            <p className="text-stone-600 mb-6">Trendy, expert piercing for first-timers and collectors.</p>
            <span className="inline-flex items-center gap-2 text-violet-600 font-medium">
              Explore <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
