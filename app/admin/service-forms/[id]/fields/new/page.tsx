"use client";
import { use } from "react";
import { EntityForm } from "../../../../_components/EntityForm";
import { SERVICE_FORM_FIELD_FIELDS } from "../../../../_components/forms";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <EntityForm
      table="service_form_fields"
      fields={SERVICE_FORM_FIELD_FIELDS}
      returnTo={`/admin/service-forms/${id}`}
      defaults={{ form_id: id, required: "false", options: "", sort_order: 100 }}
    />
  );
}
