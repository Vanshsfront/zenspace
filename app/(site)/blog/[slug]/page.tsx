import { notFound } from "next/navigation";
import { getBlogPost } from "@/lib/data";
import type { Block } from "@/lib/blocks";
import { PostContent } from "./PostContent";

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
      <PostContent
        post={{ id: post.id, slug: post.slug, title: post.title, cover_image: post.cover_image }}
        blocks={blocks}
      />
    </article>
  );
}
