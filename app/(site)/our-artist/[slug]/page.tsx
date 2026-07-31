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
      id={a.id}
      name={a.name}
      role={a.role || ""}
      experience={a.experience || "—"}
      specialty={a.specialty || "—"}
      bio={a.bio || ""}
      photo={a.photo || ""}
      // Inline editing writes per row, so the portfolio keeps its ids instead
      // of being flattened to a list of URLs.
      works={(a.portfolio || []).map((p) => ({ id: p.id, photo: p.photo }))}
    />
  );
}
