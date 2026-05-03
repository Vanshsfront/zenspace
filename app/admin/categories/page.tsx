import { EntityList } from "../_components/EntityList";

type Category = {
  id: string;
  name: string;
  slug: string | null;
  photo: string | null;
  sort_order: number | null;
};

export default function Page() {
  return (
    <EntityList<Category>
      table="categories"
      title="Categories"
      basePath="/admin/categories"
      columns={[
        { key: "photo", label: "Cover", image: true },
        { key: "name", label: "Name" },
        { key: "slug", label: "Slug" },
      ]}
    />
  );
}
