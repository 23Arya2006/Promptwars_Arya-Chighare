import React from 'react';
import { Gauge, ShieldCheck, AlertCircle, Info } from 'lucide-react';

interface Props {
  userConfidence: number;
  evidenceCoverage: number;
  calibrationAdvice: string;
  onConfidenceChange: (val: number) => void;
}

export const ConfidenceEvidenceGauge: React.FC<Props> = ({
  userConfidence,
  evidenceCoverage,
  calibrationAdvice,
  onConfidenceChange
}) => {
  const delta = userConfidence - evidenceCoverage;

  let statusBadge = {
    title: 'Calibrated Reasoning Balance',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10 border-emerald-500/30',
    icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />
  };

  if (delta > 20) {
    statusBadge = {
      title: 'Confidence May Be Ahead Of Evidence',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/30',
      icon: <AlertCircle className="w-4 h-4 text-amber-400" />
    };
  } else if (delta < -15) {
    statusBadge = {
      title: 'Evidence Exceeds Current Confidence',
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/10 border-sky-500/30',
      icon: <Info className="w-4 h-4 text-sky-400" />
    };
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0A0D15]/90 backdrop-blur-xl p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Gauge className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono font-bold tracking-widest text-sky-400 uppercase">
              Calibration Signal
            </span>
          </div>
          <h3 className="text-xl font-bold text-white font-display">
            Confidence vs. Evidence Calibration
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            A cognitive calibration metric comparing subjective conviction with empirically verified facts.
          </p>
        </div>

        {/* Status indicator */}
        <div className={`px-3 py-1.5 rounded-xl border flex items-center space-x-2 text-xs font-semibold ${statusBadge.bgColor} ${statusBadge.color}`}>
          {statusBadge.icon}
          <span>{statusBadge.title}</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left: Dual Visual Bars & Slider */}
        <div className="space-y-6">
          {/* User Confidence Slider */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-semibold uppercase tracking-wider">
                1. Your Stated Confidence
              </span>
              <span className="text-amber-400 font-bold text-sm">{userConfidence}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={userConfidence}
              onChange={(e) => onConfidenceChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0% (Complete Uncertainty)</span>
              <span>50% (Equally Torn)</span>
              <span>100% (Absolute Certainty)</span>
            </div>
          </div>

          {/* Evidence Coverage Bar */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-semibold uppercase tracking-wider">
                2. Calculated Evidence Coverage
              </span>
              <span className="text-sky-400 font-bold text-sm">{evidenceCoverage}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-lg overflow-hidden flex">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-sky-400 transition-all duration-500"
                style={{ width: `${evidenceCoverage}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-400">
              Derived from verified operational facts vs unresolved missing dependencies.
            </div>
          </div>
        </div>

        {/* Right: Calibration Interpretation Note */}
        <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">CALIBRATION DELTA</span>
            <span className={`font-bold ${delta > 20 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {delta > 0 ? `+${delta}% Conviction Delta` : `${delta}% Coverage Delta`}
            </span>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed">
            {calibrationAdvice}
          </p>

          <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400 italic">
            <strong>Calibration principle:</strong> This is a calibration signal, not a verdict. High confidence with low evidence simply points to unexamined assumptions you may wish to verify before committing.
          </div>
        </div>
      </div>
    </div>
  );
};
