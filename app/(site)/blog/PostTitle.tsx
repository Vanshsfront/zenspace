"use client";

import type { ElementType } from "react";
import { InlineEditable } from "@/components/InlineEditable";
import { useEditMode } from "@/lib/edit/context";
import { fieldMeta } from "@/lib/edit/fields";
import { useRowPatch } from "@/lib/edit/useSave";

/** The columns a title edit needs. Deliberately not the whole row: a blog post
 *  carries its entire body in `blocks`, which no title editor has any use for. */
export type PostRef = { id: string; slug: string; title: string };

/**
 * A blog post's title, saved together with its slug.
 *
 * The write API derives blog_posts.slug from the title whenever the request
 * body leaves the slug out, and it does so on PATCH as well as on POST
 * (normalizeBody in app/api/admin/[table]/route.ts). A plain EditableText sends
 * { id, title }, so every rename would quietly move the post to a new URL,
 * break every link to it and 404 the page the owner is standing on. Echoing the
 * current slug back freezes it. Changing a URL stays a deliberate act on
 * /admin/blog, which is the only surface where the slug is a visible field.
 */
export function PostTitle({
  post,
  as: As,
  className,
}: {
  post: PostRef;
  as: ElementType;
  className: string;
}) {
  const editing = useEditMode();
  const patch = useRowPatch();

  if (!editing) return <As className={className}>{post.title}</As>;

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
