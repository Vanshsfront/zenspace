import { getSiteSettings, getArtists, getCategories, getStudioPhotos, getReviews, getShortVideos, getServiceForm } from "@/lib/data";
import { PageContent } from "@/components/PageContent";

export default async function HomePage() {
  const [settings, artists, categories, studio, reviews, videos, customDesignForm, coverUpForm, piercingForm] = await Promise.all([
    getSiteSettings(),
    getArtists(),
    getCategories(),
    getStudioPhotos(),
    getReviews(),
    getShortVideos(),
    getServiceForm("custom-design"),
    getServiceForm("cover-up"),
    getServiceForm("piercing"),
  ]);

  return (
    <PageContent
      settings={settings}
      artists={artists}
      categories={categories}
      studio={studio}
      reviews={reviews}
      videos={videos}
      serviceForms={{ "custom-design": customDesignForm, "cover-up": coverUpForm, "piercing": piercingForm }}
    />
  );
}
