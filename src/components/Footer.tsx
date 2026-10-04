import React from 'react';
import { Layers, ShieldCheck, Github, ExternalLink, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-[#040609] py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-white/5">
          {/* Col 1: Brand & Philosophy */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center space-x-2.5">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white font-display tracking-wider">
                BLINDSPOT
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md">
              An AI reasoning X-Ray designed for the PromptWars / Prompathon competition. BLINDSPOT exposes assumptions, missing evidence, second-order effects, and internal contradictions—without taking decision agency away from the human.
            </p>
            <div className="flex items-center space-x-2 text-sky-400 font-mono text-[11px]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI doesn't make decisions. It interrogates reasoning.</span>
            </div>
          </div>

          {/* Col 2: Core Features */}
          <div className="space-y-2">
            <span className="text-white font-semibold font-mono uppercase tracking-wider block mb-2 text-xs">
              Reasoning System
            </span>
            <ul className="space-y-1.5 text-slate-400">
              <li>• 2D Blind Spot Topology Radar</li>
              <li>• Assumption Stress-Test Simulator</li>
              <li>• Value Tension & Conflict Engine</li>
              <li>• 5-Perspective Stakeholder Lens</li>
              <li>• Confidence vs Evidence Calibration</li>
            </ul>
          </div>

          {/* Col 3: Architecture & Security */}
          <div className="space-y-2">
            <span className="text-white font-semibold font-mono uppercase tracking-wider block mb-2 text-xs">
              Frontend Architecture
            </span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Built with React 19, TypeScript, Tailwind CSS, and Google Gemini 2.0 Socratic AI. Operates 100% client-side with zero tracking and zero mandatory databases.
            </p>
            <div className="pt-1">
              <a
                href="https://github.com/23Arya2006/Promptwars_Arya-Chighare"
                target="_blank"
                rel="noreferrer"
                className="text-slate-300 hover:text-white flex items-center gap-1.5 font-mono text-[11px]"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Repository</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px] font-mono">
          <div>
            PromptWars / Prompathon Edition • Built with Socratic AI Architecture
          </div>
          <div className="flex items-center space-x-4">
            <span>Human-in-the-loop Final Decision Authority</span>
            <span>•</span>
            <span className="text-emerald-400">Vercel Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
