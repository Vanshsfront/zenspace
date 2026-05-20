import { EntityList } from "../_components/EntityList";

type Row = { id: string; name: string; slug: string; audience: string; photo: string | null };

export default function Page() {
  return (
    <EntityList<Row>
      table="earring_categories"
      title="Earring categories"
      basePath="/admin/earrings"
      columns={[
        { key: "photo", label: "Cover", image: true },
        { key: "name", label: "Name" },
        { key: "audience", label: "Audience" },
        { key: "slug", label: "Slug" },
      ]}
    />
  );
}
