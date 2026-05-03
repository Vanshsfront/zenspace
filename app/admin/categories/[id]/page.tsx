"use client";
import Link from "next/link";
import { use } from "react";
import { ArrowLeft } from "lucide-react";
import { EntityForm } from "../../_components/EntityForm";
import { CATEGORY_FIELDS } from "../../_components/forms";
import { InlinePhotoLibrary } from "../../_components/InlinePhotoLibrary";

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <div className="max-w-3xl">
      <Link href="/admin/categories" className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 mb-6">
        <ArrowLeft size={16} /> Back to categories
      </Link>
      <h1 className="font-serif text-3xl mb-6">Edit category</h1>

      <section className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 mb-8">
        <EntityForm table="categories" id={id} returnTo="/admin/categories" fields={CATEGORY_FIELDS} />
      </section>

      <section className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
        <InlinePhotoLibrary
          table="category_photos"
          parentField="category_id"
          parentId={id}
          title="Photos in this category"
          description="These show up on /category/<slug>. Drop in multiple at once."
        />
      </section>
    </div>
  );
}
