"use client";

import { motion } from "motion/react";
import { CheckCircle, Clock, Database, Scan } from "@phosphor-icons/react";
import clsx from "clsx";
import { staggerContainer, staggerItem } from "@/lib/ui/motion-tokens";

const timelineEvents = [
  { id: 1, type: "INGEST", label: "Raw Data Ingested", source: "Tor Hidden Service (Agora)", timestamp: "08:14:22 UTC", icon: Database, color: "text-blue-400" },
  { id: 2, type: "PROCESS", label: "GLiNER Entity Extraction", source: "NLP Engine", timestamp: "08:14:24 UTC", icon: Scan, color: "text-purple-400" },
  { id: 3, type: "ANALYZE", label: "GraphSAGE Anomaly Detection", source: "GNN Inferencer", timestamp: "08:14:35 UTC", icon: CheckCircle, color: "text-green-400" },
  { id: 4, type: "FLAG", label: "Critical Priority Assessed", source: "Risk Scoring Module", timestamp: "08:14:36 UTC", icon: Clock, color: "text-red-400" }
];

export function EvidenceTimeline() {
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-4 relative before:absolute before:inset-0 before:ml-[15px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
      {timelineEvents.map((event, i) => (
        <motion.div key={event.id} variants={staggerItem} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-black/50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10 backdrop-blur-md">
            <event.icon size={14} className={event.color} />
          </div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-3 rounded-lg border border-white/5 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-colors shadow-lg">
            <div className="flex items-center justify-between mb-1">
              <div className={clsx("text-[10px] font-mono uppercase tracking-widest", event.color)}>{event.type}</div>
              <time className="text-[9px] font-mono text-zinc-500">{event.timestamp}</time>
            </div>
            <div className="text-xs text-zinc-300 font-medium">{event.label}</div>
            <div className="text-[10px] text-zinc-500 mt-1">{event.source}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
