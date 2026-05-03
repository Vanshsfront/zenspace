import { CategoryContent } from "@/components/CategoryContent";
import { getCategories } from "@/lib/data";

export const metadata = { title: "Categories — Zenspace" };

export default async function CategoryPage() {
  const categories = await getCategories();
  return <CategoryContent categories={categories} />;
}
