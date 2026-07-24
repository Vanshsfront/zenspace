import { createClient } from "@/lib/supabase/client";

/**
 * Uploads a file directly to Supabase Storage via a server-signed URL and
 * returns its public URL. Used by every admin uploader so large photos and
 * videos no longer hit the serverless request-body cap.
 */
export async function uploadMedia(file: File): Promise<string> {
  const r = await fetch("/api/admin/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file.name }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.token || !j.path) {
    throw new Error(j.error || "Could not start upload");
  }
  const supabase = createClient();
  const { error } = await supabase.storage
    .from("media")
    .uploadToSignedUrl(j.path, j.token, file, { contentType: file.type || undefined });
  if (error) throw new Error(error.message);
  return j.publicUrl as string;
}
