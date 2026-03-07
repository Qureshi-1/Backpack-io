"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, LogOut } from "lucide-react";
import { auth } from "@/lib/auth";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    auth.logout();
  };

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <Link href="/dashboard" className="flex items-center gap-2">
        <ShieldCheck className="h-6 w-6 text-emerald-500" />
        <span className="font-bold text-white text-lg tracking-tight">
          Backport
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-6 text-sm text-zinc-400 font-medium">
        <Link href="/dashboard" className="hover:text-white transition-colors">
          Overview
        </Link>
        <Link
          href="/dashboard/api-keys"
          className="hover:text-white transition-colors"
        >
          API Keys
        </Link>
        <Link
          href="/dashboard/settings"
          className="hover:text-white transition-colors"
        >
          Settings
        </Link>
        <Link
          href="/dashboard/billing"
          className="hover:text-white transition-colors"
        >
          Billing
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleLogout}
          className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
}
