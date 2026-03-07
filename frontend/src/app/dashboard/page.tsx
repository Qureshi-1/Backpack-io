"use client";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";

export default function DashboardOverview() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi("/api/user/me")
      .then((res) => {
        setUser(res);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
          Dashboard
        </h1>
        {user?.plan === "pro" && (
          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow-lg">
            PRO
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-zinc-400 text-sm font-medium mb-2">
            Account Status
          </h3>
          <p className="text-2xl font-bold text-white capitalize">
            {user?.plan} Plan
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-zinc-400 text-sm font-medium mb-2">
            Active Backend
          </h3>
          <p className="text-lg font-mono text-zinc-300 truncate">
            {user?.target_backend_url || "Not Configured"}
          </p>
        </div>
      </div>

      <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Getting Started
        </h2>
        <ul className="space-y-4 text-zinc-400">
          <li className="flex gap-3">
            <span className="text-emerald-500">1.</span>
            Navigate to <strong>Settings</strong> to configure your Target
            Backend URL.
          </li>
          <li className="flex gap-3">
            <span className="text-emerald-500">2.</span>
            View your keys in <strong>API Keys</strong> and pass `X-API-Key` to
            the proxy endpoint.
          </li>
        </ul>
      </div>
    </div>
  );
}
