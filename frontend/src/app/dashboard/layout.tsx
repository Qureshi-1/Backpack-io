"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { auth } from "@/lib/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!auth.isLoggedIn()) {
      router.replace("/login");
    }
  }, [router]);

  if (typeof window !== "undefined" && !auth.isLoggedIn()) {
    return null; // prevent flash
  }

  return (
    <div className="flex h-screen overflow-hidden w-full">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-[#0a0a0a] border-l border-zinc-800/60">
        {children}
      </main>
    </div>
  );
}
