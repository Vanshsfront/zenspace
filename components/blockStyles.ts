/**
 * The class names for each rich-text block.
 *
 * They live in their own module because the reading path and the editing path
 * are in separate chunks (see components/BlockRenderer.tsx) and both have to
 * render a block identically. Importing them from one another would put the
 * editor in the visitor's bundle, which is the whole thing the split avoids.
 */
export const H2_CLASS = "font-serif text-3xl mt-10 mb-4 text-stone-900";
export const H3_CLASS = "font-serif text-2xl mt-8 mb-3 text-stone-900";
export const P_CLASS = "text-lg text-stone-700 leading-relaxed mb-5 whitespace-pre-wrap";
export const CAPTION_CLASS = "mt-2 text-sm text-stone-500 text-center";
