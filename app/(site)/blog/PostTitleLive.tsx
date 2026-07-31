"use client";

import type { ElementType } from "react";
import { InlineEditable } from "@/components/InlineEditable";
import { fieldMeta } from "@/lib/edit/fields";
import { useRowPatch } from "@/lib/edit/useSave";
import type { PostRef } from "./PostTitle";

/**
 * The editing half of PostTitle, split out so /blog visitors stop downloading
 * it. PostTitle renders on the prerendered list page, so importing the write
 * path at module level put the whole mutation layer, the registry and
 * InlineEditable into a chunk every visitor loads.
 *
 * The write sends the slug back unchanged on purpose. The API only derives a
 * slug from the title on create, but blog_posts.slug is a real editable column
 * on /admin/blog, and echoing the current value keeps a rename here from
 * touching the URL at all. Changing a post's URL stays a deliberate act on the
 * admin form, which is the only surface that shows the slug as a field.
 */
export default function PostTitleLive({
  post,
  as: As,
  className,
}: {
  post: PostRef;
  as: ElementType;
  className: string;
}) {
  const patch = useRowPatch();
  const meta = fieldMeta("blog_posts", "title");

  return (
    <InlineEditable
      as={As}
      className={className}
      value={post.title}
      max={meta?.max ?? 0}
      label={meta?.label ?? "Post title"}
      onCommit={(title) =>
        patch({
          table: "blog_posts",
          id: post.id,
          values: { title, slug: post.slug },
          previous: { title: post.title, slug: post.slug },
          undoMessage: `${meta?.label ?? "Post title"} updated`,
        })
      }
    />
  );
}
