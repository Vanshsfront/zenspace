"use client";

import Image from "next/image";
import type { Block } from "@/lib/blocks";
import { BlockRenderer } from "@/components/BlockRenderer";
import { EditableImage } from "@/lib/edit/EditableImage";
import { useEditMode } from "@/lib/edit/context";
import { PostTitle, type PostRef } from "../PostTitle";

/**
 * The body of /blog/<slug>.
 *
 * Split out of page.tsx only so it can ask whether edit mode is on: a post with
 * no cover renders no image frame at all, which would leave the admin nothing to
 * click in order to add one. The page itself stays a cached server component.
 */
export function PostContent({
  post,
  blocks,
}: {
  post: PostRef & { cover_image: string | null };
  blocks: Block[];
}) {
  const editing = useEditMode();

  return (
    <div className="max-w-3xl mx-auto">
      <PostTitle post={post} as="h1" className="font-serif text-4xl md:text-6xl text-stone-900 tracking-tight mb-6 text-center" />
      {(post.cover_image || editing) && (
        <EditableImage table="blog_posts" field="cover_image" id={post.id}>
          <div className="relative aspect-[16/9] rounded-[2rem] overflow-hidden bg-stone-100 mb-12">
            {post.cover_image && <Image src={post.cover_image} alt={post.title} fill className="object-cover" priority sizes="(min-width: 768px) 768px, 100vw" />}
          </div>
        </EditableImage>
      )}
      <BlockRenderer blocks={blocks} owner={{ table: "blog_posts", id: post.id }} />
    </div>
  );
}
