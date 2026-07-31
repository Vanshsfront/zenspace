"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";

/**
 * Positioning helpers for the inline editing affordances.
 *
 * Every overlay (the character counter, the image controls, the collection
 * handles) is rendered into a portal on <body> and positioned from the target's
 * bounding box rather than from a wrapper element. That is deliberate: the edit
 * surface is the real site route, so the editor must not add a single node that
 * could change how the page lays out. Portals also dodge the transformed
 * ancestors framer-motion leaves all over the site, which break position:fixed.
 */

export type AnchorRect = { top: number; left: number; width: number; height: number };

function rectOf(el: Element): AnchorRect {
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

/**
 * Tracks the on-screen box of `el` while `active`. Re-measures on scroll and
 * resize so the overlay follows the content instead of drifting off it.
 */
export function useAnchorRect(el: Element | null, active: boolean): AnchorRect | null {
  const [rect, setRect] = useState<AnchorRect | null>(null);

  useEffect(() => {
    if (!el || !active) {
      setRect(null);
      return;
    }
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setRect(rectOf(el)));
    };
    measure();
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
      observer.disconnect();
    };
  }, [el, active]);

  return rect;
}

/**
 * For primitives that wrap existing markup in a `display: contents` host: finds
 * the real element inside it and reports whether the pointer is over it.
 *
 * The host itself has no box (that is the point of `display: contents`), so the
 * first element child is what we measure and listen on.
 */
export function useHostTarget(hostRef: RefObject<HTMLElement | null>): {
  target: HTMLElement | null;
  hovered: boolean;
  /** Spread onto the overlay root so it counts as part of the hover surface. */
  overlayProps: { onMouseEnter: () => void; onMouseLeave: () => void };
} {
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [hovered, setHovered] = useState(false);

  // The overlay is portaled on top of the target and is not pointer-transparent,
  // because its buttons have to be clickable. That means moving the pointer from
  // the image onto Replace fires mouseleave on the image before mouseenter on the
  // overlay. Tracking only the target would unmount the overlay in that gap, the
  // pointer would land back on the image, and the whole thing would flicker
  // without ever letting a click through. So: track both surfaces, and clear on a
  // short delay so the handoff between them survives.
  const over = useRef({ target: false, overlay: false });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sync = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    if (over.current.target || over.current.overlay) {
      setHovered(true);
      return;
    }
    timer.current = setTimeout(() => setHovered(false), 120);
  }, []);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  // No dependency array: the wrapped markup can be re-rendered by the server
  // (router.refresh) and swap the child element out from under us. Setting the
  // same element back is a no-op for React, so this cannot loop.
  useEffect(() => {
    const child = hostRef.current?.firstElementChild;
    setTarget(child instanceof HTMLElement ? child : null);
  });

  useEffect(() => {
    if (!target) return;
    const enter = () => {
      over.current.target = true;
      sync();
    };
    const leave = () => {
      over.current.target = false;
      sync();
    };
    target.addEventListener("mouseenter", enter);
    target.addEventListener("mouseleave", leave);
    return () => {
      target.removeEventListener("mouseenter", enter);
      target.removeEventListener("mouseleave", leave);
      over.current.target = false;
    };
  }, [target, sync]);

  const overlayProps = useMemo(
    () => ({
      onMouseEnter: () => {
        over.current.overlay = true;
        sync();
      },
      onMouseLeave: () => {
        over.current.overlay = false;
        sync();
      },
    }),
    [sync]
  );

  return { target, hovered, overlayProps };
}
