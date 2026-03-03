"use client";

import Toggle from "@/components/Toggle";
import { useState, useEffect } from "react";
import { Loader2, CheckCircle2, AlertCircle, Key } from "lucide-react";
import Link from "next/link";
import { apiFetch, auth } from "@/lib/auth";

export default function Settings() {
  const [formData, setFormData] = useState({
    target_backend_url: "http://localhost:3001",
    rate_limit_enabled: true,
    cache_enabled: true,
    idempotency_enabled: true,
    waf_enabled: true,
    rate_limit_per_minute: 100,
  });

  const [apiKey, setApiKey] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const key = auth.getSelectedKey();
    setApiKey(key);
    if (!key) {
      setLoading(false);
      return;
    }

    apiFetch("/api/settings", { headers: { "X-API-Key": key } })
      .then((r) => r.json())
      .then((data) => setFormData(data))
      .catch((err) => console.error("Failed to fetch settings:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rate_limit_per_minute" ? parseInt(value) || 0 : value,
    }));
  };

  const handleToggle = (key: keyof typeof formData) => (checked: boolean) => {
    setFormData((prev) => ({ ...prev, [key]: checked }));
  };

  const handleSubmit = async () => {
    if (!apiKey) return;
    setSaving(true);
    setStatus("idle");
    try {
      const res = await apiFetch("/api/settings", {
        method: "POST",
        headers: { "X-API-Key": apiKey },
        body: JSON.stringify(formData),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center gap-2 text-zinc-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading settings...
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="p-8 max-w-lg">
        <h1 className="text-2xl font-semibold text-white tracking-tight mb-2">
          Settings
        </h1>
        <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 flex flex-col items-center text-center gap-4">
          <Key className="h-8 w-8 text-zinc-700" />
          <p className="text-zinc-400 text-sm">
            No gateway selected. Go to API Keys and select one first.
          </p>
          <Link
            href="/dashboard/api-keys"
            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400 transition-colors"
          >
            Go to API Keys →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Settings
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Configure your gateway routing and security rules.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2">
          <Key className="h-3.5 w-3.5 text-zinc-500" />
          <code className="text-xs text-zinc-400 font-mono max-w-[180px] truncate">
            {apiKey}
          </code>
        </div>
      </div>

      <div className="space-y-8">
        {/* General */}
        <div>
          <h2 className="text-base font-medium text-white mb-3">General</h2>
          <div className="rounded-xl border border-zinc-800 bg-black/50 p-6">
            <label
              htmlFor="target_backend_url"
              className="block text-sm font-medium text-white mb-2"
            >
              Target Backend URL
            </label>
            <input
              type="url"
              name="target_backend_url"
              id="target_backend_url"
              value={formData.target_backend_url}
              onChange={handleChange}
              className="block w-full max-w-lg rounded-xl border border-zinc-700 bg-zinc-900 py-2.5 px-4 text-white text-sm placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
              placeholder="https://api.yourbackend.com"
            />
            <p className="mt-2 text-xs text-zinc-500">
              All requests through your gateway ({apiKey.slice(0, 12)}...) will
              be forwarded here.
            </p>
          </div>
        </div>

        {/* Features */}
        <div>
          <h2 className="text-base font-medium text-white mb-3">
            Security & Performance
          </h2>
          <div className="rounded-xl border border-zinc-800 bg-black/50 divide-y divide-zinc-800">
            <div className="p-6">
              <Toggle
                label="Sliding Window Rate Limit"
                description="Block IPs that exceed your configured request threshold per minute."
                checked={formData.rate_limit_enabled}
                onChange={handleToggle("rate_limit_enabled")}
              />
              {formData.rate_limit_enabled && (
                <div className="mt-4">
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    Requests per Minute per IP
                  </label>
                  <input
                    type="number"
                    name="rate_limit_per_minute"
                    value={formData.rate_limit_per_minute}
                    onChange={handleChange}
                    className="w-24 rounded-xl border border-zinc-700 bg-zinc-900 py-1.5 px-3 text-white text-sm focus:border-emerald-500 focus:outline-none"
                    min="1"
                  />
                </div>
              )}
            </div>
            <div className="p-6">
              <Toggle
                label="LRU Cache"
                description="Sub-millisecond GET response caching (5 min TTL, max 1000 entries)."
                checked={formData.cache_enabled}
                onChange={handleToggle("cache_enabled")}
              />
            </div>
            <div className="p-6">
              <Toggle
                label="POST Idempotency"
                description="Replay safe cached responses for duplicate X-Idempotency-Key requests."
                checked={formData.idempotency_enabled}
                onChange={handleToggle("idempotency_enabled")}
              />
            </div>
            <div className="p-6">
              <Toggle
                label="WAF — Web Application Firewall"
                description="Block SQLi, XSS, and known injection patterns before they reach your backend."
                checked={formData.waf_enabled}
                onChange={handleToggle("waf_enabled")}
              />
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-zinc-800">
          {status === "success" && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-400">
              <CheckCircle2 className="h-4 w-4" /> Saved successfully
            </span>
          )}
          {status === "error" && (
            <span className="flex items-center gap-1.5 text-sm text-rose-400">
              <AlertCircle className="h-4 w-4" /> Failed to save
            </span>
          )}
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-black hover:bg-emerald-400 transition-colors disabled:opacity-60"
          >
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
