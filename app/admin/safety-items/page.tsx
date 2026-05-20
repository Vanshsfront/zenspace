import { EntityList } from "../_components/EntityList";

type Row = { id: string; audience: string; title: string; photo: string | null; sort_order: number | null };

export default function Page() {
  return (
    <EntityList<Row>
      table="safety_items"
      title="What makes us safe"
      basePath="/admin/safety-items"
      columns={[
        { key: "photo", label: "Photo", image: true },
        { key: "audience", label: "Audience" },
        { key: "title", label: "Title" },
        { key: "sort_order", label: "Sort" },
      ]}
    />
  );
}
