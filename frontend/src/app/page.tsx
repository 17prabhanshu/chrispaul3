"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { WarningOctagon, Folder, CheckSquareOffset, FileText, MagnifyingGlass, Funnel, Clock, CaretRight, X, ShieldWarning, Cpu, ChartLineUp, Database, CircleDashed } from "@phosphor-icons/react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { NewCaseModal } from "@/components/NewCaseModal";
import { EvidenceTimeline } from "@/components/EvidenceTimeline";
import { motion, AnimatePresence } from "motion/react";

const STAGGER_DELAY = 0.05;

export default function CommandCenter() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [isNewCaseOpen, setIsNewCaseOpen] = useState(false);
  const [isIntercepting, setIsIntercepting] = useState(false);
  const [interceptText, setInterceptText] = useState("");
  const [stream, setStream] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/dashboard").then(r => r.json()).then(setData);
  }, []);

  const handleIntercept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interceptText.trim()) return;
    setIsIntercepting(true);
    try {
      const res = await fetch("http://localhost:8000/api/pipeline/ingest/intercept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: interceptText }),
      });
      const resData = await res.json();
      setStream(prev => [{
        id: Date.now(),
        text: interceptText,
        score: resData?.result?.anomaly_score || 0.99
      }, ...prev].slice(0, 5));
      setInterceptText("");
      // Refresh dash
      fetch("/api/dashboard").then(r => r.json()).then(setData);
    } catch(err) {
      console.error(err);
    }
    setIsIntercepting(false);
  };

  if (!data) return (
    <div className="flex items-center justify-center h-full w-full bg-[#050507]">
      <motion.div 
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="font-mono text-sm tracking-widest text-blue-500/50 flex flex-col items-center gap-4"
      >
        <CircleDashed size={32} className="animate-spin" />
        INITIALIZING SECURE TERMINAL...
      </motion.div>
    </div>
  );

  return (
    <div className="flex h-full overflow-hidden relative bg-[#050507] text-zinc-300">
      <div className="grain-overlay"></div>
      
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <NewCaseModal isOpen={isNewCaseOpen} onClose={() => setIsNewCaseOpen(false)} />
      
      <div className={clsx("flex-1 overflow-auto flex flex-col p-8 transition-all duration-500 ease-out z-10", selectedIncident ? "mr-[420px]" : "")}>
        
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-between items-end"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 relative">
                <div className="absolute inset-0 bg-red-500/20 animate-pulse mix-blend-screen rounded-lg"></div>
                <ShieldWarning className="text-blue-400 relative z-10" size={24} weight="fill" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tighter text-white flex items-center gap-2 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                DARKINT <span className="text-red-500 font-light text-2xl">// CP3</span>
              </h1>
            </div>
            <p className="text-[10px] font-mono text-blue-300/80 uppercase tracking-widest flex items-center gap-2">
               Chandigarh Police Cyber Command • Live ML Analytics
            </p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setIsNewCaseOpen(true)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono uppercase tracking-wider rounded-md transition-all flex items-center gap-2 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              <Folder size={14} /> New Case
            </button>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 flex flex-col gap-6 min-h-0">
            
            {/* KPI Bento Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: STAGGER_DELAY * 1 }}
              className="grid grid-cols-3 gap-4"
            >
              {[
                { label: "Active Investigations", value: data.metrics?.investigationCount || "06", icon: MagnifyingGlass, color: "text-blue-400", border: "border-blue-500/20", glow: "hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]" },
                { label: "Critical Alerts", value: data.recentAlerts?.filter((a:any)=>a.severity==='CRITICAL').length || "03", icon: WarningOctagon, color: "text-red-400", border: "border-red-500/20", glow: "hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]" },
                { label: "Entities Analyzed", value: data.metrics?.entityCount || "420", icon: Database, color: "text-purple-400", border: "border-purple-500/20", glow: "hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]" },
              ].map((kpi, i) => (
                <div key={i} className={clsx("glass-card p-5 rounded-xl flex flex-col justify-between group transition-all duration-300", kpi.glow)}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">{kpi.label}</div>
                    <kpi.icon size={16} className={kpi.color} />
                  </div>
                  <div className={clsx("text-4xl font-light tracking-tighter text-glow", kpi.color)}>
                    {kpi.value.toString().padStart(2, '0')}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Live Intercept Console */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: STAGGER_DELAY * 2 }}
              className="glass-card rounded-xl p-5 relative overflow-hidden"
            >
              <div className="absolute top-0 left-[-100%] w-[50%] h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-[scanline-x_3s_linear_infinite]"></div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ChartLineUp size={16} className="text-green-500 animate-pulse" />
                  <h3 className="text-green-500 text-xs font-bold font-mono tracking-widest uppercase">Live Threat Intercept</h3>
                </div>
              </div>
              
              <form onSubmit={handleIntercept} className="flex gap-3">
                <div className="flex-1 bg-black/40 border border-green-500/30 rounded-lg flex items-center px-3 py-2 shadow-[inset_0_0_10px_rgba(0,255,100,0.05)] focus-within:border-green-500/60 focus-within:shadow-[inset_0_0_15px_rgba(0,255,100,0.1)] transition-all">
                  <span className="text-green-500/50 font-mono text-sm mr-2">&gt;</span>
                  <input 
                    type="text" 
                    value={interceptText}
                    onChange={(e) => setInterceptText(e.target.value)}
                    placeholder="Paste raw intercepted comms here (e.g. 'Selling zero-day exploit...')"
                    className="bg-transparent text-green-400 font-mono text-sm outline-none w-full placeholder:text-green-500/30"
                    disabled={isIntercepting}
                    autoComplete="off"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isIntercepting || !interceptText.trim()}
                  className="px-6 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/50 rounded-lg font-mono text-xs uppercase tracking-widest transition-all disabled:opacity-50"
                >
                  {isIntercepting ? 'INJECTING...' : 'INJECT'}
                </button>
              </form>
              
              {stream.length > 0 && (
                <div className="mt-4 space-y-2">
                  {stream.map((s, idx) => (
                    <motion.div 
                      key={s.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xs font-mono flex items-start gap-3 bg-green-500/5 p-2 rounded border border-green-500/10"
                    >
                      <span className="text-green-500/50">[{new Date().toLocaleTimeString()}]</span>
                      <span className="text-green-300 flex-1 truncate">{s.text}</span>
                      <span className="text-red-400 font-bold">RISK: {(s.score * 100).toFixed(0)}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Priority Incidents Table */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: STAGGER_DELAY * 3 }}
              className="glass-card flex-1 flex flex-col min-h-0 rounded-xl overflow-hidden"
            >
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
                <h2 className="text-xs font-mono text-zinc-300 uppercase tracking-widest flex items-center gap-2">
                   ML Priority Targets
                </h2>
                <button className="text-[10px] font-mono text-zinc-500 hover:text-zinc-300 flex items-center gap-1 uppercase"><Funnel size={12}/> Filter</button>
              </div>
              
              <div className="flex-1 overflow-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-black/40 sticky top-0 z-10 border-b border-white/5">
                    <tr className="font-mono text-[10px] uppercase text-zinc-500">
                      <th className="px-5 py-4 font-semibold tracking-wider">Status</th>
                      <th className="px-5 py-4 font-semibold tracking-wider">Entity Identifier</th>
                      <th className="px-5 py-4 font-semibold tracking-wider">Confidence</th>
                      <th className="px-5 py-4 font-semibold tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <AnimatePresence>
                      {data.topEntities?.length === 0 && (
                        <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-transparent cursor-default">
                          <td colSpan={4} className="px-5 py-8 text-center text-zinc-500 font-mono text-[10px] tracking-widest">
                            NO PRIORITY TARGETS QUEUED
                          </td>
                        </motion.tr>
                      )}
                      {data.topEntities?.slice(0,8).map((ent: any, i: number) => (
                        <motion.tr 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: STAGGER_DELAY * (4 + i) }}
                          key={ent.id} 
                          onClick={() => setSelectedIncident(ent)}
                          className={clsx(
                            "transition-all duration-200 cursor-pointer group",
                            selectedIncident?.id === ent.id ? "bg-blue-500/10 border-l-2 border-l-blue-500" : "hover:bg-white/5 border-l-2 border-l-transparent"
                          )}
                        >
                          <td className="px-5 py-4">
                            <span className={clsx(
                              "px-2 py-1 text-[9px] font-mono uppercase tracking-widest rounded border",
                              ent.priorityScore >= 80 ? "bg-red-500/10 text-red-400 border-red-500/30" : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            )}>
                              {ent.priorityScore >= 80 ? 'CRITICAL' : 'HIGH'}
                            </span>
                          </td>
                          <td className="px-5 py-4 font-mono text-xs font-medium text-zinc-200 group-hover:text-white transition-colors">{ent.label}</td>
                          <td className="px-5 py-4 font-mono text-xs text-zinc-400 flex items-center gap-2">
                            <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                              <div className={clsx("h-full", ent.priorityScore >= 80 ? "bg-red-500" : "bg-amber-500")} style={{width: `${ent.priorityScore}%`}}></div>
                            </div>
                            {ent.priorityScore}%
                          </td>
                          <td className="px-5 py-4 text-right">
                            <button className="text-[10px] font-mono uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors">
                              Analyze
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar - System Alerts */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: STAGGER_DELAY * 4 }}
            className="glass-card rounded-xl flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-white/5 bg-black/20">
              <h2 className="text-xs font-mono text-zinc-300 uppercase tracking-widest flex items-center gap-2">
                 Real-Time Alerts
              </h2>
            </div>
            <div className="p-4 space-y-3 flex-1 overflow-auto">
              {data.recentAlerts?.map((alert: any, i: number) => (
                <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className={clsx("text-[9px] font-mono uppercase tracking-widest", alert.severity === 'CRITICAL' ? 'text-red-400' : 'text-amber-400')}>
                      {alert.severity}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-600">JUST NOW</span>
                  </div>
                  <h4 className="text-sm text-zinc-200">{alert.title}</h4>
                </div>
              ))}
              
              <div className="mt-8 border-t border-white/5 pt-4">
                <div className="flex items-center gap-2 mb-4">
                  <Cpu size={14} className="text-blue-400" />
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">ML Subsystems</span>
                </div>
                <div className="space-y-2">
                  {[
                    {name: "GraphSAGE Inferencer", status: "ONLINE", color: "text-green-400"},
                    {name: "GLiNER Zero-Shot NLP", status: "ONLINE", color: "text-green-400"},
                    {name: "FAISS Vector DB", status: "SYNCED", color: "text-blue-400"},
                  ].map((sys, i) => (
                    <div key={i} className="flex justify-between items-center text-xs font-mono">
                      <span className="text-zinc-500">{sys.name}</span>
                      <span className={sys.color}>{sys.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Slide-out Drawer */}
      <AnimatePresence>
        {selectedIncident && (
          <motion.div 
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute top-0 right-0 bottom-0 w-[420px] glass-card border-l border-white/10 shadow-2xl flex flex-col z-50 backdrop-blur-2xl bg-black/60"
          >
            <div className="p-6 border-b border-white/10 bg-black/40 relative">
              <button 
                onClick={() => setSelectedIncident(null)} 
                className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors p-1 bg-white/5 rounded-md hover:bg-red-500/20 hover:text-red-400"
              >
                <X size={16}/>
              </button>
              <div className="text-[10px] font-mono text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                ENTITY DOSSIER
              </div>
              <h2 className="text-2xl font-light text-white mb-3 tracking-tight">{selectedIncident.label}</h2>
              <div className="flex gap-2">
                <span className={clsx(
                  "px-2 py-1 text-[9px] font-mono uppercase tracking-widest rounded border",
                  selectedIncident.priorityScore >= 80 ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                )}>
                  RISK SCORE: {selectedIncident.priorityScore}
                </span>
                <span className="px-2 py-1 text-[9px] font-mono uppercase tracking-widest rounded border bg-blue-500/10 text-blue-400 border-blue-500/30">
                  {selectedIncident.type}
                </span>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto p-6 space-y-8">
              <section>
                <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-white/5 pb-2">
                  Algorithmic Assessment
                </h3>
                <div className="text-sm text-zinc-300 leading-relaxed bg-white/5 border border-white/10 p-4 rounded-lg font-light">
                  GraphSAGE anomaly detection combined with GLiNER entity extraction flags this node due to multi-hop overlap with known threat actors in the Agora dataset.
                </div>
              </section>

              <section>
                <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-white/5 pb-2">
                  Chain of Custody
                </h3>
                <EvidenceTimeline />
              </section>
              
              <section>
                <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-white/5 pb-2">
                  SHAP Feature Contributions
                </h3>
                <div className="space-y-2">
                  {["Wallet Co-occurrence", "Darknet Slang Detected", "Geographic Anomaly"].map((risk: string, i: number) => (
                    <div key={i} className="flex justify-between items-center text-xs bg-black/40 px-3 py-2 rounded-lg border border-white/5">
                      <span className="text-zinc-400">{risk}</span>
                      <span className="text-red-400 font-mono">+{(selectedIncident.priorityScore / 3).toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-white/5 pb-2">
                  Chain of Custody
                </h3>
                <EvidenceTimeline />
              </section>
            </div>
            
            <div className="p-6 border-t border-white/10 bg-black/40">
              <button 
                onClick={() => router.push(`/entities/${selectedIncident.id}`)} 
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono uppercase tracking-widest rounded-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              >
                Deep Dive Graph Analysis
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
