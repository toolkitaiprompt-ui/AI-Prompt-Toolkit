import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Copy, Check, Download, Trash2, Wand2, FlaskConical, Gauge, MessageSquare, Lightbulb } from "lucide-react";
import { cleanPrompt } from "../lib/toolkit";
import { analyzeAll, generateOptimizedPrompt, getTokenColor } from "../lib/playgroundAnalysis";

const QUICK_STARTS = [
  { label: "📝 Blog Post", text: "Write a 500-word blog post about the benefits of AI for small businesses. Target audience: small business owners. Tone: friendly and informative. Include 3 key benefits with examples." },
  { label: "💻 Code Review", text: "You are a senior code reviewer. Review the following code for potential bugs, security issues, and performance improvements. Provide feedback with line references." },
  { label: "📧 Cold Email", text: "You are a sales expert. Write a cold email for a SaaS product that helps marketing teams save time. The email should be personalized, value-focused, and end with a low-pressure CTA." },
];

export default function PlaygroundPage() {
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState("tokens");
  const [copied, setCopied] = useState(false);
  const [optimized, setOptimized] = useState<{ prompt: string; changes: string[] } | null>(null);
  const [showOptimized, setShowOptimized] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analysis = useMemo(() => {
    if (!input.trim()) return null;
    return analyzeAll(input);
  }, [input]);

  const structureScore = analysis?.structure.score ?? 0;
  const debugScore = analysis?.debug.score ?? 0;
  const isGood = debugScore >= 80;
  const isMedium = debugScore >= 50 && debugScore < 80;

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
    setIsAnalyzing(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setIsAnalyzing(false), 300);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleClean = () => {
    setInput(cleanPrompt(input));
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    const blob = new Blob([input], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prompt.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setInput("");
    setOptimized(null);
    setShowOptimized(false);
  };

  const handleOptimize = () => {
    const result = generateOptimizedPrompt(input);
    setOptimized(result);
    setShowOptimized(true);
  };

  const fillQuickStart = (text: string) => {
    setInput(text);
    setOptimized(null);
    setShowOptimized(false);
  };

  const scoreRing = (score: number, size = "w-16 h-16", textSize = "text-xl") => {
    const color = score >= 80 ? "from-emerald-400 to-emerald-500" : score >= 50 ? "from-amber-400 to-rose-400" : "from-rose-400 to-red-500";
    const textColor = score >= 80 ? "text-emerald-400" : score >= 50 ? "text-amber-400" : "text-rose-400";
    return (
      <div className={`relative ${size} rounded-full bg-gradient-to-br ${color} p-[2px]`}>
        <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
          <span className={`${textSize} font-bold ${textColor}`}>{score}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 font-headline">
          ✨ Prompt Playground
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Your AI prompt workshop — analyze, optimize, and perfect your prompts in real-time 🧠
        </p>
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-[1fr_400px] gap-6">
        {/* Left — Input area */}
        <div className="space-y-3">
          <textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Type or paste your prompt here… I'll analyze it as you type 🧠"
            rows={14}
            className="w-full rounded-[20px] border border-white/[0.06] bg-white/[0.02] p-5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-amber-400/40 focus:ring-2 focus:ring-amber-400/10 resize-none backdrop-blur-sm font-mono leading-relaxed"
          />

          {/* Bottom action bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button onClick={handleClean} disabled={!input.trim()} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-white/10 disabled:opacity-30 transition">
                🧹 Clean
              </button>
              <button onClick={handleCopy} disabled={!input.trim()} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-white/10 disabled:opacity-30 transition">
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {copied ? "Copied!" : "Copy"}
              </button>
              <button onClick={handleExport} disabled={!input.trim()} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-white/10 disabled:opacity-30 transition">
                <Download className="w-3.5 h-3.5" /> Export
              </button>
              <button onClick={handleClear} disabled={!input.trim()} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs text-slate-500 hover:text-rose-400 disabled:opacity-30 transition">
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
            </div>
            {input.trim() && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className={`inline-block w-2 h-2 rounded-full ${isAnalyzing ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`} />
                {isAnalyzing ? "Analyzing..." : `${Math.ceil(input.length / 4)} tokens`}
              </div>
            )}
          </div>

          {/* Empty state */}
          {!input.trim() && (
            <div className="text-center py-8 border border-dashed border-slate-700/60 rounded-2xl bg-slate-900/30">
              <FlaskConical className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">Ready when you are! Paste a prompt or start typing… 💡</p>
              <div className="flex flex-wrap justify-center gap-3 mt-5">
                {QUICK_STARTS.map((qs) => (
                  <button key={qs.label} onClick={() => fillQuickStart(qs.text)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-400/20 text-xs text-amber-300 hover:bg-amber-500/20 transition">
                    {qs.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — Analysis panel */}
        <div className="rounded-[20px] border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-white/[0.06] overflow-x-auto">
            {["tokens", "structure", "debug", "optimize"].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-1 px-3 py-3 text-xs font-medium transition whitespace-nowrap ${
                  activeTab === tab ? "text-amber-400 border-b-2 border-amber-400 bg-amber-500/5" : "text-slate-500 hover:text-slate-300"
                }`}>
                {tab === "tokens" && "📊 Tokens"}
                {tab === "structure" && "🏗️ Structure"}
                {tab === "debug" && "🔍 Debug"}
                {tab === "optimize" && "✨ Optimize"}
              </button>
            ))}
          </div>

          <div className="p-4 min-h-[300px]">
            <AnimatePresence mode="wait">
              {!input.trim() ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-10 text-center">
                  <MessageSquare className="w-8 h-8 text-slate-600 mb-3" />
                  <p className="text-slate-500 text-xs">Start typing to see analysis</p>
                </motion.div>
              ) : (
                <motion.div key={activeTab + input.length} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                  {/* Tokens Tab */}
                  {activeTab === "tokens" && analysis && (
                    <div className="space-y-3">
                      <p className={`text-xs font-medium ${isGood ? "text-emerald-400" : isMedium ? "text-amber-400" : "text-rose-400"}`}>
                        {isGood ? "Great prompt! 🎯 Minor tweaks could make it perfect." : isMedium ? "Good start! 💪 Here's how to level up:" : "Let's improve this together! 🔧"}
                      </p>
                      <div className="space-y-2">
                        {analysis.tokens.modelEstimates.map((m) => (
                          <div key={m.model} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-slate-900/60">
                            <span className="text-xs text-slate-400">{m.model}</span>
                            <div className="flex items-center gap-3">
                              <span className={`text-xs font-semibold ${getTokenColor(m.tokens)}`}>{m.tokens.toLocaleString()} tok</span>
                              <span className="text-[11px] text-slate-500">${m.inputCost.toFixed(5)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                        <span>Characters: {analysis.tokens.characters}</span>
                        <span>Words: {analysis.tokens.words}</span>
                      </div>
                    </div>
                  )}

                  {/* Structure Tab */}
                  {activeTab === "structure" && analysis && (
                    <div className="space-y-4">
                      <div className="flex flex-col items-center py-2">
                        {scoreRing(analysis.structure.score)}
                        <p className="text-xs text-slate-500 mt-2">Structure Score</p>
                      </div>
                      <div className="space-y-2">
                        {[
                          { label: "Role assigned", check: analysis.structure.hasRole },
                          { label: "Task defined", check: analysis.structure.hasTask },
                          { label: "Format specified", check: analysis.structure.hasFormat },
                          { label: "Constraints set", check: analysis.structure.hasConstraints },
                          { label: "Examples included", check: analysis.structure.hasExamples },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-slate-900/60">
                            <span className="text-xs text-slate-400">{item.label}</span>
                            <span className={`text-xs font-bold ${item.check ? "text-emerald-400" : "text-rose-400"}`}>{item.check ? "✅" : "❌"}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Debug Tab */}
                  {activeTab === "debug" && analysis && (
                    <div className="space-y-4">
                      <div className="flex flex-col items-center py-2">
                        {scoreRing(analysis.debug.score, "w-20 h-20", "text-2xl")}
                        <p className={`text-xs font-semibold mt-2 ${isGood ? "text-emerald-400" : isMedium ? "text-amber-400" : "text-rose-400"}`}>
                          {analysis.debug.label}
                        </p>
                      </div>
                      {analysis.debug.issues.length > 0 ? (
                        <div className="space-y-2">
                          {analysis.debug.issues.map((issue, i) => (
                            <div key={i} className={`py-2 px-3 rounded-lg text-xs ${
                              issue.type === "warning" ? "bg-amber-500/10 border border-amber-400/20" :
                              issue.type === "error" ? "bg-rose-500/10 border border-rose-400/20" :
                              "bg-blue-500/10 border border-blue-400/20"
                            }`}>
                              <div className="flex items-start gap-2">
                                <span className={issue.type === "warning" ? "text-amber-400" : issue.type === "error" ? "text-rose-400" : "text-blue-400"}>
                                  {issue.type === "warning" ? "⚠" : issue.type === "error" ? "✕" : "ℹ"}
                                </span>
                                <div>
                                  <p className="text-white font-medium">{issue.title}</p>
                                  <p className="text-slate-500 mt-0.5">{issue.suggestion}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-emerald-400 text-sm font-medium">✅ No issues found! Your prompt looks solid.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Optimize Tab */}
                  {activeTab === "optimize" && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <Wand2 className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-300 mb-4">Let AI help you improve your prompt</p>
                        <button onClick={handleOptimize} disabled={!input.trim()}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-sm font-semibold text-white shadow-lg shadow-amber-500/30 hover:shadow-xl transition disabled:opacity-40">
                          <Sparkles className="w-4 h-4" /> Optimize Now
                        </button>
                      </div>

                      {showOptimized && optimized && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-emerald-400/20 bg-emerald-500/5 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-semibold text-emerald-300">✨ Here's your upgraded prompt!</p>
                            <button onClick={async () => { await navigator.clipboard.writeText(optimized.prompt); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                              className="text-xs text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1">
                              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}{copied ? "Copied!" : "Copy"}
                            </button>
                          </div>
                          {optimized.changes.length > 0 && (
                            <div className="mb-3 flex flex-wrap gap-2">
                              {optimized.changes.map((c, i) => (
                                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-400/20">+ {c}</span>
                              ))}
                            </div>
                          )}
                          <pre className="text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed max-h-[200px] overflow-y-auto">{optimized.prompt}</pre>
                        </motion.div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Analysis pulse indicator */}
      {isAnalyzing && input.trim() && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-400/20 text-xs text-amber-300 shadow-lg">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          Analyzing your prompt…
        </div>
      )}

      {/* Pro tip */}
      <div className="rounded-[16px] border border-amber-400/15 bg-amber-500/5 p-4">
        <p className="text-xs font-medium text-amber-300 mb-1">💡 Pro tip:</p>
        <p className="text-xs text-slate-400 leading-relaxed">
          Try writing a prompt with <span className="text-white">all 5 structure elements</span> (role, task, format, constraints, examples) 
          and watch your health score jump from 50 to 90+! The <span className="text-amber-400">🏗️ Structure</span> tab shows exactly what's missing. 
          For best results, keep your prompt under 800 tokens — shorter prompts get faster, more focused responses 🚀
        </p>
      </div>
    </div>
  );
}
