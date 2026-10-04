import React, { useState } from 'react';
import { AssumptionItem } from '../types';
import { HelpCircle, AlertTriangle, CheckCircle2, FileSearch, Sparkles, Flame } from 'lucide-react';

interface Props {
  assumptions: AssumptionItem[];
  highlightedId?: string | null;
}

export const AssumptionStressTest: React.FC<Props> = ({ assumptions, highlightedId }) => {
  const [responses, setResponses] = useState<Record<string, 'changes' | 'no_change' | 'need_evidence'>>({});

  const handleSelect = (id: string, response: 'changes' | 'no_change' | 'need_evidence') => {
    setResponses(prev => ({ ...prev, [id]: response }));
  };

  const completedCount = Object.keys(responses).length;
  const changesCount = Object.values(responses).filter(r => r === 'changes').length;
  const needEvidenceCount = Object.values(responses).filter(r => r === 'need_evidence').length;
  const noChangeCount = Object.values(responses).filter(r => r === 'no_change').length;

  return (
    <div className="rounded-2xl border border-amber-500/20 bg-[#0A0E17]/90 backdrop-blur-xl p-6 shadow-xl relative overflow-hidden">
      {/* Background Amber Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Flame className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
              Signature Feature
            </span>
          </div>
          <h3 className="text-xl font-bold text-white font-display">
            Assumption Stress-Test Simulator
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Test how robust your decision is when foundational assumptions face realistic counterfactual pressure.
          </p>
        </div>

        {/* Live Interactive Counter */}
        <div className="flex items-center space-x-3 bg-black/40 px-4 py-2.5 rounded-xl border border-white/5 text-xs font-mono">
          <div className="text-right">
            <span className="text-slate-400 block text-[10px]">TESTED</span>
            <span className="text-amber-400 font-bold">{completedCount} of {assumptions.length}</span>
          </div>
          <div className="w-[1px] h-6 bg-white/10" />
          <div className="flex space-x-2 text-[11px]">
            {changesCount > 0 && <span className="text-red-400">⚡ {changesCount} flipped</span>}
            {needEvidenceCount > 0 && <span className="text-sky-400">🔍 {needEvidenceCount} unverified</span>}
            {noChangeCount > 0 && <span className="text-emerald-400">✓ {noChangeCount} held</span>}
          </div>
        </div>
      </div>

      {/* Assumptions List */}
      <div className="mt-6 space-y-5">
        {assumptions.map((item, index) => {
          const selected = responses[item.id];
          const isHighlighted = highlightedId === item.id;

          return (
            <div
              key={item.id}
              className={`rounded-xl border transition-all duration-200 p-5 ${
                isHighlighted
                  ? 'border-amber-400 bg-amber-500/[0.08] shadow-lg shadow-amber-950/40 ring-1 ring-amber-400'
                  : selected
                  ? 'border-white/15 bg-white/[0.02]'
                  : 'border-white/10 bg-black/30 hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-mono font-bold flex items-center justify-center border border-amber-500/30">
                    {index + 1}
                  </span>
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    Unstated Assumption
                  </span>
                </div>
                {selected && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Tested
                  </span>
                )}
              </div>

              {/* Statement */}
              <h4 className="text-base font-semibold text-white mt-2 leading-snug">
                "{item.statement}"
              </h4>

              {/* Critique Grid */}
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-red-500/[0.04] border border-red-500/10 text-slate-300">
                  <span className="text-red-400 font-semibold flex items-center gap-1 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Why it may be questionable:
                  </span>
                  <p className="leading-relaxed">{item.whyQuestionable}</p>
                </div>
                <div className="p-3 rounded-lg bg-sky-500/[0.04] border border-sky-500/10 text-slate-300">
                  <span className="text-sky-400 font-semibold flex items-center gap-1 mb-1">
                    <FileSearch className="w-3.5 h-3.5" /> Evidence needed to verify:
                  </span>
                  <p className="leading-relaxed">{item.evidenceNeeded}</p>
                </div>
              </div>

              {/* Counter-Factual Stress Question */}
              <div className="mt-4 p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20">
                <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Stress Scenario:
                </div>
                <p className="text-sm font-medium text-slate-100 italic">
                  "{item.stressScenario}"
                </p>
              </div>

              {/* User Interactive Decision Choice Buttons */}
              <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center gap-2.5">
                <span className="text-xs text-slate-400 font-medium mr-1">
                  How does this scenario affect your stance?
                </span>

                <button
                  onClick={() => handleSelect(item.id, 'changes')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 ${
                    selected === 'changes'
                      ? 'bg-red-500 text-white shadow-md shadow-red-900/50 font-semibold'
                      : 'bg-white/5 text-slate-300 hover:bg-red-500/20 hover:text-red-300 border border-white/5'
                  }`}
                >
                  <span>⚡ This changes my thinking</span>
                </button>

                <button
                  onClick={() => handleSelect(item.id, 'no_change')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 ${
                    selected === 'no_change'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50 font-semibold'
                      : 'bg-white/5 text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-300 border border-white/5'
                  }`}
                >
                  <span>✓ This doesn't change my thinking</span>
                </button>

                <button
                  onClick={() => handleSelect(item.id, 'need_evidence')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 ${
                    selected === 'need_evidence'
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-900/50 font-semibold'
                      : 'bg-white/5 text-slate-300 hover:bg-sky-500/20 hover:text-sky-300 border border-white/5'
                  }`}
                >
                  <span>🔍 I need more evidence first</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
