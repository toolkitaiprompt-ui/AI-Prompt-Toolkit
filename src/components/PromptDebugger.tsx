import { useState, useMemo } from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle2, Activity, Wrench } from 'lucide-react';
import { debugPrompt, type PromptIssue } from '../lib/toolkit';

const SEVERITY_CONFIG: Record<PromptIssue['severity'], { icon: typeof AlertTriangle; color: string; bg: string; label: string }> = {
  critical: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', label: 'Critical' },
  warning: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', label: 'Warning' },
  info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', label: 'Info' },
};

export default function PromptDebugger() {
  const [input, setInput] = useState('write a blog about AI tools');

  const result = useMemo(() => debugPrompt(input), [input]);

  const scoreColor =
    result.healthScore >= 80 ? 'text-emerald-400' :
    result.healthScore >= 50 ? 'text-amber-400' :
    'text-red-400';

  const scoreBg =
    result.healthScore >= 80 ? 'from-emerald-500 to-green-500' :
    result.healthScore >= 50 ? 'from-amber-500 to-yellow-500' :
    'from-red-500 to-rose-500';

  return (
    <div className="space-y-6">
      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-300">Paste your prompt to debug</span>
        <textarea
          className="h-40 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 resize-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your prompt here to analyze its health and find issues..."
          aria-label="Prompt to debug"
        />
      </label>

      {/* Health Score */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-amber-400" />
            <h3 className="text-base font-semibold text-white">Prompt Health Score</h3>
          </div>
          <span className={`text-3xl font-bold ${scoreColor}`}>{result.healthScore}/100</span>
        </div>
        <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${scoreBg} transition-all duration-500`}
            style={{ width: `${result.healthScore}%` }}
          />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3 text-center">
          <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
            <p className="text-xl font-bold text-white">{result.metrics.words}</p>
            <p className="text-xs text-slate-400">Words</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
            <p className="text-xl font-bold text-white">{result.metrics.characters}</p>
            <p className="text-xs text-slate-400">Characters</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
            <p className="text-xl font-bold text-white">{result.metrics.sentences}</p>
            <p className="text-xs text-slate-400">Sentences</p>
          </div>
        </div>
      </div>

      {/* Issues */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-white">Detected Issues ({result.issues.length})</h3>
        </div>
        {result.issues.length === 0 ? (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <p className="text-sm text-emerald-300">No issues detected! Your prompt looks healthy.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {result.issues.map((issue) => {
              const config = SEVERITY_CONFIG[issue.severity];
              const Icon = config.icon;
              return (
                <div key={issue.id} className={`rounded-xl border ${config.bg} p-4`}>
                  <div className="flex items-start gap-3">
                    <Icon className={`h-5 w-5 ${config.color} shrink-0 mt-0.5`} />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-semibold ${config.color}`}>{config.label}</span>
                        <span className="text-xs text-slate-500">·</span>
                        <span className="text-xs text-slate-400">{issue.category}</span>
                      </div>
                      <p className="text-sm text-slate-200">{issue.message}</p>
                      <div className="flex items-start gap-2 rounded-lg bg-slate-900/50 p-3">
                        <Wrench className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-slate-300">{issue.suggestion}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
