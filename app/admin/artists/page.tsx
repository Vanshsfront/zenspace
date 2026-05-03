import { EntityList } from "../_components/EntityList";

type Artist = {
  id: string;
  name: string;
  slug: string | null;
  role: string | null;
  photo: string | null;
  specialty: string | null;
  sort_order: number | null;
};

export default function Page() {
  return (
    <EntityList<Artist>
      table="artists"
      title="Artists"
      basePath="/admin/artists"
      columns={[
        { key: "photo", label: "Photo", image: true },
        { key: "name", label: "Name" },
        { key: "slug", label: "Slug" },
        { key: "specialty", label: "Specialty" },
      ]}
    />
  );
}
