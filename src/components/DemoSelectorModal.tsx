import React from 'react';
import { DEMO_SCENARIOS } from '../data/demoScenarios';
import { ReasoningXRayResult } from '../types';
import { Sparkles, X, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectScenario: (scenario: ReasoningXRayResult) => void;
}

export const DemoSelectorModal: React.FC<Props> = ({ isOpen, onClose, onSelectScenario }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl border border-white/15 bg-[#0D121D] p-6 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-display">
                Select a Realistic Demo Scenario
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Instant full-fidelity X-Ray simulations built for judges & evaluations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scenarios Grid */}
        <div className="mt-5 space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
          {DEMO_SCENARIOS.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                onSelectScenario(item.data);
                onClose();
              }}
              className="cursor-pointer group rounded-xl border border-white/10 bg-black/40 p-4 hover:border-sky-500/40 hover:bg-sky-500/[0.04] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">
                    {item.tag}
                  </span>
                  <span className="text-sm font-bold text-white font-display">
                    {item.name}
                  </span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2">
                  "{item.data.decision}"
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400 font-mono">
                  <span>{item.data.blindSpots.length} Blind Spots</span>
                  <span>•</span>
                  <span>{item.data.assumptions.length} Assumptions</span>
                  <span>•</span>
                  <span>{item.data.conflicts.length} Value Tensions</span>
                </div>
              </div>

              <button
                className="shrink-0 px-4 py-2 rounded-lg bg-white/5 group-hover:bg-sky-500 text-xs font-bold text-slate-200 group-hover:text-white transition flex items-center justify-center space-x-1.5 font-display"
              >
                <span>X-Ray Now</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          ))}
        </div>

        {/* Socratic Guarantee */}
        <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Zero hallucinated advice • 100% Socratic critique
          </span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
