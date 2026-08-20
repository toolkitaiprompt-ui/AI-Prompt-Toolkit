import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, Download, Flag, Plus, RefreshCcw, Sparkles, Trash2, Wand2 } from "lucide-react";
import { copyToClipboard, downloadTextFile } from "../lib/toolkit";
import { LiveStats } from "./OutputToolbar";

type ImprovementType = "added" | "kept" | "flagged";

interface Improvement {
  text: string;
  type: ImprovementType;
}

interface Analysis {
  scoreBefore: number;
  scoreAfter: number;
  improvements: Improvement[];
  optimized: string;
}

const EXAMPLES: { label: string; text: string }[] = [
  {
    label: "Blog outline",
    text: "Write a blog post outline about how AI tools help small businesses save time. Keep it practical for Indian business owners.",
  },
  {
    label: "Cold email",
    text: "Draft a professional cold email to a potential client introducing my freelance design services. I want it short and friendly.",
  },
  {
    label: "Summarize",
    text: "Summarize the key points of a long meeting transcript into clear action items and decisions.",
  },
];

const VAGUE_WORDS = /\b(good|great|nice|stuff|things?|etc\.?|some|many|very|really|a lot|kind of|sort of)\b/i;

interface PromptChecks {
  hasRole: boolean;
  hasAudience: boolean;
  hasContext: boolean;
  hasFormat: boolean;
  hasConstraints: boolean;
  hasTone: boolean;
  hasExamples: boolean;
  hasActionVerb: boolean;
  vagueWords: string[];
  wordCount: number;
}

