import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Shield, ShieldAlert, ShieldCheck, Copy, Check, AlertTriangle } from "lucide-react";
import { scanPrompt } from "../../lib/securityScanner";

export default function SecurityScanner() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!input.trim()) return null;
    return scanPrompt(input);
  }, [input]);

  const getStatus = (score: number) => {
    if (score >= 80) return { label: "Safe", icon: ShieldCheck, color: "text-emerald-400", bg: "from-emerald-400 to-emerald-500" };
    if (score >= 50) return { label: "Warning", icon: ShieldAlert, color: "text-amber-400", bg: "from-amber-400 to-rose-400" };
    return { label: "Danger", icon: Shield, color: "text-rose-400", bg: "from-rose-400 to-red-500" };
  };

  const copyResults = () => {
    if (!result) return;
    const text = `Security Score: ${result.score}/100\nIssues:\n${result.issues.map(i => `[${i.type.toUpperCase()}] ${i.title}\n  ${i.suggestion}`).join("\n\n")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Paste your prompt to scan</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste a prompt to check for injection, jailbreak, data leak, PII, and unsafe content risks..."
          rows={5}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20 resize-none"
        />
      </div>

      {!input.trim() && (
        <div className="text-center py-10 border border-dashed border-slate-700/60 rounded-2xl bg-slate-900/30">
          <Shield className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Paste a prompt above to scan for security risks</p>
          <p className="text-slate-600 text-xs mt-1">Checks: injection, jailbreak, data leak, PII, and harmful content</p>
        </div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Score */}
          <div className="flex flex-col items-center py-6">
            <div className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${getStatus(result.score).bg} p-[3px]`}>
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                <span className={`text-3xl font-bold ${getStatus(result.score).color}`}>{result.score}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              {(() => { const Icon = getStatus(result.score).icon; return <Icon className={`w-5 h-5 ${getStatus(result.score).color}`} />; })()}
              <span className={`text-lg font-semibold ${getStatus(result.score).color}`}>{getStatus(result.score).label}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {result.score >= 80 ? "Prompt appears safe. No critical issues detected." :
               result.score >= 50 ? "Some issues found. Review warnings below." :
               "Critical issues detected. Do not use this prompt."}
            </p>
          </div>

          {/* Issues */}
          {result.issues.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" /> Issues ({result.issues.length})
                </h3>
                <button onClick={copyResults} className="text-xs text-amber-400 hover:text-amber-300 transition flex items-center gap-1">
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied" : "Copy Report"}
                </button>
              </div>
              {result.issues.map((issue, i) => (
                <div key={i} className={`rounded-xl border p-4 ${issue.type === "danger" ? "border-rose-500/30 bg-rose-500/10" : issue.type === "warning" ? "border-amber-500/30 bg-amber-500/10" : "border-emerald-500/30 bg-emerald-500/10"}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <span className={`mt-0.5 text-sm ${issue.type === "danger" ? "text-rose-400" : issue.type === "warning" ? "text-amber-400" : "text-emerald-400"}`}>
                        {issue.type === "danger" ? "✕" : issue.type === "warning" ? "⚠" : "✓"}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-white">{issue.title}</p>
                        <p className="text-xs text-slate-400 mt-1">{issue.description}</p>
                        <p className="text-xs text-slate-500 mt-1 italic">💡 {issue.suggestion}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${issue.type === "danger" ? "bg-rose-500/20 text-rose-300" : issue.type === "warning" ? "bg-amber-500/20 text-amber-300" : "bg-emerald-500/20 text-emerald-300"}`}>
                      {issue.type === "danger" ? "High" : issue.type === "warning" ? "Med" : "Low"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {result.issues.length === 0 && (
            <div className="text-center py-6">
              <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
              <p className="text-white font-medium">No issues detected</p>
              <p className="text-sm text-slate-400">Your prompt passed all security checks.</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
