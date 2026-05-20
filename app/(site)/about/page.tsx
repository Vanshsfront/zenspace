import { AboutContent } from "@/components/AboutContent";
import { getSiteSettings, getStudioPhotos } from "@/lib/data";

export const metadata = { title: "About Us | Zenspace" };

export default async function AboutPage() {
  const [settings, studio] = await Promise.all([
    getSiteSettings(),
    getStudioPhotos(),
  ]);
  return <AboutContent settings={settings} studio={studio} />;
}
