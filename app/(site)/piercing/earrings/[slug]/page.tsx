import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getEarringCategoryWithProducts } from "@/lib/data";

export const dynamic = "force-static";
export const revalidate = 3600;

export default async function EarringCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getEarringCategoryWithProducts(slug);
  if (!data) notFound();
  const { category, products } = data;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/40 via-white to-violet-50/40">
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-12 text-center">
        <p className="text-sm text-stone-500 mb-2">
          <Link href="/piercing" className="hover:text-stone-700">Piercing</Link> · {category.audience === "kids" ? "Kids" : category.audience === "adults" ? "Adults" : "All ages"}
        </p>
        <h1 className="font-serif text-5xl md:text-6xl text-stone-900 tracking-tight">{category.name}</h1>
        {category.description && (
          <p className="text-stone-600 max-w-2xl mx-auto mt-4 leading-relaxed">{category.description}</p>
        )}
        {category.photo && (
          <div className="relative w-full max-w-3xl mx-auto aspect-[16/9] mt-10 rounded-[2rem] overflow-hidden shadow-lg">
            <Image src={category.photo} alt={category.name} fill className="object-cover" sizes="(min-width: 768px) 768px, 100vw" />
          </div>
        )}
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        {products.length === 0 ? (
          <p className="text-center text-stone-500 italic">More designs coming soon.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p.id} className="bg-white/80 backdrop-blur-md border border-stone-200/60 rounded-[2rem] overflow-hidden shadow-lg flex flex-col">
                <div className="relative aspect-square bg-stone-100">
                  {p.photo ? (
                    <Image src={p.photo} alt={p.name} fill className="object-cover" sizes="(min-width: 768px) 30vw, 100vw" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-stone-400">No image</div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-serif text-xl text-stone-900 mb-1">{p.name}</h3>
                  {p.price_inr != null && (
                    <p className="text-stone-700 text-sm font-medium mb-2">₹{p.price_inr.toLocaleString("en-IN")}</p>
                  )}
                  {p.description && <p className="text-stone-600 leading-relaxed text-sm">{p.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
