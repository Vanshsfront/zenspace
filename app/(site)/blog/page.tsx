import Image from "next/image";
import Link from "next/link";
import { getBlogPosts } from "@/lib/data";

export const revalidate = 3600;
export const metadata = { title: "Blog | Zenspace" };

export default async function BlogPage() {
  const posts = await getBlogPosts();
  return (
    <div className="bg-paper-texture min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-serif text-5xl md:text-7xl text-stone-900 tracking-tight text-center mb-16">Journal</h1>
        {posts.length === 0 ? (
          <p className="text-center text-stone-500">No posts yet. Check back soon.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`} className="group block bg-white rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                <div className="relative aspect-[16/10] bg-stone-100">
                  {p.cover_image && <Image src={p.cover_image} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(min-width: 1024px) 30vw, 100vw" />}
                </div>
                <div className="p-6">
                  <h2 className="font-serif text-2xl text-stone-900 mb-2">{p.title}</h2>
                  {p.excerpt && <p className="text-stone-600 text-sm leading-relaxed">{p.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
