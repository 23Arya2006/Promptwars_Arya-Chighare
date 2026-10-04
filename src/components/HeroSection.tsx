import React, { useState, useEffect } from 'react';
import { ShieldAlert, ArrowRight, Sparkles, Layers, Eye, HelpCircle, AlertOctagon, Zap, FileSearch, HelpCircle as QuestionIcon, Play } from 'lucide-react';

interface Props {
  onStart: () => void;
  onTryDemo: () => void;
}

export const HeroSection: React.FC<Props> = ({ onStart, onTryDemo }) => {
  const [activeScanStep, setActiveScanStep] = useState(0);

  const scanSteps = [
    { label: 'VISIBLE PREMISE', tag: 'EXPLICIT', desc: '"Accepting an internship with high monthly stipend ($1.2k/mo)"', color: '#94A3B8', icon: <Eye className="w-4 h-4" /> },
    { label: 'UNSTATED ASSUMPTION', tag: 'ASSUMED', desc: '"Proximity automatically makes balancing 40h/week with studies easy"', color: '#F59E0B', icon: <HelpCircle className="w-4 h-4" /> },
    { label: 'CRITICAL BLIND SPOT', tag: 'MISSING', desc: '"Mentorship quality and actual code review depth unverified"', color: '#EF4444', icon: <AlertOctagon className="w-4 h-4" /> },
    { label: 'REASONING CONFLICT', tag: 'CONFLICT', desc: '"Stated priority: 3.7+ GPA vs 40h/week on-site schedule requirement"', color: '#A855F7', icon: <Zap className="w-4 h-4" /> },
    { label: 'DECISION-CHANGING QUESTION', tag: 'QUESTION', desc: '"If stipend were $0, would the practical learning still justify the risk?"', color: '#10B981', icon: <QuestionIcon className="w-4 h-4" /> }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveScanStep(prev => (prev + 1) % scanSteps.length);
    }, 2400);
    return () => clearInterval(timer);
  }, [scanSteps.length]);

  return (
    <div className="relative pt-12 pb-20 overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-b from-sky-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        {/* Top Eyebrow Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-slate-300 mb-6 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
          <span className="text-white font-semibold">BLINDSPOT</span>
          <span className="text-slate-500">|</span>
          <span>AI Socratic Reasoning X-Ray</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white font-display leading-[1.1] max-w-4xl mx-auto">
          See what your decision <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-slate-100 to-amber-300">
            can't see.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          An AI reasoning X-Ray that finds the assumptions, missing evidence, second-order effects, and contradictions hiding inside your decisions—<span className="text-white font-semibold underline decoration-sky-400/50">without deciding for you</span>.
        </p>

        {/* The Golden Competition Axiom */}
        <div className="mt-4 inline-block px-4 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs sm:text-sm font-mono text-sky-300">
          ✨ AI doesn't make the decision. It interrogates the reasoning behind it.
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStart}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-slate-950 font-bold hover:bg-slate-200 transition-all font-display text-base shadow-xl shadow-white/10 flex items-center justify-center space-x-2 group"
          >
            <span>X-RAY MY DECISION</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={onTryDemo}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/90 text-white font-semibold border border-white/15 hover:border-white/30 hover:bg-slate-800/90 transition-all text-base flex items-center justify-center space-x-2"
          >
            <Play className="w-4 h-4 text-sky-400 fill-sky-400" />
            <span>TRY DEMO SCENARIO</span>
          </button>
        </div>

        {/* 2D Animated Reasoning Scan Interactive Demonstration */}
        <div className="mt-16 max-w-3xl mx-auto text-left rounded-2xl border border-white/10 bg-[#0A0E17]/95 backdrop-blur-xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="uppercase tracking-wider text-slate-300 font-semibold">Live 2D Reasoning Scan</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
              Scanning Layer {activeScanStep + 1} of {scanSteps.length}
            </span>
          </div>

          {/* Decision statement being scanned */}
          <div className="my-4 p-4 rounded-xl bg-black/40 border border-white/5 relative">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
              INPUT DECISION STATEMENT
            </span>
            <p className="text-sm sm:text-base font-semibold text-white">
              "Should I accept a 6-month internship with a good stipend even though it may affect my college schedule?"
            </p>
          </div>

          {/* Scanned Layers Accordion / Flow */}
          <div className="space-y-2 mt-4">
            {scanSteps.map((step, idx) => {
              const isActive = activeScanStep === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveScanStep(idx)}
                  className={`cursor-pointer p-3 rounded-xl border transition-all duration-300 flex items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-slate-900 border-white/20 shadow-lg'
                      : 'bg-black/20 border-transparent opacity-60 hover:opacity-100'
                  }`}
                  style={{
                    borderLeftColor: step.color,
                    borderLeftWidth: isActive ? '4px' : '2px'
                  }}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div
                      className="p-1.5 rounded-lg shrink-0"
                      style={{ backgroundColor: `${step.color}15`, color: step.color }}
                    >
                      {step.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold" style={{ color: step.color }}>
                          {step.label}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-slate-400 uppercase">
                          {step.tag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 truncate mt-0.5">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  {isActive && (
                    <span className="text-[10px] font-mono text-sky-400 shrink-0 font-semibold px-2 py-0.5 rounded bg-sky-500/10">
                      X-RAY ACTIVE
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Conceptual Differentiator Card */}
        <div className="mt-16 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {/* Most AI Tools */}
          <div className="rounded-2xl border border-white/5 bg-slate-950/50 p-6">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-400 block mb-2">
              Most AI Advice Tools
            </span>
            <h3 className="text-xl font-bold text-slate-300 font-display">
              "What should I do?"
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Generic chatbots generate shallow pros/cons lists, hallucinate recommendations, or attempt to make the decision for you—stripping away human accountability.
            </p>
          </div>

          {/* BLINDSPOT */}
          <div className="rounded-2xl border border-sky-500/30 bg-sky-950/10 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-sky-400 block mb-2">
              BLINDSPOT Reasoning X-Ray
            </span>
            <h3 className="text-xl font-bold text-white font-display">
              "Why do you think that?"
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Deconstructs your cognitive premises. Exposes what you assumed, overlooked, or left unverified—empowering <strong>you</strong> as the ultimate decision-maker.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
