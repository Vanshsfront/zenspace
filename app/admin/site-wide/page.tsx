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
  const [pw, setPw] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!pw.trim()) {
      toast.push("error", "Enter a new password first");
      return;
    }
    setSaving(true);
    const r = await fetch("/api/admin/password", {
      method: "POST",
      body: JSON.stringify({ password: pw.trim() }),
    });
    setSaving(false);
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      toast.push("error", j.error || "Could not update the password");
      return;
    }
    setPw("");
    toast.push("success", "Password updated — it applies at your next sign-in");
  }

  return (
    <div className="max-w-3xl mt-12 pt-8 border-t">
      <h2 className="font-serif text-xl text-stone-700 mb-4">Admin password</h2>
      <label className="block">
        <span className="text-sm font-medium">New password</span>
        <span className="block text-xs text-stone-500 mb-1">
          Write-only — the current password is never shown here. Setting a new one takes effect at
          your next sign-in.
        </span>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          autoComplete="new-password"
          placeholder="••••••••"
          className="w-full mt-1 px-3 py-2 rounded-lg border bg-white"
        />
      </label>
      <button
        onClick={save}
        disabled={saving}
        className="mt-4 px-6 py-2.5 rounded-full bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-50"
      >
        {saving ? "Updating…" : "Update password"}
      </button>
    </div>
  );
}
