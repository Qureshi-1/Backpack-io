"use client";
import MatrixBackground from "@/components/MatrixBackground";
import { CheckCircle2, Zap, Shield, Sparkles } from "lucide-react";

const CHANGES = [
  {
    version: "v1.1.0",
    name: "The Performance Update",
    date: "March 2026",
    color: "emerald",
    items: [
      { icon: Zap, text: "Introduced in-memory LRU caching for GET requests" },
      { icon: Shield, text: "Added WAF strict mode for SQLi prevention" },
      { icon: Sparkles, text: "Real-time dashboard analytics integration" },
    ]
  },
  {
    version: "v1.0.0",
    name: "Initial Beta Release",
    date: "February 2026",
    color: "zinc",
    items: [
      { icon: CheckCircle2, text: "Core proxy engine with under 10ms latency" },
      { icon: CheckCircle2, text: "Rate limiting & Idempotency key support" },
      { icon: CheckCircle2, text: "Admin panel for user management" },
    ]
  }
];

export default function Changelog() {
  return (
    <div className="relative min-h-screen bg-black text-zinc-300">
      <MatrixBackground />
      <div className="mx-auto max-w-3xl px-6 py-24 relative z-10">
        <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Changelog</h1>
        <p className="text-zinc-500 mb-16">Follow along as we build the future of API security.</p>
        
        <div className="space-y-16">
          {CHANGES.map((change, idx) => (
            <div key={change.version} className="relative pl-8 border-l border-zinc-800">
              <div className={`absolute -left-[9px] top-0 h-4 w-4 rounded-full border-4 border-black ${change.color === 'emerald' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-zinc-700'}`} />
              
              <div className="mb-2 flex items-center gap-3">
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${change.color === 'emerald' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-zinc-800 text-zinc-500 bg-zinc-900'}`}>
                  {change.version}
                </span>
                <span className="text-sm text-zinc-600 font-mono">{change.date}</span>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-6">{change.name}</h2>
              
              <ul className="space-y-4">
                {change.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 group">
                    <item.icon className="w-5 h-5 text-emerald-500/50 group-hover:text-emerald-500 transition-colors mt-0.5" />
                    <span className="text-zinc-400 group-hover:text-zinc-200 transition-colors">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
