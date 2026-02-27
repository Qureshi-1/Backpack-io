"use client";

import Toggle from "@/components/Toggle";
import { useState, useEffect } from "react";

export default function Settings() {
  const [formData, setFormData] = useState({
    target_backend_url: "http://localhost:3001",
    rate_limit_enabled: true,
    cache_enabled: true,
    idempotency_enabled: true,
    waf_enabled: true,
    rate_limit_per_minute: 100,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/api/settings")
      .then((res) => res.json())
      .then((data) => setFormData(data))
      .catch((err) => console.error("Failed to fetch settings:", err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rate_limit_per_minute" ? parseInt(value) || 0 : value,
    }));
  };

  const handleToggle = (key: keyof typeof formData) => (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [key]: checked,
    }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const response = await fetch("http://localhost:8080/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert("Settings saved successfully!");
      } else {
        alert("Failed to save settings.");
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Error saving settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-white tracking-tight">Settings</h1>
        <p className="text-sm text-zinc-400 mt-1">Configure your API Gateway routing and security.</p>
      </div>

      <div className="space-y-10">
        {/* General Settings */}
        <div>
          <h2 className="text-lg font-medium text-white mb-4">General</h2>
          <div className="rounded-xl border border-zinc-800 bg-black/50 p-6 shadow-sm">
            <label htmlFor="target_backend_url" className="block text-sm font-medium text-white mb-2">
              Original Backend URL
            </label>
            <input
              type="url"
              name="target_backend_url"
              id="target_backend_url"
              value={formData.target_backend_url}
              onChange={handleChange}
              className="block w-full max-w-lg rounded-md border-0 bg-zinc-900 py-2 px-3 text-white shadow-sm ring-1 ring-inset ring-zinc-800 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm sm:leading-6"
              placeholder="https://api.yourbackend.com"
            />
            <p className="mt-2 text-sm text-zinc-500">
              Traffic will be transparently proxied to this destination.
            </p>
          </div>
        </div>

        {/* Features */}
        <div>
          <h2 className="text-lg font-medium text-white mb-4">Features</h2>
          <div className="rounded-xl border border-zinc-800 bg-black/50 divide-y divide-zinc-800 shadow-sm">
            <div className="p-6">
              <Toggle 
                label="Enable Sliding Window Rate Limit" 
                description="Prevent API abuse with distributed sliding window counters."
                checked={formData.rate_limit_enabled}
                onChange={handleToggle("rate_limit_enabled")}
              />
              
              {formData.rate_limit_enabled && (
                <div className="mt-4">
                  <label htmlFor="rate_limit_per_minute" className="block text-sm font-medium text-zinc-400 mb-2">
                    Requests per Minute
                  </label>
                  <input
                    type="number"
                    name="rate_limit_per_minute"
                    id="rate_limit_per_minute"
                    value={formData.rate_limit_per_minute}
                    onChange={handleChange}
                    className="block w-32 rounded-md border-0 bg-zinc-900 py-1.5 px-3 text-white shadow-sm ring-1 ring-inset ring-zinc-800 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm sm:leading-6"
                    min="1"
                  />
                </div>
              )}
            </div>
            <div className="p-6">
              <Toggle 
                label="Enable LRU Cache" 
                description="In-memory caching for GET requests up to 10MB."
                checked={formData.cache_enabled}
                onChange={handleToggle("cache_enabled")}
              />
            </div>
            <div className="p-6">
              <Toggle 
                label="Enable POST Idempotency" 
                description="Automatically detect and drop duplicate mutations."
                checked={formData.idempotency_enabled}
                onChange={handleToggle("idempotency_enabled")}
              />
            </div>
            <div className="p-6">
              <Toggle 
                label="Enable WAF Security" 
                description="Block SQLi, XSS, and known bad IPs proactively."
                checked={formData.waf_enabled}
                onChange={handleToggle("waf_enabled")}
              />
            </div>
          </div>
        </div>

        {/* Save Form */}
        <div className="flex justify-end pt-4 border-t border-zinc-800 mt-6">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className={`rounded-md px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 ${
              saving ? "bg-emerald-600 opacity-70 cursor-not-allowed" : "bg-emerald-500 hover:bg-emerald-400"
            }`}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
