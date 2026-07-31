"use client";

import { useEffect, useRef, useState } from "react";
import { ShortVideoCard } from "./ShortVideoCard";
import { EditableCollection } from "@/lib/edit/EditableCollection";

type Video = { id: string; video: string; poster?: string | null; caption?: string | null };

/**
 * Manual multi-video carousel. Replaces the auto-marquee on the homepage so users
 * can browse short videos at their own pace via arrow buttons, dot indicators, or
 * native swipe/drag/wheel.
 *
 * Card width matches ShortVideoCard (260px) + a 24px gap (gap-6) = 284px per step.
 * If you ever resize the card, keep CARD_WIDTH in sync or scroll snapping will drift.
 */
export function VideoCarousel({ videos }: { videos: Video[] }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  // Each card is 260px wide + 24px gap. Mirror ShortVideoCard width + gap-6.
  const CARD_WIDTH = 260 + 24;

  const scrollToIndex = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(videos.length - 1, i));
    setIndex(clamped);
    el.scrollTo({ left: clamped * CARD_WIDTH, behavior: "smooth" });
  };

  const next = () => scrollToIndex(index + 1);
  const prev = () => scrollToIndex(index - 1);

  // Keep `index` in sync if the user drags / wheels / swipes the scroller manually,
  // so the dot indicators reflect the actual visible card.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const i = Math.round(el.scrollLeft / CARD_WIDTH);
        setIndex(i);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (videos.length === 0) return null;

  return (
    <div className="relative">
      {/* Scrollable strip — manual swipe/drag/wheel + arrow buttons.
          Inline styles hide the scrollbar since the project has no scrollbar-hide utility. */}
      <div
        ref={scrollerRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-px-6 px-6 pb-2"
        style={{
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <EditableCollection
          table="short_videos"
          items={videos}
          // video is NOT NULL, so a new row cannot start empty and there is no
          // placeholder clip to point it at. It starts as a copy of the first
          // card and the admin swaps the file with Replace.
          newItem={{ video: videos[0]?.video }}
          addLabel="Add video"
          itemLabel="video"
        >
          {(v) => (
            <div className="snap-start shrink-0">
              <ShortVideoCard
                id={v.id}
                src={v.video}
                poster={v.poster ?? undefined}
                caption={v.caption ?? undefined}
              />
            </div>
          )}
        </EditableCollection>
      </div>

      {/* Arrow controls — only meaningful when there's more than one video. */}
      {videos.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous video"
            onClick={prev}
            disabled={index === 0}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 border border-stone-200 shadow-md flex items-center justify-center text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next video"
            onClick={next}
            disabled={index >= videos.length - 1}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 border border-stone-200 shadow-md flex items-center justify-center text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}

      {/* Dot indicators — hidden for single-video case to avoid a lonely dot. */}
      {videos.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {videos.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to video ${i + 1}`}
              onClick={() => scrollToIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-stone-700" : "w-1.5 bg-stone-300 hover:bg-stone-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
