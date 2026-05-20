import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { ClientEffects } from "@/components/ClientEffects";

const serif = Playfair_Display({ variable: "--font-serif", subsets: ["latin"] });
const sans = Inter({ variable: "--font-sans", subsets: ["latin"] });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://zenspace.local";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Zenspace Art & Tattoo | Mumbai's consultation-led tattoo studio",
  description:
    "A consultation-led tattoo studio in Andheri East, Mumbai. Custom tattoos, cover-ups, piercings and aftercare, built around anatomy, symbolism and long-term aesthetics.",
  keywords: ["tattoo studio mumbai", "andheri tattoo", "custom tattoo", "piercing mumbai", "cover up tattoo", "zenspace"],
  openGraph: {
    title: "Zenspace Art & Tattoo",
    description: "Where your story becomes timeless art.",
    images: ["/assets/logo.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} h-full antialiased`}>
      <head>
        {/* Preconnect to Google Maps so /contact's lazy iframe paints fast when scrolled into view */}
        <link rel="preconnect" href="https://maps.google.com" />
        <link rel="preconnect" href="https://maps.gstatic.com" crossOrigin="" />
      </head>
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900 font-sans">
        <ClientEffects />
        {children}
      </body>
    </html>
  );
}
