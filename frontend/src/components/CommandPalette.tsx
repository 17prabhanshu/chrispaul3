"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "motion/react";
import { MagnifyingGlass, User, ShieldCheck, Folder, FileText, ArrowRight } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99]"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20, x: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, y: -20, x: "-50%" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed top-[20%] left-1/2 w-full max-w-xl z-[100] shadow-2xl border border-white/10 rounded-xl overflow-hidden bg-[#0A0E14]"
          >
            <Command className="w-full flex flex-col" loop>
              <div className="flex items-center px-4 border-b border-white/10 bg-white/5">
                <MagnifyingGlass size={18} className="text-blue-500 mr-2" />
                <Command.Input 
                  autoFocus 
                  placeholder="Search entities, investigations, or alerts..." 
                  className="flex-1 bg-transparent text-white placeholder:text-zinc-500 h-14 outline-none font-mono text-sm"
                />
                <div className="text-[10px] font-mono text-zinc-500 border border-white/10 px-2 py-1 rounded bg-black/40">ESC</div>
              </div>
              <Command.List className="max-h-[300px] overflow-auto p-2 scrollbar-thin scrollbar-thumb-white/10">
                <Command.Empty className="py-6 text-center text-sm font-mono text-zinc-500">No results found.</Command.Empty>

                <Command.Group heading="Entities" className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest px-2 py-2">
                  <Command.Item onSelect={() => { router.push("/entities/1"); setOpen(false); }} className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm text-zinc-300 hover:bg-blue-500/20 hover:text-white cursor-pointer transition-colors aria-selected:bg-blue-500/20 aria-selected:text-white group">
                    <User size={16} className="text-blue-400 group-aria-selected:text-blue-300" />
                    <span>ShadowBroker</span>
                    <span className="ml-auto text-[10px] text-zinc-500 group-aria-selected:text-blue-400 font-mono">Actor</span>
                  </Command.Item>
                  <Command.Item onSelect={() => { router.push("/entities/2"); setOpen(false); }} className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm text-zinc-300 hover:bg-blue-500/20 hover:text-white cursor-pointer transition-colors aria-selected:bg-blue-500/20 aria-selected:text-white group">
                    <User size={16} className="text-blue-400 group-aria-selected:text-blue-300" />
                    <span>Neon Dust</span>
                    <span className="ml-auto text-[10px] text-zinc-500 group-aria-selected:text-blue-400 font-mono">Product</span>
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Investigations" className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest px-2 py-2 mt-2">
                  <Command.Item onSelect={() => { router.push("/investigations/INV-2026-0042"); setOpen(false); }} className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm text-zinc-300 hover:bg-purple-500/20 hover:text-white cursor-pointer transition-colors aria-selected:bg-purple-500/20 aria-selected:text-white group">
                    <Folder size={16} className="text-purple-400 group-aria-selected:text-purple-300" />
                    <span>Operation Alpha</span>
                    <span className="ml-auto text-[10px] text-zinc-500 group-aria-selected:text-purple-400 font-mono">Active</span>
                  </Command.Item>
                </Command.Group>

              </Command.List>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
