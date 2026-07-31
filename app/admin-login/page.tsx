"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Where to go after signing in.
 *
 * Read off window.location rather than useSearchParams so this page keeps
 * prerendering without a Suspense boundary. Only a same-origin absolute path is
 * accepted: anything starting "//" is protocol-relative and would send the admin
 * to another host, which is an open redirect on a login form.
 */
function nextPath(): string {
  if (typeof window === "undefined") return "/admin";
  const raw = new URLSearchParams(window.location.search).get("next");
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/admin";
  return raw;
}

export default function LoginPage() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/admin/login", { method: "POST", body: JSON.stringify({ password: pw }) });
    // Returns to the page that was being edited, ?edit=1 and all, so a session
    // expiring mid-edit does not also cost the admin their place.
    if (r.ok) router.push(nextPath());
    else setErr("Wrong password");
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper-texture">
      <form onSubmit={submit} className="bg-white p-8 rounded-2xl w-full max-w-sm shadow-xl space-y-4">
        <h1 className="font-serif text-3xl">Admin login</h1>
        <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Password" className="w-full px-4 py-3 rounded-lg border" />
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button className="w-full py-3 rounded-full bg-[#1a1613] text-white">Sign in</button>
      </form>
    </div>
  );
}
