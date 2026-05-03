import { notFound } from "next/navigation";
import { CategoryDetailContent } from "@/components/CategoryDetailContent";
import { getCategoryWithPhotos } from "@/lib/data";

const FRIENDLY_DESCRIPTION: Record<string, string> = {
  "realistic":
    "Detailed realistic tattoos created in Andheri, Mumbai, focusing on depth, accuracy, and long-lasting clarity. Each piece is rendered with patience for shading and dimension.",
  "small-minimal":
    "Simple, clean tattoos designed with precise linework and balanced placement for a subtle, timeless look. Built to age beautifully on the skin.",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = await getCategoryWithPhotos(slug);
  return { title: `${cat?.name || "Category"} — Zenspace` };
}

export default async function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = await getCategoryWithPhotos(slug);
  if (!cat) notFound();

  return (
    <CategoryDetailContent
      name={cat.name}
      description={FRIENDLY_DESCRIPTION[slug]}
      photos={cat.photos.map((p) => ({ id: p.id, photo: p.photo, caption: p.caption }))}
    />
  );
}
