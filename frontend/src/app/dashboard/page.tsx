"use client";

import TrafficChart from "@/components/TrafficChart";
import {
  Activity,
  Zap,
  ShieldAlert,
  Copy,
  CheckCheck,
  Terminal,
  Link2,
} from "lucide-react";
import { useState, useEffect } from "react";

// ── Copy Button ──────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="ml-auto flex items-center gap-1 rounded-md px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-700 hover:text-white transition-colors"
    >
      {copied ? (
        <CheckCheck className="h-3.5 w-3.5 text-emerald-400" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

// ── Code Block ───────────────────────────────────────────────────────────────
function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 overflow-hidden">
      {label && (
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
          <span className="text-xs font-mono text-zinc-500">{label}</span>
          <CopyButton text={code} />
        </div>
      )}
      <pre className="overflow-x-auto px-4 py-3 text-xs font-mono leading-6 text-emerald-300">
        {code}
      </pre>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [gatewayUrl, setGatewayUrl] = useState("http://localhost:8080");
  const [metrics, setMetrics] = useState({
    total_requests: 0,
    cache_hits: 0,
    threats_blocked: 0,
  });

  useEffect(() => {
    setMounted(true);

    const fetchMetrics = async () => {
      try {
        const response = await fetch(`${gatewayUrl}/api/metrics`);
        if (response.ok) {
          const data = await response.json();
          setMetrics(data);
        }
      } catch (error) {
        console.error("Failed to fetch metrics:", error);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, [gatewayUrl]);

  const stats = [
    {
      name: "Total Requests",
      value: metrics.total_requests.toLocaleString(),
      change: "+12.5%",
      changeType: "positive",
      icon: Activity,
    },
    {
      name: "Cache Hits",
      value: metrics.cache_hits.toLocaleString(),
      change: "+18.2%",
      changeType: "positive",
      icon: Zap,
    },
    {
      name: "Threats Blocked",
      value: metrics.threats_blocked.toLocaleString(),
      change: "-4.1%",
      changeType: "negative",
      icon: ShieldAlert,
    },
  ];

  if (!mounted) return <div className="p-8 min-h-screen" />;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          Overview
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Real-time metrics for your API Gateway.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="rounded-xl border border-zinc-800 bg-black/50 p-6 shadow-sm backdrop-blur-md"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-400">{stat.name}</p>
              <stat.icon className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="mt-4 flex items-baseline">
              <p className="text-3xl font-semibold text-white tracking-tight md:text-4xl">
                {stat.value}
              </p>
              <span
                className={`ml-2 text-sm font-medium ${stat.changeType === "positive" ? "text-emerald-500" : "text-rose-500"}`}
              >
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Traffic Chart */}
      <div className="rounded-xl border border-zinc-800 bg-black/50 p-6 shadow-sm backdrop-blur-md">
        <h2 className="text-base font-semibold text-white tracking-tight">
          Traffic (Last 24h)
        </h2>
        <TrafficChart />
      </div>

      {/* ── Quick Start: How to Use ── */}
      <div className="rounded-xl border border-zinc-800 bg-black/50 p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-emerald-500" />
          <h2 className="text-base font-semibold text-white">
            How to Use Your Gateway
          </h2>
        </div>

        {/* Live Gateway URL with editable display */}
        <div>
          <p className="text-xs font-medium text-zinc-500 mb-2 uppercase tracking-widest">
            Your Gateway URL
          </p>
          <div className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3">
            <Link2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
            <span className="font-mono text-sm text-emerald-300 flex-1">
              {gatewayUrl}
            </span>
            <CopyButton text={gatewayUrl} />
          </div>
          <p className="text-xs text-zinc-600 mt-1">
            By default the gateway runs on port 8080. Change this in Settings if
            you've reconfigured.
          </p>
        </div>

        {/* Step 1 */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
            Step 1 — Send requests through Backpack (not your backend directly)
          </p>
          <p className="text-sm text-zinc-500">
            Instead of calling your backend at{" "}
            <code className="text-zinc-300 bg-zinc-800 px-1 rounded">
              http://your-backend.com/api/data
            </code>
            , call Backpack at the same path:
          </p>
          <CodeBlock label="curl" code={`curl ${gatewayUrl}/api/data`} />
        </div>

        {/* Step 2 */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
            Step 2 — POST with idempotency (safe retries)
          </p>
          <p className="text-sm text-zinc-500">
            Add the{" "}
            <code className="text-zinc-300 bg-zinc-800 px-1 rounded">
              X-Idempotency-Key
            </code>{" "}
            header to any POST to ensure it runs exactly once, even if retried.
          </p>
          <CodeBlock
            label="curl"
            code={`curl -X POST ${gatewayUrl}/api/payments \\
  -H "Content-Type: application/json" \\
  -H "X-Idempotency-Key: unique-txn-abc123" \\
  -d '{"amount": 500, "currency": "USD"}'`}
          />
        </div>

        {/* Step 3 — JS Fetch */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
            Step 3 — Use from your frontend or app
          </p>
          <CodeBlock
            label="JavaScript / TypeScript"
            code={`const GATEWAY = "${gatewayUrl}";

// GET — will be cached automatically
const data = await fetch(\`\${GATEWAY}/api/products\`).then(r => r.json());

// POST — with idempotency key
await fetch(\`\${GATEWAY}/api/orders\`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Idempotency-Key": crypto.randomUUID(),
  },
  body: JSON.stringify({ item: "Backpack Pro", qty: 1 }),
});`}
          />
        </div>

        {/* Notes */}
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-1 text-sm text-zinc-400">
          <p className="text-emerald-400 font-medium mb-2">
            What Backpack does automatically:
          </p>
          <p>
            ✓ <strong className="text-zinc-300">Rate Limiting</strong> — blocks
            IPs that exceed your configured requests/min
          </p>
          <p>
            ✓ <strong className="text-zinc-300">WAF</strong> — strips SQLi / XSS
            from request bodies before forwarding
          </p>
          <p>
            ✓ <strong className="text-zinc-300">Caching</strong> — GET responses
            cached for 5 min to reduce backend load
          </p>
          <p>
            ✓ <strong className="text-zinc-300">Idempotency</strong> — duplicate
            POSTs replay cached response, never re-execute
          </p>
        </div>
      </div>
    </div>
  );
}
