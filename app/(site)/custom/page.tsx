import { CustomRequestForm } from "@/components/CustomRequestForm";
import { Sparkles } from "lucide-react";

export const metadata = { title: "Custom Design Request | Zenspace" };

export default function CustomDesignPage() {
  return (
    <div className="bg-paper-texture min-h-screen pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-stone-200/40 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900 text-stone-50 text-xs uppercase tracking-widest mb-6">
            <Sparkles size={14} /> Custom Work
          </span>
          <h1 className="font-serif text-5xl md:text-6xl mb-6 text-stone-900 tracking-tight">Request a custom design</h1>
          <p className="text-lg text-stone-600 leading-relaxed">
            Tell us what you have in mind. Share your idea, references and any meaning behind it, and our artists will get back to you.
          </p>
        </div>
        <CustomRequestForm />
      </div>
    </div>
  );
}
