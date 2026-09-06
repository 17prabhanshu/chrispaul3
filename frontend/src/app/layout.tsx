import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { CommandPalette } from "@/components/CommandPalette";
import { WalkthroughOverlay } from "@/components/WalkthroughOverlay";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plexMono = IBM_Plex_Mono({ weight: ["400", "500", "600"], subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "DARKINT | Investigative Intelligence System",
  description: "Government intelligence terminal and police investigation workstation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${plexMono.variable} antialiased bg-[#050507] text-white h-screen flex flex-col overflow-hidden`}>
        {/* Institutional Header */}
        <header className="h-12 bg-[#0A0E14] border-b border-white/5 shrink-0 flex items-center justify-between px-4 z-50 rounded-none shadow-md relative">
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600/20 text-blue-400 flex items-center justify-center font-serif font-bold italic border border-blue-500/30 rounded-none shadow-[0_0_10px_rgba(37,99,235,0.2)]">
                CP
              </div>
              <div className="leading-tight">
                <div className="text-[10px] text-blue-400/80 font-mono uppercase tracking-widest">Chandigarh Police</div>
                <div className="text-sm font-semibold text-white tracking-wide drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">CYBER CRIME & INTELLIGENCE UNIT</div>
              </div>
            </div>
            <div className="w-px h-6 bg-white/10 hidden md:block"></div>
            <div className="hidden md:flex flex-col justify-center">
              <div className="text-xs font-semibold text-zinc-200 tracking-wider">DARKINT // CP3</div>
              <div className="text-[9px] font-mono text-zinc-500 uppercase">Investigative Intelligence System</div>
            </div>
            <div className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[9px] font-mono uppercase ml-4 font-bold rounded-sm backdrop-blur-md">
              Synthetic Data / Demo Environment
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">System Status</div>
              <div className="text-xs text-green-400 font-bold flex items-center justify-end gap-2 drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                SECURE & ACTIVE
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">Investigator ID</div>
              <div className="text-xs font-mono text-white font-bold">OP-7492</div>
            </div>
          </div>
        </header>

        {/* Main Application Area */}
        <div className="flex flex-1 overflow-hidden relative">
          <Sidebar />
          <main className="flex-1 overflow-hidden bg-[#050507] relative">
            {children}
            <CommandPalette />
            <WalkthroughOverlay />
          </main>
        </div>
      </body>
    </html>
  );
}
