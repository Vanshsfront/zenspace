import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";
import type { SiteSettings } from "@/lib/data";

export function Footer({ settings }: { settings: SiteSettings | null }) {
  const s = settings;
  return (
    <footer className="bg-stone-950 text-[#f5f1ea]">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-12">
        <div>
          <h3 className="font-serif text-xl mb-5">Location</h3>
          <div className="space-y-4 text-sm text-stone-300 leading-relaxed">
            <p className="flex gap-3"><MapPin className="shrink-0 mt-0.5" size={18} />{s?.address || "Shop No. 101, 1st Floor, Zenspace Art and Tattoo, Akruti Commercial Complex, MIDC Central Rd, Andheri East, Mumbai 400093"}</p>
            <p className="flex gap-3"><Mail size={18} /><a href={`mailto:${s?.email || "zenspace32@gmail.com"}`}>{s?.email || "zenspace32@gmail.com"}</a></p>
            <p className="flex gap-3"><Phone size={18} />{s?.phone || "+91 7208388209 / +91 8652144521"}</p>
          </div>
        </div>
        <div>
          <h3 className="font-serif text-xl mb-5">Useful Links</h3>
          <ul className="space-y-2 text-sm text-stone-300">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/category">Category</Link></li>
            <li><Link href="/our-artist">Our Artist</Link></li>
            <li><Link href="/about">About Us</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-serif text-xl mb-5">Quick Links</h3>
          <ul className="space-y-2 text-sm text-stone-300">
            <li><Link href="/terms">Terms</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/blog">Blog</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-serif text-xl mb-5">Follow Us</h3>
          <div className="flex gap-3">
            <a href={s?.facebook || "#"} aria-label="Facebook" className="w-10 h-10 rounded-full border border-stone-600 flex items-center justify-center hover:bg-stone-50 hover:text-stone-900 transition font-bold text-sm">f</a>
            <a href={s?.pinterest || "#"} aria-label="Pinterest" className="w-10 h-10 rounded-full border border-stone-600 flex items-center justify-center hover:bg-stone-50 hover:text-stone-900 transition font-bold text-sm">P</a>
            <a href={s?.instagram || "#"} aria-label="Instagram" className="w-10 h-10 rounded-full border border-stone-600 flex items-center justify-center hover:bg-stone-50 hover:text-stone-900 transition"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
          </div>
        </div>
      </div>
      <div className="border-t border-stone-800 py-5 text-center text-xs text-stone-500">
        © {new Date().getFullYear()} Zenspace Art & Tattoo. All rights reserved.
      </div>
    </footer>
  );
}
