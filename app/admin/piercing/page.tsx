import { redirect } from "next/navigation";

// The galleries are split per audience. Keep this path working for anyone with
// the old link bookmarked.
export default function Page() {
  redirect("/admin/piercing/kids");
}
