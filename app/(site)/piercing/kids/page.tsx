import { PiercingAudienceContent } from "@/components/PiercingAudienceContent";
import { getSiteSettings, getPiercingPhotos, getEarringCategories, getSafetyItems } from "@/lib/data";
import { piercingSettings, piercingPhotoCards, earringCategoryCards, safetyItemCards } from "../_props";

export const metadata = { title: "Piercings for Kids | Zenspace" };

export default async function KidsPiercingPage() {
  const [settings, photos, categories, safetyItems] = await Promise.all([
    getSiteSettings(),
    getPiercingPhotos("kids"),
    getEarringCategories("kids"),
    getSafetyItems("kids"),
  ]);
  // Projected before the client boundary so the unread columns never reach the
  // flight payload embedded in this page's prerendered HTML.
  return (
    <PiercingAudienceContent
      audience="kids"
      settings={piercingSettings(settings)}
      photos={piercingPhotoCards(photos)}
      earringCategories={earringCategoryCards(categories)}
      safetyItems={safetyItemCards(safetyItems)}
    />
  );
}
