"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2 } from "lucide-react";

export function CustomRequestForm() {
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      const r = await fetch("/api/custom-request", { method: "POST", body: fd });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        setError(j.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/80 backdrop-blur-md border border-stone-200/60 rounded-[2rem] p-10 text-center shadow-xl"
      >
        <CheckCircle2 size={48} className="mx-auto text-green-600 mb-4" />
        <h2 className="font-serif text-3xl text-stone-900 mb-2">Request received</h2>
        <p className="text-stone-600">Thank you. Our team will reach out to you shortly.</p>
      </motion.div>
    );
  }

  const inputCls = "w-full mt-1 px-4 py-3 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-stone-400";

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white/80 backdrop-blur-md border border-stone-200/60 rounded-[2rem] p-8 md:p-10 shadow-xl space-y-5"
    >
      <label className="block">
        <span className="text-sm font-medium text-stone-800">Name *</span>
        <input name="name" required className={inputCls} />
      </label>
      <div className="grid sm:grid-cols-2 gap-5">
        <label className="block">
          <span className="text-sm font-medium text-stone-800">Phone *</span>
          <input name="phone" required className={inputCls} />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-stone-800">Email</span>
          <input name="email" type="email" className={inputCls} />
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-medium text-stone-800">Describe your idea *</span>
        <textarea name="description" required rows={5} className={inputCls} placeholder="Style, placement, size, references, any meaning behind it…" />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-stone-800">Reference image (optional)</span>
        <input name="reference" type="file" accept="image/*" className="w-full mt-1 text-sm text-stone-600 file:mr-3 file:px-4 file:py-2 file:rounded-full file:border-0 file:bg-stone-200 file:text-stone-800 file:cursor-pointer" />
      </label>

      {status === "error" && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={status === "saving"}
        className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-stone-900 text-stone-50 font-medium hover:bg-stone-800 transition-all disabled:opacity-60"
      >
        <Send size={18} /> {status === "saving" ? "Sending…" : "Send request"}
      </button>
    </form>
  );
}
