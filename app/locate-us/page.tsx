import { getSiteSettings } from "@/lib/data";

export const metadata = { title: "Locate Us — Zenspace" };

export default async function LocatePage() {
  const s = await getSiteSettings();
  const q = encodeURIComponent(s?.address || "Akruti Commercial Complex MIDC Andheri East Mumbai");
  return (
    <div className="bg-paper-texture min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h1 className="font-serif text-5xl mb-4">Locate us</h1>
        <p className="text-stone-700 mb-8 max-w-2xl">{s?.address}</p>
        <div className="aspect-video rounded-2xl overflow-hidden shadow-xl">
          <iframe
            src={`https://maps.google.com/maps?q=${q}&output=embed`}
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
