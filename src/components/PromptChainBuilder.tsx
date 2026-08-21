import { useState, useMemo, useRef } from 'react';
import { Plus, Trash2, Copy, Download, Layers, ArrowDown, ArrowUp, Eye } from 'lucide-react';
import { exportChainAsMarkdown, copyAllChainSteps, type ChainStep } from '../lib/toolkit';
import { LiveStats } from './OutputToolbar';
import { ToolGuide } from './ToolGuide';

const OUTPUT_FORMATS = ['Text', 'JSON', 'Markdown', 'Code', 'Table', 'Bullet Points', 'CSV'];

export default function PromptChainBuilder() {
  const [steps, setSteps] = useState<ChainStep[]>([
    { id: 1, title: 'Analyze Feedback', prompt: 'Analyze the customer feedback and identify the top 3 pain points mentioned.', outputFormat: 'Bullet Points' },
    { id: 2, title: '', prompt: '', outputFormat: 'Text' },
  ]);
  const [copied, setCopied] = useState(false);
  const nextIdRef = useRef(3);

  const activeSteps = useMemo(() => steps.filter((s) => s.prompt.trim()), [steps]);

  const addStep = () => {
    if (steps.length >= 5) return;
    setSteps((prev) => [...prev, { id: nextIdRef.current++, title: '', prompt: '', outputFormat: 'Text' }]);
  };

  const removeStep = (id: number) => {
    if (steps.length <= 1) return;
    setSteps((prev) => prev.filter((s) => s.id !== id));
  };

  const moveStep = (id: number, direction: -1 | 1) => {
    setSteps((prev) => {
      const from = prev.findIndex((s) => s.id === id);
      const to = from + direction;
      if (from < 0 || to < 0 || to >= prev.length) return prev;
      const next = [...prev];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
  };

  const updateStep = (id: number, field: 'title' | 'prompt' | 'outputFormat', value: string) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const handleCopyAll = async () => {
    const text = copyAllChainSteps(steps);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (permissions/insecure context) — ignore
    }
  };

  const handleDownload = () => {
    const md = exportChainAsMarkdown(steps);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prompt-chain.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
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
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-300 border border-amber-500/30">
                    {idx + 1}
                  </span>
                  <h3 className="text-sm font-semibold text-white">Step {idx + 1}</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => moveStep(step.id, -1)}
                    disabled={idx === 0}
                    aria-label={`Move step ${idx + 1} up`}
                    title="Move step up"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700 text-slate-400 transition hover:border-amber-500/40 hover:text-amber-300 disabled:opacity-30 disabled:hover:border-slate-700 disabled:hover:text-slate-400"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveStep(step.id, 1)}
                    disabled={idx === steps.length - 1}
                    aria-label={`Move step ${idx + 1} down`}
                    title="Move step down"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700 text-slate-400 transition hover:border-amber-500/40 hover:text-amber-300 disabled:opacity-30 disabled:hover:border-slate-700 disabled:hover:text-slate-400"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeStep(step.id)}
                    disabled={steps.length <= 1}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-700 px-2.5 py-1 text-xs text-slate-400 transition hover:border-red-500/30 hover:text-red-400 disabled:opacity-30"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                </div>
              </div>
              <input
                className="mb-3 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20"
                placeholder={`Step ${idx + 1} title (e.g. Analyze Feedback)`}
                value={step.title}
                onChange={(e) => updateStep(step.id, 'title', e.target.value)}
                aria-label={`Step ${idx + 1} title`}
              />
              <textarea
                className="h-24 w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm text-slate-100 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20 resize-none mb-3"
                placeholder={`Enter the prompt for step ${idx + 1}...`}
                value={step.prompt}
                onChange={(e) => updateStep(step.id, 'prompt', e.target.value)}
                aria-label={`Step ${idx + 1} prompt`}
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
      {steps.length < 5 ? (
        <button
          type="button"
          onClick={addStep}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-700 py-3 text-sm font-medium text-slate-400 transition hover:border-amber-500/40 hover:text-amber-300"
        >
          <Plus className="h-4 w-4" /> Add Step ({steps.length}/5)
        </button>
      ) : (
        <p className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 py-3 text-center text-xs text-slate-500">
          Maximum 5 steps reached — remove a step to add a new one.
        </p>
      )}

      {/* Complete Workflow Preview */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-amber-400" />
            <p className="text-sm font-semibold text-white">Complete Workflow</p>
          </div>
          <span className="text-xs text-slate-500">{activeSteps.length} active step{activeSteps.length !== 1 ? 's' : ''} · {steps.length}/5 total</span>
        </div>
        {activeSteps.length === 0 ? (
          <p className="text-sm text-slate-500">Add prompts to your steps above — the full workflow will appear here.</p>
        ) : (
          <ol className="space-y-3">
            {steps.map((step, idx) => {
              if (!step.prompt.trim()) return null;
              const title = step.title.trim() || `Step ${idx + 1}`;
              return (
                <li key={step.id} className="flex gap-3 rounded-lg border border-slate-800/90 bg-slate-950/60 p-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-[11px] font-bold text-amber-300 border border-amber-500/30">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-white">{title}</p>
                      <span className="rounded border border-slate-700 bg-slate-900 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-slate-400">
                        {step.outputFormat}
                      </span>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap text-xs leading-6 text-slate-400">{step.prompt}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      {/* Export Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleCopyAll}
          disabled={activeSteps.length === 0}
          title={activeSteps.length === 0 ? 'Add a prompt to at least one step first' : undefined}
          className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-amber-500"
        >
          {copied ? '✓ Copied All!' : 'Copy Full Workflow'}
          <Copy className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleDownload}
          disabled={activeSteps.length === 0}
          title={activeSteps.length === 0 ? 'Add a prompt to at least one step first' : undefined}
          className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-slate-900"
        >
          Export as Markdown <Download className="h-4 w-4" />
        </button>
      </div>

      <p className="text-xs text-slate-500">
        {activeSteps.length === 0
          ? 'No active steps yet — write a prompt in Step 1 to start your chain.'
          : `${activeSteps.length} active step${activeSteps.length !== 1 ? 's' : ''} in your chain.`}
      </p>

      <ToolGuide
        intro="The Prompt Chain Builder breaks a big task into 2–5 sequential steps, where each step's output feeds the next one. It is made for content creators planning multi-part articles, marketers running research-to-post workflows, developers building step-by-step code tasks, and students preparing structured study plans — anything too big for a single prompt."
        steps={[
          "Give each step a short title, like “Analyze Feedback” or “Draft Response”.",
          "Write the prompt instruction for that step. The more specific the instruction, the better the result.",
          "Pick an output format for the step — Text, JSON, Markdown, Code, Table, Bullet Points, or CSV.",
          "Add up to 5 steps with the “Add Step” button, and reorder them with the up/down arrows until the flow feels right.",
          "Check the “Complete Workflow” preview, then click “Copy Full Workflow” or “Export as Markdown” to reuse the chain.",
        ]}
        example={{
          title: "A customer-feedback workflow in 3 steps: analyze → respond → summarize.",
          before:
            "Step 1 — Analyze Feedback (Bullet Points)\nAnalyze the customer feedback and identify the top 3 pain points.\n\nStep 2 — Draft Response (Text)\nDraft a friendly reply to the customer for each pain point.\n\nStep 3 — Summarize Outcome (Markdown)\nSummarize the replies into a short internal note for the team.",
          after:
            "# Step 1: Analyze Feedback (Bullet Points)\nAnalyze the customer feedback and identify the top 3 pain points mentioned.\n\n---\n\n# Step 2: Draft Response (Text)\nBased on the pain points, draft a friendly reply to the customer.\n\n---\n\n# Step 3: Summarize Outcome (Text)\nSummarize the whole exchange into 3 bullet points for the team.",
          note: "Run each step's prompt in order in your AI chatbot, passing the previous output into the next step. The Copy button gives you the whole workflow in one go, so you can reuse it for every new batch of feedback.",
        }}
      />
    </div>
  );
}
