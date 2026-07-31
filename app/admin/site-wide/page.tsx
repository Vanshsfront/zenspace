"use client";
import { useState } from "react";
import { SettingsSection } from "../_components/SettingsSection";
import { useToast } from "../_components/Toast";

/**
 * Settings that are not tied to one page: contact details, social links, the
 * Google-reviews badge and the admin password. The password lives in its own
 * table behind its own endpoint, so it gets its own card and Save button.
 */
export default function SiteWideAdmin() {
  return (
    <div className="max-w-5xl">
      <h1 className="font-serif text-3xl mb-2">Site-wide</h1>
      <p className="text-stone-600 mb-6 text-sm">
        Details that appear across the whole site — the footer, the contact page, the WhatsApp
        button and the review badge.
      </p>

      <SettingsSection
        fields={[
          {
            key: "address",
            label: "Address",
            type: "textarea",
            help: "Shown in the footer and on the contact page map.",
            heading: "Contact",
          },
          { key: "email", label: "Email", help: "Footer and contact page." },
          { key: "phone", label: "Phone", help: "Footer and contact page. Separate two numbers with a “/”." },
          {
            key: "whatsapp",
            label: "WhatsApp number",
            help: "Drives every WhatsApp button on the site, including the home page and the floating button. Use international format with country code, no “+”, spaces or dashes — e.g. 917208388209",
          },
          { key: "instagram", label: "Instagram URL", heading: "Social" },
          { key: "facebook", label: "Facebook URL" },
          { key: "pinterest", label: "Pinterest URL" },
          {
            key: "google_review_count",
            label: "Number of reviews",
            help: "Whole number, e.g. 193. Shown in the “Rated highly by …” heading on the home page and the badge on the contact page.",
            heading: "Google reviews",
          },
          {
            key: "google_reviews_url",
            label: "Google reviews link",
            help: "Tapping the badge on the contact page opens this URL.",
          },
        ]}
      />

      <PasswordCard />
    </div>
  );
}

function PasswordCard() {
  const toast = useToast();
  const [user, setUser] = useState("");
  const [pw, setPw] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!pw.trim() && !user.trim()) {
      toast.push("error", "Enter a new username or password first");
      return;
    }
    setSaving(true);
    // Blank fields are left out entirely, so changing one does not blank the
    // other. The endpoint treats a missing key as "leave this alone".
    const body: Record<string, string> = {};
    if (user.trim()) body.username = user.trim();
    if (pw.trim()) body.password = pw.trim();
    const r = await fetch("/api/admin/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      toast.push("error", j.error || "Could not update the login");
      return;
    }
    setUser("");
    setPw("");
    toast.push("success", "Login updated — it applies at your next sign-in");
  }

  return (
    <div className="max-w-3xl mt-12 pt-8 border-t">
      <h2 className="font-serif text-xl text-stone-700 mb-4">Admin login</h2>
      <p className="text-xs text-stone-500 mb-4">
        Write-only: neither current value is shown here. Fill in only what you want to change and
        leave the other blank. Changes take effect at your next sign-in.
      </p>
      <label className="block">
        <span className="text-sm font-medium">New username</span>
        <input
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          placeholder="Leave blank to keep the current one"
          className="w-full mt-1 px-3 py-2 rounded-lg border bg-white"
        />
      </label>
      <label className="block mt-4">
        <span className="text-sm font-medium">New password</span>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          autoComplete="new-password"
          placeholder="Leave blank to keep the current one"
          className="w-full mt-1 px-3 py-2 rounded-lg border bg-white"
        />
      </label>
      <button
        onClick={save}
        disabled={saving}
        className="mt-4 px-6 py-2.5 rounded-full bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-50"
      >
        {saving ? "Updating…" : "Update login"}
      </button>
    </div>
  );
}
