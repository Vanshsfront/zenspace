import { CrudList } from "../CrudList";
export default function Page() {
  return <CrudList table="studio_photos" title="Studio photos" fields={[
    { key: "photo", label: "Photo", type: "image" },
    { key: "caption", label: "Caption" },
    { key: "sort_order", label: "Sort order", type: "number" },
  ]} />;
}
