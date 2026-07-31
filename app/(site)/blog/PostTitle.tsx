"use client";

import { Suspense, lazy, type ElementType } from "react";
import { useEditMode } from "@/lib/edit/context";

/** The columns a title edit needs. Deliberately not the whole row: a blog post
 *  carries its entire body in `blocks`, which no title editor has any use for. */
export type PostRef = { id: string; slug: string; title: string };

/**
 * A blog post's title, editable in place.
 *
 * This module renders on the prerendered /blog list, so it holds nothing but
 * the reading path. Everything the write needs, including the registry and
 * InlineEditable, lives in PostTitleLive behind the lazy() below: importing any
 * of it here shipped the editor's mutation layer to every visitor.
 */
const PostTitleLive = lazy(() => import("./PostTitleLive"));

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

  if (!editing) return <As className={className}>{post.title}</As>;

  return (
    <Suspense fallback={<As className={className}>{post.title}</As>}>
      <PostTitleLive post={post} as={As} className={className} />
    </Suspense>
  );
}
