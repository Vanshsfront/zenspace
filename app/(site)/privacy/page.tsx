import { getLegalPage } from "@/lib/data";
import { BlockRenderer } from "@/components/BlockRenderer";
import type { Block } from "@/lib/blocks";
import { EditableText } from "@/lib/edit/EditableText";

export const revalidate = 3600;
export const metadata = { title: "Privacy Policy | Zenspace" };

const TITLE_CLASS = "font-serif text-4xl md:text-6xl text-stone-900 tracking-tight mb-10 text-center";

export default async function PrivacyPage() {
  const page = await getLegalPage("privacy");
  const blocks = (Array.isArray(page?.blocks) ? page!.blocks : []) as Block[];
  return (
    <div className="bg-paper-texture min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        {/* No row means no id to patch, so the page falls back to the plain
            heading it always had. Creating the missing row from here would be a
            guess: getLegalPage also returns null when the database times out, so
            "not seeded" and "slow" look identical from the client and a POST
            would collide on the unique slug. supabase/schema.sql seeds both
            legal pages, and /admin/legal creates one when it has not. */}
        {page ? (
          <EditableText as="h1" className={TITLE_CLASS} table="legal_pages" field="title" id={page.id} value={page.title}>
            {page.title || "Privacy Policy"}
          </EditableText>
        ) : (
          <h1 className={TITLE_CLASS}>Privacy Policy</h1>
        )}
        {/* The title on the browser tab comes from the static `metadata` above,
            so renaming the page here does not change it. */}
        <BlockRenderer
          blocks={blocks}
          owner={page ? { table: "legal_pages", id: page.id } : undefined}
          empty={<p className="text-stone-600 text-center">Coming soon.</p>}
        />
      </div>
    </div>
  );
}
