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
          <div className="space-y-4 mb-8">
            <p className="text-zinc-400 text-sm leading-relaxed">
              Share the power of Backport. When a friend signs up with your link, they get a <span className="text-emerald-400 font-bold">60% Discount</span> on Cloud Pro.
            </p>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Once they upgrade, you receive <span className="text-emerald-400 font-bold">1 Month of Cloud Pro</span> for free.
            </p>
            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-[11px] text-emerald-500/70 font-mono">
              RULE: 1st friend = 1 Month Free. <br/>
              Then, every 5 friends = 1 Month Free.
            </div>
          </div>
          
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
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-zinc-400">
                  <Users className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-zinc-500">Paid Conversions</span>
              </div>
              <span className="text-2xl font-bold text-white tabular-nums">{data?.total_paid_referrals}</span>
            </div>
            
            {data?.has_received_first_reward ? (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-[10px] font-mono uppercase text-zinc-500">
                  <span>Next Reward Progress</span>
                  <span>{data?.pending_referrals_count} / 5</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-1000" 
                    style={{ width: `${(data?.pending_referrals_count / 5) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-zinc-600 italic">Get 5 more friends to pay and unlock another month of Pro.</p>
              </div>
            ) : (
              <div className="mt-2 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <p className="text-[12px] text-emerald-400 font-bold italic">Your 1st friend upgrade gives you 1 MONTH FREE instantly!</p>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 flex flex-col justify-center overflow-hidden relative group">
             <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Sparkles size={120} className="text-emerald-500" />
             </div>
             <p className="text-sm font-medium text-zinc-400 mb-2">Total Bonus Received</p>
             <p className="text-2xl font-bold text-emerald-400">
               {data?.total_paid_referrals > 0 ? (data?.has_received_first_reward ? (1 + Math.floor((data.total_paid_referrals - 1) / 5)) : 0) : 0} Months Pro Free
             </p>
             <p className="text-xs text-zinc-600 mt-2">Applied automatically to your subscription.</p>
          </div>
        </motion.div>
      </div>

      {/* How it works */}
      <div className="pt-8 border-t border-zinc-800/50">
        <h3 className="text-lg font-bold text-white mb-6">How it works</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Share Link", desc: "Your friends get a massive 60% discount on their first Cloud Pro upgrade." },
            { step: "02", title: "They Upgrade", desc: "Once they complete a successful payment, the conversion is tracked." },
            { step: "03", title: "Earn Rewards", desc: "We credit your account with free Pro months based on your referral milestone." },
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
