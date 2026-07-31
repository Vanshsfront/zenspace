import { notFound } from "next/navigation";
import { getEarringCategoryWithProducts } from "@/lib/data";
import { EarringCategoryContent } from "../../_components/EarringCategoryContent";

export const dynamic = "force-static";
export const revalidate = 3600;

export default async function EarringCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getEarringCategoryWithProducts(slug);
  if (!data) notFound();
  const { category, products } = data;

  return <EarringCategoryContent category={category} products={products} />;
}
