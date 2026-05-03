import { AboutContent } from "@/components/AboutContent";
import { getSiteSettings } from "@/lib/data";

export const metadata = { title: "About Us — Zenspace" };

export default async function AboutPage() {
  const settings = await getSiteSettings();
  return <AboutContent settings={settings} />;
}
