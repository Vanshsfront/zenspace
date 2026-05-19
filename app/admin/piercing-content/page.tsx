"use client";
import { CrudList } from "../CrudList";
import { SettingsSection } from "../_components/SettingsSection";

export default function Page() {
  return (
    <div className="max-w-5xl space-y-12">
      <div>
        <h1 className="font-serif text-3xl mb-2">Piercing — Kids & Adults</h1>
        <p className="text-stone-600 mb-6">
          Copy for the two piercing pages plus the aftercare PDF shown on both.
        </p>
        <SettingsSection
          fields={[
            { key: "piercing_kids_title", label: "Kids page — title" },
            { key: "piercing_kids_intro", label: "Kids page — intro", type: "textarea" },
            { key: "piercing_adults_title", label: "Adults page — title" },
            { key: "piercing_adults_intro", label: "Adults page — intro", type: "textarea" },
            { key: "aftercare_pdf", label: "Aftercare guide (PDF)", type: "pdf", help: "Shown as a download button on both piercing pages." },
          ]}
        />
      </div>

      <div>
        <h2 className="font-serif text-2xl mb-2">Earring options</h2>
        <p className="text-stone-600 mb-4">
          The three metals shown on each piercing page. Pick the audience for each row —
          Kids benefits should emphasise hypoallergenic, child-safe materials.
        </p>
        <CrudList
          table="earring_options"
          title=""
          disableSearch
          fields={[
            {
              key: "audience",
              label: "Audience",
              type: "select",
              options: [
                { value: "kids", label: "Kids" },
                { value: "adults", label: "Adults" },
              ],
            },
            { key: "metal", label: "Metal (e.g. Stainless Steel, Gold, Silver)" },
            { key: "photo", label: "Photo", type: "image" },
            { key: "benefits", label: "Benefits / description", type: "textarea" },
          ]}
        />
      </div>
    </div>
  );
}
