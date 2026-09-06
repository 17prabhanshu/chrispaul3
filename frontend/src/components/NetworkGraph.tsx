"use client";
import dynamic from 'next/dynamic';
import { useCallback, useRef, useEffect, useState } from 'react';
import { MagnifyingGlassPlus, MagnifyingGlassMinus, ArrowsOutSimple, CircleDashed } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'motion/react';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export function NetworkGraph({ data, onNodeClick }: { data: any, onNodeClick?: (node: any) => void }) {
  const fgRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);
  const [filterType, setFilterType] = useState<string>("ALL");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNodeClick = useCallback((node: any) => {
    if (onNodeClick) onNodeClick(node);
    if (fgRef.current) {
      fgRef.current.centerAt(node.x, node.y, 800);
      fgRef.current.zoom(3.5, 800);
    }
  }, [onNodeClick]);

  const handleZoomIn = () => {
    if (fgRef.current) fgRef.current.zoom(fgRef.current.zoom() * 1.3, 400);
  };

  const handleZoomOut = () => {
    if (fgRef.current) fgRef.current.zoom(fgRef.current.zoom() * 0.7, 400);
  };

  const handleResetZoom = () => {
    if (fgRef.current) fgRef.current.zoomToFit(600, 40);
  };

  const filteredData = {
    nodes: data?.nodes?.filter((n: any) => filterType === "ALL" || n.group === filterType) || [],
    links: data?.links?.filter((l: any) => {
      if (filterType === "ALL") return true;
      const srcId = typeof l.source === 'object' ? l.source.id : l.source;
      const tgtId = typeof l.target === 'object' ? l.target.id : l.target;
      const srcNode = data?.nodes?.find((n: any) => n.id === srcId);
      const tgtNode = data?.nodes?.find((n: any) => n.id === tgtId);
      return srcNode?.group === filterType || tgtNode?.group === filterType;
    }) || []
  };

  if (!mounted || !data) return (
    <div className="w-full h-full bg-[#050507] flex flex-col items-center justify-center text-blue-500/50 font-mono text-xs gap-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-500/5 animate-pulse mix-blend-screen"></div>
      <CircleDashed size={48} className="animate-spin text-blue-500/80" />
      <span className="tracking-[0.3em] uppercase">Booting Graph Inference Engine...</span>
    </div>
  );

  return (
    <div className="w-full h-full relative bg-[#050507] overflow-hidden">
      <div className="grain-overlay"></div>
      {/* Top Legend and Filter Toolbar */}
      <div className="absolute top-6 left-6 z-20 flex gap-2 p-1.5 border border-white/5 bg-black/40 backdrop-blur-md rounded-lg shadow-2xl text-[10px] font-mono tracking-widest uppercase">
        {[
          { key: "ALL", label: "ALL NODES", color: "text-white" },
          { key: "ACTOR", label: "ACTORS", color: "text-blue-400" },
          { key: "BANK_ACCOUNT", label: "BANKS (FIAT)", color: "text-emerald-400" },
          { key: "WALLET", label: "CRYPTO WALLETS", color: "text-amber-400" },
          { key: "IDENTIFIER", label: "IDENTIFIERS", color: "text-purple-400" }
        ].map(btn => (
          <button
            key={btn.key}
            onClick={() => setFilterType(btn.key)}
            className={`px-3 py-1.5 rounded transition-all duration-300 ${
              filterType === btn.key ? "bg-white/10 shadow-[inset_0_0_10px_rgba(255,255,255,0.1)] " + btn.color : "text-zinc-600 hover:text-zinc-300 hover:bg-white/5"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Zoom Control Overlay */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2 bg-black/40 backdrop-blur-md p-1 border border-white/5 rounded-lg shadow-2xl">
        <button onClick={handleZoomIn} className="p-2 hover:bg-white/10 text-zinc-400 hover:text-white rounded transition-colors"><MagnifyingGlassPlus size={16} /></button>
        <button onClick={handleZoomOut} className="p-2 hover:bg-white/10 text-zinc-400 hover:text-white rounded transition-colors"><MagnifyingGlassMinus size={16} /></button>
        <button onClick={handleResetZoom} className="p-2 hover:bg-white/10 text-zinc-400 hover:text-white rounded transition-colors"><ArrowsOutSimple size={16} /></button>
      </div>

      <ForceGraph2D
        ref={fgRef}
        graphData={filteredData}
        nodeLabel={(node: any) => `${node.label} [${node.group}]`}
        nodeColor={(node: any) => {
          if (node.group === 'ACTOR') return '#3B82F6'; // Blue
          if (node.group === 'BANK_ACCOUNT') return '#10B981'; // Emerald
          if (node.group === 'WALLET') return '#F59E0B'; // Amber
          if (node.group === 'IDENTIFIER') return '#A855F7'; // Purple
          if (node.group === 'LISTING') return '#EF4444'; // Red
          return '#6B7280';
        }}
        nodeRelSize={8}
        nodeCanvasObjectMode={() => 'after'}
        nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
          if (globalScale < 1.5) return;
          const label = node.label || '';
          const fontSize = 10 / globalScale;
          ctx.font = `${fontSize}px monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.fillText(label.length > 18 ? label.substring(0, 16) + '...' : label, node.x, node.y + 14);
        }}
        linkColor={() => 'rgba(255, 255, 255, 0.1)'}
        linkWidth={1}
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        linkDirectionalArrowColor={() => 'rgba(255, 255, 255, 0.2)'}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={1.5}
        linkDirectionalParticleSpeed={0.005}
        linkDirectionalParticleColor={() => 'rgba(59, 130, 246, 0.8)'}
        onNodeClick={handleNodeClick}
        backgroundColor="#050507"
      />
    </div>
  );
}
