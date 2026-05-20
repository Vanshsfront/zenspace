import { notFound } from "next/navigation";
import { ArtistProfileContent } from "@/components/ArtistProfileContent";
import { getArtistBySlug } from "@/lib/data";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = await getArtistBySlug(slug);
  return { title: `${a?.name || "Artist"} | Zenspace` };
}

export default async function ArtistProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = await getArtistBySlug(slug);
  if (!a) notFound();

  return (
    <ArtistProfileContent
      name={a.name}
      role={a.role || ""}
      experience={a.experience || "—"}
      specialty={a.specialty || "—"}
      bio={a.bio || ""}
      photo={a.photo || ""}
      works={(a.portfolio || []).map((p) => p.photo)}
    />
  );
}
