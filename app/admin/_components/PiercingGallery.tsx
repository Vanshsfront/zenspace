"use client";
import { useState } from "react";
import { CrudList } from "../CrudList";
import { MultiImageUpload } from "./MultiImageUpload";

/**
 * One audience's piercing gallery. Kids and adults each get their own admin
 * screen so a photo can never be uploaded to the wrong page by accident — the
 * audience is stamped from the route, not picked from a dropdown.
 */
export function PiercingGallery({ audience }: { audience: "kids" | "adults" }) {
  const [reloadKey, setReloadKey] = useState(0);
  return (
    <>
      <div className="mb-8">
        <h2 className="font-serif text-xl mb-1">Bulk upload</h2>
        <p className="text-stone-500 text-sm mb-3">
          Every photo added here is tagged <code>{audience}</code> and appears only on{" "}
          <code>/piercing/{audience}</code>.
        </p>
        <MultiImageUpload
          table="piercing_photos"
          extraFields={{ audience }}
          onUploaded={() => setReloadKey((k) => k + 1)}
        />
      </div>

      <h2 className="font-serif text-xl mb-3">Edit existing</h2>
      <CrudList
        table="piercing_photos"
        title=""
        disableSearch
        reloadKey={reloadKey}
        // Also stamps `audience` on rows added via "Add new", so nothing here
        // can land on the other audience's page.
        filter={{ key: "audience", value: audience }}
        fields={[
          { key: "photo", label: "Photo", type: "image" },
          { key: "caption", label: "Caption (optional)" },
        ]}
      />
    </>
  );
}
