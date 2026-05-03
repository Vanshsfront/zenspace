"use client";
import { useState } from "react";
import { CrudList } from "../CrudList";
import { MultiImageUpload } from "../_components/MultiImageUpload";

export default function Page() {
  const [reloadKey, setReloadKey] = useState(0);
  return (
    <div className="max-w-5xl">
      <h1 className="font-serif text-3xl mb-2">Piercing photos</h1>
      <p className="text-stone-600 mb-6">Photos shown on the public /piercing page. Include both adult and baby piercings.</p>

      <div className="mb-8">
        <h2 className="font-serif text-xl mb-3">Bulk upload</h2>
        <MultiImageUpload table="piercing_photos" onUploaded={() => setReloadKey((k) => k + 1)} />
      </div>

      <h2 className="font-serif text-xl mb-3">Edit existing</h2>
      <CrudList
        table="piercing_photos"
        title=""
        disableSearch
        reloadKey={reloadKey}
        fields={[
          { key: "photo", label: "Photo", type: "image" },
          { key: "caption", label: "Caption (optional — e.g. 'baby ear, healed')" },
        ]}
      />
    </div>
  );
}
