import React from 'react';
import { Layers, ShieldAlert, Sparkles } from 'lucide-react';

interface Props {
  currentStage: string;
}

export const ScanLoadingModal: React.FC<Props> = ({ currentStage }) => {
  const stages = [
    "Parsing visible premises & user context...",
    "Stress-testing unstated assumptions...",
    "Searching for unexamined blind spots & omissions...",
    "Detecting value tensions & internal conflicts...",
    "Mapping cascading second-order downstream effects...",
    "Calibrating confidence vs evidence coverage...",
    "Rendering 2D Blind Spot Radar..."
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-sky-500/30 bg-[#0A0E18] p-8 shadow-2xl relative overflow-hidden text-center">
        {/* Radar Pulse Rings in Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-72 h-72 rounded-full border border-sky-400 animate-ping" />
          <div className="w-48 h-48 rounded-full border border-sky-400/50 absolute" />
          <div className="w-24 h-24 rounded-full border border-sky-400/80 absolute" />
        </div>

        {/* Central Glowing Icon */}
        <div className="relative mx-auto w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/40 flex items-center justify-center mb-6 shadow-lg shadow-sky-500/20">
          <Layers className="w-8 h-8 text-sky-400 animate-pulse" />
        </div>

        {/* Scanning Header */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-mono text-sky-400 mb-3">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          <span>SOCRATIC DECONSTRUCTION IN PROGRESS</span>
        </div>

        <h3 className="text-xl font-bold text-white font-display">
          Building Reasoning X-Ray
        </h3>

        {/* Active Stage Log */}
        <p className="mt-2 text-sm text-slate-300 font-mono min-h-[24px] text-sky-300">
          {currentStage || "Analyzing cognitive assumptions..."}
        </p>

        {/* Multi-step progress list */}
        <div className="mt-6 space-y-1.5 text-left bg-black/40 p-4 rounded-xl border border-white/5 text-xs font-mono">
          {stages.map((stg, i) => {
            const isPassed = currentStage && stages.indexOf(currentStage) > i;
            const isCurrent = currentStage === stg;

            return (
              <div
                key={i}
                className={`flex items-center space-x-2 transition-colors duration-200 ${
                  isCurrent
                    ? 'text-sky-300 font-bold'
                    : isPassed
                    ? 'text-slate-500'
                    : 'text-slate-600'
                }`}
              >
                <span className="text-[10px]">
                  {isPassed ? '✓' : isCurrent ? '▶' : '○'}
                </span>
                <span className="truncate">{stg}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-[11px] text-slate-400">
          Deconstructing reasoning dependencies without generating biased advice.
        </div>
      </div>
    </div>
  );
};
