import { ContactContent } from "@/components/ContactContent";
import { getSiteSettings } from "@/lib/data";

export const metadata = { title: "Contact Us — Zenspace" };

export default async function ContactPage() {
  const settings = await getSiteSettings();
  return <ContactContent settings={settings} />;
}
