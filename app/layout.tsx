import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getSiteSettings } from "@/lib/data";
import { ClientEffects } from "@/components/ClientEffects";

const serif = Playfair_Display({ variable: "--font-serif", subsets: ["latin"] });
const sans = Inter({ variable: "--font-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zenspace Art & Tattoo — Mumbai's consultation-led tattoo studio",
  description:
    "A consultation-led tattoo studio in Andheri East, Mumbai. Custom tattoos, cover-ups, piercings & aftercare — built around anatomy, symbolism and long-term aesthetics.",
  keywords: ["tattoo studio mumbai", "andheri tattoo", "custom tattoo", "piercing mumbai", "cover up tattoo", "zenspace"],
  openGraph: {
    title: "Zenspace Art & Tattoo",
    description: "Where your story becomes timeless art.",
    images: ["/assets/logo.jpg"],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900 font-sans">
        <ClientEffects />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
