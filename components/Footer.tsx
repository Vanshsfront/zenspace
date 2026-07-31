"use client";

import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";
import type { SiteSettings } from "@/lib/data";
import { EditableText } from "@/lib/edit/EditableText";
import { useEditMode } from "@/lib/edit/context";

export function Footer({ settings }: { settings: SiteSettings | null }) {
  const s = settings;
  // The footer is a client component only so it can ask this. Several
  // site_settings columns are never rendered as text anywhere on the site — they
  // sit in an href or in a WhatsApp link — so edit mode adds a labelled line for
  // each of them. A visitor's markup is untouched.
  const editing = useEditMode();

  return (
    <footer className="relative z-10 bg-stone-950 text-[#f5f1ea]">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-12">
        <div>
          <h3 className="font-serif text-xl mb-5">Location</h3>
          <div className="space-y-4 text-sm text-stone-300 leading-relaxed">
            <p className="flex gap-3"><MapPin className="shrink-0 mt-0.5" size={18} /><EditableText table="site_settings" field="address">{s?.address || "Shop No. 101, 1st Floor, Zenspace Art and Tattoo, Akruti Commercial Complex, MIDC Central Rd, Andheri East, Mumbai 400093"}</EditableText></p>
            {/* The address also feeds the contact page and the map query, so the
                registry cap here is the tightest of the three, not the footer's. */}
            <p className="flex gap-3"><Mail size={18} /><a href={`mailto:${s?.email || "zenspace32@gmail.com"}`}><EditableText table="site_settings" field="email">{s?.email || "zenspace32@gmail.com"}</EditableText></a></p>
            {/* The email renders twice, as the link text and inside mailto:. Only
                the text is editable; the href catches up on the refresh that
                follows the save. */}
            <p className="flex gap-3"><Phone size={18} /><EditableText table="site_settings" field="phone">{s?.phone || "+91 7208388209 / +91 8652144521"}</EditableText></p>
            {/* The WhatsApp number only ever reaches the page as the href behind
                the floating button, so this is the one place it can be typed. */}
            {editing && <AdminField label="WhatsApp" field="whatsapp" value={s?.whatsapp} />}
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
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/terms">Terms</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-serif text-xl mb-5">Follow Us</h3>
          <div className="flex gap-3">
            <a href={s?.facebook || "#"} aria-label="Facebook" className="w-10 h-10 rounded-full border border-stone-600 flex items-center justify-center hover:bg-stone-50 hover:text-stone-900 transition font-bold text-sm">f</a>
            <a href={s?.pinterest || "#"} aria-label="Pinterest" className="w-10 h-10 rounded-full border border-stone-600 flex items-center justify-center hover:bg-stone-50 hover:text-stone-900 transition font-bold text-sm">P</a>
            <a href={s?.instagram || "#"} aria-label="Instagram" className="w-10 h-10 rounded-full border border-stone-600 flex items-center justify-center hover:bg-stone-50 hover:text-stone-900 transition"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
          </div>
          {/* Each icon's child is a literal letter or an inline SVG, so the URL
              behind it has nowhere to be edited in place. Spelling the three out
              also shows which are actually set: an unconfigured link falls back
              to "#" and looks exactly like a working one. The set itself is
              fixed — another network would need another column. */}
          {editing && (
            <div className="mt-4 space-y-2">
              <AdminField label="Facebook" field="facebook" value={s?.facebook} />
              <AdminField label="Pinterest" field="pinterest" value={s?.pinterest} />
              <AdminField label="Instagram" field="instagram" value={s?.instagram} />
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-stone-800 py-5 text-center text-xs text-stone-500">
        © {new Date().getFullYear()} Zenspace Art & Tattoo. All rights reserved.
      </div>
    </footer>
  );
}

/**
 * One site_settings column that the live footer never prints, given a line of
 * its own for the duration of edit mode. `empty:` keeps an unset value clickable
 * instead of collapsing it to nothing.
 */
function AdminField({ label, field, value }: { label: string; field: string; value?: string | null }) {
  return (
    <p className="flex gap-3 text-xs text-stone-400">
      <span className="w-20 shrink-0">{label}</span>
      <EditableText table="site_settings" field={field} className="flex-1 break-all empty:min-h-[1.25em]">
        {value || ""}
      </EditableText>
    </p>
  );
}
