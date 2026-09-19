"use client";

import { useEffect, useState } from "react";

const SETTING_FIELDS = [
  { key: "site_name", label: "Site Name", placeholder: "Chatgainya Shutki" },
  { key: "banner_text", label: "Homepage Banner Text", placeholder: "Fresh & Authentic Shutki, Delivered to Your Door" },
  { key: "contact_phone", label: "Contact Phone", placeholder: "01XXXXXXXXX" },
  { key: "contact_email", label: "Contact Email", placeholder: "info@chatgainyashutki.com" },
  { key: "address", label: "Business Address", placeholder: "Chattogram, Bangladesh" },
  { key: "facebook_link", label: "Facebook Page Link", placeholder: "https://facebook.com/..." },
  { key: "about_text", label: "About Us Text", placeholder: "Short description about the business" },
];

export default function SettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchSettings = async () => {
    const res = await fetch("/api/settings");
    setValues(await res.json());
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setLoading(true);
    await Promise.all(
      SETTING_FIELDS.map((f) =>
        fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: f.key, value: values[f.key] || "" }),
        })
      )
    );
    setLoading(false);
    setSaved(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-blue-950 mb-6">Site Settings</h1>

      <div className="bg-white p-6 rounded-lg shadow max-w-2xl border-t-4 border-yellow-600 space-y-4">
        {SETTING_FIELDS.map((f) => (
          <div key={f.key}>
            <label className="block text-sm text-gray-700 mb-1">{f.label}</label>
            {f.key === "about_text" || f.key === "banner_text" ? (
              <textarea
                value={values[f.key] || ""}
                onChange={(e) => handleChange(f.key, e.target.value)}
                placeholder={f.placeholder}
                rows={3}
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-yellow-600 outline-none"
              />
            ) : (
              <input
                value={values[f.key] || ""}
                onChange={(e) => handleChange(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-yellow-600 outline-none"
              />
            )}
          </div>
        ))}

        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-5 py-2 rounded font-medium disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Settings"}
          </button>
          {saved && <span className="text-green-700 text-sm">✓ Saved</span>}
        </div>
      </div>
    </div>
  );
}