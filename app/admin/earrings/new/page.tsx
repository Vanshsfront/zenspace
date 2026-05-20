"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EntityForm } from "../../_components/EntityForm";
import { EARRING_CATEGORY_FIELDS } from "../../_components/forms";

export default function NewEarringCategoryPage() {
  return (
    <div className="max-w-2xl">
      <Link href="/admin/earrings" className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 mb-6">
        <ArrowLeft size={16} /> Back to earring categories
      </Link>
      <h1 className="font-serif text-3xl mb-6">New earring category</h1>
      <EntityForm
        table="earring_categories"
        fields={EARRING_CATEGORY_FIELDS}
        returnTo="/admin/earrings"
        defaults={{ audience: "both", sort_order: 0 }}
      />
    </div>
  );
}
