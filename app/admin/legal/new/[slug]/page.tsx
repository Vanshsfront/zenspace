import { notFound } from "next/navigation";
import { LegalForm } from "../../LegalForm";
import { LEGAL_PAGE_TEMPLATES, isLegalSlug } from "../../templates";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Only /terms and /privacy are rendered by the public site, so those are the
  // only two pages worth creating.
  if (!isLegalSlug(slug)) notFound();
  const t = LEGAL_PAGE_TEMPLATES[slug];

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-3xl mb-2">Create {t.title}</h1>
      <p className="text-stone-600 mb-6 text-sm">
        Starter copy is filled in below so the page isn’t blank — edit it and save.
      </p>
      <LegalForm initial={{ slug, title: t.title, blocks: t.blocks }} />
    </div>
  );
}
