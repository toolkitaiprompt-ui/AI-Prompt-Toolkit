import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Copy, RefreshCcw, Sparkles, Wand2 } from "lucide-react";

function generateOptimizedPrompt(prompt: string) {
  const trimmed = prompt.trim();
  if (!trimmed) {
    return "Start with your prompt on the left and click Optimize to see the upgraded prompt here.";
  }

  return `Refine this instruction for maximum clarity, tone control, and AI alignment:\n\n${trimmed}\n\nUse concise sections, explicit role prompts, output expectations, and optional placeholders for tone and audience.`;
}

export default function PromptOptimizer() {
  const [originalPrompt, setOriginalPrompt] = useState(
    "Write a polished executive summary for the product roadmap, emphasize user impact, and keep the tone confident yet clear."
  );
  const [optimizedPrompt, setOptimizedPrompt] = useState(() => generateOptimizedPrompt(originalPrompt));
  const [creditsRemaining, setCreditsRemaining] = useState(12);
  const [compareMode, setCompareMode] = useState(false);
  const [status, setStatus] = useState("Ready for a premium prompt upgrade.");

  const canOptimize = creditsRemaining > 0;
  const promotedCredits = useMemo(() => `${creditsRemaining} credits remaining`, [creditsRemaining]);

  const handleOptimize = () => {
    if (!canOptimize) {
      setStatus("Optimization limit reached. Try again later.");
      return;
    }

    setCreditsRemaining((current) => Math.max(current - 1, 0));
    setOptimizedPrompt(generateOptimizedPrompt(originalPrompt));
    setStatus("Optimized prompt ready — copy it into your next AI request.");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(optimizedPrompt);
      setStatus("Optimized prompt copied to clipboard.");
    } catch {
      setStatus("Copy failed. Please try again in a secure browser.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] border border-cyan-400/10 bg-slate-950/75 p-6 shadow-[0_32px_80px_-48px_rgba(6,182,212,0.35)] backdrop-blur-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200">Credits remaining</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-white">{promotedCredits}</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-3xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
            <Sparkles className="h-4 w-4 text-cyan-300" aria-hidden="true" />
            Advanced prompt optimization
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.6)] backdrop-blur-xl"
        >
          <div className="flex items-center justify-between gap-3 pb-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Original Prompt</p>
              <p className="text-xs text-slate-500">Edit here before optimization.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/70 px-3 py-1 text-xs text-slate-300">
              <Wand2 className="h-4 w-4 text-cyan-300" aria-hidden="true" />
              inline editing
            </div>
          </div>
          <textarea
            className="min-h-[320px] w-full rounded-3xl border border-slate-700/80 bg-slate-950/90 p-5 text-sm text-slate-100 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
            value={originalPrompt}
            onChange={(event) => setOriginalPrompt(event.target.value)}
            aria-label="Original prompt input"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-[0_20px_60px_-40px_rgba(99,102,241,0.55)] backdrop-blur-xl"
        >
          <div className="flex items-center justify-between gap-3 pb-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">AI Optimized Version</p>
              <p className="text-xs text-slate-500">Copy or compare with your prompt.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/70 px-3 py-1 text-xs text-slate-300">
              <RefreshCcw className="h-4 w-4 text-violet-300" aria-hidden="true" />
              premium result
            </div>
          </div>
          <div className="relative min-h-[320px] rounded-3xl border border-slate-800/90 bg-slate-900/90 p-5 text-sm leading-7 text-slate-200 shadow-inner shadow-slate-950/60">
            <pre className={`whitespace-pre-wrap ${compareMode ? "bg-slate-900/90" : ""}`}>{optimizedPrompt}</pre>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleOptimize}
              disabled={!canOptimize}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:shadow-xl hover:shadow-cyan-500/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Wand2 className="h-4 w-4" aria-hidden="true" />
              Optimize Prompt
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300/60 hover:bg-cyan-500/20"
            >
              <Copy className="h-4 w-4" aria-hidden="true" />
              Copy optimized prompt
            </button>
            <button
              type="button"
              onClick={() => setCompareMode((current) => !current)}
              className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-5 py-3 text-sm font-semibold text-violet-100 transition hover:border-violet-300/60 hover:bg-violet-500/20"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {compareMode ? "Hide comparison" : "Compare"}
            </button>
          </div>
        </motion.div>
      </div>

      <div className="rounded-[32px] border border-slate-800/80 bg-slate-950/80 p-6 text-sm text-slate-300 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.55)]">
        <p className="text-white">Status</p>
        <p className="mt-2 text-sm leading-7 text-slate-400">{status}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[28px] border border-slate-800/90 bg-slate-900/85 p-5 text-sm text-slate-300 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.45)]">
          <p className="font-semibold text-white">AI signal</p>
          <p className="mt-3 text-slate-400">Every optimization pass applies tone, clarity, and instruction architecture to the prompt.</p>
        </div>
        <div className="rounded-[28px] border border-slate-800/90 bg-slate-900/85 p-5 text-sm text-slate-300 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.45)]">
          <p className="font-semibold text-white">Workflow control</p>
          <p className="mt-3 text-slate-400">Compare original and refined prompts side by side, then push the version that best matches your goals.</p>
        </div>
        <div className="rounded-[28px] border border-slate-800/90 bg-slate-900/85 p-5 text-sm text-slate-300 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.45)]">
          <p className="font-semibold text-white">Premium design</p>
          <p className="mt-3 text-slate-400">A polished, glassmorphism interface built for a commander-style AI toolkit experience.</p>
        </div>
      </div>
    </div>
  );
}
