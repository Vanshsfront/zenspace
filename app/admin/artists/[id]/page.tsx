"use client";
import Link from "next/link";
import { use } from "react";
import { ArrowLeft } from "lucide-react";
import { EntityForm } from "../../_components/EntityForm";
import { ARTIST_FIELDS } from "../../_components/forms";
import { InlinePhotoLibrary } from "../../_components/InlinePhotoLibrary";

export default function EditArtistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <div className="max-w-3xl">
      <Link href="/admin/artists" className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 mb-6">
        <ArrowLeft size={16} /> Back to artists
      </Link>
      <h1 className="font-serif text-3xl mb-6">Edit artist</h1>

      <section className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 mb-8">
        <EntityForm table="artists" id={id} returnTo="/admin/artists" fields={ARTIST_FIELDS} />
      </section>

      <section className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
        <InlinePhotoLibrary
          table="portfolio_items"
          parentField="artist_id"
          parentId={id}
          title="Portfolio photos"
          description="These appear on this artist's public profile page. Drop in multiple at once."
        />
      </section>
    </div>
  );
}
