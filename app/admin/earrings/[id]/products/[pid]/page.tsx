"use client";
import Link from "next/link";
import { use } from "react";
import { ArrowLeft } from "lucide-react";
import { EntityForm } from "../../../../_components/EntityForm";
import { EARRING_PRODUCT_FIELDS } from "../../../../_components/forms";

export default function EditEarringProductPage({ params }: { params: Promise<{ id: string; pid: string }> }) {
  const { id: categoryId, pid } = use(params);
  return (
    <div className="max-w-2xl">
      <Link
        href={`/admin/earrings/${categoryId}/products`}
        className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 mb-6"
      >
        <ArrowLeft size={16} /> Back to products
      </Link>
      <h1 className="font-serif text-3xl mb-6">Edit product</h1>
      <EntityForm
        table="earring_products"
        id={pid}
        fields={EARRING_PRODUCT_FIELDS}
        returnTo={`/admin/earrings/${categoryId}/products`}
      />
    </div>
  );
}
