"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import Link from "next/link";
import { Settings } from "lucide-react";

export function ClientEffects() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isAdmin) return;

    // Smooth Scroll Setup
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Mouse Tracking Setup
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest(".hover-lift") ||
        target.closest("[role='button']");

      setIsHovering(Boolean(isInteractive));
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    // Inject styles instead of inline body style
    const style = document.createElement("style");
    style.innerHTML = `
      * {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
      document.head.removeChild(style);
    };
  }, [isAdmin]);

  if (isAdmin || !isClient) return null;

  return (
    <>
      {/* Custom Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] rounded-full border-2 border-stone-800 flex items-center justify-center mix-blend-difference"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 1.8 : 1,
          backgroundColor: isHovering ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0)",
          borderColor: "rgba(255, 255, 255, 1)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 28, mass: 0.5 }}
      />
      
      {/* Settings Button (Side, floating) */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[9998]">
        <Link
          href="/admin-login"
          className="w-14 h-14 bg-white/70 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 flex items-center justify-center text-stone-800 transition-all duration-300 hover:bg-stone-900 hover:text-white hover:scale-110 pointer-events-auto"
          title="Admin Panel"
        >
          <Settings size={22} className="animate-[spin_6s_linear_infinite]" />
        </Link>
      </div>

      {/* Extreme Premium Blur Overlay */}
      <div className="fixed bottom-0 left-0 w-full h-32 pointer-events-none z-[9990]" style={{
        background: "linear-gradient(to top, rgba(250, 250, 249, 0.9) 0%, rgba(250, 250, 249, 0) 100%)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        maskImage: "linear-gradient(to top, black 0%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 100%)"
      }} />
    </>
  );
}
