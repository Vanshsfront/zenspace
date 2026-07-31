import { PiercingAudienceContent } from "@/components/PiercingAudienceContent";
import { getSiteSettings, getPiercingPhotos, getEarringCategories, getSafetyItems } from "@/lib/data";
import { piercingSettings, piercingPhotoCards, earringCategoryCards, safetyItemCards } from "../_props";

export const metadata = { title: "Piercings for Adults | Zenspace" };

export default async function AdultsPiercingPage() {
  const [settings, photos, categories, safetyItems] = await Promise.all([
    getSiteSettings(),
    getPiercingPhotos("adults"),
    getEarringCategories("adults"),
    getSafetyItems("adults"),
  ]);
  // Projected before the client boundary so the unread columns never reach the
  // flight payload embedded in this page's prerendered HTML.
  return (
    <PiercingAudienceContent
      audience="adults"
      settings={piercingSettings(settings)}
      photos={piercingPhotoCards(photos)}
      earringCategories={earringCategoryCards(categories)}
      safetyItems={safetyItemCards(safetyItems)}
    />
  );
}
