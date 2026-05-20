"use client";

import { useEffect, useRef } from "react";

/**
 * Short-form vertical video tile used on the homepage "Watch us at work" section.
 * Plays automatically when at least half of the card is in view; pauses otherwise.
 * Fixed width (260px) keeps marquee + carousel layouts deterministic.
 */
export function ShortVideoCard({
  src,
  poster,
  caption,
}: {
  src: string;
  poster?: string | null;
  caption?: string | null;
}) {
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
