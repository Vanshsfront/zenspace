"use client";
import { CrudList } from "../CrudList";

export default function Page() {
  return (
    <div className="max-w-5xl">
      <h1 className="font-serif text-3xl mb-2">Home → ‘Watch us at work’</h1>
      <p className="text-stone-600 mb-6">
        Vertical (9:16) clips shown in the home-page "Watch us at work" strip. They autoplay
        muted when scrolled into view. Add a poster image for a clean first frame.
      </p>
      <CrudList
        table="short_videos"
        title=""
        disableSearch
        fields={[
          { key: "video", label: "Video file (mp4, vertical 9:16)", type: "video" },
          { key: "poster", label: "Poster image (optional)", type: "image" },
          { key: "caption", label: "Caption (optional)" },
        ]}
      />
    </div>
  );
}
