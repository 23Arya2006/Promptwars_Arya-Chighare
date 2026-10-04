import React, { useState } from 'react';
import { DecisionInput } from '../types';
import { DEMO_SCENARIOS } from '../data/demoScenarios';
import { Sparkles, ChevronDown, ChevronUp, Sliders, ArrowRight, RotateCcw, Zap, HelpCircle } from 'lucide-react';

interface Props {
  onSubmit: (input: DecisionInput) => void;
  isLoading: boolean;
}

export const DecisionInputLab: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [decision, setDecision] = useState('');
  const [priorities, setPriorities] = useState('');
  const [leaning, setLeaning] = useState('');
  const [existingEvidence, setExistingEvidence] = useState('');
  const [worries, setWorries] = useState('');
  const [userConfidence, setUserConfidence] = useState(80);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSelectPreset = (scenario: typeof DEMO_SCENARIOS[0]) => {
    setDecision(scenario.data.decision);
    if (scenario.name.includes("Internship")) {
      setPriorities("Maintaining a competitive Academic GPA (3.7+) while gaining top tier industry experience");
      setLeaning("Leaning toward accepting because the stipend and brand look compelling");
      setExistingEvidence("Offer letter specifies $1,200/mo stipend; commute is 20 minutes from apartment");
      setWorries("Missing mandatory laboratory sessions and falling behind during midterms");
    } else if (scenario.name.includes("Startup")) {
      setPriorities("Maximum career leverage and upside in the next 3 years without going broke");
      setLeaning("Leaning toward startup because of full architectural freedom");
      setExistingEvidence("14 months seed runway, 1.5% equity offer, known founders");
      setWorries("Startup folding in 12 months with zero equity value");
    } else {
      setPriorities("Protecting company brand reputation while beating competitor to market");
      setLeaning("Leaning toward launching next week");
      setExistingEvidence("5 beta testers gave positive feedback on the core algorithm");
      setWorries("Public signup drop-off due to rough onboarding UX");
    }
    setUserConfidence(scenario.data.userConfidence);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decision.trim()) return;

    onSubmit({
      decision: decision.trim(),
      priorities: priorities.trim() || undefined,
      leaning: leaning.trim() || undefined,
      existingEvidence: existingEvidence.trim() || undefined,
      worries: worries.trim() || undefined,
      userConfidence
    });
  };

  const handleClear = () => {
    setDecision('');
    setPriorities('');
    setLeaning('');
    setExistingEvidence('');
    setWorries('');
    setUserConfidence(80);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0A0D15]/95 backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            <span className="text-xs font-mono font-bold tracking-widest text-sky-400 uppercase">
              Decision Input Lab
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display mt-1">
            What decision are you considering?
          </h2>
        </div>

        {/* Clear Button */}
        {decision && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Form</span>
          </button>
        )}
      </div>

      {/* Quick Demo Presets Selector */}
      <div className="mt-4 pt-1">
        <span className="text-[11px] font-mono text-slate-400 block mb-2">
          ⚡ QUICK PRELOAD PRESETS (INSTANT DEMO):
        </span>
        <div className="flex flex-wrap gap-2">
          {DEMO_SCENARIOS.map((scenario, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(scenario)}
              className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-sky-500/15 hover:text-sky-300 text-slate-300 border border-white/5 transition flex items-center space-x-1.5"
            >
              <Sparkles className="w-3 h-3 text-sky-400" />
              <span>{scenario.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {/* Core Decision Textarea */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>The Decision Inquiry *</span>
            <span className="text-[11px] font-normal text-slate-400">Be as specific as possible</span>
          </label>
          <textarea
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            required
            rows={3}
            placeholder="e.g. Should I accept a 6-month internship with a good stipend even though it may affect my college schedule?"
            className="w-full bg-[#06080C] border border-white/15 rounded-xl p-4 text-sm sm:text-base text-white placeholder:text-slate-600 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 resize-none transition shadow-inner leading-relaxed"
          />
        </div>

        {/* Collapsible Optional Nuance Fields */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-between w-full py-2 px-3 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-slate-400 hover:text-slate-200 transition font-mono"
          >
            <span className="flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-sky-400" />
              <span>{showAdvanced ? 'Hide Additional Reasoning Context' : 'Add Context: Priorities, Worries & Evidence (Optional)'}</span>
            </span>
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showAdvanced && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in-50 duration-200">
              {/* Priorities */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400 block">
                  What matters most to you? (Your top priority)
                </label>
                <input
                  type="text"
                  value={priorities}
                  onChange={(e) => setPriorities(e.target.value)}
                  placeholder="e.g. Maintaining 3.7+ GPA vs Career acceleration"
                  className="w-full bg-[#06080C] border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder:text-slate-600 focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                />
              </div>

              {/* Current Leaning */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400 block">
                  What are you currently leaning toward?
                </label>
                <input
                  type="text"
                  value={leaning}
                  onChange={(e) => setLeaning(e.target.value)}
                  placeholder="e.g. Leaning toward accepting the offer"
                  className="w-full bg-[#06080C] border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder:text-slate-600 focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                />
              </div>

              {/* Existing Evidence */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400 block">
                  What hard evidence do you already have?
                </label>
                <input
                  type="text"
                  value={existingEvidence}
                  onChange={(e) => setExistingEvidence(e.target.value)}
                  placeholder="e.g. $1,200/mo stipend contract, 20min commute"
                  className="w-full bg-[#06080C] border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder:text-slate-600 focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                />
              </div>

              {/* Worries */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400 block">
                  What are you most worried about?
                </label>
                <input
                  type="text"
                  value={worries}
                  onChange={(e) => setWorries(e.target.value)}
                  placeholder="e.g. Academic debarment due to low attendance"
                  className="w-full bg-[#06080C] border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder:text-slate-600 focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                />
              </div>
            </div>
          )}
        </div>

        {/* Initial Confidence Level Slider */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 font-medium">Initial Subjective Confidence in Your Reasoning:</span>
            <span className="text-sky-400 font-bold">{userConfidence}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={userConfidence}
            onChange={(e) => setUserConfidence(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !decision.trim()}
          className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-sky-500 via-indigo-500 to-sky-500 hover:opacity-95 active:scale-[0.99] transition shadow-lg shadow-sky-950/50 flex items-center justify-center space-x-2 text-base font-display disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {isLoading ? (
            <span className="flex items-center space-x-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>SCANNING REASONING MATRIX...</span>
            </span>
          ) : (
            <span className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
              <span>RUN REASONING X-RAY</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          )}
        </button>
      </form>
    </div>
  );
};
