"use client";

import Image from "next/image";
import Link from "next/link";
import type { MouseEvent } from "react";
import { EditableCollection } from "@/lib/edit/EditableCollection";
import { EditableImage } from "@/lib/edit/EditableImage";
import { EditableText } from "@/lib/edit/EditableText";
import { useEditMode } from "@/lib/edit/context";
import { PostTitle } from "./PostTitle";

/**
 * The /blog card grid.
 *
 * It lives in its own client component only because EditableCollection takes a
 * render callback, which a Server Component cannot hand across the boundary.
 * The markup is exactly what the page rendered before, so a visitor gets the
 * same HTML; the page itself stays a cached Server Component and still does the
 * fetching.
 */

export type PostCard = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
};

export function PostGrid({ posts }: { posts: PostCard[] }) {
  const editing = useEditMode();
  // Gives an empty optional field enough height to aim at. Appended only in edit
  // mode so a visitor's class attributes are byte for byte what they were.
  const emptySlot = editing ? " empty:min-h-[1.25em]" : "";

  // The whole card is a <Link>, so a click on an inline editor would navigate
  // instead of editing. Overlays (image controls, delete, the counter) are
  // portaled onto <body>, so they are outside the anchor in the DOM but still
  // bubble through the React tree — hence the containment check as well as the
  // contentEditable one. Clicking the card anywhere else still opens the post.
  const guardClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!editing) return;
    const target = e.target as HTMLElement | null;
    if (!target || !e.currentTarget.contains(target) || target.closest("[contenteditable='true']")) {
      e.preventDefault();
    }
  };

  // Nothing to show and nothing to add: the visitor's copy stands. In edit mode
  // the grid renders anyway, because the add affordance lives inside it and an
  // empty blog would otherwise have no way to get its first post.
  if (posts.length === 0 && !editing) {
    return <p className="text-center text-stone-500">No posts yet. Check back soon.</p>;
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* A new post is created published, so it does not vanish from the page it
          was created on: /blog only ever renders published rows. It also gets a
          slug of its own up front, because renaming the placeholder title later
          deliberately leaves the slug alone (see PostTitle) and two posts would
          otherwise collide on the unique column. The readable URL is set on
          /admin/blog, which is where the slug is a visible field. */}
      <EditableCollection
        table="blog_posts"
        items={posts}
        newItem={{
          title: "New post",
          slug: `new-post-${Date.now().toString(36)}`,
          published: true,
          published_at: new Date().toISOString(),
        }}
        addLabel="Add post"
        itemLabel="post"
      >
        {(p) => (
          <Link key={p.id} href={`/blog/${p.slug}`} onClick={guardClick} className="group block bg-white rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
            <EditableImage table="blog_posts" field="cover_image" id={p.id}>
              {/* The frame, not the <Image>, is what gets wrapped: it is there
                  even when the post has no cover yet, so one can still be added. */}
              <div className="relative aspect-[16/10] bg-stone-100">
                {p.cover_image && <Image src={p.cover_image} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(min-width: 1024px) 30vw, 100vw" />}
              </div>
            </EditableImage>
            <div className="p-6">
              <PostTitle post={p} as="h2" className="font-serif text-2xl text-stone-900 mb-2" />
              {/* An empty excerpt renders nothing for a visitor, so edit mode
                  puts the empty paragraph back to give it something to type in. */}
              {(p.excerpt || editing) && <EditableText as="p" className={`text-stone-600 text-sm leading-relaxed${emptySlot}`} table="blog_posts" field="excerpt" id={p.id}>{p.excerpt || ""}</EditableText>}
            </div>
          </Link>
        )}
      </EditableCollection>
    </div>
  );
}
