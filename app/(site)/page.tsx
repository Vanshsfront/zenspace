import { getSiteSettings, getArtists, getCategories, getStudioPhotos, getReviews } from "@/lib/data";
import { PageContent } from "@/components/PageContent";

export default async function HomePage() {
  const [settings, artists, categories, studio, reviews] = await Promise.all([
    getSiteSettings(),
    getArtists(),
    getCategories(),
    getStudioPhotos(),
    getReviews(),
  ]);

  return (
    <PageContent 
      settings={settings} 
      artists={artists} 
      categories={categories} 
      studio={studio} 
      reviews={reviews} 
    />
  );
}
