import { getLegalPage } from "@/lib/data";
import { BlockRenderer } from "@/components/BlockRenderer";
import type { Block } from "@/lib/blocks";

export const revalidate = 3600;
export const metadata = { title: "Privacy Policy | Zenspace" };

export default async function PrivacyPage() {
  const page = await getLegalPage("privacy");
  const blocks = (Array.isArray(page?.blocks) ? page!.blocks : []) as Block[];
  return (
    <div className="bg-paper-texture min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-4xl md:text-6xl text-stone-900 tracking-tight mb-10 text-center">{page?.title || "Privacy Policy"}</h1>
        {blocks.length > 0 ? <BlockRenderer blocks={blocks} /> : <p className="text-stone-600 text-center">Coming soon.</p>}
      </div>
    </div>
  );
}
