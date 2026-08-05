import { useState, useMemo } from 'react';
import { CheckCircle2, Copy, Download, ChevronRight, ChevronLeft, RotateCcw } from 'lucide-react';
import { buildMegaPrompt, type MegaPromptStep } from '../lib/toolkit';

const STEPS: { key: string; label: string; placeholder: string; help: string }[] = [
  {
    key: 'role',
    label: 'Role',
    placeholder: 'e.g., Senior content marketing strategist with 10+ years of B2B SaaS experience',
    help: 'Define the AI\'s expertise and persona. Who should the AI act as?',
  },
  {
    key: 'task',
    label: 'Task',
    placeholder: 'e.g., Write a product launch announcement blog post',
    help: 'The specific action you want the AI to perform. Be clear and direct.',
  },
  {
    key: 'context',
    label: 'Context',
    placeholder: 'e.g., We are launching AI World Hub, a free in-browser prompt engineering toolkit...',
    help: 'Background information the AI needs to understand the task fully.',
  },
  {
    key: 'audience',
    label: 'Target Audience',
    placeholder: 'e.g., Developers and indie hackers interested in AI productivity tools',
    help: 'Who is the output for? This shapes the tone, complexity, and terminology.',
  },
  {
    key: 'format',
    label: 'Output Format',
    placeholder: 'e.g., Markdown with: H1 headline, subheadline, 3 bullet benefits, CTA',
    help: 'Specify the structure of the output — markdown, JSON, table, bullet points, etc.',
  },
  {
    key: 'tone',
    label: 'Tone',
    placeholder: 'e.g., Confident, friendly, professional — no corporate jargon',
    help: 'The personality and style of the output.',
  },
  {
    key: 'constraints',
    label: 'Constraints',
    placeholder: 'e.g., Max 500 words, no hype words, include 3 specific benefits',
    help: 'Boundaries the AI must respect — word limits, exclusions, rules.',
  },
  {
    key: 'examples',
    label: 'Examples',
    placeholder: 'e.g., Example output: "AI World Hub: Your Free Prompt Engineering Toolkit..."',
    help: 'Provide 1-3 examples of expected output to guide the model (few-shot).',
  },
];

export default function MegaPromptBuilder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const steps: MegaPromptStep[] = STEPS.map((s) => ({
    key: s.key,
    label: s.label,
    value: values[s.key] || '',
  }));

  const output = useMemo(() => buildMegaPrompt(steps), [values]);

  const completedSteps = STEPS.filter((s) => (values[s.key] || '').trim().length > 0).length;
  const progress = Math.round((completedSteps / STEPS.length) * 100);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setValues({});
    setCurrentStep(0);
  };

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  const goPrev = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mega-prompt.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentStepData = STEPS[currentStep];

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white">Build Progress</h2>
          <span className="text-xs text-slate-400">{completedStepCount()} of {STEPS.length} steps completed</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {STEPS.map((step, idx) => (
            <button
              key={step.key}
              onClick={() => setCurrentStep(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                idx === currentStep
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : (values[step.key] || '').trim()
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {idx + 1}. {step.label}
            </button>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Step {currentStep + 1}: {currentStepData.label}
            </h3>
            <p className="mt-1 text-sm text-slate-400">{currentStepData.help}</p>
          </div>
          <textarea
            className="h-32 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 resize-none"
            placeholder={currentStepData.placeholder}
            value={values[currentStepData.key] || ''}
            onChange={(e) => setValues((prev) => ({ ...prev, [currentStepData.key]: e.target.value }))}
            aria-label={`${currentStepData.label} input`}
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={goPrev}
              disabled={currentStep === 0}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-400 transition hover:bg-slate-800"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={currentStep === STEPS.length - 1}
                className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-black transition hover:bg-amber-400 disabled:opacity-40"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Output */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-white">Generated Mega Prompt</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-slate-800"
            >
              <Download className="h-3.5 w-3.5" /> Download
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-slate-800"
            >
              {copied ? <><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Copied!</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
            </button>
          </div>
        </div>
        <pre className="overflow-auto rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-300 whitespace-pre-wrap break-words min-h-[200px]">
          {output || 'Your mega prompt will appear here as you fill in each step...'}
        </pre>
      </div>
    </div>
  );

  function completedStepCount() {
    return STEPS.filter((s) => (values[s.key] || '').trim().length > 0).length;
  }
}

