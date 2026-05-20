import { EntityList } from "../_components/EntityList";

type Row = { id: string; slug: string; title: string; intro: string | null };

export default function Page() {
  return (
    <EntityList<Row>
      table="service_forms"
      title="Booking forms"
      basePath="/admin/service-forms"
      columns={[
        { key: "slug", label: "Slug" },
        { key: "title", label: "Title" },
        { key: "intro", label: "Intro", truncate: true },
      ]}
    />
  );
}
