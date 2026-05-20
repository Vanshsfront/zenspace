import { OurArtistsContent } from "@/components/OurArtistsContent";
import { getArtists } from "@/lib/data";

export const metadata = { title: "Our Artists | Zenspace" };

export default async function ArtistsPage() {
  const artists = await getArtists();
  return (
    <OurArtistsContent
      artists={artists.map((a) => ({ id: a.id, name: a.name, slug: a.slug, role: a.role, photo: a.photo }))}
    />
  );
}
