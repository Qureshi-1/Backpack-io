"use client";
import Link from "next/link";
import { ArrowRight, Calendar, User, Clock } from "lucide-react";
import MatrixBackground from "@/components/MatrixBackground";

const POSTS = [
  {
    title: "Why Traditional Backends fail under burst traffic",
    description: "Learn how API gateways like Backport prevent database thrashing using sliding-window rate limits and intelligent caching.",
    date: "March 15, 2026",
    author: "Sohail Qureshi",
    readTime: "5 min read",
    slug: "why-backends-fail",
    tag: "Security"
  },
  {
    title: "Introducing WAF 2.0: Stopping SQLi in 30 seconds",
    description: "A deep dive into our new Web Application Firewall engine and how it intercepts malicious payloads without slowing down requests.",
    date: "March 10, 2026",
    author: "Backport Team",
    readTime: "4 min read",
    slug: "waf-2-announcement",
    tag: "Update"
  }
];

export default function BlogPage() {
  return (
    <div className="relative min-h-screen bg-black text-zinc-300">
      <MatrixBackground />
      
      <div className="mx-auto max-w-5xl px-6 py-24 relative z-10">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold text-white sm:text-6xl tracking-tight mb-4">Engineering Blog</h1>
          <p className="text-zinc-500 text-lg">Insights on API security, performance, and scaling.</p>
        </div>

        <div className="grid gap-8">
          {POSTS.map((post) => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`}
              className="group block p-8 rounded-2xl border border-white/5 bg-zinc-900/50 hover:bg-zinc-900 hover:border-emerald-500/30 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium mb-4">
                    {post.tag}
                  </span>
                  <h2 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors mb-2">
                    {post.title}
                  </h2>
                  <p className="text-zinc-400 mb-6 leading-relaxed">
                    {post.description}
                  </p>
                  <div className="flex items-center gap-6 text-xs text-zinc-500 font-mono">
                    <span className="flex items-center gap-2"><Calendar className="w-3 h-3"/> {post.date}</span>
                    <span className="flex items-center gap-2"><User className="w-3 h-3"/> {post.author}</span>
                    <span className="flex items-center gap-2"><Clock className="w-3 h-3"/> {post.readTime}</span>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-zinc-700 group-hover:text-emerald-400 group-hover:translate-x-2 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
