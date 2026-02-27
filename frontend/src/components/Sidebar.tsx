"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, Shield } from "lucide-react";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const links = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  if (!mounted) {
    return <div className="h-screen w-64 border-r border-zinc-800 bg-black text-zinc-300"></div>;
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r border-zinc-800 bg-black text-zinc-300">
      <div className="flex h-16 items-center border-b border-zinc-800 px-6">
        <Shield className="mr-3 h-6 w-6 text-emerald-500" />
        <span className="text-lg font-semibold text-zinc-50 tracking-tight">
          Backpack
        </span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-zinc-800/50 text-white"
                  : "text-zinc-400 hover:bg-zinc-800/30 hover:text-white"
              }`}
            >
              <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {link.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-zinc-800 p-4">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-zinc-800"></div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-zinc-500">admin@backpack.io</p>
          </div>
        </div>
      </div>
    </div>
  );
}
