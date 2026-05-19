import { PiercingAudienceContent } from "@/components/PiercingAudienceContent";
import { getSiteSettings, getPiercingPhotos, getEarringOptions } from "@/lib/data";

export const metadata = { title: "Piercings for Kids — Zenspace" };

export default async function KidsPiercingPage() {
  const [settings, photos, earrings] = await Promise.all([
    getSiteSettings(),
    getPiercingPhotos(),
    getEarringOptions("kids"),
  ]);
  return <PiercingAudienceContent audience="kids" settings={settings} photos={photos} earrings={earrings} />;
}
