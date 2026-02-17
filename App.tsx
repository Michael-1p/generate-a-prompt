
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { PromptPackDisplay } from './components/PromptPackDisplay';
import { geminiService } from './services/geminiService';
import { PromptPack, PromptCategory } from './types';

const App: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [category, setCategory] = useState<PromptCategory>(PromptCategory.AUTO);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPack, setGeneratedPack] = useState<PromptPack | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (forcedInput?: string) => {
    const inputToUse = forcedInput || userInput;
    if (!inputToUse.trim()) return;

    setIsGenerating(true);
    setError(null);
    try {
      const fullInput = category !== PromptCategory.AUTO 
        ? `Use Case: ${category}\nRequest: ${inputToUse}`
        : inputToUse;
      
      const pack = await geminiService.generatePromptPack(fullInput);
      setGeneratedPack(pack);
      
      if (!pack.clarifyingQuestions?.length) {
        setTimeout(() => {
          document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during the stabilization protocol. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuestionSelect = (question: string) => {
    setUserInput(prev => `${prev}\n\n[Clarification] Answer to "${question}": `);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-12 pb-24">
        {/* Hero & Input Section */}
        <section className="text-center space-y-4 pt-8">
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-x">
            Prompt Generator
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Transform vague requests into high-control, low-variance, deterministic prompt architectures.
          </p>
        </section>

        <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl shadow-indigo-500/5">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><path d="M12 2v10"/><path d="M18.4 4.6a10 10 0 1 1-12.8 0"/></svg>
                Input Strategic Requirement
              </label>
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Describe your intent (e.g., 'Generate a direct-response ad copy for a luxury watch brand')..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 min-h-[160px] focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none text-lg resize-none placeholder:text-slate-700 font-light"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                  Target Architecture
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as PromptCategory)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/50 outline-none text-slate-300"
                >
                  {Object.values(PromptCategory).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => handleGenerate()}
                  disabled={isGenerating || !userInput.trim()}
                  className={`w-full py-2.5 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
                    isGenerating || !userInput.trim()
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20 active:scale-[0.98]'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Stabilizing Protocol...
                    </>
                  ) : (
                    <>
                      Engineer Stable Prompt
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                    </>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm text-center font-medium">
                {error}
              </div>
            )}
          </div>
        </section>

        {/* Clarifying Questions */}
        {generatedPack?.clarifyingQuestions && generatedPack.clarifyingQuestions.length > 0 && (
          <section className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 animate-in zoom-in-95 duration-500">
            <h3 className="text-amber-400 font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
              Precision Alignment Needed
            </h3>
            <p className="text-slate-400 text-xs mb-4">The engine requires further stabilization data to minimize output variance:</p>
            <div className="space-y-3">
              {generatedPack.clarifyingQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuestionSelect(q)}
                  className="w-full text-left p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800 transition-all text-xs text-slate-200"
                >
                  {q}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Results Section */}
        {generatedPack && (generatedPack.masterPrompt || !generatedPack.clarifyingQuestions?.length) && (
          <div id="result-section" className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-4">
              <div className="h-px bg-slate-800 flex-1"></div>
              <h3 className="text-slate-500 font-bold uppercase tracking-widest text-[10px] shrink-0">Commercially Stable Architecture</h3>
              <div className="h-px bg-slate-800 flex-1"></div>
            </div>
            <PromptPackDisplay pack={generatedPack} />
          </div>
        )}

        {!generatedPack && !isGenerating && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-40">
            {[
              { title: "Deterministic Output", desc: "Reduces interpretive noise and creative randomness for predictable results." },
              { title: "Production Stability", desc: "Designed for enterprise-level automation and consistent API responses." },
              { title: "Low Variance", desc: "Engineered for cross-model consistency across GPT-4, Gemini, and Claude." }
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-slate-800 border-dashed text-center">
                <h4 className="font-bold mb-2 text-indigo-400 text-sm">{item.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
