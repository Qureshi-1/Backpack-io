"use client";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Loader2, Copy, CheckCircle2 } from "lucide-react";
import { auth } from "@/lib/auth";
import toast from "react-hot-toast";

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [plan, setPlan] = useState("free");

  useEffect(() => {
    fetchApi("/api/user/me")
      .then((res) => {
        setPlan(res.plan);
        setKeys([
          {
            key: res.api_key,
            name: "Default Gateway",
            created_at: res.created_at,
          },
        ]);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopied(key);
    toast.success("API Key copied to clipboard!");
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">API Keys</h1>
        <p className="text-zinc-400">Manage your Backport gateway keys.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm transition-all hover:border-zinc-700 hover:shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[500px]">
          <thead className="bg-zinc-800/50 text-zinc-400 text-sm">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Key</th>
              <th className="px-6 py-4 font-medium">Created</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-sm text-zinc-300">
            {keys.map((k, i) => (
              <tr key={i} className="hover:bg-zinc-800/20 transition-colors">
                <td className="px-6 py-4 font-medium text-white">{k.name}</td>
                <td className="px-6 py-4 font-mono text-emerald-400">
                  {k.key.substring(0, 10)}******************
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(k.created_at || Date.now()).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleCopy(k.key)}
                    className="p-2 hover:bg-zinc-800 rounded-md transition-colors"
                    title="Copy Key"
                  >
                    {copied === k.key ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-zinc-400" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {plan === "free" && (
          <div className="p-4 bg-zinc-800/30 border-t border-zinc-800 text-sm text-zinc-400">
            Free plan is limited to 1 gateway.{" "}
            <a
              href="/dashboard/billing"
              className="text-emerald-400 hover:underline"
            >
              Upgrade to Pro
            </a>{" "}
            for more keys.
          </div>
        )}
      </div>

      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 transition-colors hover:border-emerald-500/30">
        <h3 className="font-semibold text-emerald-500 mb-2">
          How to use your API Key
        </h3>
        <p className="text-zinc-300 text-sm mb-4">
          Pass the key in the headers of your requests to the Backport gateway:
        </p>
        <pre className="bg-black border border-white/5 p-4 rounded-lg text-sm font-mono text-zinc-300 overflow-x-auto">
          <code>
            {`curl -X GET https://backpack-backend-wldo.onrender.com/proxy/your/api/path
  -H "X-API-Key: bk_YOUR_API_KEY"`}
          </code>
        </pre>
      </div>
    </div>
  );
}
