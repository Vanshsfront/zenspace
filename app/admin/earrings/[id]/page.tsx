"use client";
import Link from "next/link";
import { use } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { EntityForm } from "../../_components/EntityForm";
import { EARRING_CATEGORY_FIELDS } from "../../_components/forms";

export default function EditEarringCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <div className="max-w-3xl">
      <Link href="/admin/earrings" className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 mb-6">
        <ArrowLeft size={16} /> Back to earring categories
      </Link>
      <h1 className="font-serif text-3xl mb-6">Edit earring category</h1>

      <section className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 mb-8">
        <EntityForm table="earring_categories" id={id} returnTo="/admin/earrings" fields={EARRING_CATEGORY_FIELDS} />
      </section>

      <section className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-xl text-stone-900">Products in this category</h2>
            <p className="text-sm text-stone-500 mt-1">
              Designs shown on /piercing/earrings/&lt;slug&gt;. Add, edit, or remove them on a dedicated screen.
            </p>
          </div>
          <Link
            href={`/admin/earrings/${id}/products`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-900 text-white text-sm hover:bg-stone-800 shadow-md"
          >
            Manage products <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
