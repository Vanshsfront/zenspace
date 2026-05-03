"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EntityForm } from "../../_components/EntityForm";
import { CATEGORY_FIELDS } from "../../_components/forms";

export default function NewCategoryPage() {
  return (
    <div className="max-w-2xl">
      <Link href="/admin/categories" className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 mb-6">
        <ArrowLeft size={16} /> Back to categories
      </Link>
      <h1 className="font-serif text-3xl mb-6">New category</h1>
      <EntityForm table="categories" returnTo="/admin/categories" fields={CATEGORY_FIELDS} />
    </div>
  );
}
