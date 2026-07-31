"use client";
import { SettingsSection } from "./_components/SettingsSection";

/**
 * Home page only. Contact details, social links, Google reviews and the admin
 * password moved to /admin/site-wide so each screen maps to one part of the
 * site rather than mixing page content with global settings.
 */
export default function HomePageAdmin() {
  return (
    <div className="max-w-5xl">
      <h1 className="font-serif text-3xl mb-2">Home page</h1>
      <p className="text-stone-600 mb-6 text-sm">
        Everything on <code>/</code>, top to bottom. Contact details and social links live under
        <strong> Site-wide</strong> in the sidebar; the photo carousel and videos have their own
        sections.
      </p>
      <SettingsSection
        fields={[
          { key: "hero_title", label: "Hero title", heading: "1. Hero (top of the page)" },
          { key: "hero_subtitle", label: "Hero subtitle", help: "The italic second line." },
          { key: "hero_description", label: "Hero description", type: "textarea" },
          {
            key: "hero_image",
            label: "Hero photo (large image, right-hand side)",
            type: "image",
            help: "Home → hero. Also used as the first frame if you upload a hero video.",
          },
          {
            key: "hero_video",
            label: "Hero video (optional)",
            type: "video",
            help: "Home → hero. Plays muted and looping in place of the hero photo. Leave empty to show the photo.",
          },
          {
            key: "home_piercing_kids_image",
            label: "Kids card photo — “For Little Stars” (round image)",
            type: "image",
            heading: "2. “Choose Your Piercing Experience” cards",
          },
          {
            key: "home_piercing_adults_image",
            label: "Adults card photo — “For everyone” (round image)",
            type: "image",
          },
          { key: "cta_title", label: "Closing CTA title", heading: "3. Closing CTA (dark box at the bottom)" },
          { key: "cta_subtitle", label: "Closing CTA subtitle", type: "textarea" },
        ]}
      />
    </div>
  );
}
