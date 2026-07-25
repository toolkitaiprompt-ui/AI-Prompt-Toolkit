import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, Sparkles, Zap, ArrowRight } from "lucide-react";

interface Issue {
  type: "error" | "warning" | "info";
  title: string;
  description: string;
  suggestion: string;
  fix?: string;
}

const VAGUE_WORDS = ["good", "nice", "some", "things", "stuff", "great", "many", "several", "various", "different", "appropriate", "proper", "interesting", "important"];

export default function PromptDebugger() {
  const [input, setInput] = useState("");
  const [autoFixed, setAutoFixed] = useState(false);
  const [fixedPrompt, setFixedPrompt] = useState("");

  const analysis = useMemo(() => {
    if (!input.trim()) return null;
    const issues: Issue[] = [];
    const text = input;
    const lower = text.toLowerCase();

    // 1. Vague words
    const vagueFound = VAGUE_WORDS.filter((w) => {
      const regex = new RegExp(`\\b${w}\\b`, "gi");
      return regex.test(text);
    });
    if (vagueFound.length > 0) {
      issues.push({
        type: "warning",
        title: `Vague words detected (${vagueFound.length})`,
        description: `Found: ${vagueFound.join(", ")}. Replace with specific, measurable terms.`,
        suggestion: `Replace vague words with concrete details. Instead of "${vagueFound[0]}", use specific numbers, names, or criteria.`,
        fix: text.replace(new RegExp(`\\b(${vagueFound.join("|")})\\b`, "gi"), (match) => `[specific:${match}]`),
      });
    }

    // 2. Missing role
    const roleIndicators = ["act as", "you are a", "you are an", "role:", "as a", "your role"];
    const hasRole = roleIndicators.some((r) => lower.includes(r));
    if (!hasRole) {
      issues.push({
        type: "error",
        title: "No role specified",
        description: "The prompt doesn't assign a role to the AI. Adding a role improves output quality significantly.",
        suggestion: 'Start with: "You are an expert [role] in [field]."',
        fix: "[ROLE: Add a role at the beginning]\n" + text,
      });
    }

    // 3. No output format
    const formatIndicators = ["format:", "output:", "respond in", "in json", "in markdown", "bullet", "table", "paragraph"];
    const hasFormat = formatIndicators.some((f) => lower.includes(f));
    if (!hasFormat) {
      issues.push({
        type: "warning",
        title: "No output format specified",
        description: "Without a specified format, the AI may structure the response inconsistently.",
        suggestion: 'Add: "Respond in [paragraph/bullet points/table/JSON] format."',
        fix: text + "\n\nRespond in a clear paragraph format with sections.",
      });
    }

    // 4. No constraints
    if (!lower.includes("max") && !lower.includes("limit") && !lower.includes("constraint") && !lower.includes("must not") && !lower.includes("avoid") && !lower.includes("keep under")) {
      issues.push({
        type: "info",
        title: "No constraints set",
        description: "Without constraints, the AI may produce overly long or off-target responses.",
        suggestion: 'Add constraints like: "Max 300 words. Avoid jargon. Stay on topic."',
        fix: text + "\n[CONSTRAINTS: Add word limit, tone, or other rules]",
      });
    }

    // 5. Too many tasks
    const taskIndicators = ["also", "additionally", "in addition", "furthermore", "moreover", "and also", "next,", "finally,"];
    const taskCount = taskIndicators.filter((t) => lower.includes(t)).length;
    if (taskCount >= 3) {
      issues.push({
        type: "warning",
        title: "Multiple tasks detected",
        description: `Found ${taskCount} task indicators. The AI may struggle to address all tasks effectively.`,
        suggestion: "Split into separate prompts — one task per prompt for best results.",
      });
    }

    // 6. Token check
    const approxTokens = Math.ceil(text.length / 4);
    if (approxTokens > 2000) {
      issues.push({
        type: "warning",
        title: `Prompt is long (${approxTokens.toLocaleString()} tokens)`,
        description: "Prompts over 2000 tokens may lose focus or exceed model limits.",
        suggestion: "Try to trim or split this prompt into smaller, focused prompts.",
      });
    } else if (approxTokens < 20 && text.length > 5) {
      issues.push({
        type: "info",
        title: "Very short prompt",
        description: `Only ~${approxTokens} tokens. Very short prompts often produce generic responses.`,
        suggestion: "Add more context, specific instructions, and examples for better results.",
      });
    }

    // 7. Ambiguous pronouns
    const ambiguousCount = (lower.match(/\bit\b(?!\s*(is|was|will|can|should|has|have|had|does|did)\b)/g) || []).length +
      (lower.match(/\bthey\b(?!\s*(are|were|will|can|should|have|has)\b)/g) || []).length;
    if (ambiguousCount > 1) {
      issues.push({
        type: "warning",
        title: "Ambiguous pronouns detected",
        description: `Found potentially unclear uses of "it"/"they". These should reference a clear noun.`,
        suggestion: 'Replace "it" and "they" with specific nouns for clarity.',
      });
    }

    // 8. Conflicting instructions
    if (lower.includes("but don't") && lower.includes("also include")) {
      issues.push({
        type: "error",
        title: "Potentially conflicting instructions",
        description: '"but don\'t" combined with "also include" may create conflicting requirements.',
        suggestion: "Review and simplify instructions to remove contradictions.",
      });
    }

    // Score calculation
    let score = 100;
    const deductions: Record<string, number> = {
      error: 20,
      warning: 10,
      info: 5,
    };
    for (const issue of issues) {
      score -= deductions[issue.type] || 5;
    }
    score = Math.max(0, Math.min(100, score));

    return { issues, score, vagueFound, hasRole, hasFormat };
  }, [input]);

  const handleAutoFix = () => {
    if (!analysis) return;
    let fixed = input;
    for (const issue of analysis.issues) {
      if (issue.fix && issue.fix !== input) {
        fixed = issue.fix;
        break;
      }
    }
    if (fixed === input) {
      fixed = "[IMPROVED PROMPT]\n\n" + input + "\n\n[Add a specific role, output format, and constraints for best results.]";
    }
    setFixedPrompt(fixed);
    setAutoFixed(true);
  };

  const copyFixed = () => {
    navigator.clipboard.writeText(fixedPrompt);
  };

  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-emerald-400";
    if (s >= 60) return "text-amber-400";
    return "text-rose-400";
  };
  const getScoreRing = (s: number) => {
    if (s >= 80) return "from-emerald-400 to-emerald-500";
    if (s >= 60) return "from-amber-400 to-rose-400";
    return "from-rose-400 to-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Paste your prompt for analysis</label>
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setAutoFixed(false); }}
          placeholder="Paste your AI prompt here..."
          rows={6}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20 resize-none"
        />
      </div>

      <AnimatePresence>
        {analysis && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Score */}
            <div className="flex flex-col items-center py-6">
              <div className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${getScoreRing(analysis.score)} p-[3px]`}>
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                  <span className={`text-3xl font-bold ${getScoreColor(analysis.score)}`}>{analysis.score}</span>
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-400">Prompt Health Score</p>
              <p className="text-xs text-slate-500 mt-1">
                {analysis.score >= 80 ? "✓ Looks good! Minor improvements possible." :
                 analysis.score >= 60 ? "⚠️ Decent, but could be improved." :
                 "❌ Needs significant improvement."}
              </p>
            </div>

            {/* Issues */}
            {analysis.issues.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Issues Found ({analysis.issues.length})
                </h3>
                {analysis.issues.map((issue, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`rounded-xl border p-4 ${
                      issue.type === "error"
                        ? "border-rose-500/30 bg-rose-500/10"
                        : issue.type === "warning"
                        ? "border-amber-500/30 bg-amber-500/10"
                        : "border-blue-500/30 bg-blue-500/10"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <span className={`mt-0.5 text-sm ${issue.type === "error" ? "text-rose-400" : issue.type === "warning" ? "text-amber-400" : "text-blue-400"}`}>
                          {issue.type === "error" ? "✕" : issue.type === "warning" ? "⚠" : "ℹ"}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-white">{issue.title}</p>
                          <p className="text-xs text-slate-400 mt-1">{issue.description}</p>
                          <p className="text-xs text-slate-500 mt-1 italic">{issue.suggestion}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                        issue.type === "error" ? "bg-rose-500/20 text-rose-300" :
                        issue.type === "warning" ? "bg-amber-500/20 text-amber-300" :
                        "bg-blue-500/20 text-blue-300"
                      }`}>
                        {issue.type === "error" ? "High" : issue.type === "warning" ? "Med" : "Low"}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {analysis.issues.length === 0 && (
              <div className="text-center py-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                <p className="text-white font-medium">No issues found!</p>
                <p className="text-sm text-slate-400">Your prompt looks well-structured.</p>
              </div>
            )}

            {/* Auto-fix button */}
            {analysis.issues.length > 0 && (
              <div className="text-center">
                <button
                  onClick={handleAutoFix}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-sm font-semibold text-white shadow-lg shadow-amber-500/30 hover:shadow-xl transition"
                >
                  <Sparkles className="w-4 h-4" /> Auto-Fix Prompt
                </button>
              </div>
            )}

            {/* Fixed prompt */}
            {autoFixed && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-[20px] border border-emerald-400/20 bg-emerald-500/5 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-emerald-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Improved Prompt
                  </h4>
                  <button onClick={copyFixed} className="text-xs text-emerald-400 hover:text-emerald-300 transition underline">
                    Copy
                  </button>
                </div>
                <pre className="text-sm text-slate-200 font-mono whitespace-pre-wrap leading-relaxed max-h-[250px] overflow-y-auto">
                  {fixedPrompt}
                </pre>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!input.trim() && (
        <div className="text-center py-10 border border-dashed border-slate-700/60 rounded-2xl bg-slate-900/30">
          <Zap className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Paste a prompt above to analyze it</p>
          <p className="text-slate-600 text-xs mt-1">Checks: vague words, missing role/format, token length, and more</p>
        </div>
      )}
    </div>
  );
}
