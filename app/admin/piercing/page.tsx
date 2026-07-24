"use client";
import { useState } from "react";
import { CrudList } from "../CrudList";
import { MultiImageUpload } from "../_components/MultiImageUpload";

function Gallery({ audience, label }: { audience: "kids" | "adults"; label: string }) {
  const [reloadKey, setReloadKey] = useState(0);
  return (
    <section className="mb-14">
      <h2 className="font-serif text-2xl mb-1">{label}</h2>
      <p className="text-stone-500 text-sm mb-4">
        Shown only on the <code>/piercing/{audience}</code> page. Photos here never appear on the other page.
      </p>
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">Bulk upload</h3>
        <MultiImageUpload
          table="piercing_photos"
          extraFields={{ audience }}
          onUploaded={() => setReloadKey((k) => k + 1)}
        />
      </div>
      <CrudList
        table="piercing_photos"
        title=""
        disableSearch
        reloadKey={reloadKey}
        filter={{ key: "audience", value: audience }}
        fields={[
          { key: "photo", label: "Photo", type: "image" },
          { key: "caption", label: "Caption (optional)" },
        ]}
      />
    </section>
  );
}

export default function Page() {
  return (
    <div className="max-w-5xl">
      <h1 className="font-serif text-3xl mb-2">Piercing photos</h1>
      <p className="text-stone-600 mb-8">
        Kids and adults galleries are kept completely separate. Upload each set below.
      </p>
      <Gallery audience="kids" label="Kids gallery (Little Stars)" />
      <Gallery audience="adults" label="Adults gallery" />
    </div>
  );
}
