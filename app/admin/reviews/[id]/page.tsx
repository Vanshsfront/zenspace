"use client";
import Link from "next/link";
import { use } from "react";
import { ArrowLeft } from "lucide-react";
import { EntityForm } from "../../_components/EntityForm";
import { REVIEW_FIELDS } from "../../_components/forms";

export default function EditReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <div className="max-w-2xl">
      <Link href="/admin/reviews" className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 mb-6">
        <ArrowLeft size={16} /> Back to reviews
      </Link>
      <h1 className="font-serif text-3xl mb-6">Edit review</h1>
      <EntityForm table="reviews" id={id} returnTo="/admin/reviews" fields={REVIEW_FIELDS} />
    </div>
  );
}
