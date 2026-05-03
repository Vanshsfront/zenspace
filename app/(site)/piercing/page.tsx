import { PiercingContent } from "@/components/PiercingContent";
import { getSiteSettings, getPiercingPhotos } from "@/lib/data";

export const metadata = { title: "Piercings — Zenspace" };

export default async function PiercingPage() {
  const [settings, photos] = await Promise.all([getSiteSettings(), getPiercingPhotos()]);
  return <PiercingContent settings={settings} photos={photos} />;
}
