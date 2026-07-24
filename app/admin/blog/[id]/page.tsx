"use client";
import { use, useEffect, useState } from "react";
import { BlogForm } from "../BlogForm";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<any | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      const r = await fetch(`/api/admin/blog_posts/${id}`, { cache: "no-store" });
      if (!r.ok) { setNotFound(true); return; }
      setPost(await r.json());
    })();
  }, [id]);

  if (notFound) return <p className="text-stone-500">Post not found.</p>;
  if (!post) return <p className="text-stone-500">Loading…</p>;
  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-3xl mb-6">Edit blog post</h1>
      <BlogForm initial={{
        id: post.id,
        title: post.title ?? "",
        slug: post.slug ?? "",
        excerpt: post.excerpt ?? "",
        cover_image: post.cover_image ?? "",
        published: !!post.published,
        published_at: post.published_at ? String(post.published_at).slice(0, 10) : "",
        blocks: Array.isArray(post.blocks) ? post.blocks : [],
      }} />
    </div>
  );
}
