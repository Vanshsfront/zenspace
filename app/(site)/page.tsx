import { getSiteSettings, getArtists, getCategories, getStudioPhotos, getReviews, getShortVideos } from "@/lib/data";
import { PageContent } from "@/components/PageContent";

export default async function HomePage() {
  const [settings, artists, categories, studio, reviews, videos] = await Promise.all([
    getSiteSettings(),
    getArtists(),
    getCategories(),
    getStudioPhotos(),
    getReviews(),
    getShortVideos(),
  ]);

  return (
    <PageContent
      settings={settings}
      artists={artists}
      categories={categories}
      studio={studio}
      reviews={reviews}
      videos={videos}
    />
  );
}
