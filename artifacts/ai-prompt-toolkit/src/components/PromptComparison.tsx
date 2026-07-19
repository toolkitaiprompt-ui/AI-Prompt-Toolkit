import { useMemo, useState } from "react";
import { ArrowLeftRight, Check, X, TrendingUp } from "lucide-react";

/**
 * PromptComparison — Compare two prompts side by side.
 * Shows token count, word count, character count, readability,
 * structure score, clarity score, diff highlighting, and overall score.
 */

// ── Token estimation (~4 chars/token) ──
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

// ── Word count ──
function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

// ── Character count ──
function countChars(text: string): number {
  return text.length;
}

// ── Sentence count ──
function countSentences(text: string): number {
  const matches = text.match(/[.!?]+/g);
  return matches ? matches.length : (text.trim() ? 1 : 0);
}

// ── Readability score (Flesch Reading Ease simplified) ──
// Score 0-100, higher = easier to read
function readabilityScore(text: string): number {
  const words = countWords(text);
  const sentences = countSentences(text);
  const chars = countChars(text);
  if (words === 0) return 0;
  const syllables = Math.ceil(chars / 4.7); // approximate syllables
  const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
  return Math.max(0, Math.min(100, Math.round(score)));
}

// ── Structure score ──
// Checks for: role assignment, numbered lists, format specification,
// constraints, examples, section breaks
function structureScore(text: string): number {
  let score = 0;
  const lower = text.toLowerCase();

  // Role assignment (e.g., "you are a...", "act as...")
  if (/you are a|act as a|you are an|act as an|behave as/i.test(text)) score += 20;

  // Numbered list or bullet points
  if (/^\s*\d+[\.\)]/m.test(text) || /^\s*[-•*]\s/m.test(text)) score += 20;

  // Format specification (e.g., "format:", "output:", "json", "table")
  if (/format|output as|return as|json|table|bullet|numbered/i.test(text)) score += 15;

  // Constraints (e.g., word count, tone, style)
  if (/tone|style|word count|maximum|minimum|limit|keep it under|no more than/i.test(text)) score += 15;

  // Examples or few-shot
  if (/example|for instance|such as|e\.g\./i.test(text)) score += 10;

  // Section breaks (headings, markdown)
  if (/^#{1,6}\s/m.test(text) || /^---/m.test(text) || /\*\*[^*]+\*\*/m.test(text)) score += 10;

  // Clear instruction verbs
  if (/write|create|generate|analyze|summarize|explain|list|describe|compare/i.test(text)) score += 10;

  return Math.min(100, score);
}

// ── Clarity score ──
// Checks for: specificity, vagueness reduction, clear objective
function clarityScore(text: string): number {
  let score = 50; // baseline

  const words = countWords(text);
  const lower = text.toLowerCase();

  // Penalize very short prompts (too vague)
  if (words < 10) score -= 20;
  else if (words < 20) score -= 10;
  else if (words >= 30 && words <= 200) score += 15;
  else if (words > 500) score -= 10; // too long

  // Penalize vague words
  const vagueWords = (lower.match(/\b(something|stuff|things|good|nice|etc|whatever|maybe)\b/g) || []).length;
  score -= vagueWords * 5;

  // Reward specific descriptors
  const specificWords = (lower.match(/\b(professional|technical|formal|casual|persuasive|detailed|concise|step-by-step|comprehensive)\b/g) || []).length;
  score += specificWords * 8;

  // Reward target audience mention
  if (/audience|target|for beginners|for experts|for developers|for marketers|for students/i.test(text)) score += 10;

  // Reward measurable outcomes
  if (/\d+|percent|%|words|sentences|paragraphs|bullets/i.test(text)) score += 10;

  return Math.max(0, Math.min(100, score));
}

// ── Simple word-level diff ──
type DiffToken = { text: string; type: "same" | "added" | "removed" };

