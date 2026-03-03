"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Copy,
  CheckCheck,
  Plus,
  Trash2,
  Key,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { apiFetch, auth } from "@/lib/auth";

interface ApiKey {
  key: string;
  name: string;
  target_url: string;
  is_active: number;
  created_at: number;
  metrics: {
    total_requests: number;
    cache_hits: number;
    threats_blocked: number;
  };
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="p-1.5 rounded-lg hover:bg-zinc-700 text-zinc-500 hover:text-white transition-colors"
    >
      {copied ? (
        <CheckCheck className="h-3.5 w-3.5 text-emerald-400" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

export default function ApiKeysPage() {
  const router = useRouter();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [plan, setPlan] = useState("free");
  const [limits, setLimits] = useState<{
    max_gateways: number;
    monthly_limit: number;
  }>({ max_gateways: 1, monthly_limit: 10000 });
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTarget, setNewTarget] = useState("http://localhost:3001");
  const [error, setError] = useState("");

  const fetchKeys = async () => {
    try {
      const res = await apiFetch("/api/keys");
      if (res.ok) {
        const data = await res.json();
        setKeys(data.keys);
        setPlan(data.plan);
        setLimits(data.limits);
      }
    } catch {
      /* handled by apiFetch */
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const createKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCreating(true);
    try {
      const res = await apiFetch("/api/keys", {
        method: "POST",
        body: JSON.stringify({ name: newName, target_url: newTarget }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);
      setShowForm(false);
      setNewName("");
      setNewTarget("http://localhost:3001");
      fetchKeys();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create key");
    }
    setCreating(false);
  };

  const deleteKey = async (key: string) => {
    if (!confirm("Are you sure you want to delete this gateway key?")) return;
    await apiFetch(`/api/keys/${key}`, { method: "DELETE" });
    fetchKeys();
  };

  const selectKey = (key: string) => {
    auth.setSelectedKey(key);
    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center gap-2 text-zinc-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading...
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            API Keys
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Each key represents an isolated gateway. Your requests go through
            this gateway.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-black hover:bg-emerald-400 transition-colors"
        >
          <Plus className="h-4 w-4" /> New Gateway
        </button>
      </div>

      {/* Plan Banner */}
      <div
        className={`rounded-xl border p-4 flex items-center justify-between ${plan === "pro" ? "border-emerald-500/30 bg-emerald-500/5" : "border-zinc-800 bg-zinc-900/30"}`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`h-2 w-2 rounded-full ${plan === "pro" ? "bg-emerald-400" : "bg-zinc-500"}`}
          />
          <span className="text-sm font-medium text-white capitalize">
            {plan} Plan
          </span>
          <span className="text-xs text-zinc-500">·</span>
          <span className="text-xs text-zinc-400">
            {limits.max_gateways} gateway{limits.max_gateways > 1 ? "s" : ""}{" "}
            max · {limits.monthly_limit.toLocaleString()} req/month
          </span>
        </div>
        {plan === "free" && (
          <a
            href="#"
            className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            Upgrade to Pro <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="rounded-xl border border-emerald-500/30 bg-zinc-900/50 p-6">
          <h3 className="text-base font-semibold text-white mb-4">
            Create New Gateway
          </h3>
          <form onSubmit={createKey} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Gateway Name
                </label>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  placeholder="e.g. Production Gateway"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Target Backend URL
                </label>
                <input
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  required
                  placeholder="http://your-api.com"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
            {error && (
              <p className="flex items-center gap-2 text-sm text-rose-400">
                <AlertCircle className="h-4 w-4" /> {error}
              </p>
            )}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={creating}
                className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400 transition-colors disabled:opacity-60"
              >
                {creating && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Create Gateway
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Keys List */}
      <div className="space-y-4">
        {keys.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 py-16 text-center">
            <Key className="h-8 w-8 text-zinc-700 mb-3" />
            <p className="text-zinc-500 text-sm">
              No API keys yet. Create your first gateway.
            </p>
          </div>
        )}

        {keys.map((k) => (
          <div
            key={k.key}
            className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-white">{k.name}</h3>
                <p className="text-xs text-zinc-500 mt-0.5">→ {k.target_url}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => selectKey(k.key)}
                  className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                >
                  Select
                </button>
                <button
                  onClick={() => deleteKey(k.key)}
                  className="rounded-lg p-1.5 text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[
                {
                  label: "Requests",
                  value: k.metrics.total_requests.toLocaleString(),
                },
                {
                  label: "Cache Hits",
                  value: k.metrics.cache_hits.toLocaleString(),
                },
                {
                  label: "Threats Blocked",
                  value: k.metrics.threats_blocked.toLocaleString(),
                },
              ].map((m) => (
                <div key={m.label} className="rounded-lg bg-zinc-800/50 p-3">
                  <p className="text-xs text-zinc-500 mb-1">{m.label}</p>
                  <p className="text-lg font-semibold text-white">{m.value}</p>
                </div>
              ))}
            </div>

            {/* Key display */}
            <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-black/40 px-3 py-2">
              <Key className="h-3.5 w-3.5 text-zinc-600 flex-shrink-0" />
              <code className="flex-1 text-xs font-mono text-emerald-300 truncate">
                {k.key}
              </code>
              <CopyBtn text={k.key} />
            </div>

            {/* Usage hint */}
            <div className="mt-3 rounded-lg bg-zinc-800/30 px-3 py-2">
              <code className="text-xs font-mono text-zinc-400">
                curl -H &quot;X-API-Key: {k.key}&quot;
                http://localhost:8080/your-endpoint
              </code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
