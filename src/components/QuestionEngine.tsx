import React, { useState } from 'react';
import { QuestionItem } from '../types';
import { HelpCircle, Sparkles, MessageSquare, Check, Edit3 } from 'lucide-react';

interface Props {
  questions: QuestionItem[];
}

export const QuestionEngine: React.FC<Props> = ({ questions }) => {
  const [userNotes, setUserNotes] = useState<Record<string, string>>({});
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  const handleNoteChange = (id: string, text: string) => {
    setUserNotes(prev => ({ ...prev, [id]: text }));
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'HIGH IMPACT':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'MEDIUM IMPACT':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'LOW IMPACT':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-[#080E14]/90 backdrop-blur-xl p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
              Signature Feature
            </span>
          </div>
          <h3 className="text-xl font-bold text-white font-display">
            The Decision-Changing Question Engine
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Five high-leverage inquiries where an unexpected answer would fundamentally shift your reasoning path.
          </p>
        </div>
      </div>

      {/* Question Cards */}
      <div className="mt-6 space-y-4">
        {questions.map((q, idx) => {
          const isNoteOpen = activeNoteId === q.id;
          const noteText = userNotes[q.id] || '';

          return (
            <div
              key={q.id || idx}
              className="rounded-xl border border-white/10 bg-black/30 p-5 hover:border-emerald-500/30 transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold flex items-center justify-center border border-emerald-500/30">
                    {idx + 1}
                  </span>
                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${getImpactBadge(q.impact)}`}>
                    {q.impact}
                  </span>
                </div>

                <button
                  onClick={() => setActiveNoteId(isNoteOpen ? null : q.id)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition flex items-center gap-1.5 ${
                    noteText
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-semibold'
                      : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{noteText ? 'Edit Answer' : 'Jot Answer'}</span>
                </button>
              </div>

              {/* Question Text */}
              <h4 className="text-base font-semibold text-slate-100 leading-snug">
                "{q.question}"
              </h4>

              {/* Why it Matters */}
              <p className="text-xs text-slate-400 mt-2 flex items-start gap-1.5">
                <span className="text-emerald-400 font-semibold shrink-0">Why this matters:</span>
                <span>{q.whyItMatters}</span>
              </p>

              {/* Interactive Note Taking */}
              {isNoteOpen && (
                <div className="mt-3 pt-3 border-t border-white/5 animate-in fade-in duration-200">
                  <label className="text-xs font-mono text-slate-400 block mb-1">
                    Your preliminary thought / finding:
                  </label>
                  <textarea
                    value={noteText}
                    onChange={(e) => handleNoteChange(q.id, e.target.value)}
                    placeholder="Type what you know or need to ask..."
                    rows={2}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder:text-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
