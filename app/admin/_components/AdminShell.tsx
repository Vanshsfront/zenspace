"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ExternalLink, LogOut } from "lucide-react";

const NAV_GROUPS: { group: string; items: { href: string; label: string; exact?: boolean }[] }[] = [
  {
    group: "Home page",
    items: [
      { href: "/admin", label: "Hero, CTA & piercing cards", exact: true },
      { href: "/admin/studio", label: "‘Create your story’ strip" },
      { href: "/admin/videos", label: "‘Watch us at work’ videos" },
    ],
  },
  {
    group: "Piercing",
    items: [
      { href: "/admin/piercing-content", label: "Kids & Adults copy" },
      { href: "/admin/piercing", label: "Kids & Adults galleries" },
      { href: "/admin/earrings", label: "Earring categories" },
      { href: "/admin/safety-items", label: "What makes us safe" },
    ],
  },
  {
    group: "About page",
    items: [{ href: "/admin/about", label: "About page" }],
  },
  {
    group: "Blog & legal",
    items: [
      { href: "/admin/blog", label: "Blog posts" },
      { href: "/admin/legal", label: "Terms & Privacy" },
    ],
  },
  {
    group: "Work & people",
    items: [
      { href: "/admin/artists", label: "Artists" },
      { href: "/admin/categories", label: "Categories" },
    ],
  },
  {
    group: "Reviews",
    items: [
      { href: "/admin/reviews", label: "Reviews" },
      { href: "/admin/custom-requests", label: "Custom requests" },
    ],
  },
  {
    group: "Booking forms",
    items: [
      { href: "/admin/service-forms", label: "Forms & fields" },
      { href: "/admin/submissions", label: "Submissions" },
    ],
  },
  {
    group: "Site-wide",
    items: [{ href: "/admin", label: "Contact, social & password", exact: true }],
  },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile drawer whenever the route changes — otherwise tapping a
  // link leaves the overlay sitting on top of the new page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname?.startsWith(href + "/");

  async function signOut() {
    await fetch("/api/admin/login", { method: "DELETE" });
    window.location.href = "/admin-login";
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between bg-stone-900 text-stone-100 px-4 h-14 shadow-md">
        <button
          onClick={() => setOpen(true)}
          className="p-2 -ml-2 rounded-lg hover:bg-stone-800"
          aria-label="Open admin menu"
        >
          <Menu size={20} />
        </button>
        <span className="font-serif text-lg">Zenspace Admin</span>
        <Link href="/" className="p-2 -mr-2 rounded-lg hover:bg-stone-800" aria-label="View site">
          <ExternalLink size={18} />
        </Link>
      </header>

      <div className="flex">
        {/* Sidebar — fixed on desktop, slide-over on mobile */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 bg-stone-900 text-stone-100 p-6 flex flex-col transition-transform duration-300 md:sticky md:top-0 md:h-screen md:w-64 md:translate-x-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl">Zenspace Admin</h2>
            <button
              onClick={() => setOpen(false)}
              className="md:hidden p-2 -mr-2 rounded-lg hover:bg-stone-800"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-5 flex-1 overflow-y-auto -mx-1 px-1">
            {NAV_GROUPS.map((g) => (
              <div key={g.group} className="space-y-1">
                <p className="px-3 text-[11px] uppercase tracking-widest text-stone-500">{g.group}</p>
                {g.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch
                    className={`block px-3 py-2 rounded transition-colors ${
                      isActive(item.href, item.exact)
                        ? "bg-stone-700 text-white"
                        : "text-stone-300 hover:bg-stone-800 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>

          <div className="pt-6 mt-6 border-t border-stone-700 space-y-1">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 text-sm text-stone-400 hover:text-white"
            >
              <ExternalLink size={14} /> View site
            </Link>
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-3 py-2 text-sm text-stone-400 hover:text-white w-full text-left"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </aside>

        {/* Backdrop */}
        {open && (
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
          />
        )}

        <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
