import { CrudList } from "../CrudList";
export default function Page() {
  return <CrudList table="categories" title="Categories" fields={[
    { key: "name", label: "Name" },
    { key: "photo", label: "Photo", type: "image" },
    { key: "sort_order", label: "Sort order", type: "number" },
  ]} />;
}
