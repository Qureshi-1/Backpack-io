"use client";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Loader2, CheckCircle2 } from "lucide-react";
import Script from "next/script";

export default function BillingPage() {
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApi("/api/user/me").then((res) => {
      setPlan(res.plan);
      setLoading(false);
    });
  }, []);

  const handleUpgrade = async () => {
    try {
      setProcessing(true);
      setError("");

      const order = await fetchApi("/api/create-order", { method: "POST" });

      if (order.mock) {
        alert(
          "Razorpay is not fully configured, performing a mock successful payment.",
        );
        const verify = await fetchApi("/api/verify-payment", {
          method: "POST",
          body: JSON.stringify({ mock: true }),
        });
        setPlan(verify.plan);
        setProcessing(false);
        return;
      }

      const options = {
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: "Backport",
        description: "Backport Pro Upgrade",
        order_id: order.order_id,
        handler: async function (response: any) {
          const verify = await fetchApi("/api/verify-payment", {
            method: "POST",
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          if (verify.status === "success") {
            setPlan("pro");
          }
        },
        theme: {
          color: "#10b981",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function (resp: any) {
        setError(resp.error.description || "Payment failed");
      });
    } catch (err: any) {
      setError(err.message || "Could not initiate payment");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl space-y-8">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Billing & Plans</h1>
        <p className="text-zinc-400">Manage your subscription.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* FREE PLAN */}
        <div
          className={`bg-zinc-900 border ${plan === "free" ? "border-emerald-500" : "border-zinc-800"} rounded-2xl p-8 relative flex flex-col`}
        >
          {plan === "free" && (
            <div className="absolute top-0 right-0 bg-emerald-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">
              CURRENT PLAN
            </div>
          )}
          <h3 className="text-xl font-bold text-white mb-2">Hobby</h3>
          <p className="text-zinc-400 text-sm mb-6">For personal projects</p>
          <div className="text-3xl font-bold text-white mb-8">Free</div>
          <ul className="space-y-3 mb-8 flex-1">
            <li className="flex items-center gap-2 text-sm text-zinc-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 10,000
              monthly requests
            </li>
            <li className="flex items-center gap-2 text-sm text-zinc-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 1 Gateway
              Domain
            </li>
            <li className="flex items-center gap-2 text-sm text-zinc-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Basic rate
              limiting
            </li>
          </ul>
        </div>

        {/* PRO PLAN */}
        <div
          className={`bg-zinc-900 border ${plan === "pro" ? "border-emerald-500" : "border-zinc-800"} rounded-2xl p-8 relative flex flex-col shadow-2xl shadow-emerald-900/10`}
        >
          {plan === "pro" && (
            <div className="absolute top-0 right-0 bg-emerald-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">
              CURRENT PLAN
            </div>
          )}
          <h3 className="text-xl font-bold text-white mb-2">Cloud Pro</h3>
          <p className="text-zinc-400 text-sm mb-6">
            For production applications
          </p>
          <div className="text-3xl font-bold text-white mb-8">
            ₹750 <span className="text-lg text-zinc-500 font-normal">/mo</span>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            <li className="flex items-center gap-2 text-sm text-zinc-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 1,000,000
              monthly requests
            </li>
            <li className="flex items-center gap-2 text-sm text-zinc-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 10 Gateway
              Domains
            </li>
            <li className="flex items-center gap-2 text-sm text-zinc-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Advanced WAF
              & Rules
            </li>
            <li className="flex items-center gap-2 text-sm text-zinc-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Priority
              Support
            </li>
          </ul>

          {plan !== "pro" && (
            <button
              onClick={handleUpgrade}
              disabled={processing}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {processing && <Loader2 className="h-5 w-5 animate-spin" />}
              {processing ? "Processing..." : "Upgrade to Pro"}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mt-6">
          {error}
        </div>
      )}
    </div>
  );
}
