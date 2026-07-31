import { getBlogPosts } from "@/lib/data";
import { PostGrid } from "./PostGrid";

export const revalidate = 3600;
export const metadata = { title: "Blog | Zenspace" };

export default async function BlogPage() {
  const posts = await getBlogPosts();
  return (
    <div className="bg-paper-texture min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-serif text-5xl md:text-7xl text-stone-900 tracking-tight text-center mb-16">Journal</h1>
        {/* Only the card's own columns cross into the client component. A row
            also carries the post's entire `blocks` body, which the list has no
            use for and which would double the size of this page's payload. */}
        <PostGrid
          posts={posts.map((p) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            excerpt: p.excerpt,
            cover_image: p.cover_image,
          }))}
        />
      </div>
    </div>
  );
}
