import React, { useState } from 'react';
import { ReasoningXRayResult, BlindSpotItem, ReasoningConflict, MissingEvidenceItem, SecondOrderEffect, StakeholderLens } from '../types';
import { Eye, AlertOctagon, Zap, FileSearch, GitFork, Users, ArrowRight, CheckSquare, Square, ShieldAlert, Sparkles } from 'lucide-react';

interface Props {
  result: ReasoningXRayResult;
  highlightedBlindSpotId?: string | null;
  highlightedConflictId?: string | null;
}

export const StructuredAnalysis: React.FC<Props> = ({ result, highlightedBlindSpotId, highlightedConflictId }) => {
  const [activeTab, setActiveTab] = useState<'blindspots' | 'conflicts' | 'evidence' | 'secondorder' | 'stakeholders' | 'visible'>('blindspots');
  const [verifiedEvidence, setVerifiedEvidence] = useState<Record<string, boolean>>({});

  const toggleEvidence = (id: string) => {
    setVerifiedEvidence(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const verifiedCount = Object.values(verifiedEvidence).filter(Boolean).length;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0A0D15]/90 backdrop-blur-xl shadow-2xl overflow-hidden">
      {/* Category Tabs */}
      <div className="flex border-b border-white/10 bg-black/40 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('blindspots')}
          className={`flex items-center space-x-2 px-4 py-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
            activeTab === 'blindspots'
              ? 'border-red-500 text-red-400 bg-red-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <AlertOctagon className="w-4 h-4 text-red-400" />
          <span>Blind Spots ({result.blindSpots.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('conflicts')}
          className={`flex items-center space-x-2 px-4 py-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
            activeTab === 'conflicts'
              ? 'border-purple-500 text-purple-400 bg-purple-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <Zap className="w-4 h-4 text-purple-400" />
          <span>Reasoning Conflicts ({result.conflicts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('evidence')}
          className={`flex items-center space-x-2 px-4 py-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
            activeTab === 'evidence'
              ? 'border-sky-500 text-sky-400 bg-sky-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <FileSearch className="w-4 h-4 text-sky-400" />
          <span>Missing Evidence ({result.missingEvidence.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('secondorder')}
          className={`flex items-center space-x-2 px-4 py-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
            activeTab === 'secondorder'
              ? 'border-pink-500 text-pink-400 bg-pink-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <GitFork className="w-4 h-4 text-pink-400" />
          <span>Second-Order Effects ({result.secondOrderEffects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('stakeholders')}
          className={`flex items-center space-x-2 px-4 py-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
            activeTab === 'stakeholders'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-400" />
          <span>Stakeholder Lens ({result.stakeholderLenses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('visible')}
          className={`flex items-center space-x-2 px-4 py-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
            activeTab === 'visible'
              ? 'border-slate-400 text-slate-200 bg-white/10'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <Eye className="w-4 h-4 text-slate-400" />
          <span>Visible Premises ({result.visibleReasons.length})</span>
        </button>
      </div>

      {/* Tab Body */}
      <div className="p-6">
        {/* BLIND SPOTS */}
        {activeTab === 'blindspots' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-white font-display">
                  Critical Factors Absent From Your Current Reasoning
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Factors you did not explicitly consider that may substantially impact this outcome.
                </p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                CRITICAL WARNINGS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {result.blindSpots.map((item, idx) => {
                const isHigh = highlightedBlindSpotId === item.id;
                return (
                  <div
                    key={item.id || idx}
                    className={`rounded-xl border p-4 transition-all ${
                      isHigh
                        ? 'border-red-400 bg-red-500/10 ring-1 ring-red-400'
                        : 'border-white/10 bg-black/30 hover:border-red-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                        <AlertOctagon className="w-3.5 h-3.5" />
                        {item.factor}
                      </span>
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                          item.severity === 'critical'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {item.severity}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-200 leading-snug mb-3">
                      {item.whyItMatters}
                    </p>
                    <div className="text-xs text-slate-400 bg-white/[0.02] p-2.5 rounded-lg border border-white/5 flex items-start gap-2">
                      <ShieldAlert className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                      <p className="italic">{item.uncertainty}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* REASONING CONFLICTS */}
        {activeTab === 'conflicts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-white font-display">
                  Internal Value Contradictions & Priority Tensions
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Points where your stated values compete directly against the logistical reality of the choice.
                </p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                TENSION MAPPING
              </span>
            </div>

            <div className="space-y-4 mt-4">
              {result.conflicts.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="rounded-xl border border-purple-500/20 bg-purple-950/10 p-5 relative overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    {/* Left: Stated Priority */}
                    <div className="flex-1 p-3.5 rounded-lg bg-black/40 border border-white/5">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-1">
                        YOUR STATED PRIORITY
                      </span>
                      <p className="text-sm font-semibold text-slate-100">
                        "{item.priority}"
                      </p>
                    </div>

                    {/* Middle: Tension Bolt */}
                    <div className="flex flex-col items-center justify-center shrink-0 px-2 text-purple-400 font-mono text-xs">
                      <Zap className="w-5 h-5 animate-pulse text-purple-400" />
                      <span className="text-[10px] font-bold mt-0.5">TENSION {item.tensionScore}/10</span>
                    </div>

                    {/* Right: Actual Reason */}
                    <div className="flex-1 p-3.5 rounded-lg bg-black/40 border border-white/5">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-1">
                        OPERATIONAL REALITY / REASON
                      </span>
                      <p className="text-sm font-semibold text-slate-100">
                        "{item.reason}"
                      </p>
                    </div>
                  </div>

                  {/* Conflict Explanation */}
                  <div className="mt-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs sm:text-sm text-purple-200">
                    <span className="font-semibold block text-purple-300 mb-0.5">Underlying Reasoning Conflict:</span>
                    <p>{item.conflict}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MISSING EVIDENCE */}
        {activeTab === 'evidence' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-white font-display">
                  Information Required for Confident Verification
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Check off items as you verify empirical facts to increase your Evidence Coverage score.
                </p>
              </div>
              <div className="text-xs font-mono text-sky-400 bg-sky-500/10 px-3 py-1 rounded border border-sky-500/20">
                Verified: {verifiedCount} / {result.missingEvidence.length}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              {result.missingEvidence.map((item, idx) => {
                const isChecked = !!verifiedEvidence[item.id];
                return (
                  <div
                    key={item.id || idx}
                    onClick={() => toggleEvidence(item.id)}
                    className={`cursor-pointer rounded-xl border p-4 transition-all flex items-start space-x-3 ${
                      isChecked
                        ? 'border-emerald-500/40 bg-emerald-500/[0.05]'
                        : 'border-white/10 bg-black/30 hover:border-sky-500/40'
                    }`}
                  >
                    <div className="mt-0.5 text-sky-400 shrink-0">
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-500 hover:text-sky-400" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400 px-1.5 py-0.2 rounded bg-sky-500/10">
                          {item.category}
                        </span>
                      </div>
                      <p className={`text-sm font-medium ${isChecked ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                        {item.item}
                      </p>
                      <p className="text-xs text-slate-400">
                        <span className="text-slate-500">Risk if unverified:</span> {item.impactIfMissing}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECOND-ORDER EFFECTS */}
        {activeTab === 'secondorder' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-white font-display">
                  Cascading Downstream Domino Consequences
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Indirect second and third-order effects that unfold over 3 to 12 months.
                </p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-pink-500/10 text-pink-400 border border-pink-500/20">
                CASCADE SIMULATION
              </span>
            </div>

            <div className="space-y-4 mt-4">
              {result.secondOrderEffects.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="rounded-xl border border-pink-500/20 bg-pink-950/10 p-5"
                >
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-pink-400 mb-3 flex items-center justify-between">
                    <span>Causal Chain #{idx + 1}</span>
                    <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300">
                      Probability: {item.probability.toUpperCase()}
                    </span>
                  </div>

                  {/* Flow Diagram */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center text-xs">
                    <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1">TRIGGER</span>
                      <p className="font-semibold text-white">{item.initialTrigger}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                      <span className="text-[10px] text-pink-400 uppercase font-mono block mb-1">1ST ORDER SHIFT</span>
                      <p className="text-slate-200">{item.step1}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                      <span className="text-[10px] text-pink-400 uppercase font-mono block mb-1">2ND ORDER EFFECT</span>
                      <p className="text-slate-200">{item.step2}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30">
                      <span className="text-[10px] text-red-300 uppercase font-mono block mb-1">DOWNSTREAM RISK</span>
                      <p className="font-semibold text-red-200">{item.downstreamRisk}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STAKEHOLDER LENSES */}
        {activeTab === 'stakeholders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-white font-display">
                  360-Degree Multi-Stakeholder Perspectives
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  How other affected parties evaluate this decision vs your own internal view.
                </p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                5 PERSPECTIVES
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {result.stakeholderLenses.map((sh, idx) => (
                <div
                  key={sh.id || idx}
                  className="rounded-xl border border-white/10 bg-black/30 p-4 hover:border-emerald-500/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                      {sh.stakeholder}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                    <span className="text-slate-400 font-medium">Perspective:</span> {sh.perspective}
                  </p>
                  <div className="p-2.5 rounded bg-white/[0.02] border border-white/5 text-xs space-y-1">
                    <p className="text-amber-400">
                      <span className="font-medium text-slate-400">Potential blind spot regarding this party:</span> {sh.potentialBlindspot}
                    </p>
                    <p className="text-sky-300">
                      <span className="font-medium text-slate-400">Their primary concern:</span> {sh.keyConcern}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VISIBLE PREMISES */}
        {activeTab === 'visible' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-base font-bold text-white font-display">
                Premises Explicitly Stated In Your Initial Inquiry
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                The visible conscious factors you brought into the decision formulation.
              </p>
            </div>
            <div className="space-y-2.5 mt-4">
              {result.visibleReasons.map((reason, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-3 p-3.5 rounded-xl border border-white/10 bg-black/30"
                >
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-slate-200 font-medium">
                    {reason}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
