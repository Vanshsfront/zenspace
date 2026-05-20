"use client";

import { useEffect, useState } from "react";
import type { ServiceFormRow, ServiceFormFieldRow } from "@/lib/data";

type Props = {
  form: ServiceFormRow;
  open: boolean;
  onClose: () => void;
};

export function ServiceFormModal({ form, open, onClose }: Props) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) { setValues({}); setDone(false); setError(null); setSubmitting(false); }
  }, [open]);

  if (!open) return null;

  async function uploadFile(file: File): Promise<string | null> {
    const fd = new FormData();
    fd.append("file", file);
    const r = await fetch("/api/service-forms/upload", { method: "POST", body: fd });
    if (!r.ok) return null;
    const j = await r.json();
    return j.url as string;
  }

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = {};
      for (const f of form.fields) {
        const v = values[f.key];
        payload[f.key] = v ?? null;
      }
      const r = await fetch(`/api/service-forms/${form.slug}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) { setError(j.error ?? "Submission failed"); return; }
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-[2rem] max-w-lg w-full max-h-[90vh] overflow-y-auto p-7 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="float-right text-stone-400 hover:text-stone-700">✕</button>
        <h3 className="font-serif text-2xl text-stone-900 mb-1">{form.title}</h3>
        {form.intro && <p className="text-stone-500 text-sm mb-5">{form.intro}</p>}

        {done ? (
          <div className="py-6 text-center">
            <p className="text-stone-900 font-medium text-lg">Thanks — we'll be in touch.</p>
            <button onClick={onClose} className="mt-5 px-4 py-2 rounded-full bg-stone-900 text-white text-sm">Close</button>
          </div>
        ) : (
          <div className="space-y-4">
            {form.fields.map((f) => (
              <Field key={f.id} f={f} value={values[f.key] ?? ""} onChange={(v) => setValues((s) => ({ ...s, [f.key]: v }))} uploadFile={uploadFile} />
            ))}
            {error && <p className="text-rose-600 text-sm">{error}</p>}
            <button
              disabled={submitting}
              onClick={submit}
              className="w-full mt-2 px-4 py-3 rounded-full bg-stone-900 text-white font-medium disabled:opacity-60"
            >
              {submitting ? "Sending…" : "Send"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ f, value, onChange, uploadFile }: { f: ServiceFormFieldRow; value: string; onChange: (v: string) => void; uploadFile: (file: File) => Promise<string | null> }) {
  const label = (
    <label className="text-xs uppercase tracking-wide text-stone-500 block mb-1">
      {f.label} {f.required && <span className="text-rose-500">*</span>}
    </label>
  );
  const base = "w-full border border-stone-200 rounded-xl px-3 py-2 text-sm bg-white";
  if (f.type === "textarea") {
    return (
      <div>{label}<textarea className={base} rows={4} value={value} onChange={(e) => onChange(e.target.value)} required={f.required} /></div>
    );
  }
  if (f.type === "select") {
    return (
      <div>{label}
        <select className={base} value={value} onChange={(e) => onChange(e.target.value)} required={f.required}>
          <option value="">Select…</option>
          {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    );
  }
  if (f.type === "file") {
    return (
      <div>{label}
        <input
          type="file"
          accept="image/*,application/pdf"
          className="text-sm"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const url = await uploadFile(file);
            if (url) onChange(url);
          }}
          required={f.required && !value}
        />
        {value && <p className="text-xs text-stone-500 mt-1 truncate">Uploaded: {value}</p>}
      </div>
    );
  }
  const type = f.type === "tel" || f.type === "email" || f.type === "date" ? f.type : "text";
  return (
    <div>{label}
      <input type={type} className={base} value={value} onChange={(e) => onChange(e.target.value)} required={f.required} />
    </div>
  );
}
