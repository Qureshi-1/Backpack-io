"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { auth } from "@/lib/auth";
import Link from "next/link";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token found. Please check your email link.");
      return;
    }

    fetchApi(`/api/auth/verify-email?token=${encodeURIComponent(token)}`, {
      method: "GET",
    })
      .then((data) => {
        auth.setToken(data.token);
        if (data.api_key) auth.setApiKey(data.api_key);
        setStatus("success");
        setMessage(data.message || "Email verified!");
        // Redirect to dashboard after 2s
        setTimeout(() => router.push("/dashboard"), 2000);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.message || "Verification failed. The link may have expired.");
      });
  }, [token]);

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

          {status === "loading" && (
            <>
              <div className="flex justify-center mb-6">
                <div className="h-12 w-12 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
              </div>
              <h1 className="text-xl font-bold text-white mb-2">Verifying your email...</h1>
              <p className="text-zinc-400 text-sm">Please wait a moment.</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-3xl">✅</div>
              </div>
              <h1 className="text-xl font-bold text-white mb-2">Email Verified!</h1>
              <p className="text-zinc-400 text-sm mb-6">{message}</p>
              <p className="text-emerald-400 text-sm animate-pulse">Redirecting to dashboard...</p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-3xl">❌</div>
              </div>
              <h1 className="text-xl font-bold text-white mb-2">Verification Failed</h1>
              <p className="text-red-400 text-sm mb-6">{message}</p>
              <Link
                href="/auth/login"
                className="inline-block w-full rounded-xl bg-emerald-500 py-3 text-center text-sm font-bold text-black hover:bg-emerald-400 transition-colors"
              >
                Back to Login
              </Link>
            </>
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
