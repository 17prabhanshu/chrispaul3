"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShieldChevron,
  WarningOctagon,
  FolderOpen,
  Users,
  MagnifyingGlass,
  FileText,
  Database,
  Bank,
  CheckSquareOffset
} from "@phosphor-icons/react";
import clsx from "clsx";

const navSections = [
  {
    title: "OPERATIONS",
    items: [
      { href: "/", label: "Command Center", icon: ShieldChevron },
      { href: "/actions", label: "Action Center", icon: CheckSquareOffset, badge: "11" },
      { href: "/alerts", label: "Alerts", icon: WarningOctagon, badge: "03", badgeColor: "bg-red-500/20 text-red-400 border border-red-500/30" },
      { href: "/investigations", label: "Investigations", icon: FolderOpen },
    ]
  },
  {
    title: "INTELLIGENCE",
    items: [
      { href: "/entities", label: "Entities Directory", icon: Users },
      { href: "/search", label: "Global Search", icon: MagnifyingGlass, shortcut: "⌘K" },
    ]
  },
  {
    title: "FINANCIAL FORENSICS",
    items: [
      { href: "/financial", label: "Asset Review (Fiat)", icon: Bank, badge: "6" },
    ]
  },
  {
    title: "STATUTORY REPORTING",
    items: [
      { href: "/reports", label: "Evidentiary Reports", icon: FileText },
    ]
  },
  {
    title: "INTELLIGENCE INGESTION",
    items: [
      { href: "/ingestion", label: "Tor & NLP Ingestion", icon: Database },
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // ⌘K handled by CommandPalette globally now, keeping it here for visual only
  
  return (
    <aside className="w-64 bg-[#0A0E14] border-r border-white/5 flex flex-col h-full shrink-0 z-20 relative">
      <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent"></div>
      
      <div className="flex-1 overflow-y-auto py-6 custom-scrollbar">
        {navSections.map((section, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="px-6 text-[10px] font-mono text-blue-500/50 uppercase tracking-widest mb-2 font-semibold">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item: any) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={clsx(
                        "flex items-center justify-between px-6 py-2.5 text-xs transition-all duration-200 border-l-[3px]",
                        isActive
                          ? "border-blue-500 bg-blue-500/10 text-white font-medium shadow-[inset_4px_0_10px_rgba(37,99,235,0.1)]"
                          : "border-transparent text-zinc-400 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon
                          weight={isActive ? "fill" : "regular"}
                          className={clsx("text-lg", isActive ? "text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" : "text-zinc-500")}
                        />
                        <span className="tracking-wide">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <span className={clsx("text-[9px] font-mono px-1.5 py-0.5 rounded-sm", item.badgeColor || "bg-white/10 text-zinc-300 border border-white/10")}>
                            {item.badge}
                          </span>
                        )}
                        {item.shortcut && (
                          <kbd className="text-[9px] font-mono bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-zinc-500">
                            {item.shortcut}
                          </kbd>
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      
      {/* System Telemetry Footer */}
      <div className="p-4 border-t border-white/5 bg-[#050507] text-[10px] font-mono text-zinc-500 space-y-2 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.5)]"></span>
            Tor Crawlers
          </span>
          <span className="font-bold text-zinc-300">8 Active</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_5px_rgba(59,130,246,0.5)]"></span>
            FIU-IND Node
          </span>
          <span className="font-bold text-blue-400">Synced</span>
        </div>
        <div className="flex justify-between items-center pt-2 mt-2 border-t border-white/5 text-[9px] text-zinc-600">
          <span>DARKINT v3.1</span>
          <span className="text-red-500/50">RESTRICTED</span>
        </div>
      </div>
    </aside>
  );
}
