"use client";

import { MessageCircle } from "lucide-react";

const DEFAULT_DIGITS = "917208388209";

export function WhatsAppFab({ digits }: { digits?: string | null }) {
  const cleaned = (digits || DEFAULT_DIGITS).replace(/\D/g, "") || DEFAULT_DIGITS;
  const href = `https://wa.me/${cleaned}?text=${encodeURIComponent(
    "Hi Zenspace, I'd like to know more."
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message us on WhatsApp"
      style={{ zIndex: 9999 }}
      className="group fixed bottom-6 right-6 inline-flex items-center gap-2 pl-4 pr-5 h-14 rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(37,211,102,0.5)] hover:scale-105 transition-all isolate"
    >
      <span className="relative inline-flex items-center justify-center">
        <span className="absolute inline-flex h-10 w-10 rounded-full bg-[#25D366] opacity-60 animate-ping" />
        <span className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20">
          <MessageCircle size={22} />
        </span>
      </span>
      <span className="hidden sm:inline font-medium">Chat on WhatsApp</span>
    </a>
  );
}
