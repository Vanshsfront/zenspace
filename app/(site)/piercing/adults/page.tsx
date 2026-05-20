import { PiercingAudienceContent } from "@/components/PiercingAudienceContent";
import { getSiteSettings, getPiercingPhotos, getEarringCategories, getSafetyItems } from "@/lib/data";

export const metadata = { title: "Piercings for Adults — Zenspace" };

export default async function AdultsPiercingPage() {
  const [settings, photos, categories, safetyItems] = await Promise.all([
    getSiteSettings(),
    getPiercingPhotos(),
    getEarringCategories("adults"),
    getSafetyItems("adults"),
  ]);
  return <PiercingAudienceContent audience="adults" settings={settings} photos={photos} earringCategories={categories} safetyItems={safetyItems} />;
}
