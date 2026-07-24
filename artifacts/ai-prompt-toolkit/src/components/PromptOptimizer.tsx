import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, RefreshCcw, Sparkles, Wand2 } from "lucide-react";

interface Analysis {
  improvements: string[];
  optimized: string;
}

function analyzeAndOptimize(prompt: string): Analysis {
  const trimmed = prompt.trim();
  if (!trimmed) {
    return {
      improvements: [],
      optimized: "Start with your prompt on the left and click Optimize to see the upgraded prompt here.",
    };
  }

  const improvements: string[] = [];
  const lower = trimmed.toLowerCase();

  const hasRole = /\b(act as|you are|as a|role:)\b/i.test(trimmed);
  const hasFormat = /\b(format|bullet|list|table|markdown|json|sections?|structure)\b/i.test(lower);
  const hasAudience = /\b(audience|for (beginners|experts|developers|students|customers|managers))\b/i.test(lower);
  const hasConstraints = /\b(\d+\s*(words?|sentences?|paragraphs?|bullets?|items?)|max|limit|under|at most|concise)\b/i.test(lower);
  const hasTone = /\b(tone|formal|casual|friendly|professional|confident|playful)\b/i.test(lower);
  const hasExamples = /\b(example|e\.g\.|for instance|such as)\b/i.test(lower);

  if (!hasRole) improvements.push("Added an expert role so the model answers from the right perspective");
  if (!hasFormat) improvements.push("Specified an output format for a predictable, structured response");
  if (!hasConstraints) improvements.push("Added a length constraint to keep the answer focused");
  if (!hasTone) improvements.push("Defined the tone so the writing style matches your intent");
  if (!hasAudience) improvements.push("Added a target-audience placeholder for better tailoring");
  if (!hasExamples) improvements.push("Suggested including an example to anchor the model");

  const lines: string[] = [];
  if (!hasRole) lines.push("Role: You are an expert assistant in the relevant domain.");
  lines.push("Task: " + trimmed.replace(/\s+/g, " "));
  if (!hasAudience) lines.push("Audience: [describe who this is for, e.g. beginners, executives]");
  if (!hasTone) lines.push("Tone: professional and clear");
  if (!hasFormat) lines.push("Format: well-structured Markdown with short sections and bullet points where helpful");
  if (!hasConstraints) lines.push("Constraints: be concise; avoid filler and repetition");
  if (!hasExamples) lines.push("If helpful, include one brief example to illustrate the main point.");
  lines.push("If anything is ambiguous, state your assumptions before answering.");

  return { improvements, optimized: lines.join("\\n") };
}

export default function PromptOptimizer() {
  const [originalPrompt, setOriginalPrompt] = useState(
    "Write a polished executive summary for the product roadmap, emphasize user impact, and keep the tone confident yet clear."
  );
  const [analysis, setAnalysis] = useState<Analysis>(() => analyzeAndOptimize(originalPrompt));
  const [compareMode, setCompareMode] = useState(false);
  const [status, setStatus] = useState("Ready to structure and strengthen your prompt.");

  const handleOptimize = () => {
    setAnalysis(analyzeAndOptimize(originalPrompt));
    setStatus("Optimized prompt ready — copy it into your next AI request.");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(analysis.optimized.replace(/\\n/g, "\n"));
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
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200">How it works</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              This tool analyzes your prompt in your browser and restructures it with proven prompt-engineering
              patterns — role, format, constraints, and tone. No AI API calls, no data leaves your device, unlimited use.
            </p>
          </div>
          <div className="inline-flex shrink-0 items-center gap-2 rounded-3xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
            <Sparkles className="h-4 w-4 text-cyan-300" aria-hidden="true" />
            Free &amp; unlimited
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
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Optimized Version</p>
              <p className="text-xs text-slate-500">Copy or compare with your prompt.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/70 px-3 py-1 text-xs text-slate-300">
              <RefreshCcw className="h-4 w-4 text-violet-300" aria-hidden="true" />
              structured result
            </div>
          </div>
          <div className="relative min-h-[320px] rounded-3xl border border-slate-800/90 bg-slate-900/90 p-5 text-sm leading-7 text-slate-200 shadow-inner shadow-slate-950/60">
            <pre className={`whitespace-pre-wrap ${compareMode ? "bg-slate-900/90" : ""}`}>{analysis.optimized.replace(/\\n/g, "\n")}</pre>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleOptimize}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:shadow-xl hover:shadow-cyan-500/50"
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

      {analysis.improvements.length > 0 && (
        <div className="rounded-[32px] border border-emerald-500/20 bg-emerald-500/5 p-6 text-sm text-slate-300">
          <p className="font-semibold text-white">What was improved</p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-slate-400">
            {analysis.improvements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-[32px] border border-slate-800/80 bg-slate-950/80 p-6 text-sm text-slate-300 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.55)]">
        <p className="text-white">Status</p>
        <p className="mt-2 text-sm leading-7 text-slate-400">{status}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[28px] border border-slate-800/90 bg-slate-900/85 p-5 text-sm text-slate-300 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.45)]">
          <p className="font-semibold text-white">Prompt structure</p>
          <p className="mt-3 text-slate-400">Every pass applies role, task, audience, tone, format, and constraint patterns to your prompt.</p>
        </div>
        <div className="rounded-[28px] border border-slate-800/90 bg-slate-900/85 p-5 text-sm text-slate-300 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.45)]">
          <p className="font-semibold text-white">Workflow control</p>
          <p className="mt-3 text-slate-400">Compare original and refined prompts side by side, then use the version that best matches your goals.</p>
        </div>
        <div className="rounded-[28px] border border-slate-800/90 bg-slate-900/85 p-5 text-sm text-slate-300 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.45)]">
          <p className="font-semibold text-white">100% private</p>
          <p className="mt-3 text-slate-400">All analysis runs locally in your browser — your prompts are never sent to any server.</p>
        </div>
      </div>
    </div>
  );
}
