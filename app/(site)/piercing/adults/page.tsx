import { PiercingAudienceContent } from "@/components/PiercingAudienceContent";
import { getSiteSettings, getPiercingPhotos, getEarringOptions } from "@/lib/data";

export const metadata = { title: "Piercings for Adults — Zenspace" };

export default async function AdultsPiercingPage() {
  const [settings, photos, earrings] = await Promise.all([
    getSiteSettings(),
    getPiercingPhotos(),
    getEarringOptions("adults"),
  ]);
  return <PiercingAudienceContent audience="adults" settings={settings} photos={photos} earrings={earrings} />;
}
