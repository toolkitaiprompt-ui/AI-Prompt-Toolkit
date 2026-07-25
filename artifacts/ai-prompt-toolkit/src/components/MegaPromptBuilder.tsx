import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, ArrowRight, ArrowLeft, Sparkles, Wand2 } from "lucide-react";

const STEPS = [
  { id: 1, label: "Role", emoji: "🎭" },
  { id: 2, label: "Task", emoji: "📝" },
  { id: 3, label: "Context", emoji: "📖" },
  { id: 4, label: "Audience", emoji: "👥" },
  { id: 5, label: "Output Format", emoji: "📋" },
  { id: 6, label: "Tone", emoji: "🎨" },
  { id: 7, label: "Constraints", emoji: "⚠️" },
  { id: 8, label: "Examples", emoji: "💡" },
];

const ROLES = ["Marketing Expert", "Software Developer", "Professional Writer", "Business Analyst", "Teacher / Educator", "Custom Role"];
const OUTPUT_FORMATS = ["Paragraph", "Bullet Points", "Table", "JSON", "Code Block"];
const TONES = ["Professional", "Casual", "Friendly", "Authoritative", "Technical", "Persuasive"];

export default function MegaPromptBuilder() {
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    role: "Marketing Expert",
    customRole: "",
    task: "",
    context: "",
    audience: "",
    outputFormat: "Paragraph",
    tone: "Professional",
    constraints: "",
    examples: "",
  });

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const generatedPrompt = useMemo(() => {
    const role = form.role === "Custom Role" && form.customRole ? form.customRole : form.role;
    const parts: string[] = [];
    parts.push(`You are an expert ${role}.`);
    if (form.task) parts.push(`\n## Task\n${form.task}`);
    if (form.context) parts.push(`\n## Context\n${form.context}`);
    if (form.audience) parts.push(`\n## Target Audience\n${form.audience}`);
    parts.push(`\n## Output Format\nProvide the response in ${form.outputFormat.toLowerCase()} format.`);
    parts.push(`\n## Tone\nUse a ${form.tone.toLowerCase()} tone throughout.`);
    if (form.constraints) parts.push(`\n## Constraints\n${form.constraints}`);
    if (form.examples) parts.push(`\n## Examples\n${form.examples}`);
    return parts.join("\n");
  }, [form]);

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalSteps = STEPS.length;
  const progress = ((step - 1) / totalSteps) * 100;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <p className="text-sm text-slate-400">Choose the role for your AI to act as.</p>
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => update("role", r)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium text-left transition-all border ${
                    form.role === r
                      ? "bg-amber-500/15 border-amber-400/30 text-amber-300"
                      : "bg-slate-900/60 border-slate-700/50 text-slate-300 hover:border-slate-600"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            {form.role === "Custom Role" && (
              <input
                type="text"
                value={form.customRole}
                onChange={(e) => update("customRole", e.target.value)}
                placeholder="Enter your custom role..."
                className="w-full px-4 py-3 bg-slate-900/80 border border-amber-400/30 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400/60"
              />
            )}
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <p className="text-sm text-slate-400">What do you want the AI to do? Be specific.</p>
            <textarea
              value={form.task}
              onChange={(e) => update("task", e.target.value)}
              placeholder="e.g. Write a product launch email for a new AI tool..."
              rows={5}
              className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400/60 resize-none"
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <p className="text-sm text-slate-400">Provide background information the AI needs to know.</p>
            <textarea
              value={form.context}
              onChange={(e) => update("context", e.target.value)}
              placeholder="e.g. We're launching on March 1st. The product costs $29/month. Our main competitor is..."
              rows={5}
              className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400/60 resize-none"
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <p className="text-sm text-slate-400">Who is this content for?</p>
            <input
              type="text"
              value={form.audience}
              onChange={(e) => update("audience", e.target.value)}
              placeholder="e.g. Small business owners, developers, students..."
              className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400/60"
            />
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <p className="text-sm text-slate-400">How should the AI structure its response?</p>
            <div className="grid grid-cols-2 gap-3">
              {OUTPUT_FORMATS.map((f) => (
                <button
                  key={f}
                  onClick={() => update("outputFormat", f)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium text-center transition-all border ${
                    form.outputFormat === f
                      ? "bg-amber-500/15 border-amber-400/30 text-amber-300"
                      : "bg-slate-900/60 border-slate-700/50 text-slate-300 hover:border-slate-600"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <p className="text-sm text-slate-400">What tone should the AI use?</p>
            <div className="grid grid-cols-2 gap-3">
              {TONES.map((t) => (
                <button
                  key={t}
                  onClick={() => update("tone", t)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium text-center transition-all border ${
                    form.tone === t
                      ? "bg-amber-500/15 border-amber-400/30 text-amber-300"
                      : "bg-slate-900/60 border-slate-700/50 text-slate-300 hover:border-slate-600"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-4">
            <p className="text-sm text-slate-400">Any rules or limits the AI must follow?</p>
            <textarea
              value={form.constraints}
              onChange={(e) => update("constraints", e.target.value)}
              placeholder="e.g. Max 300 words. No jargon. Include a CTA. Must mention 3 benefits..."
              rows={5}
              className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400/60 resize-none"
            />
          </div>
        );
      case 8:
        return (
          <div className="space-y-4">
            <p className="text-sm text-slate-400">Provide an example of what you want (optional).</p>
            <textarea
              value={form.examples}
              onChange={(e) => update("examples", e.target.value)}
              placeholder="e.g. Example: 'Write about X' → Expected output: ..."
              rows={5}
              className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400/60 resize-none"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="flex items-center gap-1">
        {STEPS.map((s) => (
          <div
            key={s.id}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              s.id <= step ? "bg-gradient-to-r from-amber-500 to-rose-500" : "bg-slate-700"
            }`}
          />
        ))}
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
          Step {step} of {totalSteps}
        </p>
        <p className="text-xs text-slate-500">{STEPS[step - 1].emoji} {STEPS[step - 1].label}</p>
      </div>

      {/* Step content */}
      <div className="min-h-[280px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-white mb-1">{STEPS[step - 1].emoji} {STEPS[step - 1].label}</h3>
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {step < totalSteps ? (
          <button
            onClick={() => setStep(Math.min(totalSteps, step + 1))}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-sm font-semibold text-white shadow-lg shadow-amber-500/30 hover:shadow-xl transition"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={copyPrompt}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-sm font-semibold text-white shadow-lg shadow-amber-500/30 hover:shadow-xl transition"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy Prompt"}
          </button>
        )}
      </div>

      {/* Generated prompt preview */}
      <div className="rounded-[20px] border border-white/10 bg-slate-950/80 p-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> Generated Prompt
          </h4>
          {step === totalSteps && (
            <button
              onClick={copyPrompt}
              className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
          )}
        </div>
        <pre className="text-sm text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto">
          {generatedPrompt || "Fill in the steps above to generate your prompt."}
        </pre>
      </div>
    </div>
  );
}
