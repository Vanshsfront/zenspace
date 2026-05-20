import { EntityForm } from "../../_components/EntityForm";
import { SAFETY_ITEM_FIELDS } from "../../_components/forms";

export default function Page() {
  return <EntityForm table="safety_items" fields={SAFETY_ITEM_FIELDS} returnTo="/admin/safety-items" defaults={{ audience: "both", sort_order: 0 }} />;
}
