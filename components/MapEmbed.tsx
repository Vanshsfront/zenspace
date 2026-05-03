"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

/**
 * Defers loading the Google Maps iframe (≈1MB of JS + tiles) until the user
 * actually scrolls it into view OR taps the placeholder. The page becomes
 * interactive in well under a second instead of waiting on Google.
 */
export function MapEmbed({ query }: { query: string }) {
  const [load, setLoad] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (load) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setLoad(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [load]);

  const src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;

  return (
    <div ref={ref} className="aspect-video rounded-2xl overflow-hidden shadow-xl bg-stone-100 relative">
      {load ? (
        <iframe
          src={src}
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Map"
        />
      ) : (
        <button onClick={() => setLoad(true)} className="absolute inset-0 group bg-gradient-to-br from-stone-200 to-stone-400" aria-label="Load map">
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="bg-stone-900/80 backdrop-blur-md text-stone-50 px-6 py-3 rounded-full font-medium text-sm shadow-xl flex items-center gap-2 group-hover:scale-105 transition-transform">
              <MapPin size={16} /> Tap to load map
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
