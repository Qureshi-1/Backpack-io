"use client";

import TrafficChart from "@/components/TrafficChart";
import { Activity, Zap, ShieldAlert } from "lucide-react";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [metrics, setMetrics] = useState({
    total_requests: 0,
    cache_hits: 0,
    threats_blocked: 0,
  });

  useEffect(() => {
    setMounted(true);

    const fetchMetrics = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/metrics");
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
  }, []);

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

  if (!mounted) {
    return <div className="p-8 min-h-screen"></div>;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white tracking-tight">Overview</h1>
        <p className="text-sm text-zinc-400 mt-1">Real-time metrics for your API Gateway.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
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
                className={`ml-2 text-sm font-medium ${
                  stat.changeType === "positive" ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-zinc-800 bg-black/50 p-6 shadow-sm backdrop-blur-md">
        <h2 className="text-base font-semibold text-white tracking-tight">Traffic (Last 24h)</h2>
        <TrafficChart />
      </div>
    </div>
  );
}
