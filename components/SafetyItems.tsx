import Image from "next/image";
import type { SafetyItemRow } from "@/lib/data";

export function SafetyItems({ items }: { items: SafetyItemRow[] }) {
  if (items.length === 0) return null;
  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-10 text-center">What makes us safe?</h2>
      <div className="space-y-8">
        {items.map((it) => (
          <div key={it.id} className="grid md:grid-cols-[260px_1fr] gap-6 items-start">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100">
              {it.photo && (
                <Image src={it.photo} alt={it.title} fill className="object-cover" sizes="(min-width: 768px) 260px, 100vw" />
              )}
            </div>
            <div>
              <h3 className="font-serif text-xl text-stone-900 mb-2">{it.title}</h3>
              <p className="text-stone-600 leading-relaxed whitespace-pre-wrap">{it.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
