"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EntityForm } from "../../_components/EntityForm";
import { REVIEW_FIELDS } from "../../_components/forms";

export default function NewReviewPage() {
  return (
    <div className="max-w-2xl">
      <Link href="/admin/reviews" className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 mb-6">
        <ArrowLeft size={16} /> Back to reviews
      </Link>
      <h1 className="font-serif text-3xl mb-6">New review</h1>
      <EntityForm table="reviews" returnTo="/admin/reviews" fields={REVIEW_FIELDS} defaults={{ rating: 5 }} />
    </div>
  );
}
