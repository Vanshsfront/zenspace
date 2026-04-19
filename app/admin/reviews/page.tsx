import { CrudList } from "../CrudList";
export default function Page() {
  return <CrudList table="reviews" title="Reviews" fields={[
    { key: "client_name", label: "Client name" },
    { key: "photo", label: "Photo", type: "image" },
    { key: "review", label: "Review", type: "textarea" },
    { key: "rating", label: "Rating (1-5)", type: "number" },
    { key: "sort_order", label: "Sort order", type: "number" },
  ]} />;
}
