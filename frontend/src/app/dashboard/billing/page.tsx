"use client";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Loader2, CheckCircle2, Circle } from "lucide-react";
import Script from "next/script";

const PLANS = [
  {
    id: "free",
    name: "Hobby",
    price: "$0",
    period: "/forever",
    desc: "Perfect for side projects or self-hosting lovers.",
    features: [
      "10,000 Requests / month",
      "Or Self-host for unlimited",
      "Basic WAF patterns",
      "In-memory Cache",
      "Community support",
    ],
    cta: "Current Plan",
    highlight: false,
  },
  {
    id: "plus",
    name: "Plus",
    price: "$15",
    period: "/month",
    desc: "Perfect for indie hackers.",
    features: [
      "250,000 Requests / month",
      "Standard WAF rules",
      "Up to 3 API Gateways",
      "Managed Hosting",
      "Email support",
    ],
    cta: "Get Plus",
    highlight: false,
  },
  {
    id: "pro",
    name: "Cloud Pro",
    price: "$39",
    period: "/month",
    desc: "For teams handling traffic.",
    features: [
      "1,000,000 Requests / mo",
      "AI-enhanced WAF rules",
      "Up to 10 API Gateways",
      "Distributed Redis",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    highlight: true,
    badge: "MOST POPULAR",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For massive scale and dedicated infrastructure.",
    features: [
      "Custom Volume Limits",
      "Custom Rate Limits",
      "Unlimited Gateways",
      "Dedicated VPC Deployment",
      "24/7 Phone Support",
    ],
    cta: "Contact Sales",
    highlight: false,
    muted: true,
  },
];

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
        alert("Mock payment — Razorpay not configured. Upgrading to Pro.");
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
        description: "Backport Cloud Pro Upgrade",
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
          if (verify.status === "success") setPlan("pro");
        },
        theme: { color: "#10b981" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      rzp.on("payment.failed", (resp: any) => {
        setError(resp.error.description || "Payment failed");
      });
    } catch (err: any) {
      setError(err.message || "Could not initiate payment");
    } finally {
      setProcessing(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center gap-2 text-zinc-400 p-8">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading...
      </div>
    );

  return (
    <div className="max-w-5xl space-y-8">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Billing & Plans</h1>
        <p className="text-zinc-400">Manage your subscription.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {PLANS.map((p) => {
          const isCurrent = plan === p.id || (plan === "free" && p.id === "free");
          const isClickable = p.id === "pro" && plan !== "pro";

          return (
            <div
              key={p.id}
              className={`relative flex flex-col rounded-2xl border p-6 transition-all
                ${isCurrent ? "border-emerald-500 shadow-lg shadow-emerald-900/20" : "border-zinc-800"}
                ${p.highlight ? "bg-zinc-900/80" : "bg-zinc-900/40"}
              `}
            >
              {/* Badge */}
              {p.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-[10px] font-bold px-3 py-0.5 rounded-full">
                  {p.badge}
                </div>
              )}
              {isCurrent && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-bl-lg rounded-tr-xl">
                  CURRENT
                </div>
              )}

              <h3 className="text-base font-bold text-white mb-1">{p.name}</h3>
              <p className="text-zinc-500 text-xs mb-4">{p.desc}</p>

              <div className="mb-5">
                <span className={`text-3xl font-bold ${p.muted ? "text-zinc-300" : "text-white"}`}>
                  {p.price}
                </span>
                {p.period && (
                  <span className="text-zinc-500 text-sm ml-1">{p.period}</span>
                )}
              </div>

              <ul className="space-y-2 mb-6 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-zinc-300">
                    {p.muted ? (
                      <Circle className="h-3.5 w-3.5 text-zinc-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    )}
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              {isClickable ? (
                <button
                  onClick={handleUpgrade}
                  disabled={processing}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                  {processing ? "Processing..." : p.cta}
                </button>
              ) : p.id === "enterprise" ? (
                <a
                  href="mailto:support@backport.dev"
                  className="w-full border border-zinc-700 hover:border-zinc-500 text-white text-sm font-medium py-2.5 rounded-xl text-center transition-colors block"
                >
                  {p.cta}
                </a>
              ) : isCurrent ? (
                <div className="w-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium py-2.5 rounded-xl text-center">
                  ✓ Active Plan
                </div>
              ) : (
                <button
                  onClick={handleUpgrade}
                  className="w-full border border-zinc-700 hover:border-zinc-500 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
                >
                  {p.cta}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
