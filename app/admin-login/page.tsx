"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/admin/login", { method: "POST", body: JSON.stringify({ password: pw }) });
    if (r.ok) router.push("/admin");
    else setErr("Wrong password");
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper-texture">
      <form onSubmit={submit} className="bg-white p-8 rounded-2xl w-full max-w-sm shadow-xl space-y-4">
        <h1 className="font-serif text-3xl">Admin login</h1>
        <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Password" className="w-full px-4 py-3 rounded-lg border" />
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button className="w-full py-3 rounded-full bg-[#1a1613] text-white">Sign in</button>
        <p className="text-xs text-stone-500 text-center">Default password: zenspace2026 (set ADMIN_PASSWORD env to override)</p>
      </form>
    </div>
  );
}
