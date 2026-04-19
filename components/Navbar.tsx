"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/category", label: "Category" },
  { href: "/our-artist", label: "Our Artists" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/locate-us", label: "Locate Us" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50 flex justify-center pointer-events-none">
      <header className="pointer-events-auto w-full rounded-full bg-white/40 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)] transition-all duration-300">
        <nav className="px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/60 shadow-sm group-hover:scale-105 transition-transform">
              <Image src="/assets/logo.jpg" alt="Zenspace" width={40} height={40} className="object-cover w-full h-full" />
            </div>
            <span className="font-serif text-lg tracking-wide text-stone-900 group-hover:text-stone-600 transition-colors">Zenspace</span>
          </Link>
          <ul className="hidden md:flex items-center gap-1 bg-white/30 backdrop-blur-sm px-2 py-1.5 rounded-full border border-white/40 shadow-sm">
            {links.map((l) => {
              const isActive = pathname === l.href;
              return (
                <li key={l.href}>
                  <Link 
                    href={l.href} 
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      isActive 
                        ? "bg-white shadow-sm text-stone-900" 
                        : "text-stone-600 hover:text-stone-900 hover:bg-white/50"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link href="/contact" className="hidden md:inline-block px-6 py-2 rounded-full bg-stone-900 text-stone-50 text-sm font-medium hover:bg-stone-800 hover:scale-105 transition-all shadow-md">
            Book consultation
          </Link>
          <button className="md:hidden text-stone-800 p-2 rounded-full hover:bg-white/50 transition-colors" onClick={() => setOpen(!open)} aria-label="menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden absolute top-[110%] left-0 w-full rounded-3xl overflow-hidden bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.1)] p-4">
            <ul className="flex flex-col gap-2">
              {links.map((l) => {
                const isActive = pathname === l.href;
                return (
                  <li key={l.href}>
                    <Link 
                      href={l.href} 
                      onClick={() => setOpen(false)} 
                      className={`block px-4 py-3 rounded-2xl transition-all ${
                        isActive ? "bg-white shadow-sm font-medium text-stone-900" : "text-stone-700 hover:bg-white/50"
                      }`}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link 
                  href="/contact" 
                  onClick={() => setOpen(false)} 
                  className="block text-center mt-2 px-4 py-3 rounded-2xl bg-stone-900 text-stone-50 font-medium"
                >
                  Book consultation
                </Link>
              </li>
            </ul>
          </div>
        )}
      </header>
    </div>
  );
}
