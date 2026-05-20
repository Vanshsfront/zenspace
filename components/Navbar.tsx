"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";

type NavArtist = { id: string; name: string; slug: string | null };
type NavCategory = { id: string; name: string; slug: string | null };

export function Navbar({ artists, categories }: { artists: NavArtist[]; categories: NavCategory[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<null | "category" | "artists" | "piercing">(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setOpen(false); setOpenMenu(null); }, [pathname]);

  function hover(menu: "category" | "artists" | "piercing") {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(menu);
  }
  function leave() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  }

  const linkClass = (active: boolean) =>
    `px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
      active ? "bg-white shadow-sm text-stone-900" : "text-stone-600 hover:text-stone-900 hover:bg-white/50"
    }`;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50 flex justify-center pointer-events-none">
      <header className="pointer-events-auto w-full rounded-full bg-white/40 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)] transition-all duration-300">
        <nav className="px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group" aria-label="Zenspace home">
            <Image
              src="/assets/logo.jpg"
              alt="Zenspace logo"
              width={64}
              height={64}
              priority
              className="h-10 w-10 rounded-full object-cover group-hover:scale-105 transition-transform"
            />
            <span className="flex flex-col leading-tight">
              <span className="font-serif font-bold text-stone-900 text-xl tracking-tight">Zenspace</span>
              <span className="font-serif font-light text-stone-500 text-[11px] tracking-wide">Tattoo and piercing</span>
            </span>
          </Link>

          <ul className="hidden md:flex items-center gap-1 bg-white/30 backdrop-blur-sm px-2 py-1.5 rounded-full border border-white/40 shadow-sm">
            <li><Link href="/" prefetch className={linkClass(pathname === "/")}>Home</Link></li>

            <li className="relative" onMouseEnter={() => hover("category")} onMouseLeave={leave}>
              <button
                onClick={() => setOpenMenu(openMenu === "category" ? null : "category")}
                className={`${linkClass(pathname?.startsWith("/category") ?? false)} flex items-center gap-1`}
                aria-haspopup="true"
                aria-expanded={openMenu === "category"}
              >
                Category <ChevronDown size={14} className={`transition-transform ${openMenu === "category" ? "rotate-180" : ""}`} />
              </button>
              {openMenu === "category" && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 min-w-[240px] max-h-[70vh] overflow-y-auto rounded-2xl bg-white/95 backdrop-blur-xl border border-white/60 shadow-xl">
                  {categories.length === 0 && (
                    <span className="block px-5 py-3 text-sm text-stone-500">No categories yet</span>
                  )}
                  {categories
                    .filter((c) => c.slug)
                    .map((c) => (
                      <Link key={c.id} href={`/category/${c.slug}`} prefetch className="block px-5 py-3 text-sm hover:bg-stone-100 transition-colors">
                        {c.name}
                      </Link>
                    ))}
                  <div className="border-t border-stone-200">
                    <Link href="/category" prefetch className="block px-5 py-3 text-xs uppercase tracking-widest text-stone-500 hover:bg-stone-100">View all</Link>
                  </div>
                </div>
              )}
            </li>

            <li className="relative" onMouseEnter={() => hover("artists")} onMouseLeave={leave}>
              <button
                onClick={() => setOpenMenu(openMenu === "artists" ? null : "artists")}
                className={`${linkClass(pathname?.startsWith("/our-artist") ?? false)} flex items-center gap-1`}
                aria-haspopup="true"
                aria-expanded={openMenu === "artists"}
              >
                Our Artists <ChevronDown size={14} className={`transition-transform ${openMenu === "artists" ? "rotate-180" : ""}`} />
              </button>
              {openMenu === "artists" && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 min-w-[240px] rounded-2xl bg-white/90 backdrop-blur-xl border border-white/60 shadow-xl overflow-hidden">
                  {artists.length === 0 && <span className="block px-5 py-3 text-sm text-stone-500">No artists yet</span>}
                  {artists
                    .filter((a) => a.slug)
                    .map((a) => (
                      <Link key={a.id} href={`/our-artist/${a.slug}`} prefetch className="block px-5 py-3 text-sm hover:bg-stone-100 transition-colors">
                        {a.name}
                      </Link>
                    ))}
                </div>
              )}
            </li>

            <li className="relative" onMouseEnter={() => hover("piercing")} onMouseLeave={leave}>
              <button
                onClick={() => setOpenMenu(openMenu === "piercing" ? null : "piercing")}
                className={`${linkClass(pathname?.startsWith("/piercing") ?? false)} flex items-center gap-1`}
                aria-haspopup="true"
                aria-expanded={openMenu === "piercing"}
              >
                Piercing <ChevronDown size={14} className={`transition-transform ${openMenu === "piercing" ? "rotate-180" : ""}`} />
              </button>
              {openMenu === "piercing" && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 min-w-[200px] rounded-2xl bg-white/95 backdrop-blur-xl border border-white/60 shadow-xl overflow-hidden">
                  <Link href="/piercing/kids" prefetch className="block px-5 py-3 text-sm hover:bg-stone-100 transition-colors">Kids</Link>
                  <Link href="/piercing/adults" prefetch className="block px-5 py-3 text-sm hover:bg-stone-100 transition-colors">Adults</Link>
                </div>
              )}
            </li>
            <li><Link href="/about" prefetch className={linkClass(pathname === "/about")}>About Us</Link></li>
            <li><Link href="/contact" prefetch className={linkClass(pathname === "/contact")}>Contact</Link></li>
          </ul>

          <Link href="/contact" prefetch className="hidden md:inline-block px-6 py-2 rounded-full bg-stone-900 text-stone-50 text-sm font-medium hover:bg-stone-800 hover:scale-105 transition-all shadow-md">
            Locate us
          </Link>
          <button className="md:hidden text-stone-800 p-2 rounded-full hover:bg-white/50 transition-colors" onClick={() => setOpen(!open)} aria-label="menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {open && (
          <div className="md:hidden absolute top-[110%] left-0 w-full rounded-3xl overflow-hidden bg-white/90 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.1)] p-3 max-h-[80vh] overflow-y-auto">
            <ul className="flex flex-col gap-0.5 text-stone-800 text-[15px]">
              <li><Link href="/" prefetch className="flex items-center px-4 py-2.5 rounded-2xl hover:bg-stone-100">Home</Link></li>

              <li>
                <button
                  onClick={() => setOpenMenu(openMenu === "category" ? null : "category")}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl hover:bg-stone-100"
                  aria-expanded={openMenu === "category"}
                >
                  <span>Category</span>
                  <ChevronDown size={16} className={`transition-transform ${openMenu === "category" ? "rotate-180" : ""}`} />
                </button>
                {openMenu === "category" && (
                  <ul className="ml-4 my-1 border-l border-stone-200 pl-3 flex flex-col gap-0.5">
                    {categories.length === 0 && (
                      <li className="px-3 py-2 text-sm text-stone-500">No categories yet</li>
                    )}
                    {categories
                      .filter((c) => c.slug)
                      .map((c) => (
                        <li key={c.id}>
                          <Link href={`/category/${c.slug}`} prefetch className="block px-3 py-2 rounded-xl text-sm hover:bg-stone-100">{c.name}</Link>
                        </li>
                      ))}
                    <li><Link href="/category" prefetch className="block px-3 py-2 rounded-xl text-xs uppercase tracking-widest text-stone-500 hover:bg-stone-100">View all</Link></li>
                  </ul>
                )}
              </li>

              <li>
                <button
                  onClick={() => setOpenMenu(openMenu === "artists" ? null : "artists")}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl hover:bg-stone-100"
                  aria-expanded={openMenu === "artists"}
                >
                  <span>Our Artists</span>
                  <ChevronDown size={16} className={`transition-transform ${openMenu === "artists" ? "rotate-180" : ""}`} />
                </button>
                {openMenu === "artists" && (
                  <ul className="ml-4 my-1 border-l border-stone-200 pl-3 flex flex-col gap-0.5">
                    {artists.length === 0 && <li className="px-3 py-2 text-sm text-stone-500">No artists yet</li>}
                    {artists.filter((a) => a.slug).map((a) => (
                      <li key={a.id}>
                        <Link href={`/our-artist/${a.slug}`} prefetch className="block px-3 py-2 rounded-xl text-sm hover:bg-stone-100">{a.name}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>

              <li>
                <button
                  onClick={() => setOpenMenu(openMenu === "piercing" ? null : "piercing")}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl hover:bg-stone-100"
                  aria-expanded={openMenu === "piercing"}
                >
                  <span>Piercing</span>
                  <ChevronDown size={16} className={`transition-transform ${openMenu === "piercing" ? "rotate-180" : ""}`} />
                </button>
                {openMenu === "piercing" && (
                  <ul className="ml-4 my-1 border-l border-stone-200 pl-3 flex flex-col gap-0.5">
                    <li><Link href="/piercing/kids" prefetch className="block px-3 py-2 rounded-xl text-sm hover:bg-stone-100">Kids</Link></li>
                    <li><Link href="/piercing/adults" prefetch className="block px-3 py-2 rounded-xl text-sm hover:bg-stone-100">Adults</Link></li>
                  </ul>
                )}
              </li>
              <li><Link href="/about" prefetch className="flex items-center px-4 py-2.5 rounded-2xl hover:bg-stone-100">About Us</Link></li>
              <li><Link href="/contact" prefetch className="flex items-center px-4 py-2.5 rounded-2xl hover:bg-stone-100">Contact</Link></li>

              <li className="pt-2 mt-1 border-t border-stone-200/70">
                <Link href="/contact" prefetch className="block text-center px-4 py-2.5 rounded-2xl bg-stone-900 text-stone-50 text-sm font-medium">
                  Locate us
                </Link>
              </li>
            </ul>
          </div>
        )}
      </header>
    </div>
  );
}
