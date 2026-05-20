import { PiercingAudienceContent } from "@/components/PiercingAudienceContent";
import { getSiteSettings, getPiercingPhotos, getEarringCategories } from "@/lib/data";

export const metadata = { title: "Piercings for Adults — Zenspace" };

export default async function AdultsPiercingPage() {
  const [settings, photos, categories] = await Promise.all([
    getSiteSettings(),
    getPiercingPhotos(),
    getEarringCategories("adults"),
  ]);
  return <PiercingAudienceContent audience="adults" settings={settings} photos={photos} earringCategories={categories} />;
}
