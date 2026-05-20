import { PiercingAudienceContent } from "@/components/PiercingAudienceContent";
import { getSiteSettings, getPiercingPhotos, getEarringCategories } from "@/lib/data";

export const metadata = { title: "Piercings for Kids — Zenspace" };

export default async function KidsPiercingPage() {
  const [settings, photos, categories] = await Promise.all([
    getSiteSettings(),
    getPiercingPhotos(),
    getEarringCategories("kids"),
  ]);
  return <PiercingAudienceContent audience="kids" settings={settings} photos={photos} earringCategories={categories} />;
}
