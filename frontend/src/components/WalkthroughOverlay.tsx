"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowRight, PlayCircle } from "@phosphor-icons/react";

const STEPS = [
  { target: "live-intercept", title: "Live Threat Intercept", desc: "Start the demo by injecting raw intercepted comms here. The FastAPI backend instantly processes it using GLiNER for zero-shot entity extraction." },
  { target: "priority-targets", title: "GNN Priority Queue", desc: "GraphSAGE models flag entities based on structural anomalies. High-risk targets automatically appear here." },
  { target: "dossier-panel", title: "Explainable AI Dossier", desc: "Click a target to reveal SHAP feature contributions and the Evidence Chain of Custody." },
  { target: "command-palette", title: "Command Palette", desc: "Press Cmd+K to navigate globally across the dataset like a pro." }
];

export function WalkthroughOverlay() {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!active) {
    return (
      <button 
        onClick={() => setActive(true)}
        className="fixed bottom-6 right-6 z-[90] px-4 py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30 rounded-full font-mono text-[10px] uppercase tracking-widest backdrop-blur-md flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)]"
      >
        <PlayCircle size={16} /> Demo Mode
      </button>
    );
  }

  const currentStep = STEPS[step];

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={() => setActive(false)} />
      
      <motion.div 
        key={step}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] glass-card p-6 rounded-2xl pointer-events-auto border border-white/10 bg-black/80"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="text-[10px] font-mono text-blue-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold border border-blue-500/50">{step + 1}</span>
            DEMO WALKTHROUGH
          </div>
          <button onClick={() => setActive(false)} className="text-zinc-500 hover:text-white"><X size={16}/></button>
        </div>
        <h3 className="text-xl font-light text-white mb-2">{currentStep.title}</h3>
        <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
          {currentStep.desc}
        </p>
        <div className="flex justify-between items-center pt-4 border-t border-white/10">
          <div className="flex gap-1">
            {STEPS.map((s, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === step ? 'bg-blue-500' : 'bg-white/20'}`} />
            ))}
          </div>
          <button 
            onClick={() => step < STEPS.length - 1 ? setStep(step + 1) : setActive(false)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-mono text-[10px] uppercase tracking-widest flex items-center gap-2 transition-colors"
          >
            {step < STEPS.length - 1 ? 'Next' : 'Finish'} <ArrowRight size={14} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
