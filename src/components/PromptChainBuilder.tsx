import { useState, useMemo } from 'react';
import { Plus, Trash2, Copy, Download, Layers, ArrowDown } from 'lucide-react';
import { exportChainAsMarkdown, copyAllChainSteps, type ChainStep } from '../lib/toolkit';
import { LiveStats } from './OutputToolbar';

const OUTPUT_FORMATS = ['Text', 'JSON', 'Markdown', 'Code', 'Table', 'Bullet Points', 'CSV'];

export default function PromptChainBuilder() {
  const [steps, setSteps] = useState<ChainStep[]>([
    { id: 1, prompt: 'Analyze the customer feedback and identify the top 3 pain points mentioned.', outputFormat: 'Bullet Points' },
    { id: 2, prompt: '', outputFormat: 'Text' },
  ]);
  const [copied, setCopied] = useState(false);

  const activeSteps = useMemo(() => steps.filter((s) => s.prompt.trim()), [steps]);

  const addStep = () => {
    if (steps.length >= 5) return;
    setSteps((prev) => [...prev, { id: prev.length + 1, prompt: '', outputFormat: 'Text' }]);
  };

  const removeStep = (id: number) => {
    if (steps.length <= 1) return;
    setSteps((prev) => prev.filter((s) => s.id !== id));
  };

  const updateStep = (id: number, field: 'prompt' | 'outputFormat', value: string) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const handleCopyAll = () => {
    const text = copyAllChainSteps(steps);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const md = exportChainAsMarkdown(steps);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prompt-chain.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-4">
        <Layers className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-sm text-slate-300">
          <p className="font-medium text-indigo-300">Prompt Chain Builder</p>
          <p className="mt-1">Break complex tasks into sequential steps. Each step's output feeds the next. Supports up to 5 steps with customizable output formats.</p>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, idx) => (
          <div key={step.id}>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-300 border border-amber-500/30">
                    {step.id}
                  </span>
                  <h3 className="text-sm font-semibold text-white">Step {step.id}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => removeStep(step.id)}
                  disabled={steps.length <= 1}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-700 px-2.5 py-1 text-xs text-slate-400 transition hover:border-red-500/30 hover:text-red-400 disabled:opacity-30"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              </div>
              <textarea
                className="h-24 w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm text-slate-100 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20 resize-none mb-3"
                placeholder={`Enter the prompt for step ${step.id}...`}
                value={step.prompt}
                onChange={(e) => updateStep(step.id, 'prompt', e.target.value)}
                aria-label={`Step ${step.id} prompt`}
              />
              <LiveStats text={step.prompt} />
              <div className="mt-3">
                <label className="block text-xs font-medium text-slate-400 mb-2">Output Format</label>
                <div className="flex flex-wrap gap-2">
                  {OUTPUT_FORMATS.map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => updateStep(step.id, 'outputFormat', fmt)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                        step.outputFormat === fmt
                          ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                          : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {idx < steps.length - 1 && (
              <div className="flex justify-center py-2">
                <ArrowDown className="h-5 w-5 text-slate-600" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Step Button */}
      {steps.length < 5 && (
        <button
          type="button"
          onClick={addStep}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-700 py-3 text-sm font-medium text-slate-400 transition hover:border-amber-500/40 hover:text-amber-300"
        >
          <Plus className="h-4 w-4" /> Add Step ({steps.length}/5)
        </button>
      )}

      {/* Export Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleCopyAll}
          className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-400"
        >
          {copied ? '✓ Copied All!' : 'Copy All Steps'}
          <Copy className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
        >
          Export as Markdown <Download className="h-4 w-4" />
        </button>
      </div>

      <p className="text-xs text-slate-500">{activeSteps.length} active step{activeSteps.length !== 1 ? 's' : ''} in your chain.</p>
    </div>
  );
}
