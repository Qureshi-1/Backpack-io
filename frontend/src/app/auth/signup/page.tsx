"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import { auth } from "@/lib/auth";
import { ShieldCheck, Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await fetchApi("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      auth.setToken(data.token);
      auth.setApiKey(data.api_key);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900/50 p-8 rounded-2xl border border-white/10 backdrop-blur-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <ShieldCheck className="h-8 w-8 text-emerald-500" />
          <span className="text-2xl font-bold text-white">Backport</span>
        </Link>
        <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
        <p className="text-zinc-400 mb-8 text-sm">
          Free forever. No card required.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-emerald-400 hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
