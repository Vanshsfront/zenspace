import Image from "next/image";
import { notFound } from "next/navigation";
import { getBlogPost } from "@/lib/data";
import { BlockRenderer } from "@/components/BlockRenderer";
import type { Block } from "@/lib/blocks";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  return { title: post ? `${post.title} | Zenspace` : "Blog | Zenspace" };
}

export default async function BlogDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();
  const blocks = (Array.isArray(post.blocks) ? post.blocks : []) as Block[];
  return (
    <article className="bg-paper-texture min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-4xl md:text-6xl text-stone-900 tracking-tight mb-6 text-center">{post.title}</h1>
        {post.cover_image && (
          <div className="relative aspect-[16/9] rounded-[2rem] overflow-hidden bg-stone-100 mb-12">
            <Image src={post.cover_image} alt={post.title} fill className="object-cover" priority sizes="(min-width: 768px) 768px, 100vw" />
          </div>
        )}
        <BlockRenderer blocks={blocks} />
      </div>
    </article>
  );
}
