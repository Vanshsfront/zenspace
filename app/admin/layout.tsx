import Link from "next/link";
import { SignOut } from "./SignOut";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-stone-100">
      <aside className="w-64 bg-[#1a1613] text-[#f5f1ea] p-6 space-y-1">
        <h2 className="font-serif text-2xl mb-6">Zenspace Admin</h2>
        <Link href="/admin" className="block px-3 py-2 rounded hover:bg-stone-800">Site settings</Link>
        <Link href="/admin/artists" className="block px-3 py-2 rounded hover:bg-stone-800">Artists</Link>
        <Link href="/admin/categories" className="block px-3 py-2 rounded hover:bg-stone-800">Categories</Link>
        <Link href="/admin/studio" className="block px-3 py-2 rounded hover:bg-stone-800">Studio photos</Link>
        <Link href="/admin/reviews" className="block px-3 py-2 rounded hover:bg-stone-800">Reviews</Link>
        <div className="pt-6 border-t border-stone-700 mt-6 space-y-1">
          <Link href="/" className="block px-3 py-2 text-sm text-stone-400">← View site</Link>
          <SignOut />
        </div>
      </aside>
      <div className="flex-1 p-10 overflow-auto">{children}</div>
    </div>
  );
}
