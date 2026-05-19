"use client";
import { SettingsSection } from "../_components/SettingsSection";

export default function Page() {
  return (
    <div className="max-w-5xl">
      <h1 className="font-serif text-3xl mb-2">About page</h1>
      <p className="text-stone-600 mb-6">
        The big title, the "About Zenspace" heading and paragraphs, and the two overlapped
        photos. Photo 1 is the large back image; Photo 2 overlaps it at the bottom-right.
      </p>
      <SettingsSection
        fields={[
          { key: "about_title", label: "Page title", help: 'The large heading, e.g. "Workspace where we create magic".' },
          { key: "about_heading", label: 'Section heading (above the paragraphs)', help: 'e.g. "About Zenspace".' },
          { key: "about_body", label: "Paragraphs", type: "textarea", help: "Separate paragraphs with a blank line." },
          { key: "about_photo_1", label: "Photo 1 (large, back)", type: "image" },
          { key: "about_photo_2", label: "Photo 2 (overlapping, front)", type: "image" },
        ]}
      />
    </div>
  );
}
