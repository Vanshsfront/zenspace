import { EntityList } from "../_components/EntityList";

type Review = {
  id: string;
  client_name: string;
  photo: string;
  review: string | null;
  rating: number | null;
  sort_order: number | null;
};

export default function Page() {
  return (
    <EntityList<Review>
      table="reviews"
      title="Reviews"
      basePath="/admin/reviews"
      columns={[
        { key: "photo", label: "Client", image: true },
        { key: "client_name", label: "Name" },
        { key: "rating", label: "Rating" },
        { key: "review", label: "Review", truncate: true },
      ]}
    />
  );
}
