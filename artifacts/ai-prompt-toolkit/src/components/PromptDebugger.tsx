import { useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Sparkles, Zap } from "lucide-react";
import { savePrompt } from "../lib/promptHistory";

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
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const analysis = useMemo(() => {
    if (!input.trim()) return null;
    const issues: Issue[] = [];
    const text = input;
    const lower = text.toLowerCase();

    const vagueFound = VAGUE_WORDS.filter((w) => {
      const regex = new RegExp(`\\b${w}\\b`, "gi");
      return regex.test(text);
    });
    if (vagueFound.length > 0) {
      issues.push({ type: "warning", title: `Vague words (${vagueFound.length})`, description: `Found: ${vagueFound.join(", ")}. Use specific terms instead.`, suggestion: `Replace "${vagueFound[0]}" with concrete numbers, names, or criteria.` });
    }

    if (!["act as", "you are a", "you are an", "role:", "as a", "your role"].some((r) => lower.includes(r))) {
      issues.push({ type: "error", title: "No role specified", description: "AI performs better with a role.", suggestion: 'Start with: "You are an expert [role]."' });
    }

    if (!["format:", "output:", "respond in", "in json", "bullet", "table", "paragraph"].some((f) => lower.includes(f))) {
      issues.push({ type: "warning", title: "No output format", description: "Response structure may be inconsistent.", suggestion: 'Add: "Respond in paragraph/bullet/JSON format."' });
    }

    if (!["max", "limit", "constraint", "must not", "avoid", "keep under"].some((c) => lower.includes(c))) {
      issues.push({ type: "info", title: "No constraints", description: "AI may produce overly long responses.", suggestion: 'Add: "Max 300 words. Avoid jargon."' });
    }

    const taskCount = ["also", "additionally", "furthermore", "moreover", "and also"].filter((t) => lower.includes(t)).length;
    if (taskCount >= 3) {
      issues.push({ type: "warning", title: "Too many tasks", description: `Found ${taskCount} task indicators.`, suggestion: "Split into separate prompts — one task per prompt." });
    }

    const tokens = Math.ceil(text.length / 4);
    if (tokens > 2000) {
      issues.push({ type: "warning", title: `Long prompt (${tokens.toLocaleString()} tokens)`, description: "Prompts over 2000 tokens may lose focus.", suggestion: "Trim or split into smaller prompts." });
    } else if (tokens < 20 && text.length > 5) {
      issues.push({ type: "info", title: "Very short prompt", description: `~${tokens} tokens. Generates generic responses.`, suggestion: "Add more context, instructions, and examples." });
    }

    const ambigCount = (lower.match(/\bit\b(?!\s*(is|was|will|can|should|has|have|had|does|did)\b)/g) || []).length + (lower.match(/\bthey\b(?!\s*(are|were|will|can|should|have|has)\b)/g) || []).length;
    if (ambigCount > 1) {
      issues.push({ type: "warning", title: "Ambiguous pronouns", description: 'Unclear "it"/"they" usage.', suggestion: 'Replace with specific nouns.' });
    }

    if (lower.includes("but don't") && lower.includes("also include")) {
      issues.push({ type: "error", title: "Conflicting instructions", description: '"but don\'t" + "also include" may conflict.', suggestion: "Simplify instructions." });
    }

    let score = 100;
    for (const issue of issues) score -= issue.type === "error" ? 20 : issue.type === "warning" ? 10 : 5;
    score = Math.max(0, Math.min(100, score));

    return { issues, score };
  }, [input]);

  const handleAutoFix = () => {
    if (!analysis) return;
    let fixed = "[IMPROVED PROMPT]\n\n" + input;
    const firstFix = analysis.issues.find((i) => i.type === "error");
    if (firstFix) {
      fixed = "[ROLE: Add a specific role here]\n" + input + "\n[Output in clear format. Max 300 words.]";
    }
    setFixedPrompt(fixed);
    setAutoFixed(true);
  };

  const scoreColor = analysis ? (analysis.score >= 80 ? "text-emerald-400" : analysis.score >= 60 ? "text-amber-400" : "text-rose-400") : "";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Paste your prompt for analysis</label>
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setAutoFixed(false);
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
              if (e.target.value.trim().length > 10) savePrompt(e.target.value, "Prompt Debugger", "/tools/prompt-debugger");
            }, 1500);
          }}
          placeholder="Paste your AI prompt here..."
          rows={5}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20 resize-none"
        />
      </div>

      {!input.trim() && (
        <div className="text-center py-10 border border-dashed border-slate-700/60 rounded-2xl bg-slate-900/30">
          <Zap className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Paste a prompt above to analyze it</p>
          <p className="text-slate-600 text-xs mt-1">Checks: vague words, missing role/format, token length, and more</p>
        </div>
      )}

      {analysis && (
        <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex flex-col items-center py-6">
            <div className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${analysis.score >= 80 ? "from-emerald-400 to-emerald-500" : analysis.score >= 60 ? "from-amber-400 to-rose-400" : "from-rose-400 to-red-500"} p-[3px]`}>
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                <span className={`text-3xl font-bold ${scoreColor}`}>{analysis.score}</span>
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-400">Prompt Health Score</p>
            <p className="text-xs text-slate-500 mt-1">
              {analysis.score >= 80 ? "✓ Looks good! Minor improvements possible." : analysis.score >= 60 ? "⚠️ Decent, but could be improved." : "❌ Needs significant improvement."}
            </p>
          </div>

          {analysis.issues.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" /> Issues Found ({analysis.issues.length})
              </h3>
              {analysis.issues.map((issue, i) => (
                <div
                  key={i}
                  className={`rounded-xl border p-4 ${issue.type === "error" ? "border-rose-500/30 bg-rose-500/10" : issue.type === "warning" ? "border-amber-500/30 bg-amber-500/10" : "border-blue-500/30 bg-blue-500/10"}`}
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
                    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${issue.type === "error" ? "bg-rose-500/20 text-rose-300" : issue.type === "warning" ? "bg-amber-500/20 text-amber-300" : "bg-blue-500/20 text-blue-300"}`}>
                      {issue.type === "error" ? "High" : issue.type === "warning" ? "Med" : "Low"}
                    </span>
                  </div>
                </div>
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

          {analysis.issues.length > 0 && (
            <div className="text-center">
              <button onClick={handleAutoFix} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-sm font-semibold text-white shadow-lg shadow-amber-500/30 hover:shadow-xl transition">
                <Sparkles className="w-4 h-4" /> Auto-Fix Prompt
              </button>
            </div>
          )}

          {autoFixed && (
            <div className="rounded-[20px] border border-emerald-400/20 bg-emerald-500/5 p-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-emerald-300 flex items-center gap-2"><Sparkles className="w-4 h-4" /> Improved Prompt</h4>
                <button onClick={() => navigator.clipboard.writeText(fixedPrompt)} className="text-xs text-emerald-400 hover:text-emerald-300 transition underline">Copy</button>
              </div>
              <pre className="text-sm text-slate-200 font-mono whitespace-pre-wrap leading-relaxed max-h-[250px] overflow-y-auto">{fixedPrompt}</pre>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
