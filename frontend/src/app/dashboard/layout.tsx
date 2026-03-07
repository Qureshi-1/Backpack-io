"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/lib/auth";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!auth.isLoggedIn()) {
      router.push("/auth/login");
    }
  }, [router]);

  if (!mounted || !auth.isLoggedIn()) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}
