"use client";
import { use } from "react";
import { EntityForm } from "../../../../_components/EntityForm";
import { SERVICE_FORM_FIELD_FIELDS } from "../../../../_components/forms";

export default function Page({ params }: { params: Promise<{ id: string; fid: string }> }) {
  const { id, fid } = use(params);
  return (
    <EntityForm
      table="service_form_fields"
      id={fid}
      fields={SERVICE_FORM_FIELD_FIELDS}
      returnTo={`/admin/service-forms/${id}`}
    />
  );
}
