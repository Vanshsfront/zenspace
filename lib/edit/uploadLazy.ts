/**
 * Defers the Supabase browser SDK out of the visitor bundle.
 *
 * lib/uploadMedia.ts pulls in lib/supabase/client -> @supabase/ssr, roughly
 * 228 KB of JavaScript. Any module a visitor loads that imports it statically
 * drags the whole SDK into the shared client chunk, which is how the home page
 * and /privacy ended up shipping it to people who will never upload anything.
 *
 * Importing it inside the call instead puts the SDK in its own async chunk that
 * is fetched the first time an admin actually picks a file. Use this anywhere
 * an upload is triggered from a module that is also on the visitor path.
 */
export async function uploadMediaLazy(file: File): Promise<string> {
  const { uploadMedia } = await import("@/lib/uploadMedia");
  return uploadMedia(file);
}