function analyzePrompt(prompt: string): PromptChecks {
  const lower = prompt.toLowerCase();
  return {
    hasRole: /\b(act as|you are|you're|as a|act like|role:|assume the role)\b/i.test(prompt),
    hasAudience: /\b(audience|for (beginners|experts|developers|students|customers|managers|teens|kids|non-technical|business owners))\b/i.test(lower),
    hasContext: /\b(context|background|situation|scenario|my (company|project|business|goal|team|audience))\b/i.test(lower),
    hasFormat: /\b(format|bullet|list|table|markdown|json|csv|sections?|outline|steps?|numbered|headings?|paragraphs?)\b/i.test(lower),
    hasConstraints: /\b(\d+\s*(words?|sentences?|paragraphs?|bullets?|items?|pages?)|max|limit|under|at most|concise|within|no more than|exactly)\b/i.test(lower),
    hasTone: /\b(tone|formal|casual|friendly|professional|confident|playful|empathetic|authoritative|voice|engaging)\b/i.test(lower),
    hasExamples: /\b(example|e\.g\.|for instance|such as|sample|for example)\b/i.test(lower),
    hasActionVerb: /^(please\s+|can you\s+|could you\s+|i want (you to )?|i need (you to )?)?(write|create|generate|explain|summarize|analyze|list|draft|compare|review|improve|rewrite|translate|outline|describe|design|build|make|prepare|plan|help)\b/i.test(prompt.trim()),
    vagueWords: (prompt.match(VAGUE_WORDS) || []).map((w) => w.toLowerCase()).filter((w, i, arr) => arr.indexOf(w) === i),
    wordCount: prompt.trim().split(/\s+/).filter(Boolean).length,
  };
}

function scorePrompt(prompt: string, checks: PromptChecks): number {
  if (!prompt.trim()) return 0;
  let score = 0;
  if (checks.hasRole) score += 15;
  if (checks.hasActionVerb) score += 15;
  if (checks.hasContext) score += 13;
  if (checks.hasAudience) score += 12;
  if (checks.hasFormat) score += 15;
  if (checks.hasConstraints) score += 10;
  if (checks.hasTone) score += 10;
  if (checks.hasExamples) score += 10;
  // Too short to be useful
  if (checks.wordCount < 8) score = Math.max(0, score - 10);
  // Vague wording penalty
  score -= Math.min(15, checks.vagueWords.length * 5);
  return Math.max(0, Math.min(100, score));
}

function cleanTaskText(prompt: string): string {
  let text = prompt.trim().replace(/\s+/g, " ");
  text = text.replace(/^(please\s+|can you\s+|could you\s+|i want you to\s+|i need you to\s+|i want\s+|i need\s+)/i, "");
  text = text.replace(/[.!?]+$/, "").trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function analyzeAndOptimize(prompt: string): Analysis {
  const trimmed = prompt.trim();
  if (!trimmed) {
    return {
      scoreBefore: 0,
      scoreAfter: 0,
      improvements: [],
      optimized:
        "Start with your prompt on the left and click Optimize to see the upgraded prompt here.",
    };
  }

  const checks = analyzePrompt(trimmed);
  const scoreBefore = scorePrompt(trimmed, checks);
  const improvements: Improvement[] = [];

  if (!checks.hasRole) {
    improvements.push({ text: "Added an expert role so the model answers from the right perspective", type: "added" });
  } else {
    improvements.push({ text: "Kept your role instruction — the model keeps its perspective", type: "kept" });
  }
  if (!checks.hasActionVerb) {
    improvements.push({ text: "Made the instruction action-first so the task is unmistakable", type: "added" });
  }
  if (!checks.hasContext && !checks.hasAudience) {
    improvements.push({ text: "Added context placeholders — background and audience make answers far more relevant", type: "added" });
  } else if (!checks.hasAudience) {
    improvements.push({ text: "Added a target-audience placeholder for better tailoring", type: "added" });
  } else {
    improvements.push({ text: "Kept your audience details", type: "kept" });
  }
  if (!checks.hasTone) {
    improvements.push({ text: "Defined the tone so the writing style matches your intent", type: "added" });
  }
  if (!checks.hasFormat) {
    improvements.push({ text: "Specified an output format for a predictable, structured response", type: "added" });
  }
  if (!checks.hasConstraints) {
    improvements.push({ text: "Added a length constraint to keep the answer focused", type: "added" });
  }
  if (!checks.hasExamples) {
    improvements.push({ text: "Suggested including an example to anchor the model", type: "added" });
  } else {
    improvements.push({ text: "Kept your example request", type: "kept" });
  }
  if (checks.vagueWords.length > 0) {
    improvements.push({
      text: `Vague wording detected (“${checks.vagueWords.slice(0, 3).join("”, “")}”) — added a clarity instruction to replace it with specifics`,
      type: "flagged",
    });
  }
  if (checks.wordCount < 8) {
    improvements.push({ text: "Prompt is very short — added structure so the model has enough direction", type: "flagged" });
  }

  const task = cleanTaskText(trimmed);
  const lines: string[] = [];

  if (!checks.hasRole) lines.push("Role: You are an expert in the relevant domain with deep practical experience.");
  lines.push("Task: " + task);
  if (!checks.hasContext && !checks.hasAudience) {
    lines.push("Context: [1–2 sentences of background — who this is for and what problem it solves]");
  } else if (!checks.hasAudience) {
    lines.push("Audience: [describe exactly who this is for, e.g. beginners, executives]");
  }
  if (!checks.hasTone) lines.push("Tone: professional, clear, and direct");
  if (!checks.hasFormat) {
    lines.push("Format: well-structured Markdown — short sections with headings and bullet points where helpful");
  }
  if (!checks.hasConstraints) lines.push("Constraints: keep it focused and concise; avoid filler and repetition");
  if (!checks.hasExamples) lines.push("If helpful, include one brief example to illustrate the main point.");
  if (checks.vagueWords.length > 0) {
    lines.push("Clarity: replace vague words such as “good” or “stuff” with specific, measurable details.");
  }
  lines.push("Before answering, restate the goal in one sentence so we are aligned. If anything is ambiguous, state your assumptions.");

  const optimized = lines.join("\n");
  const optimizedChecks = analyzePrompt(optimized);
  const scoreAfter = scorePrompt(optimized, optimizedChecks);

  return { scoreBefore, scoreAfter, improvements, optimized };
}

function ScoreBadge({ score, delta }: { score: number; delta?: number }) {
  const color = score >= 75 ? "#34d399" : score >= 50 ? "#fbbf24" : "#f87171";
  return (
    <div className="flex items-center gap-2" title={`Prompt quality score: ${score}/100`}>
      <div
        className="flex h-11 w-11 items-center justify-center rounded-full"
        style={{ background: `conic-gradient(${color} ${score * 3.6}deg, rgba(255,255,255,0.08) 0deg)` }}
        aria-hidden="true"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/90 text-[11px] font-bold text-white">
          {score}
        </div>
      </div>
      {typeof delta === "number" && (
        <span className={`text-xs font-semibold ${delta >= 0 ? "text-emerald-400" : "text-red-400"}`}>
          {delta >= 0 ? "+" : ""}
          {delta}
        </span>
      )}
    </div>
  );
}

const IMPROVEMENT_ICONS: Record<ImprovementType, { icon: typeof Plus; className: string }> = {
  added: { icon: Plus, className: "text-emerald-400" },
  kept: { icon: Check, className: "text-cyan-300" },
  flagged: { icon: Flag, className: "text-amber-400" },
};

export default function PromptOptimizer() {
  const [originalPrompt, setOriginalPrompt] = useState(
    "Write a polished executive summary for the product roadmap, emphasize user impact, and keep the tone confident yet clear."
  );
  const [analysis, setAnalysis] = useState<Analysis>(() => analyzeAndOptimize(originalPrompt));
  const [compareMode, setCompareMode] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState("Ready to structure and strengthen your prompt.");

  const runOptimization = (text: string) => {
    setProcessing(true);
    setStatus("Analyzing your prompt…");
    window.setTimeout(() => {
      setAnalysis(analyzeAndOptimize(text));
      setProcessing(false);
      setStatus("Optimized prompt ready — copy it into your next AI request.");
    }, 650);
  };

  const handleOptimize = () => {
    if (!originalPrompt.trim()) {
      setStatus("Paste a prompt first, then click Optimize Prompt.");
      return;
    }
    runOptimization(originalPrompt);
  };

  const handleExample = (text: string) => {
    setOriginalPrompt(text);
    runOptimization(text);
  };

  const handleClear = () => {
    setOriginalPrompt("");
    setAnalysis({
      scoreBefore: 0,
      scoreAfter: 0,
      improvements: [],
      optimized: "Start with your prompt on the left and click Optimize to see the upgraded prompt here.",
    });
    setCompareMode(false);
    setStatus("Paste a prompt above and click Optimize Prompt.");
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(analysis.optimized);
    setStatus(ok ? "Optimized prompt copied to clipboard." : "Copy failed. Please try again in a secure browser.");
  };

  const handleDownload = () => {
    downloadTextFile(analysis.optimized, "optimized-prompt.txt");
  };

  const scoreDelta = analysis.scoreAfter - analysis.scoreBefore;

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] border border-cyan-400/10 bg-slate-950/75 p-6 shadow-[0_32px_80px_-48px_rgba(6,182,212,0.35)] backdrop-blur-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200">How it works</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              This tool analyzes your prompt in your browser and restructures it with proven prompt-engineering
              patterns — role, context, format, constraints, and tone. No AI API calls, no data leaves your device, unlimited use.
            </p>
          </div>
          <div className="inline-flex shrink-0 items-center gap-2 rounded-3xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
            <Sparkles className="h-4 w-4 text-cyan-300" aria-hidden="true" />
            Free &amp; unlimited
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-[0.2em] text-slate-500">Try an example:</span>
          {EXAMPLES.map((example) => (
            <button
              key={example.label}
              type="button"
              onClick={() => handleExample(example.text)}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/70 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-200"
            >
              <Wand2 className="h-3 w-3 text-cyan-300" aria-hidden="true" />
              {example.label}
            </button>
          ))}
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
            <div className="flex items-center gap-2">
              <ScoreBadge score={analysis.scoreBefore} />
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear prompt"
                title="Clear prompt"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700/70 bg-slate-900/70 text-slate-400 transition hover:border-red-400/50 hover:text-red-300"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
          <textarea
            className="min-h-[320px] w-full rounded-3xl border border-slate-700/80 bg-slate-950/90 p-5 text-sm text-slate-100 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
            value={originalPrompt}
            onChange={(event) => setOriginalPrompt(event.target.value)}
            placeholder="Paste any prompt here…"
            aria-label="Original prompt input"
          />
          <div className="mt-2">
            <LiveStats text={originalPrompt} />
          </div>
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
            <ScoreBadge score={analysis.scoreAfter} delta={scoreDelta} />
          </div>

          {compareMode ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="min-h-[320px] rounded-3xl border border-slate-800/90 bg-slate-900/90 p-4">
                <p className="pb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Before</p>
                <pre className="whitespace-pre-wrap text-xs leading-6 text-slate-400">{originalPrompt}</pre>
              </div>
              <div className="min-h-[320px] rounded-3xl border border-emerald-500/25 bg-slate-900/90 p-4">
                <p className="pb-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">After</p>
                <pre className="whitespace-pre-wrap text-xs leading-6 text-slate-200">{analysis.optimized}</pre>
              </div>
            </div>
          ) : (
            <div className="relative min-h-[320px] rounded-3xl border border-slate-800/90 bg-slate-900/90 p-5 text-sm leading-7 text-slate-200 shadow-inner shadow-slate-950/60">
              <pre className="whitespace-pre-wrap">{analysis.optimized}</pre>
            </div>
          )}

          <div className="mt-2">
            <LiveStats text={analysis.optimized} />
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleOptimize}
              disabled={processing}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:shadow-xl hover:shadow-cyan-500/50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {processing ? (
                <RefreshCcw className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Wand2 className="h-4 w-4" aria-hidden="true" />
              )}
              {processing ? "Optimizing…" : "Optimize Prompt"}
            </button>
            <button
              type="button"
              onClick={handleCopy}
              disabled={processing || !analysis.optimized}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300/60 hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Copy className="h-4 w-4" aria-hidden="true" />
              Copy optimized prompt
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/70 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500/70 hover:bg-slate-800/70"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download .txt
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
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-semibold text-white">What was improved</p>
            <p className="text-xs text-slate-500">
              Quality score: {analysis.scoreBefore}/100 → {analysis.scoreAfter}/100
            </p>
          </div>
          <ul className="mt-3 space-y-2">
            {analysis.improvements.map((item) => {
              const Icon = IMPROVEMENT_ICONS[item.type].icon;
              return (
                <li key={item.text} className="flex items-start gap-2.5 text-slate-400">
                  <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${IMPROVEMENT_ICONS[item.type].className}`} aria-hidden="true" />
                  <span>{item.text}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="rounded-[32px] border border-slate-800/80 bg-slate-950/80 p-6 text-sm text-slate-300 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.55)]">
        <p className="text-white">Status</p>
        <p className="mt-2 text-sm leading-7 text-slate-400" aria-live="polite">{status}</p>
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
