import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Copy, Download, ChevronDown, ChevronUp } from "lucide-react";

interface ChainStep {
  id: number;
  name: string;
  prompt: string;
  outputType: string;
}

const OUTPUT_TYPES = ["Text", "JSON", "Markdown", "Code", "Table", "Bullet Points", "CSV"];

const MAX_STEPS = 5;

export default function PromptChainBuilder() {
  const [steps, setSteps] = useState<ChainStep[]>([
    { id: 1, name: "Step 1", prompt: "", outputType: "Text" },
  ]);
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);

  const addStep = () => {
    if (steps.length >= MAX_STEPS) return;
    const newId = Math.max(...steps.map((s) => s.id), 0) + 1;
    setSteps([...steps, { id: newId, name: `Step ${newId}`, prompt: "", outputType: "Text" }]);
  };

  const removeStep = (id: number) => {
    if (steps.length <= 1) return;
    setSteps(steps.filter((s) => s.id !== id));
  };

  const updateStep = (id: number, field: keyof ChainStep, value: string) => {
    setSteps(steps.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const toggleCollapse = (id: number) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const generateMarkdown = () => {
    const lines: string[] = ["# Prompt Chain", "", `Total Steps: ${steps.length}`, ""];
    steps.forEach((step, i) => {
      lines.push(`---`);
      lines.push(`## Step ${i + 1}: ${step.name}`);
      lines.push(`**Output Type:** ${step.outputType}`);
      lines.push(``);
      lines.push(`### Prompt`);
      lines.push(``);
      lines.push(step.prompt || "*(empty)*");
      lines.push(``);
    });
    return lines.join("\n");
  };

  const copyAll = async () => {
    const text = steps
      .map((s, i) => `=== Step ${i + 1}: ${s.name} (${s.outputType}) ===\n${s.prompt}`)
      .join("\n\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportMarkdown = () => {
    const md = generateMarkdown();
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prompt-chain.md";
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Steps count */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Steps: {steps.length}/{MAX_STEPS}
          {steps.length >= MAX_STEPS && <span className="text-amber-400 ml-2">Max reached</span>}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={copyAll}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-white/10 transition"
          >
            <Copy className="w-3.5 h-3.5" /> {copied ? "Copied!" : "Copy All"}
          </button>
          <button
            onClick={exportMarkdown}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-400/20 text-xs text-amber-300 hover:bg-amber-500/20 transition"
          >
            <Download className="w-3.5 h-3.5" /> {exported ? "Exported!" : "Export"}
          </button>
        </div>
      </div>

      {/* Steps */}
      <AnimatePresence>
        {steps.map((step, idx) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="relative"
          >
            {/* Flow arrow between steps */}
            {idx > 0 && (
              <div className="flex justify-center -mt-2 mb-2">
                <div className="flex flex-col items-center">
                  <div className="w-px h-4 bg-gradient-to-b from-amber-400/40 to-rose-400/40" />
                  <ChevronDown className="w-4 h-4 text-amber-400/60" />
                </div>
              </div>
            )}

            <div
              className={`rounded-[20px] border p-5 transition-all duration-300 ${
                step.prompt.trim()
                  ? "border-amber-400/20 bg-white/[0.03]"
                  : "border-white/[0.06] bg-white/[0.02]"
              }`}
            >
              {/* Step header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-rose-500 text-xs font-bold text-white">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={step.name}
                    onChange={(e) => updateStep(step.id, "name", e.target.value)}
                    className="bg-transparent text-sm font-semibold text-white outline-none border-b border-transparent focus:border-amber-400/40 transition"
                    placeholder="Step name..."
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <select
                    value={step.outputType}
                    onChange={(e) => updateStep(step.id, "outputType", e.target.value)}
                    className="bg-slate-800/80 border border-slate-700/50 rounded-lg px-2 py-1 text-[11px] text-slate-300 outline-none focus:border-amber-400/40"
                  >
                    {OUTPUT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <button onClick={() => toggleCollapse(step.id)} className="p-1 rounded hover:bg-white/5 transition text-slate-500 hover:text-slate-300">
                    {collapsed[step.id] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={() => removeStep(step.id)} disabled={steps.length <= 1} className="p-1 rounded hover:bg-rose-500/10 transition text-slate-500 hover:text-rose-400 disabled:opacity-30 disabled:cursor-not-allowed">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Prompt textarea */}
              {!collapsed[step.id] && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <textarea
                    value={step.prompt}
                    onChange={(e) => updateStep(step.id, "prompt", e.target.value)}
                    rows={3}
                    placeholder={`Enter prompt for "${step.name}"...`}
                    className="w-full rounded-xl border border-slate-700/50 bg-slate-900/60 p-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-amber-400/40 focus:ring-2 focus:ring-amber-400/10 resize-none"
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add step button */}
      {steps.length < MAX_STEPS && (
        <div className="text-center">
          <button
            onClick={addStep}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-dashed border-slate-600/60 text-sm text-slate-400 hover:border-amber-400/40 hover:text-amber-300 transition-all bg-transparent hover:bg-amber-500/5"
          >
            <Plus className="w-4 h-4" /> Add Step
          </button>
        </div>
      )}

      {/* Empty state */}
      {steps.filter(s => s.prompt.trim()).length === 0 && steps.length <= 1 && (
        <div className="text-center py-6 border border-dashed border-slate-700/60 rounded-2xl bg-slate-900/30">
          <p className="text-slate-400 text-sm">Add prompts to each step to build your chain</p>
          <p className="text-slate-600 text-xs mt-1">Each step flows into the next — ideal for multi-stage AI workflows</p>
        </div>
      )}
    </div>
  );
}
