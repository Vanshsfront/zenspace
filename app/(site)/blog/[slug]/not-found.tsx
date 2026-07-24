import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-paper-texture min-h-screen pt-40 pb-24 px-6 text-center">
      <h1 className="font-serif text-4xl text-stone-900 mb-4">Post not found</h1>
      <Link href="/blog" className="text-stone-600 underline">Back to the journal</Link>
    </div>
  );
}
