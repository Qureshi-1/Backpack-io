"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { auth } from "@/lib/auth";
import Link from "next/link";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlToken = searchParams.get("token") || "";

  const [tokenInput, setTokenInput] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(urlToken ? "loading" : "idle");
  const [message, setMessage] = useState("");

  const verifyToken = (tokenToVerify: string) => {
    setStatus("loading");
    fetchApi(`/api/auth/verify-email?token=${encodeURIComponent(tokenToVerify)}`, {
      method: "GET",
    })
      .then((data: any) => {
        auth.setToken(data.token);
        if (data.api_key) auth.setApiKey(data.api_key);
        setStatus("success");
        setMessage(data.message || "Email verified!");
        setTimeout(() => router.push("/dashboard"), 2000);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.message || "Verification failed. The code may be invalid or expired.");
      });
  };

  useEffect(() => {
    if (urlToken) {
      verifyToken(urlToken);
    }
  }, [urlToken]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    verifyToken(tokenInput.trim());
  };

  return (
    <div className="relative min-h-screen bg-black flex flex-col items-center justify-center p-4">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f18_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f18_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-8 text-center shadow-2xl backdrop-blur">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-black text-sm">B</div>
            <span className="text-white font-bold text-lg">Backport</span>
          </div>

          {(status === "idle" || status === "error") && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h1 className="text-xl font-bold text-white mb-2">Verify your email</h1>
                <p className="text-zinc-400 text-sm mb-6">Enter the 6-digit code sent to your email.</p>
                
                <input
                  type="text"
                  placeholder="Enter 6-digit code..."
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-4 text-center text-3xl font-mono text-emerald-400 placeholder:text-zinc-700 tracking-[0.5em] focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value.replace(/[^0-9a-zA-Z]/g, '').toUpperCase())}
                  maxLength={6}
                  required
                />
              </div>

              {status === "error" && (
                <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={!tokenInput || tokenInput.length < 6}
                className="w-full rounded-xl bg-emerald-500 py-3 text-center text-sm font-bold text-black hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verify Code
              </button>

              <div className="pt-4 text-center">
                <Link href="/auth/login" className="text-zinc-500 hover:text-white transition-colors text-sm font-medium">
                  &larr; Back to login
                </Link>
              </div>
            </form>
          )}

          {status === "loading" && (
            <div className="py-8">
              <div className="flex justify-center mb-6">
                <div className="h-12 w-12 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
              </div>
              <h1 className="text-xl font-bold text-white mb-2">Verifying code...</h1>
              <p className="text-zinc-400 text-sm">Please wait a moment.</p>
            </div>
          )}

          {status === "success" && (
            <div className="py-8">
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-3xl">✅</div>
              </div>
              <h1 className="text-xl font-bold text-white mb-2">Email Verified!</h1>
              <p className="text-zinc-400 text-sm mb-6">{message}</p>
              <p className="text-emerald-400 text-sm animate-pulse">Redirecting to dashboard...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
