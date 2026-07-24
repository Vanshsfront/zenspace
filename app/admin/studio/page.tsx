"use client";
import { useState } from "react";
import { CrudList } from "../CrudList";
import { MultiImageUpload } from "../_components/MultiImageUpload";

export default function Page() {
  const [reloadKey, setReloadKey] = useState(0);
  return (
    <div className="max-w-5xl">
      <h1 className="font-serif text-3xl mb-2">Home → ‘A place where we create your story’</h1>
      <p className="text-stone-600 mb-6">Photos that scroll in the home-page "A place where we create your story" carousel.</p>

      <div className="mb-8">
        <h2 className="font-serif text-xl mb-3">Bulk upload</h2>
        <MultiImageUpload table="studio_photos" onUploaded={() => setReloadKey((k) => k + 1)} />
      </div>

      <h2 className="font-serif text-xl mb-3">Edit existing</h2>
      <CrudList
        table="studio_photos"
        title=""
        disableSearch
        reloadKey={reloadKey}
        fields={[
          { key: "photo", label: "Photo", type: "image" },
          { key: "caption", label: "Caption" },
        ]}
      />
    </div>
  );
}
