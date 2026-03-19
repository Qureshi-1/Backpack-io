"use client";

import Link from "next/link";
import { ShieldCheck, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "@/lib/auth";

export default function Header({ onDemo }: { onDemo?: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    setIsLogged(auth.isLoggedIn());
  }, []);

  return (
    <header
      suppressHydrationWarning
      className="fixed top-0 left-0 right-0 z-40 border-b border-white/5 bg-black/50 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <ShieldCheck
            suppressHydrationWarning
            className="h-6 w-6 text-emerald-500"
          />
          <span className="text-lg font-semibold tracking-tight text-white">
            Backport
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <Link href="/docs" className="hover:text-white transition-colors">
            Docs
          </Link>
          <Link href="/#features" className="hover:text-white transition-colors">
            Features
          </Link>
          <Link href="/#how-it-works" className="hover:text-white transition-colors">
            How it Works
          </Link>
          <Link href="/#compare" className="hover:text-white transition-colors">
            Compare
          </Link>
          <Link href="/#pricing" className="hover:text-white transition-colors">
            Pricing
          </Link>
        </nav>
        <div className="hidden md:flex items-center gap-3">
          {onDemo ? (
            <button
              onClick={onDemo}
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Demo
            </button>
          ) : null}
          {isLogged ? (
            <Link
              href="/dashboard"
              className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition-all shadow-[0_0_15px_rgba(0,255,135,0.3)] hover:shadow-[0_0_30px_rgba(0,255,135,0.6)] hover:-translate-y-[2px]"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition-all shadow-[0_0_15px_rgba(0,255,135,0.3)] hover:shadow-[0_0_30px_rgba(0,255,135,0.6)] hover:-translate-y-[2px]"
              >
                Start Free
              </Link>
            </>
          )}
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-zinc-400 hover:text-white transition-colors"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-white/5 bg-black/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-6">
              <Link href="/docs" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-zinc-400 hover:text-white">Docs</Link>
              <Link href="/#features" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-zinc-400 hover:text-white">Features</Link>
              <Link href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-zinc-400 hover:text-white">How it Works</Link>
              <Link href="/#compare" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-zinc-400 hover:text-white">Compare</Link>
              <Link href="/#pricing" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-zinc-400 hover:text-white">Pricing</Link>
              <div className="h-px bg-white/5 my-2" />
              {onDemo && (
                <button
                  onClick={() => { onDemo(); setMobileMenuOpen(false); }}
                  className="text-left text-sm font-medium text-zinc-400 hover:text-white"
                >
                  Watch Demo
                </button>
              )}
              {isLogged ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-2 text-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition-all shadow-[0_0_15px_rgba(0,255,135,0.3)] hover:-translate-y-[2px]"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-zinc-400 hover:text-white">Log in</Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mt-2 text-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition-all shadow-[0_0_15px_rgba(0,255,135,0.3)] hover:-translate-y-[2px]"
                  >
                    Start Free
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