function wordDiff(textA: string, textB: string): { tokens: DiffToken[]; added: number; removed: number } {
  const wordsA = textA.trim().split(/\s+/).filter(Boolean);
  const wordsB = textB.trim().split(/\s+/).filter(Boolean);

  // Build a simple LCS-based diff
  const m = wordsA.length;
  const n = wordsB.length;

  // LCS table
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (wordsA[i - 1] === wordsB[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack
  const tokens: DiffToken[] = [];
  let i = m;
  let j = n;
  let added = 0;
  let removed = 0;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && wordsA[i - 1] === wordsB[j - 1]) {
      tokens.unshift({ text: wordsA[i - 1], type: "same" });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      tokens.unshift({ text: wordsB[j - 1], type: "added" });
      added++;
      j--;
    } else {
      tokens.unshift({ text: wordsA[i - 1], type: "removed" });
      removed++;
      i--;
    }
  }

  return { tokens, added, removed };
}

// ── Score bar component ──
function ScoreBar({ label, valueA, valueB, suffix = "" }: { label: string; valueA: number; valueB: number; suffix?: string }) {
  const diff = valueB - valueA;
  const improved = diff > 0;
  const same = diff === 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-slate-500">{valueA}{suffix}</span>
          <span className="text-slate-600">→</span>
          <span className={`font-bold ${same ? "text-slate-300" : improved ? "text-emerald-400" : "text-red-400"}`}>
            {valueB}{suffix}
          </span>
          {!same && (
            <span className={`text-[10px] ${improved ? "text-emerald-500" : "text-red-500"}`}>
              {improved ? "+" : ""}{diff}{suffix}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <div className="h-1.5 flex-1 rounded-full bg-slate-800 overflow-hidden">
          <div className="h-full bg-slate-600 rounded-full" style={{ width: `${Math.min(100, valueA)}%` }} />
        </div>
        <div className="h-1.5 flex-1 rounded-full bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full ${same ? "bg-slate-600" : improved ? "bg-emerald-500" : "bg-red-500"}`}
            style={{ width: `${Math.min(100, valueB)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function PromptComparison() {
  const [promptA, setPromptA] = useState("write a summary about risks in a smart way with bullet points");
  const [promptB, setPromptB] = useState(
    "You are an expert risk analyst.\n\nTask: Summarize quarterly business risks for an executive audience.\n\nFormat: Numbered bullet points (max 10 bullets).\nTone: Professional and concise.\nFor each risk include: description, impact level (Low/Medium/High), and one recommended action."
  );
  const [compared, setCompared] = useState(false);

  const analysis = useMemo(() => {
    if (!compared) return null;

    const a = {
      tokens: estimateTokens(promptA),
      words: countWords(promptA),
      chars: countChars(promptA),
      readability: readabilityScore(promptA),
      structure: structureScore(promptA),
      clarity: clarityScore(promptA),
    };

    const b = {
      tokens: estimateTokens(promptB),
      words: countWords(promptB),
      chars: countChars(promptB),
      readability: readabilityScore(promptB),
      structure: structureScore(promptB),
      clarity: clarityScore(promptB),
    };

    // Overall improvement score (weighted average of improvement deltas)
    const structDelta = b.structure - a.structure;
    const clarityDelta = b.clarity - a.clarity;
    const readabilityDelta = b.readability - a.readability;
    const overall = Math.round(
      (structDelta * 0.4 + clarityDelta * 0.4 + readabilityDelta * 0.2) + 50
    );

    const diff = wordDiff(promptA, promptB);

    return { a, b, overall, diff };
  }, [compared, promptA, promptB]);

  return (
    <div className="space-y-6">
      {/* ── Input Section ── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Prompt A */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-red-400">Prompt A (Original)</span>
            <span className="text-xs text-slate-500">{countWords(promptA)} words · {estimateTokens(promptA)} tokens</span>
          </div>
          <textarea
            className="h-48 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-slate-100 outline-none transition focus:border-red-400/60 focus:ring-2 focus:ring-red-400/20"
            value={promptA}
            onChange={(e) => { setPromptA(e.target.value); setCompared(false); }}
            placeholder="Paste your original prompt here..."
            aria-label="Prompt A input"
          />
        </div>

        {/* Prompt B */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-emerald-400">Prompt B (Optimized)</span>
            <span className="text-xs text-slate-500">{countWords(promptB)} words · {estimateTokens(promptB)} tokens</span>
          </div>
          <textarea
            className="h-48 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
            value={promptB}
            onChange={(e) => { setPromptB(e.target.value); setCompared(false); }}
            placeholder="Paste your optimized prompt here..."
            aria-label="Prompt B input"
          />
        </div>
      </div>

      {/* ── Compare Button ── */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setCompared(true)}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-8 py-3 text-sm font-bold text-black shadow-lg shadow-amber-500/30 transition hover:scale-105"
        >
          <ArrowLeftRight className="h-4 w-4" />
          Compare Prompts
        </button>
      </div>

      {/* ── Output Section ── */}
      {analysis && (
        <div className="space-y-6">

          {/* ── Overall Score ── */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
              <TrendingUp className="h-4 w-4" />
              Overall Improvement
            </div>
            <p className={`mt-2 text-5xl font-black ${analysis.overall >= 60 ? "text-emerald-400" : analysis.overall >= 40 ? "text-amber-400" : "text-red-400"}`}>
              {analysis.overall > 0 ? "+" : ""}{analysis.overall}%
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {analysis.overall >= 70 ? "Massive improvement! Prompt B is significantly better." : 
               analysis.overall >= 50 ? "Good improvement. Prompt B is more effective." :
               analysis.overall >= 30 ? "Moderate improvement. Some areas are better." :
               "Minimal improvement. Consider restructuring Prompt B."}
            </p>
          </div>

          {/* ── Metrics Grid ── */}
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Left: Counts */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white">📊 Count Metrics</h3>
              <ScoreBar label="Token Count" valueA={analysis.a.tokens} valueB={analysis.b.tokens} />
              <ScoreBar label="Word Count" valueA={analysis.a.words} valueB={analysis.b.words} />
              <ScoreBar label="Character Count" valueA={analysis.a.chars} valueB={analysis.b.chars} />
            </div>

            {/* Right: Quality Scores */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white">🎯 Quality Scores</h3>
              <ScoreBar label="Readability" valueA={analysis.a.readability} valueB={analysis.b.readability} suffix="%" />
              <ScoreBar label="Structure" valueA={analysis.a.structure} valueB={analysis.b.structure} suffix="%" />
              <ScoreBar label="Clarity" valueA={analysis.a.clarity} valueB={analysis.b.clarity} suffix="%" />
            </div>
          </div>

          {/* ── Diff Highlighting ── */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">🔍 What Changed</h3>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                  Added ({analysis.diff.added})
                </span>
                <span className="flex items-center gap-1 text-red-400">
                  <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
                  Removed ({analysis.diff.removed})
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-slate-950 p-4 text-sm leading-7">
              {analysis.diff.tokens.map((token, idx) => (
                <span
                  key={idx}
                  className={
                    token.type === "added"
                      ? "bg-emerald-500/20 text-emerald-300 rounded px-1"
                      : token.type === "removed"
                      ? "bg-red-500/20 text-red-300 line-through rounded px-1"
                      : "text-slate-400"
                  }
                >
                  {token.text}{" "}
                </span>
              ))}
            </div>
          </div>

          {/* ── Detailed Breakdown ── */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h3 className="mb-3 text-sm font-semibold text-white">📋 Detailed Analysis</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                <p className="text-xs font-bold text-red-400 mb-2">PROMPT A</p>
                <ul className="space-y-1 text-xs text-slate-400">
                  <li>Tokens: <span className="text-slate-200">{analysis.a.tokens}</span></li>
                  <li>Words: <span className="text-slate-200">{analysis.a.words}</span></li>
                  <li>Characters: <span className="text-slate-200">{analysis.a.chars}</span></li>
                  <li>Readability: <span className="text-slate-200">{analysis.a.readability}%</span></li>
                  <li>Structure: <span className="text-slate-200">{analysis.a.structure}%</span></li>
                  <li>Clarity: <span className="text-slate-200">{analysis.a.clarity}%</span></li>
                </ul>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-xs font-bold text-emerald-400 mb-2">PROMPT B</p>
                <ul className="space-y-1 text-xs text-slate-400">
                  <li>Tokens: <span className="text-slate-200">{analysis.b.tokens}</span></li>
                  <li>Words: <span className="text-slate-200">{analysis.b.words}</span></li>
                  <li>Characters: <span className="text-slate-200">{analysis.b.chars}</span></li>
                  <li>Readability: <span className="text-slate-200">{analysis.b.readability}%</span></li>
                  <li>Structure: <span className="text-slate-200">{analysis.b.structure}%</span></li>
                  <li>Clarity: <span className="text-slate-200">{analysis.b.clarity}%</span></li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
