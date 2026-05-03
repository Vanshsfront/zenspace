import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-paper-texture min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <h1 className="font-serif text-5xl md:text-6xl mb-4 text-stone-900">Category not found</h1>
        <p className="text-stone-600 mb-8">
          The category you're looking for doesn't exist yet — it may have been renamed or removed.
        </p>
        <Link
          href="/category"
          className="inline-block px-6 py-3 rounded-full bg-stone-900 text-stone-50 hover:bg-stone-800 transition-colors"
        >
          See all categories
        </Link>
      </div>
    </div>
  );
}
