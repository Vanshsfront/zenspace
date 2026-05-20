"use client";
import { use, useEffect, useState } from "react";

type Sub = { id: string; form_id: string; payload: Record<string, unknown>; status: string; created_at: string };

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [s, setS] = useState<Sub | null>(null);

  useEffect(() => {
    (async () => {
      const r = await fetch(`/api/admin/service_form_submissions/${id}`);
      if (r.ok) setS(await r.json());
    })();
  }, [id]);

  async function setStatus(next: string) {
    if (!s) return;
    await fetch(`/api/admin/service_form_submissions/${id}`, { method: "PATCH", body: JSON.stringify({ status: next }), headers: { "content-type": "application/json" } });
    setS({ ...s, status: next });
  }

  if (!s) return <p className="text-stone-500">Loading…</p>;
  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <p className="text-xs text-stone-500 uppercase">Received</p>
        <p className="text-sm">{new Date(s.created_at).toLocaleString()}</p>
      </div>
      <div>
        <p className="text-xs text-stone-500 uppercase mb-2">Payload</p>
        <dl className="text-sm space-y-2">
          {Object.entries(s.payload).map(([k, v]) => (
            <div key={k} className="grid grid-cols-3 gap-2">
              <dt className="text-stone-500 font-mono">{k}</dt>
              <dd className="col-span-2">
                {typeof v === "string" && (v.startsWith("http://") || v.startsWith("https://"))
                  ? <a href={v} target="_blank" rel="noopener noreferrer" className="underline">{v}</a>
                  : String(v ?? "—")}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setStatus("read")} className="px-3 py-1.5 rounded-md border border-stone-300 text-sm">Mark read</button>
        <button onClick={() => setStatus("done")} className="px-3 py-1.5 rounded-md border border-stone-300 text-sm">Mark done</button>
        <span className="text-xs text-stone-500 self-center">current: {s.status}</span>
      </div>
    </div>
  );
}
