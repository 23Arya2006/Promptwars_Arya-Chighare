import React from 'react';
import { Layers, Key, Github, Sparkles, RefreshCw } from 'lucide-react';
import { getStoredApiKey } from '../services/aiService';

interface Props {
  onNewXRay: () => void;
  onOpenSettings: () => void;
  onTryDemo: () => void;
  hasResult: boolean;
}

export const Navbar: React.FC<Props> = ({ onNewXRay, onOpenSettings, onTryDemo, hasResult }) => {
  const hasKey = !!getStoredApiKey();

  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-[#06080C]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div
          onClick={onNewXRay}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-extrabold tracking-wider text-white font-display">
                BLINDSPOT
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30">
                X-RAY
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
              Reasoning Investigation System
            </p>
          </div>
        </div>

        {/* Center Banner / Tagline (Desktop) */}
        <div className="hidden md:flex items-center space-x-2 text-xs font-mono text-slate-400 bg-white/[0.03] px-3.5 py-1.5 rounded-full border border-white/5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Socratic AI: Interrogates reasoning without deciding for you</span>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {hasResult && (
            <button
              onClick={onNewXRay}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 border border-white/10 transition flex items-center space-x-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New X-Ray</span>
            </button>
          )}

          <button
            onClick={onTryDemo}
            className="px-3 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-xs font-semibold text-sky-300 border border-sky-500/30 transition flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Demo Cases</span>
          </button>

          <button
            onClick={onOpenSettings}
            className={`p-2 rounded-lg border transition flex items-center space-x-1.5 text-xs ${
              hasKey
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
            title={hasKey ? 'Custom API Key Active' : 'Configure Custom API Key'}
          >
            <Key className="w-4 h-4" />
            <span className="hidden sm:inline text-[11px] font-mono">
              {hasKey ? 'API Key Active' : 'API Key'}
            </span>
          </button>

          <a
            href="https://github.com/23Arya2006/Promptwars_Arya-Chighare"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition"
            title="GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </nav>
  );
};
