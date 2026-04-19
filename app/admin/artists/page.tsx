import { CrudList } from "../CrudList";
export default function Page() {
  return <CrudList table="artists" title="Artists" fields={[
    { key: "name", label: "Name" },
    { key: "role", label: "Role / Specialty" },
    { key: "photo", label: "Photo", type: "image" },
    { key: "portfolio_url", label: "Portfolio URL" },
    { key: "sort_order", label: "Sort order", type: "number" },
  ]} />;
}
