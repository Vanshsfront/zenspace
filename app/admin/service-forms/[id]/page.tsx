"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { EntityForm } from "../../_components/EntityForm";
import { SERVICE_FORM_FIELDS } from "../../_components/forms";

type Field = { id: string; form_id: string; key: string; label: string; type: string; required: boolean; options: string[]; sort_order: number | null };

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const r = await fetch(`/api/admin/service_form_fields`, { cache: "no-store" });
    const arr: Field[] = await r.json().catch(() => []);
    setFields(arr.filter((f) => f.form_id === id).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)));
    setLoading(false);
  }

  useEffect(() => { load(); }, [id]);

  async function del(fid: string) {
    if (!confirm("Delete this field?")) return;
    await fetch(`/api/admin/service_form_fields`, {
      method: "DELETE",
      body: JSON.stringify({ id: fid }),
      headers: { "content-type": "application/json" },
    });
    load();
  }

  return (
    <div className="space-y-10">
      <EntityForm
        table="service_forms"
        id={id}
        fields={SERVICE_FORM_FIELDS}
        returnTo="/admin/service-forms"
      />

      <div>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="font-serif text-xl text-stone-700">Form fields</h2>
          <Link href={`/admin/service-forms/${id}/fields/new`} className="text-sm px-3 py-1.5 rounded-md border border-stone-300 hover:bg-stone-50">+ Add field</Link>
        </div>
        {loading ? <p className="text-stone-500 text-sm">Loading…</p> : fields.length === 0 ? (
          <p className="text-stone-500 text-sm italic">No fields yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="text-xs text-stone-400 uppercase"><th className="text-left py-2">Sort</th><th className="text-left">Label</th><th className="text-left">Key</th><th className="text-left">Type</th><th className="text-left">Required</th><th></th></tr></thead>
            <tbody>
              {fields.map((f) => (
                <tr key={f.id} className="border-t border-stone-100">
                  <td className="py-2 tabular-nums text-stone-500">{f.sort_order ?? 0}</td>
                  <td>{f.label}</td>
                  <td className="font-mono text-xs text-stone-500">{f.key}</td>
                  <td>{f.type}</td>
                  <td>{f.required ? "yes" : "—"}</td>
                  <td className="text-right">
                    <Link href={`/admin/service-forms/${id}/fields/${f.id}`} className="text-stone-500 hover:text-stone-900 mr-3">Edit</Link>
                    <button className="text-rose-500 hover:text-rose-700" onClick={() => del(f.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
