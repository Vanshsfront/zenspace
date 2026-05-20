"use client";
import { use } from "react";
import { EntityForm } from "../../_components/EntityForm";
import { SAFETY_ITEM_FIELDS } from "../../_components/forms";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <EntityForm table="safety_items" id={id} fields={SAFETY_ITEM_FIELDS} returnTo="/admin/safety-items" />;
}
