import React, { useState } from 'react';
import { getStoredApiKey, saveStoredApiKey, getStoredProvider } from '../services/aiService';
import { Key, X, Check, ShieldAlert, Sparkles, ExternalLink } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: () => void;
}

export const ApiKeyModal: React.FC<Props> = ({ isOpen, onClose, onKeySaved }) => {
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [provider, setProvider] = useState(getStoredProvider());
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredApiKey(apiKey, provider);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onKeySaved();
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    setApiKey('');
    saveStoredApiKey('');
    onKeySaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0D121D] p-6 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                AI Reasoning Engine Settings
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Optional: Custom API Key Configuration
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="mt-4 space-y-4">
          {/* Provider Selector */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">
              AI Service Provider:
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-sky-400"
            >
              <option value="gemini">Google Gemini 2.0 / 1.5 Flash (Recommended)</option>
              <option value="openai">OpenAI / Groq / OpenRouter (GPT-4o compatible)</option>
            </select>
          </div>

          {/* Key Input */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300 flex justify-between items-center">
              <span>API Key:</span>
              <a
                href={provider === 'gemini' ? 'https://aistudio.google.com/app/apikey' : 'https://platform.openai.com/api-keys'}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-sky-400 hover:underline flex items-center gap-1"
              >
                <span>Get key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={provider === 'gemini' ? 'AIzaSy...' : 'sk-...'}
              className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder:text-slate-600 focus:border-sky-400 font-mono"
            />
          </div>

          {/* Security Notice */}
          <div className="p-3 rounded-lg bg-sky-500/[0.05] border border-sky-500/10 text-[11px] text-slate-300 space-y-1">
            <div className="flex items-center gap-1 text-sky-400 font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Prototype Notice & Security</span>
            </div>
            <p className="text-slate-400 leading-snug">
              Key is stored locally in your browser session (<code className="font-mono text-slate-300">localStorage</code>) for frontend requests. If no key is provided, the application runs on the built-in deterministic demo engine.
            </p>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-between gap-3">
            {apiKey && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-red-400 hover:text-red-300 font-mono"
              >
                Remove Key
              </button>
            )}

            <div className="flex items-center space-x-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-lg text-xs text-slate-400 hover:text-white bg-white/5 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-sky-500 hover:bg-sky-400 transition flex items-center gap-1.5"
              >
                {saved ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{saved ? 'Saved!' : 'Save Key'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
