import { EntityList } from "../_components/EntityList";

type Row = { id: string; form_id: string; status: string; created_at: string };

export default function Page() {
  return (
    <EntityList<Row>
      table="service_form_submissions"
      title="Form submissions"
      basePath="/admin/submissions"
      hideNew
      columns={[
        { key: "created_at", label: "When" },
        { key: "form_id", label: "Form" },
        { key: "status", label: "Status" },
      ]}
    />
  );
}
