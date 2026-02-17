
import React, { useState } from 'react';
import { PromptPack } from '../types';

interface PromptPackDisplayProps {
  pack: PromptPack;
}

export const PromptPackDisplay: React.FC<PromptPackDisplayProps> = ({ pack }) => {
  const [activeTab, setActiveTab] = useState<'master' | 'stability' | 'control'>('master');
  const [copied, setCopied] = useState(false);

  const getPromptContent = () => {
    switch(activeTab) {
      case 'master': return pack.masterPrompt;
      case 'stability': return pack.stabilityEnhancedVersion;
      case 'control': return pack.highControlVersion;
      default: return pack.masterPrompt;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <span className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-1 block">Detected Use Case</span>
          <h2 className="text-xl font-bold text-white mb-2">{pack.detectedUseCase}</h2>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold rounded border border-indigo-500/20 uppercase">
              Stability: {pack.optimizationLevel}
            </span>
          </div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center justify-center gap-4">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-800" />
              <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={150.8} strokeDashoffset={150.8 * (1 - pack.strengthScore / 100)} className="text-indigo-500 transition-all duration-1000" />
            </svg>
            <span className="absolute text-xs font-bold text-white">{pack.strengthScore}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase block">Architecture Score</span>
            <span className="text-white text-xs font-semibold">Commercial Grade</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <span className="text-slate-400 text-[10px] font-bold uppercase block mb-2">Assumptions</span>
          <ul className="text-[10px] text-slate-300 space-y-1">
            {pack.assumptions.slice(0, 2).map((a, i) => (
              <li key={i} className="flex items-start gap-1">
                <span className="text-indigo-500">•</span>
                <span className="line-clamp-2">{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Architecture Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-slate-800/50 flex items-center border-b border-slate-800">
          <button 
            onClick={() => setActiveTab('master')}
            className={`px-6 py-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === 'master' ? 'text-indigo-400 border-indigo-400 bg-indigo-400/5' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
          >
            1. Master Commercial-Grade
          </button>
          <button 
            onClick={() => setActiveTab('stability')}
            className={`px-6 py-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === 'stability' ? 'text-indigo-400 border-indigo-400 bg-indigo-400/5' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
          >
            2. Cross-Model Stable
          </button>
          <button 
            onClick={() => setActiveTab('control')}
            className={`px-6 py-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === 'control' ? 'text-indigo-400 border-indigo-400 bg-indigo-400/5' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
          >
            3. Maximum-Control
          </button>
          <div className="ml-auto pr-4">
            <button 
              onClick={() => copyToClipboard(getPromptContent())}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-[10px] font-bold transition-all"
            >
              {copied ? 'Copied!' : 'Copy Prompt'}
            </button>
          </div>
        </div>
        <div className="p-0">
          <div className="whitespace-pre-wrap text-slate-200 font-mono text-xs leading-relaxed bg-slate-950 p-8 min-h-[400px]">
            {getPromptContent()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reusable Parameter Schema */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-800">
             <h3 className="font-bold text-[10px] uppercase tracking-wider text-indigo-400">5) Reusable Parameter Schema (JSON)</h3>
          </div>
          <div className="p-4 bg-slate-950">
            <pre className="text-[10px] text-slate-400 font-mono overflow-auto max-h-[200px]">
              {JSON.stringify(pack.reusableVariablesSchema, null, 2)}
            </pre>
          </div>
        </div>

        {/* Stability Validation Checklist */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-800">
             <h3 className="font-bold text-[10px] uppercase tracking-wider text-green-400">6) Stability Validation Checklist</h3>
          </div>
          <div className="p-4 space-y-2">
            {pack.strengthChecklist.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-[10px] text-slate-300">
                <svg className="w-3 h-3 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Explicit Exclusions & Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h3 className="font-bold text-[10px] uppercase tracking-wider text-red-400 mb-3">4) Explicit Exclusions</h3>
          <p className="text-[11px] text-slate-400 italic leading-relaxed">{pack.negativeConstraints}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h3 className="font-bold text-[10px] uppercase tracking-wider text-amber-400 mb-3">Professional Quality Refinements</h3>
          <ul className="space-y-2">
            {pack.suggestions.map((s, i) => (
              <li key={i} className="text-[10px] text-slate-400 flex gap-2">
                <span className="text-amber-500 font-bold">{i+1}.</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
