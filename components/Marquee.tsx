"use client";

import type { ReactNode } from "react";
import { useEditMode } from "@/lib/edit/context";

/**
 * Continuously-scrolling marquee. Pure CSS — no JS state, perfect SSR, no hydration warnings.
 * Renders `children` twice end-to-end so the CSS keyframe (translateX 0 → -50%) loops seamlessly.
 * Hover pauses (see globals.css); `prefers-reduced-motion: reduce` stops the animation entirely.
 *
 * Children should have fixed widths (e.g. w-[320px]) so the track width is deterministic —
 * otherwise the loop point can shift across viewports.
 */
export function Marquee({
  children,
  durationSec = 50,
  className = "",
}: {
  children: ReactNode;
  durationSec?: number;
  className?: string;
}) {
  const editing = useEditMode();

  // In edit mode the second copy would clone every editing handle in the strip,
  // and a moving card is impossible to click, drag or type into. So the track
  // renders once and stands still, and the admin scrolls it by hand. A visitor
  // never takes this branch, so the marquee ships exactly as it always has.
  if (editing) {
    return (
      <div className={`overflow-x-auto ${className}`}>
        <div className="flex gap-6 w-max">{children}</div>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className="marquee-track flex gap-6 w-max"
        style={{ ["--marquee-duration" as string]: `${durationSec}s` }}
      >
        <div className="flex gap-6 shrink-0">{children}</div>
        <div aria-hidden className="flex gap-6 shrink-0">{children}</div>
      </div>
    </div>
  );
}
