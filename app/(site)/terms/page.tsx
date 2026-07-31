import { getLegalPage } from "@/lib/data";
import { BlockRenderer } from "@/components/BlockRenderer";
import type { Block } from "@/lib/blocks";
import { EditableText } from "@/lib/edit/EditableText";

export const revalidate = 3600;
export const metadata = { title: "Terms & Conditions | Zenspace" };

const TITLE_CLASS = "font-serif text-4xl md:text-6xl text-stone-900 tracking-tight mb-10 text-center";

export default async function TermsPage() {
  const page = await getLegalPage("terms");
  const blocks = (Array.isArray(page?.blocks) ? page!.blocks : []) as Block[];
  return (
    <div className="bg-paper-texture min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Same reasoning as /privacy: without a row there is no id to patch, and
            creating one from a page that cannot tell "not seeded" apart from "the
            database timed out" would risk colliding on the unique slug. */}
        {page ? (
          <EditableText as="h1" className={TITLE_CLASS} table="legal_pages" field="title" id={page.id} value={page.title}>
            {page.title || "Terms & Conditions"}
          </EditableText>
        ) : (
          <h1 className={TITLE_CLASS}>Terms & Conditions</h1>
        )}
        <BlockRenderer
          blocks={blocks}
          owner={page ? { table: "legal_pages", id: page.id } : undefined}
          empty={<p className="text-stone-600 text-center">Coming soon.</p>}
        />
      </div>
    </div>
  );
}
