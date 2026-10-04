import React, { useState } from 'react';
import { ReasoningXRayResult } from '../types';
import { BookOpen, CheckCircle, Copy, Download, Sparkles, Check, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  result: ReasoningXRayResult;
  onReset?: () => void;
}

export const DecisionJournal: React.FC<Props> = ({ result, onReset }) => {
  const [copied, setCopied] = useState(false);
  const [decidedState, setDecidedState] = useState(false);
  const [checkedInvestigations, setCheckedInvestigations] = useState<Record<number, boolean>>({});

  const toggleInvestigation = (idx: number) => {
    setCheckedInvestigations(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const unresolvedInvestigations = [
    ...result.assumptions.map(a => `Verify assumption: "${a.statement}" (Need: ${a.evidenceNeeded})`),
    ...result.missingEvidence.map(m => `Obtain missing data: ${m.item}`),
    ...result.highImpactQuestions.slice(0, 2).map(q => `Answer question: "${q.question}"`)
  ];

  const handleCopy = () => {
    const text = `BLINDSPOT — REASONING X-RAY EXECUTIVE BRIEF
==================================================
Decision: ${result.decision}
Timestamp: ${result.timestamp}

1. VISIBLE PREMISES:
${result.visibleReasons.map(r => `  - ${r}`).join('\n')}

2. CRITICAL UNVERIFIED ASSUMPTIONS:
${result.assumptions.map(a => `  - Statement: ${a.statement}\n    Why Questionable: ${a.whyQuestionable}\n    Evidence Needed: ${a.evidenceNeeded}`).join('\n')}

3. HIDDEN BLIND SPOTS:
${result.blindSpots.map(b => `  - [${b.severity.toUpperCase()}] ${b.factor}: ${b.whyItMatters}`).join('\n')}

4. VALUE CONFLICTS:
${result.conflicts.map(c => `  - Priority (${c.priority}) vs Reason (${c.reason})\n    Tension: ${c.conflict}`).join('\n')}

5. TOP DECISION-CHANGING QUESTIONS:
${result.highImpactQuestions.map(q => `  - [${q.impact}] ${q.question}`).join('\n')}

6. CALIBRATION METRICS:
  - Stated Confidence: ${result.userConfidence}%
  - Evidence Coverage: ${result.evidenceCoverage}%
  - Calibration: ${result.calibrationAdvice}

CONCLUSION:
"The AI found what your reasoning didn't examine. The decision is still yours."
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const text = `# BLINDSPOT — Reasoning X-Ray Executive Brief

> **Core Inquiry:** ${result.decision}  
> **Analyzed at:** ${new Date(result.timestamp).toLocaleString()}  
> **Confidence vs Evidence:** ${result.userConfidence}% Stated Conviction vs ${result.evidenceCoverage}% Empirical Coverage  

---

## 1. Before X-Ray: What Was Stated
${result.visibleReasons.map(r => `- ${r}`).join('\n')}

## 2. Hidden Assumptions to Verify
${result.assumptions.map(a => `### ${a.statement}
- **Why questionable:** ${a.whyQuestionable}
- **Evidence required:** ${a.evidenceNeeded}
- **Stress scenario:** *${a.stressScenario}*
`).join('\n')}

## 3. Critical Blind Spots
${result.blindSpots.map(b => `- **[${b.severity.toUpperCase()}] ${b.factor}:** ${b.whyItMatters} (*${b.uncertainty}*)`).join('\n')}

## 4. Internal Reasoning Conflicts
${result.conflicts.map(c => `- **Priority:** ${c.priority}  
  **Operational Demand:** ${c.reason}  
  **Tension:** ${c.conflict}`).join('\n')}

## 5. High-Impact Questions
${result.highImpactQuestions.map(q => `### [${q.impact}] ${q.question}
*Why it matters:* ${q.whyItMatters}
`).join('\n')}

---
**Core Socratic Principle:**  
*AI doesn't make the decision. It interrogates the reasoning behind it.*
`;
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blindspot-xray-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFinalDecision = () => {
    setDecidedState(true);
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0A0D15]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-white/10 text-white border border-white/10">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono font-bold tracking-widest text-slate-300 uppercase">
              Decision Journal
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
            Reasoning Evolution & Action Plan
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Compare your pre-scan mindset with the verified investigation items now required.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-200 border border-white/10 font-medium transition flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Brief!' : 'Copy Summary'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-200 border border-white/10 font-medium transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .MD</span>
          </button>
        </div>
      </div>

      {/* Before vs After Comparison Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BEFORE X-RAY */}
        <div className="rounded-xl border border-white/10 bg-black/40 p-5 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span>Before X-Ray: What I Believed</span>
          </div>
          <p className="text-sm text-slate-300 italic border-l-2 border-slate-600 pl-3 py-1">
            "{result.decision}"
          </p>
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-mono text-slate-400 block">Original premises relied upon:</span>
            {result.visibleReasons.map((r, i) => (
              <div key={i} className="text-xs text-slate-300 flex items-start space-x-2">
                <span className="text-slate-500">•</span>
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AFTER X-RAY */}
        <div className="rounded-xl border border-sky-500/20 bg-sky-950/10 p-5 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span>After X-Ray: What I Need to Investigate</span>
          </div>
          <div className="text-xs font-medium text-sky-200">
            Your reasoning now contains <span className="font-bold text-white underline">{unresolvedInvestigations.length} unresolved investigative checkpoints</span>:
          </div>

          <div className="space-y-2 pt-1 max-h-56 overflow-y-auto pr-1">
            {unresolvedInvestigations.map((item, idx) => {
              const isChecked = !!checkedInvestigations[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleInvestigation(idx)}
                  className={`cursor-pointer p-2 rounded-lg text-xs transition flex items-start space-x-2.5 ${
                    isChecked
                      ? 'bg-emerald-500/10 text-slate-400 line-through'
                      : 'bg-black/40 text-slate-200 hover:bg-black/60 border border-white/5'
                  }`}
                >
                  <span className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center text-[10px] font-mono shrink-0 ${isChecked ? 'bg-emerald-500 text-black font-bold' : 'border border-slate-600'}`}>
                    {isChecked ? '✓' : idx + 1}
                  </span>
                  <span className="leading-snug">{item}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Socratic Closure & The "I'LL MAKE THE DECISION" final CTA */}
      <div className="mt-8 pt-6 border-t border-white/10 flex flex-col items-center text-center space-y-4">
        <div className="max-w-xl">
          <p className="text-sm sm:text-base font-medium text-slate-200 leading-relaxed">
            "The AI found what your reasoning didn't examine. The decision is still completely yours."
          </p>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            No algorithms deciding your future. Pure Socratic clarity to empower human judgment.
          </p>
        </div>

        {!decidedState ? (
          <button
            onClick={handleFinalDecision}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-600 rounded-xl hover:shadow-lg hover:shadow-sky-500/25 active:scale-[0.99] font-display"
          >
            <span className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-sky-300" />
              <span>I'LL MAKE THE DECISION</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        ) : (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 max-w-lg animate-in zoom-in-95 duration-300 space-y-2">
            <div className="flex items-center justify-center space-x-2 text-emerald-400 font-bold font-display text-lg">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>Decision Agency Claimed</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200">
              You are now stepping into this decision with full visibility of your blind spots, assumptions, and key questions.
            </p>
            {onReset && (
              <div className="pt-2">
                <button
                  onClick={onReset}
                  className="text-xs text-slate-400 hover:text-white underline font-mono"
                >
                  X-Ray Another Decision
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
