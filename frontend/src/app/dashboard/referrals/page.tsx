"use client";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Copy, Gift, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function ReferralsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchApi("/api/user/referrals")
      .then((res) => {
        setData(res);
      })
      .finally(() => setLoading(false));
  }, []);

  const copyLink = () => {
    navigator.clipboard.writeText(data.referral_link);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="p-8 text-zinc-500 font-mono">Loading referral data...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Refer & Earn</h1>
        <p className="text-zinc-500">Invite your friends and grow the Backport community together.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Referral Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.03] p-8 backdrop-blur-sm"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <Gift className="h-6 w-6 text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-4">Your Referral Reward</h2>
          <p className="text-zinc-400 mb-8 leading-relaxed">
            For every user that signs up using your link, you get <span className="text-emerald-400 font-bold">1 Month of Cloud Pro</span> for free.
          </p>
          
          <div className="space-y-4">
            <p className="text-xs font-mono uppercase tracking-widest text-zinc-600">Your Unique Link</p>
            <div className="flex items-center gap-2 p-1 pl-4 rounded-xl bg-black border border-zinc-800">
              <code className="text-xs text-zinc-400 truncate flex-1">{data?.referral_link}</code>
              <button 
                onClick={copyLink}
                className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-black hover:bg-emerald-400 transition-all"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="grid grid-cols-1 gap-4"
        >
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-zinc-400">
                <Users className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-zinc-500">Total Referrals</span>
            </div>
            <p className="text-5xl font-bold text-white tabular-nums">{data?.referrals_count}</p>
            <p className="mt-4 text-xs text-zinc-600 font-mono tracking-tight uppercase">Successful signs-ups</p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 flex flex-col justify-center overflow-hidden relative group">
             <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Sparkles size={120} className="text-emerald-500" />
             </div>
             <p className="text-sm font-medium text-zinc-400 mb-2">Current Bonus</p>
             <p className="text-2xl font-bold text-emerald-400">
               {data?.referrals_count} Months Pro Free
             </p>
             <p className="text-xs text-zinc-600 mt-2 italic">Applied automatically to your account balance.</p>
          </div>
        </motion.div>
      </div>

      {/* How it works */}
      <div className="pt-8 border-t border-zinc-800/50">
        <h3 className="text-lg font-bold text-white mb-6">How it works</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Share Link", desc: "Copy your unique referral link and share it on Twitter, Discord, or with friends." },
            { step: "02", title: "They Sign Up", desc: "Your friends sign up for a free Backport account using your link." },
            { step: "03", title: "Earn Rewards", desc: "You automatically receive 30 days of Cloud Pro features for each referral." },
          ].map((s) => (
            <div key={s.step} className="space-y-3">
              <span className="text-2xl font-black text-zinc-800 font-mono italic">{s.step}</span>
              <h4 className="font-bold text-white">{s.title}</h4>
              <p className="text-sm text-zinc-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const Sparkles = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 3v3m0 12v3M5.3 5.3l2.1 2.1m9.2 9.2l2.1 2.1M3 12h3m12 0h3M5.3 18.7l2.1-2.1m9.2-9.2l2.1-2.1"/>
  </svg>
);
