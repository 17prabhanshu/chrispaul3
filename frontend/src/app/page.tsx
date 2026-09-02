"use client";

import { useEffect, useState } from "react";
import axios from "axios";
axios.defaults.headers.common["X-API-Key"] = "darkint-hackathon-secret-key";
import { ShieldAlert, Users, Network, TrendingUp, AlertTriangle, Activity, Database, Cpu, Terminal, Zap, CheckCircle, ChevronRight, Lock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

export default function Dashboard() {
  const [health, setHealth] = useState<any>(null);
  const [entities, setEntities] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [copilotResponse, setCopilotResponse] = useState<any>(null);
  const [copilotQuery, setCopilotQuery] = useState("");
  const [pipelineStatus, setPipelineStatus] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<any | null>(null);
  const [isExplaining, setIsExplaining] = useState<boolean>(false);
  const [textExplanation, setTextExplanation] = useState<any | null>(null);
  const [isTextExplaining, setIsTextExplaining] = useState<boolean>(false);

  const fetchExplanation = async (nodeId: string) => {
    setIsExplaining(true);
    try {
      const res = await axios.get(`http://localhost:8000/api/analytics/graph/explain/${nodeId}`, {
        headers: { "X-API-Key": "darkint-hackathon-secret-key" }
      });
      setExplanation(res.data);
    } catch(err: any) {
      alert(`Error fetching explanation: ${err.message}`);
    } finally {
      setIsExplaining(false);
    }
  };

  const fetchTextExplanation = async (entityId: string) => {
    setIsTextExplaining(true);
    setTextExplanation(null);
    try {
      const res = await axios.get(`http://localhost:8000/api/analytics/text/explain-entity/${entityId}`);
      setTextExplanation(res.data);
    } catch(err: any) {
      console.error("Text explanation error:", err.message);
    } finally {
      setIsTextExplaining(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const h = await axios.get("http://localhost:8000/api/system/health");
        setHealth(h.data);
        
        const ent = await axios.get("http://localhost:8000/api/entities");
        setEntities(ent.data);
        
        const alt = await axios.get("http://localhost:8000/api/alerts");
        setAlerts(alt.data);
        
        // Mock chart data for UI visual
        setChartData([
          { time: '00:00', risk: 10 },
          { time: '04:00', risk: 15 },
          { time: '08:00', risk: 45 },
          { time: '12:00', risk: 30 },
          { time: '16:00', risk: 85 },
          { time: '20:00', risk: 65 },
        ]);
      } catch(err) {
        console.error("Polling error", err);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const runPipeline = async (action: string) => {
    setIsProcessing(action);
    try {
      let endpoint = "";
      if (action === "ingest_agora") endpoint = "/api/pipeline/ingest/agora";
      if (action === "train_gnn") endpoint = "/api/analytics/graph/train-gnn";
      
      const res = await axios.post(`http://localhost:8000${endpoint}`, action === "ingest_agora" ? { limit: 2 } : {});
      setPipelineStatus(`${action} success: ${res.data.message}`);
      
      // refresh data
      const h = await axios.get("http://localhost:8000/api/system/health");
      setHealth(h.data);
      const ent = await axios.get("http://localhost:8000/api/entities");
      setEntities(ent.data);
      const alt = await axios.get("http://localhost:8000/api/alerts");
      setAlerts(alt.data);
    } catch(err: any) {
      setPipelineStatus(`Error: ${err.response?.data?.detail || err.message}`);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleAskCopilot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotQuery.trim()) return;
    
    try {
      const res = await axios.post("http://localhost:8000/api/copilot/query", { query: copilotQuery });
      setCopilotResponse(res.data);
    } catch(err) {
      console.error(err);
    }
  };

  const handlePipeline = async (endpoint: string, successMsg: string, processId: string) => {
    setPipelineStatus("");
    setIsProcessing(processId);
    try {
      const payload = endpoint.includes('agora') ? { limit: 2 } : undefined;
      const res = await axios.post(`http://localhost:8000/api${endpoint}`, payload);
      setPipelineStatus(`${successMsg} | Status: Success`);
      
      // Force refresh data after pipeline finishes
      const ent = await axios.get("http://localhost:8000/api/entities");
      setEntities(ent.data);
      const alt = await axios.get("http://localhost:8000/api/alerts");
      setAlerts(alt.data);
    } catch(err: any) {
      setPipelineStatus(`Error: ${err.response?.data?.detail || err.message}`);
    } finally {
      setIsProcessing(null);
    }
  };

  const highRiskEntities = entities.filter(e => e.anomaly_score > 0.5);

  return (
    <div className="relative min-h-screen bg-[#030303] text-neutral-200 p-4 md:p-8 font-sans overflow-hidden z-0">
      <div className="data-flow-bg"></div>
      
      {/* Top Header */}
      <header className="relative flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-white/5 z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Network className="text-cyan-400" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tighter text-white flex items-center gap-2 glitch-text">
              DARKINT <span className="text-cyan-500 font-light text-2xl">OS</span>
            </h1>
            <p className="text-xs font-mono text-cyan-500/60 mt-1 uppercase tracking-widest flex items-center gap-2">
              <Lock size={10} /> Secure Illicit Market Intelligence Platform
            </p>
          </div>
        </div>
        <div className="flex gap-6 mt-4 md:mt-0">
          <div className="flex items-center gap-3 px-4 py-2 glass-panel rounded-full">
            <span className="relative flex h-3 w-3">
              {health && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-3 w-3 ${health ? 'bg-cyan-500' : 'bg-red-500'}`}></span>
            </span>
            <span className="text-xs font-mono font-bold tracking-wider text-white">
              SYS_STATUS: <span className={health ? 'text-cyan-400' : 'text-red-400'}>{health ? 'OPTIMAL' : 'DEGRADED'}</span>
            </span>
          </div>
        </div>
      </header>

      {/* Command Center */}
      <div className="glass-panel rounded-2xl p-6 mb-8 neon-border relative overflow-hidden group">
        <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 group-hover:animate-[sweep_2s_ease-in-out_infinite]"></div>
        
        <div className="flex items-center justify-between text-neutral-400 mb-6 relative z-10">
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <Terminal size={14} className="text-cyan-400" />
            Command Center <span className="text-cyan-500/50">v4.5</span>
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          <button 
            disabled={isProcessing === 'agora'}
            onClick={() => handlePipeline("/pipeline/ingest/agora", "Agora Dataset Ingested", 'agora')} 
            className="relative flex items-center justify-between bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/50 text-white px-5 py-4 rounded-xl text-sm font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:-translate-y-1 disabled:opacity-50 disabled:hover:-translate-y-0 disabled:hover:shadow-none"
          >
            <div className="flex items-center gap-3">
              <Database size={18} className="text-emerald-400" />
              <span className="font-mono tracking-wide">1. INGEST AGORA</span>
            </div>
            {isProcessing === 'agora' ? <div className="spinner !border-l-emerald-400"></div> : <ChevronRight size={16} className="text-emerald-500/50" />}
          </button>
          
          <button 
            disabled={isProcessing === 'gnn'}
            onClick={() => handlePipeline("/analytics/graph/train-gnn", "GraphSAGE Model Trained", 'gnn')} 
            className="relative flex items-center justify-between bg-white/5 hover:bg-purple-500/10 border border-white/10 hover:border-purple-500/50 text-white px-5 py-4 rounded-xl text-sm font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:-translate-y-1 disabled:opacity-50 disabled:hover:-translate-y-0 disabled:hover:shadow-none"
          >
            <div className="flex items-center gap-3">
              <Cpu size={18} className="text-purple-400" />
              <span className="font-mono tracking-wide">2. TRAIN GRAPHSAGE</span>
            </div>
            {isProcessing === 'gnn' ? <div className="spinner !border-l-purple-400"></div> : <ChevronRight size={16} className="text-purple-500/50" />}
          </button>
          
          <button 
            disabled={isProcessing === 'osint'}
            onClick={() => handlePipeline("/pipeline/ingest/osint", "OSINT Scrape Completed", 'osint')} 
            className="relative flex items-center justify-between bg-white/5 hover:bg-blue-500/10 border border-white/10 hover:border-blue-500/50 text-white px-5 py-4 rounded-xl text-sm font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:-translate-y-1 disabled:opacity-50 disabled:hover:-translate-y-0 disabled:hover:shadow-none"
          >
            <div className="flex items-center gap-3">
              <Activity size={18} className="text-blue-400" />
              <span className="font-mono tracking-wide">3. EXECUTE OSINT</span>
            </div>
            {isProcessing === 'osint' ? <div className="spinner !border-l-blue-400"></div> : <ChevronRight size={16} className="text-blue-500/50" />}
          </button>
        </div>
        
        {pipelineStatus && (
          <div className="mt-4 flex items-center gap-2 text-xs font-mono bg-cyan-950/30 p-3 rounded-lg text-cyan-300 border border-cyan-900/50 shadow-[inset_0_0_10px_rgba(6,182,212,0.1)] relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <CheckCircle size={14} className="text-cyan-400" />
            <span className="glitch-text">{pipelineStatus}</span>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "OBSERVED ENTITIES", value: entities.length, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
          { label: "HIGH-RISK LEADS", value: highRiskEntities.length, icon: ShieldAlert, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
          { label: "ACTIVE ALERTS", value: alerts.length, icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
          { label: "EMERGING CLUSTERS", value: 0, icon: TrendingUp, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" }
        ].map((kpi, i) => (
          <div key={i} className={`glass-panel rounded-2xl p-5 border-l-4 ${kpi.border} hover:scale-[1.02] transition-transform duration-300 cursor-default`}>
            <div className="flex items-center justify-between text-neutral-400 mb-3">
              <h3 className="text-xs font-mono font-bold tracking-wider">{kpi.label}</h3>
              <div className={`p-2 rounded-lg ${kpi.bg}`}>
                <kpi.icon size={16} className={kpi.color} />
              </div>
            </div>
            <p className={`text-4xl font-extrabold tracking-tighter ${kpi.color} drop-shadow-[0_0_10px_currentColor]`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Chart Section */}
          <div className="glass-panel rounded-2xl p-6 relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Activity size={14} className="text-cyan-400" /> Temporal Activity Matrix
              </h3>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#ffffff50" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                  <YAxis stroke="#ffffff50" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(5, 5, 5, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', backdropFilter: 'blur(10px)' }} 
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorRisk)" />
                  <Area type="monotone" dataKey="events" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorEvents)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table Section */}
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <ShieldAlert size={14} className="text-red-400" /> Critical Priority Leads
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-500 font-mono text-xs uppercase tracking-wider">
                    <th className="pb-3 px-4 font-medium">Entity Identifier</th>
                    <th className="pb-3 px-4 font-medium">Vector</th>
                    <th className="pb-3 px-4 font-medium">Threat Level</th>
                    <th className="pb-3 px-4 font-medium">Detection Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {highRiskEntities.slice(0, 5).map(ent => (
                    <tr 
                      key={ent.entity_id} 
                      className="hover:bg-white/5 transition-colors group cursor-pointer"
                      onClick={() => { fetchExplanation(ent.entity_id); fetchTextExplanation(ent.entity_id); }}
                    >
                      <td className="py-4 px-4 font-mono text-cyan-300 flex items-center gap-2">
                        <Zap size={12} className="text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {ent.name}
                      </td>
                      <td className="py-4 px-4 text-xs font-medium tracking-wider text-neutral-300">
                        <span className="bg-white/5 px-2 py-1 rounded-md border border-white/10">
                          {ent.entity_type}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-white/10 rounded-full h-1.5 max-w-[80px]">
                            <div className="bg-red-500 h-1.5 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)]" style={{ width: `${ent.anomaly_score * 100}%` }}></div>
                          </div>
                          <span className="text-red-400 font-mono text-xs font-bold">
                            {(ent.anomaly_score * 100).toFixed(0)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono text-neutral-500 text-xs">
                        {new Date(ent.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {highRiskEntities.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-neutral-500 font-mono text-xs">No high risk entities detected. System clear.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Explanation Block */}
            {isExplaining && (
              <div className="mt-4 p-4 border border-cyan-500/20 bg-cyan-500/5 rounded-lg text-sm text-cyan-200 animate-pulse">
                Running ablation analysis...
              </div>
            )}
            {explanation && !isExplaining && (
              <div className="mt-4 p-4 border border-red-500/30 bg-black rounded-lg">
                <h3 className="text-red-400 font-bold mb-2">GNN Anomaly Explanation</h3>
                <p className="text-sm text-neutral-400 mb-2">Original Anomaly Score: <span className="text-white font-mono">{explanation.original_score.toFixed(4)}</span></p>
                <div className="space-y-2">
                  <p className="text-xs text-neutral-500 uppercase tracking-wider">Contributing Connections (Ablation Delta)</p>
                  {explanation.explanations.map((exp: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-xs p-2 bg-white/5 rounded">
                      <span className="text-cyan-300 font-mono">{exp.neighbor_id}</span>
                      <span className="text-red-300">-{exp.delta.toFixed(4)}</span>
                    </div>
                  ))}
                  {explanation.explanations.length === 0 && (
                    <p className="text-xs text-neutral-500">No significant neighbors contributed to this score.</p>
                  )}
                </div>
              </div>
            )}
            
            {/* SHAP Text Explanation Block */}
            {isTextExplaining && (
              <div className="mt-4 p-4 border border-purple-500/20 bg-purple-500/5 rounded-lg text-sm text-purple-200 animate-pulse">
                Computing SHAP feature importance...
              </div>
            )}
            {textExplanation && !isTextExplaining && (
              <div className="mt-4 p-4 border border-purple-500/30 bg-black rounded-lg">
                <h3 className="text-purple-400 font-bold mb-2">Text Heuristic Explanation (SHAP)</h3>
                <p className="text-xs text-neutral-500 mb-3">Feature contributions to the TF-IDF Logistic Regression risk score</p>
                <div className="space-y-1">
                  {textExplanation.top_contributions?.map((c: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-xs p-2 bg-white/5 rounded">
                      <span className="text-purple-300 font-mono">{c.term}</span>
                      <span className={c.shap_contribution > 0 ? "text-red-300" : "text-green-300"}>
                        {c.shap_contribution > 0 ? "+" : ""}{c.shap_contribution.toFixed(4)}
                      </span>
                    </div>
                  ))}
                  {(!textExplanation.top_contributions || textExplanation.top_contributions.length === 0) && (
                    <p className="text-xs text-neutral-500">No significant SHAP features found.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          {/* AI Copilot Section */}
          <div className="glass-panel rounded-2xl flex flex-col h-[450px] relative overflow-hidden neon-border">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-500"></div>
            
            <div className="p-5 border-b border-white/10 bg-white/5">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Cpu size={14} className="text-purple-400" /> Neural Copilot
              </h3>
            </div>
            
            <div className="p-5 flex-1 overflow-y-auto space-y-4 custom-scrollbar">
              {copilotResponse ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-cyan-500/10 border border-cyan-500/30 p-4 rounded-xl text-sm text-cyan-50 leading-relaxed shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                    <p className="font-mono text-xs text-cyan-400 mb-2 border-b border-cyan-500/20 pb-1">ANALYSIS_COMPLETE:</p>
                    {copilotResponse.answer}
                  </div>
                  {copilotResponse.evidence_ids?.length > 0 && (
                    <div className="text-xs font-mono bg-white/5 p-3 rounded-lg border border-white/10 text-neutral-400">
                      <span className="text-white font-bold">EVIDENCE_REF:</span> [{copilotResponse.evidence_ids.join(', ')}]
                    </div>
                  )}
                  {copilotResponse.caveats?.length > 0 && (
                    <div className="text-xs font-mono bg-amber-500/10 p-3 rounded-lg border border-amber-500/20 text-amber-300/80">
                      <span className="text-amber-400 font-bold">LIMITATION_WARNING:</span> {copilotResponse.caveats.join(' ')}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-50">
                  <Cpu size={32} className="text-cyan-500 mb-2 animate-pulse" />
                  <p className="text-xs font-mono text-cyan-400">NEURAL ENGINE IDLE</p>
                  <p className="text-sm text-neutral-500">Await query input for threat synthesis.</p>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-white/10 bg-black/20">
              <form onSubmit={handleAskCopilot} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Terminal size={14} className="text-cyan-500/50" />
                </div>
                <input 
                  type="text" 
                  value={copilotQuery}
                  onChange={(e) => setCopilotQuery(e.target.value)}
                  placeholder="Query intel database..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-24 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all font-mono"
                />
                <button 
                  type="submit" 
                  className="absolute right-2 top-2 bottom-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 rounded-lg text-xs font-bold tracking-wider transition-colors shadow-[0_0_10px_rgba(6,182,212,0.3)] hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] uppercase"
                >
                  Exec
                </button>
              </form>
            </div>
          </div>
          
          {/* Alerts Section */}
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-xs font-mono font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
              <AlertTriangle size={14} className="text-amber-400" /> Active System Alerts
            </h3>
            <div className="space-y-4">
              {alerts.slice(-5).reverse().map(alert => (
                <div key={alert.alert_id} className="relative pl-4 py-2 border-l-2 border-amber-500 hover:bg-white/5 transition-colors rounded-r-lg group cursor-default">
                  <div className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-neutral-200 tracking-wide uppercase text-xs">
                      {alert.alert_type.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-mono text-neutral-500">
                      {new Date(alert.created_at).toLocaleTimeString([], { hour12: false })}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400 line-clamp-2 pr-2" title={alert.reason}>
                    {alert.reason}
                  </div>
                </div>
              ))}
              {alerts.length === 0 && (
                <div className="text-xs font-mono text-neutral-500 text-center py-4 border border-dashed border-white/10 rounded-lg">
                  NO ACTIVE ALERTS
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.6);
        }
      `}</style>
    </div>
  );
}
