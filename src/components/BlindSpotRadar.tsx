import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ReasoningXRayResult, NodeType } from '../types';
import { Eye, HelpCircle, AlertOctagon, Zap, FileSearch, GitFork, X, ArrowRight, Layers, Maximize2, ShieldAlert } from 'lucide-react';

interface Props {
  result: ReasoningXRayResult;
  onSelectAssumption?: (id: string) => void;
  onSelectBlindSpot?: (id: string) => void;
  onSelectConflict?: (id: string) => void;
}

interface GraphNode {
  id: string;
  type: NodeType;
  title: string;
  subtitle: string;
  details: string;
  extra?: any;
  x: number;
  y: number;
  color: string;
  badge: string;
  connectedTo: string[]; // target node IDs
}

export const BlindSpotRadar: React.FC<Props> = ({ result, onSelectAssumption, onSelectBlindSpot, onSelectConflict }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'blindspot' | 'assumption' | 'conflict' | 'evidence' | 'secondorder'>('all');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'radar' | 'causal'>('radar');
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 550 });

  useEffect(() => {
    const updateDims = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(rect.width, 360),
          height: Math.max(Math.min(rect.width * 0.65, 600), 450)
        });
      }
    };
    updateDims();
    window.addEventListener('resize', updateDims);
    return () => window.removeEventListener('resize', updateDims);
  }, []);

  // Construct dynamic graph nodes from result
  const { nodes, links } = useMemo(() => {
    const rawNodes: GraphNode[] = [];
    const rawLinks: { source: string; target: string; type: NodeType }[] = [];

    const cx = dimensions.width / 2;
    const cy = dimensions.height / 2;

    // Center Node: The Decision
    const centerNode: GraphNode = {
      id: 'center-decision',
      type: 'decision',
      title: 'YOUR DECISION',
      subtitle: result.decision.length > 55 ? result.decision.slice(0, 52) + '...' : result.decision,
      details: result.decision,
      x: cx,
      y: cy,
      color: '#38BDF8',
      badge: 'CORE INQUIRY',
      connectedTo: []
    };
    rawNodes.push(centerNode);

    // Visible Reasons
    result.visibleReasons.forEach((r, idx) => {
      const id = `node-vis-${idx}`;
      rawNodes.push({
        id,
        type: 'visible',
        title: 'Visible Premise',
        subtitle: r.length > 40 ? r.slice(0, 38) + '...' : r,
        details: r,
        x: 0,
        y: 0,
        color: '#94A3B8',
        badge: 'EXPLICIT REASON',
        connectedTo: ['center-decision']
      });
      rawLinks.push({ source: 'center-decision', target: id, type: 'visible' });
    });

    // Assumptions
    result.assumptions.forEach((a, idx) => {
      const id = `node-assump-${idx}`;
      const targetVis = result.visibleReasons.length > 0 ? `node-vis-${idx % result.visibleReasons.length}` : 'center-decision';
      rawNodes.push({
        id,
        type: 'assumption',
        title: 'Unverified Assumption',
        subtitle: a.statement.length > 42 ? a.statement.slice(0, 40) + '...' : a.statement,
        details: a.statement,
        extra: a,
        x: 0,
        y: 0,
        color: '#F59E0B',
        badge: 'QUESTIONABLE PREMISE',
        connectedTo: [targetVis, 'center-decision']
      });
      rawLinks.push({ source: targetVis, target: id, type: 'assumption' });
    });

    // Blind Spots
    result.blindSpots.forEach((b, idx) => {
      const id = `node-bs-${idx}`;
      const targetAssump = result.assumptions.length > 0 ? `node-assump-${idx % result.assumptions.length}` : 'center-decision';
      rawNodes.push({
        id,
        type: 'blindspot',
        title: `Blind Spot: ${b.factor}`,
        subtitle: b.whyItMatters.length > 42 ? b.whyItMatters.slice(0, 40) + '...' : b.whyItMatters,
        details: b.whyItMatters,
        extra: b,
        x: 0,
        y: 0,
        color: '#EF4444',
        badge: b.severity.toUpperCase(),
        connectedTo: [targetAssump, 'center-decision']
      });
      rawLinks.push({ source: targetAssump, target: id, type: 'blindspot' });
    });

    // Conflicts
    result.conflicts.forEach((c, idx) => {
      const id = `node-conf-${idx}`;
      rawNodes.push({
        id,
        type: 'conflict',
        title: 'Reasoning Conflict',
        subtitle: c.conflict.length > 42 ? c.conflict.slice(0, 40) + '...' : c.conflict,
        details: `${c.priority} vs ${c.reason}`,
        extra: c,
        x: 0,
        y: 0,
        color: '#A855F7',
        badge: `TENSION ${c.tensionScore}/10`,
        connectedTo: ['center-decision']
      });
      rawLinks.push({ source: 'center-decision', target: id, type: 'conflict' });
    });

    // Missing Evidence
    result.missingEvidence.slice(0, 3).forEach((m, idx) => {
      const id = `node-evi-${idx}`;
      rawNodes.push({
        id,
        type: 'evidence',
        title: 'Missing Evidence',
        subtitle: m.item.length > 40 ? m.item.slice(0, 38) + '...' : m.item,
        details: `${m.category}: ${m.impactIfMissing}`,
        extra: m,
        x: 0,
        y: 0,
        color: '#38BDF8',
        badge: 'UNVERIFIED FACT',
        connectedTo: ['center-decision']
      });
      rawLinks.push({ source: 'center-decision', target: id, type: 'evidence' });
    });

    // Second Order Effects
    result.secondOrderEffects.slice(0, 2).forEach((s, idx) => {
      const id = `node-soe-${idx}`;
      rawNodes.push({
        id,
        type: 'secondorder',
        title: '2nd Order Cascade',
        subtitle: s.downstreamRisk.length > 40 ? s.downstreamRisk.slice(0, 38) + '...' : s.downstreamRisk,
        details: `${s.step1} -> ${s.step2}`,
        extra: s,
        x: 0,
        y: 0,
        color: '#EC4899',
        badge: 'DOWNSTREAM RISK',
        connectedTo: ['center-decision']
      });
      rawLinks.push({ source: 'center-decision', target: id, type: 'secondorder' });
    });

    // Position nodes based on layout mode
    if (viewMode === 'radar') {
      const outerNodes = rawNodes.filter(n => n.id !== 'center-decision');
      const total = outerNodes.length;
      const radiusX = Math.min(dimensions.width * 0.40, 310);
      const radiusY = Math.min(dimensions.height * 0.38, 200);

      outerNodes.forEach((node, i) => {
        // Distribute evenly in an ellipse
        const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
        // Minor orbital wobble for natural visual breathing
        const rVariation = (i % 2 === 0 ? 1.0 : 0.88);
        node.x = cx + Math.cos(angle) * (radiusX * rVariation);
        node.y = cy + Math.sin(angle) * (radiusY * rVariation);
      });
    } else {
      // Causal Flow: Left to Right column distribution
      // Col 1: Visible (x: 15%), Col 2: Assumptions (x: 35%), Col 3: Center Decision (x: 52%), Col 4: Blind Spots & Conflicts (x: 72%), Col 5: 2nd Order & Evidence (x: 88%)
      const visibleNodes = rawNodes.filter(n => n.type === 'visible');
      const assumptionNodes = rawNodes.filter(n => n.type === 'assumption');
      const conflictNodes = rawNodes.filter(n => n.type === 'conflict');
      const blindSpotNodes = rawNodes.filter(n => n.type === 'blindspot');
      const rightNodes = rawNodes.filter(n => n.type === 'evidence' || n.type === 'secondorder');

      centerNode.x = dimensions.width * 0.50;
      centerNode.y = dimensions.height * 0.50;

      const layoutColumn = (items: GraphNode[], xRatio: number) => {
        const step = dimensions.height / (items.length + 1);
        items.forEach((item, idx) => {
          item.x = dimensions.width * xRatio;
          item.y = step * (idx + 1);
        });
      };

      layoutColumn(visibleNodes, 0.12);
      layoutColumn(assumptionNodes, 0.30);
      layoutColumn([...blindSpotNodes, ...conflictNodes], 0.70);
      layoutColumn(rightNodes, 0.88);
    }

    return { nodes: rawNodes, links: rawLinks };
  }, [result, dimensions, viewMode]);

  // Selected node object
  const selectedNode = useMemo(() => {
    return nodes.find(n => n.id === selectedNodeId) || null;
  }, [nodes, selectedNodeId]);

  // Filtered nodes
  const visibleNodeList = useMemo(() => {
    if (activeFilter === 'all') return nodes;
    return nodes.filter(n => n.type === 'decision' || n.type === activeFilter);
  }, [nodes, activeFilter]);

  const isConnected = (sourceId: string, targetId: string) => {
    if (!hoveredNodeId && !selectedNodeId) return false;
    const active = hoveredNodeId || selectedNodeId;
    if (sourceId === active || targetId === active) return true;
    return false;
  };

  const getNodeIcon = (type: NodeType) => {
    switch (type) {
      case 'decision': return <Layers className="w-4 h-4 text-sky-400" />;
      case 'visible': return <Eye className="w-3.5 h-3.5 text-slate-400" />;
      case 'assumption': return <HelpCircle className="w-3.5 h-3.5 text-amber-400" />;
      case 'blindspot': return <AlertOctagon className="w-3.5 h-3.5 text-red-400" />;
      case 'conflict': return <Zap className="w-3.5 h-3.5 text-purple-400" />;
      case 'evidence': return <FileSearch className="w-3.5 h-3.5 text-sky-400" />;
      case 'secondorder': return <GitFork className="w-3.5 h-3.5 text-pink-400" />;
      default: return <Layers className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="relative w-full rounded-2xl border border-white/10 bg-[#080B10]/95 backdrop-blur-xl overflow-hidden shadow-2xl">
      {/* Radar Header & Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-white/10 bg-white/[0.02]">
        <div className="flex items-center space-x-2.5">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </div>
          <span className="text-sm font-semibold tracking-wide text-white uppercase font-display">
            The Blind Spot Radar
          </span>
          <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5 font-mono">
            Interactive 2D Topology
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium ${
              activeFilter === 'all'
                ? 'bg-white/15 text-white border border-white/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            All ({nodes.length - 1})
          </button>
          <button
            onClick={() => setActiveFilter('blindspot')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center space-x-1 ${
              activeFilter === 'blindspot'
                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                : 'text-red-400/70 hover:text-red-300 hover:bg-red-500/10'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            <span>Blind Spots ({result.blindSpots.length})</span>
          </button>
          <button
            onClick={() => setActiveFilter('assumption')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center space-x-1 ${
              activeFilter === 'assumption'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-amber-400/70 hover:text-amber-300 hover:bg-amber-500/10'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>Assumptions ({result.assumptions.length})</span>
          </button>
          <button
            onClick={() => setActiveFilter('conflict')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center space-x-1 ${
              activeFilter === 'conflict'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'text-purple-400/70 hover:text-purple-300 hover:bg-purple-500/10'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
            <span>Conflicts ({result.conflicts.length})</span>
          </button>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-black/40 rounded-lg p-0.5 border border-white/5 text-xs">
          <button
            onClick={() => setViewMode('radar')}
            className={`px-2.5 py-1 rounded-md transition ${viewMode === 'radar' ? 'bg-sky-500/20 text-sky-300 font-semibold' : 'text-slate-400 hover:text-white'}`}
          >
            Radial Radar
          </button>
          <button
            onClick={() => setViewMode('causal')}
            className={`px-2.5 py-1 rounded-md transition ${viewMode === 'causal' ? 'bg-sky-500/20 text-sky-300 font-semibold' : 'text-slate-400 hover:text-white'}`}
          >
            Causal Flow
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden bg-[#06080C] select-none"
        style={{ height: `${dimensions.height}px` }}
      >
        {/* Ambient Radar Rings / Grid Background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
        
        {viewMode === 'radar' && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Concentric rings */}
            <div className="w-[85%] h-[80%] rounded-full border border-dashed border-white/[0.04] animate-pulse-subtle" />
            <div className="w-[58%] h-[55%] rounded-full border border-dashed border-sky-500/[0.08] absolute" />
            <div className="w-[32%] h-[30%] rounded-full border border-dashed border-amber-500/[0.08] absolute" />
            {/* Crosshairs */}
            <div className="absolute w-full h-[1px] bg-white/[0.03]" />
            <div className="absolute h-full w-[1px] bg-white/[0.03]" />
          </div>
        )}

        <svg className="w-full h-full absolute inset-0 pointer-events-none">
          <defs>
            <linearGradient id="grad-active" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          {/* Render connecting links */}
          {links.map((link, idx) => {
            const sourceNode = nodes.find(n => n.id === link.source);
            const targetNode = nodes.find(n => n.id === link.target);
            if (!sourceNode || !targetNode) return null;

            // Check if either node is filtered out
            const sourceVisible = visibleNodeList.some(n => n.id === sourceNode.id);
            const targetVisible = visibleNodeList.some(n => n.id === targetNode.id);
            if (!sourceVisible || !targetVisible) return null;

            const active = isConnected(sourceNode.id, targetNode.id);
            const isHoveredSelf = hoveredNodeId === sourceNode.id || hoveredNodeId === targetNode.id;

            return (
              <g key={`link-${idx}`}>
                <line
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={active ? (link.type === 'blindspot' ? '#EF4444' : '#38BDF8') : 'rgba(255,255,255,0.07)'}
                  strokeWidth={active ? (isHoveredSelf ? 2.5 : 1.8) : 1}
                  strokeDasharray={active ? 'none' : '4 4'}
                  filter={active ? 'url(#glow)' : undefined}
                  className="transition-all duration-300"
                />
                {active && (
                  <circle
                    cx={(sourceNode.x + targetNode.x) / 2}
                    cy={(sourceNode.y + targetNode.y) / 2}
                    r="2.5"
                    fill={link.type === 'blindspot' ? '#EF4444' : '#38BDF8'}
                    className="animate-pulse"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Interactive HTML Nodes overlaying SVG coordinates */}
        <div className="absolute inset-0 pointer-events-auto">
          {visibleNodeList.map(node => {
            const isCenter = node.id === 'center-decision';
            const isSelected = selectedNodeId === node.id;
            const isHovered = hoveredNodeId === node.id;
            const isLinked = (hoveredNodeId && isConnected(node.id, hoveredNodeId)) || 
                             (selectedNodeId && isConnected(node.id, selectedNodeId));

            if (isCenter) {
              return (
                <div
                  key={node.id}
                  style={{
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  className="absolute cursor-pointer group"
                  onClick={() => setSelectedNodeId(node.id)}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                >
                  <div className="relative px-4 py-3 rounded-xl border border-sky-500/40 bg-gradient-to-b from-[#0D1626] to-[#080D17] shadow-lg shadow-sky-950/50 flex flex-col items-center text-center max-w-[210px] sm:max-w-[240px] transition-transform duration-200 group-hover:scale-105">
                    <div className="flex items-center space-x-1.5 text-[10px] font-mono uppercase tracking-widest text-sky-400 font-semibold mb-1">
                      <Layers className="w-3 h-3 text-sky-400" />
                      <span>{node.badge}</span>
                    </div>
                    <p className="text-xs font-medium text-white line-clamp-2 leading-tight">
                      {node.subtitle}
                    </p>
                    <div className="mt-1.5 text-[9px] text-slate-400 font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                      <span>Click to inspect</span>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={node.id}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  transform: 'translate(-50%, -50%)'
                }}
                className={`absolute cursor-pointer transition-all duration-200 z-10 ${
                  isHovered || isSelected ? 'scale-110 z-30' : isLinked ? 'scale-105 z-20' : 'opacity-90 hover:opacity-100'
                }`}
                onClick={() => {
                  setSelectedNodeId(node.id);
                  if (node.type === 'assumption' && node.extra?.id && onSelectAssumption) {
                    onSelectAssumption(node.extra.id);
                  } else if (node.type === 'blindspot' && node.extra?.id && onSelectBlindSpot) {
                    onSelectBlindSpot(node.extra.id);
                  } else if (node.type === 'conflict' && node.extra?.id && onSelectConflict) {
                    onSelectConflict(node.extra.id);
                  }
                }}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
              >
                <div
                  className={`px-3 py-2 rounded-lg text-left max-w-[170px] sm:max-w-[190px] border backdrop-blur-md transition-all ${
                    isSelected
                      ? 'bg-slate-900/95 ring-2 ring-offset-1 ring-offset-black'
                      : isHovered
                      ? 'bg-slate-900/95 shadow-xl'
                      : 'bg-slate-950/80 shadow-md'
                  }`}
                  style={{
                    borderColor: isSelected || isHovered ? node.color : `${node.color}40`,
                    boxShadow: isSelected || isHovered ? `0 0 16px -2px ${node.color}50` : undefined
                  }}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span
                      className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded"
                      style={{ color: node.color, backgroundColor: `${node.color}15` }}
                    >
                      {node.badge}
                    </span>
                    {getNodeIcon(node.type)}
                  </div>
                  <p className="text-[11px] font-medium text-slate-200 line-clamp-2 leading-snug">
                    {node.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Node Detail Drawer / Inspection Panel */}
      {selectedNode && (
        <div className="border-t border-white/10 bg-slate-950/95 p-5 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div
                className="p-2.5 rounded-xl mt-0.5"
                style={{ backgroundColor: `${selectedNode.color}20`, color: selectedNode.color }}
              >
                {getNodeIcon(selectedNode.type)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span
                    className="text-xs font-mono font-bold uppercase tracking-wide px-2 py-0.5 rounded"
                    style={{ color: selectedNode.color, backgroundColor: `${selectedNode.color}15` }}
                  >
                    {selectedNode.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Topology Node: {selectedNode.type.toUpperCase()}
                  </span>
                </div>
                <h4 className="text-base font-semibold text-white">
                  {selectedNode.title}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                  {selectedNode.details}
                </p>

                {/* Specific context extra fields */}
                {selectedNode.type === 'assumption' && selectedNode.extra && (
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-white/[0.02] p-3 rounded-lg border border-white/5">
                    <div>
                      <span className="text-amber-400 font-semibold block mb-0.5">Why it's questionable:</span>
                      <p className="text-slate-300">{selectedNode.extra.whyQuestionable}</p>
                    </div>
                    <div>
                      <span className="text-sky-400 font-semibold block mb-0.5">Evidence needed:</span>
                      <p className="text-slate-300">{selectedNode.extra.evidenceNeeded}</p>
                    </div>
                  </div>
                )}

                {selectedNode.type === 'blindspot' && selectedNode.extra && (
                  <div className="mt-3 text-xs bg-red-500/[0.05] p-3 rounded-lg border border-red-500/10">
                    <span className="text-red-400 font-semibold block mb-0.5">Uncertainty Note:</span>
                    <p className="text-slate-300">{selectedNode.extra.uncertainty}</p>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedNodeId(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Radar Footnote Guide */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-2.5 bg-black/40 border-t border-white/5 text-[11px] text-slate-400">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span> Visible Reason
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span> Unverified Assumption
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500"></span> Hidden Blind Spot
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span> Reasoning Conflict
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400"></span> Missing Evidence
          </span>
        </div>
        <div className="font-mono text-slate-400 flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5 text-sky-400" />
          <span>Nodes represent causal dependencies, not isolated bullet points</span>
        </div>
      </div>
    </div>
  );
};
