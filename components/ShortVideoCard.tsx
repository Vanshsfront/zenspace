"use client";

import { useEffect, useRef } from "react";
import { useEditMode } from "@/lib/edit/context";
import { EditableImage } from "@/lib/edit/EditableImage";
import { EditableText } from "@/lib/edit/EditableText";

/**
 * Short-form vertical video tile used on the homepage "Watch us at work" section.
 * Plays automatically when at least half of the card is in view; pauses otherwise.
 * Fixed width (260px) keeps marquee + carousel layouts deterministic.
 */
export function ShortVideoCard({
  id,
  src,
  poster,
  caption,
}: {
  /** The short_videos row this card renders, so the clip can be replaced in place. */
  id: string;
  src: string;
  poster?: string | null;
  caption?: string | null;
}) {
  const editing = useEditMode();
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
      {/* video is NOT NULL — a card with no clip is just a black rectangle — so
          the file can be swapped but not removed. */}
      <EditableImage table="short_videos" field="video" id={id} removable={false}>
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
      </EditableImage>
      {/* A clip with no caption renders no bar at all, which leaves nowhere to
          type one, so edit mode keeps the empty bar on screen. */}
      {(caption || editing) && (
        <EditableText
          table="short_videos"
          field="caption"
          id={id}
          as="div"
          className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-stone-900/80 to-transparent text-stone-50 text-sm"
        >
          {caption}
        </EditableText>
      )}
    </div>
  );
}
