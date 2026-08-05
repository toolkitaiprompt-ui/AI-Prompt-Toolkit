import { useState, useMemo } from "react";
import { FileText, Copy, Check, Scissors, Type, AlignLeft, BookOpen } from "lucide-react";

const MODES = [
  { id: "tl;dr", label: "TL;DR", icon: Scissors, desc: "1-2 sentence ultra-brief" },
  { id: "bullet", label: "Bullet Points", icon: AlignLeft, desc: "Key takeaways as bullets" },
  { id: "paragraph", label: "Paragraph", icon: Type, desc: "Short cohesive summary" },
  { id: "academic", label: "Academic", icon: BookOpen, desc: "Formal structured abstract" },
];

const DEMO_SUMMARIES: Record<string, (text: string) => string> = {
  "tl;dr": (text) => {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 10);
    if (sentences.length === 0) return "Please enter some content to summarize.";
    const first = sentences[0]?.trim() || "";
    const last = sentences[sentences.length - 1]?.trim() || "";
    return `${first}. ${last}.`.replace(/\.{2,}/g, ".");
  },
  bullet: (text) => {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 15);
    const keyPoints = sentences.filter((_, i) => i % 3 === 0).slice(0, 5);
    if (keyPoints.length === 0) return "• Please enter some content to summarize.";
    return keyPoints.map((s) => `• ${s.trim()}.`).join("\n");
  },
  paragraph: (text) => {
    const words = text.split(/\s+/).filter(Boolean);
    if (words.length < 20) return "Please enter at least a paragraph of content.";
    const firstThird = words.slice(0, Math.floor(words.length / 3)).join(" ");
    const lastThird = words.slice(Math.floor(words.length * 2 / 3)).join(" ");
    return `${firstThird} [...] ${lastThird}`;
  },
  academic: (text) => {
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 10);
    return `ABSTRACT\n\nThis study presents an analysis of the provided text comprising approximately ${wordCount} words and ${sentences.length} sentences. The content addresses key thematic elements including ${sentences[0]?.trim().slice(0, 60) || "various topics"}... The findings suggest that the central argument revolves around ${sentences[Math.floor(sentences.length / 2)]?.trim().slice(0, 80) || "the main subject matter"}... Further research is recommended to explore additional dimensions of this topic.`;
  },
};

export default function ContentSummarizer() {
  const [input, setInput] = useState(
    "Artificial Intelligence has transformed the way businesses operate in the modern world. From automated customer service chatbots to predictive analytics in finance, AI technologies are being adopted at an unprecedented rate. Machine learning algorithms can now process vast amounts of data to identify patterns that humans might miss. Natural language processing has enabled computers to understand and generate human-like text, powering applications like translation services and content creation tools. However, the rapid advancement of AI also raises important ethical questions about privacy, job displacement, and algorithmic bias. Organizations must balance innovation with responsible AI practices to ensure these technologies benefit society as a whole."
  );
  const [mode, setMode] = useState("bullet");
  const [copied, setCopied] = useState(false);
  const [summarized, setSummarized] = useState(false);

  const result = useMemo(() => {
    if (!summarized) return "";
    return DEMO_SUMMARIES[mode](input);
  }, [input, mode, summarized]);

  const stats = useMemo(() => {
    const words = input.split(/\s+/).filter(Boolean).length;
    const sentences = input.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
    const chars = input.length;
    const resultWords = result.split(/\s+/).filter(Boolean).length;
    const reduction = words > 0 ? Math.round(((words - resultWords) / words) * 100) : 0;
    return { words, sentences, chars, resultWords, reduction };
  }, [input, result]);

  const copy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {MODES.map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              onClick={() => { setMode(m.id); setSummarized(false); }}
              className={`rounded-xl border p-3 text-left transition ${
                mode === m.id
                  ? "border-amber-500/40 bg-amber-500/10"
                  : "border-slate-800 bg-slate-900/40 hover:border-slate-700"
              }`}
            >
              <Icon className={`h-5 w-5 ${mode === m.id ? "text-amber-400" : "text-slate-500"}`} />
              <p className={`mt-2 text-sm font-semibold ${mode === m.id ? "text-white" : "text-slate-400"}`}>{m.label}</p>
              <p className="text-xs text-slate-500">{m.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Input */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <FileText className="h-4 w-4 text-cyan-400" />
          Content to Summarize
        </label>
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setSummarized(false); }}
          className="h-48 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 resize-y"
          placeholder="Paste your article, report, or any long text here..."
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-4 text-xs text-slate-500">
            <span>{stats.words} words</span>
            <span>{stats.sentences} sentences</span>
            <span>{stats.chars} chars</span>
          </div>
          <button
            onClick={() => setSummarized(true)}
            disabled={stats.words < 10}
            className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-black transition hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Scissors className="h-4 w-4" />
            Summarize
          </button>
        </div>
      </div>

      {/* Result */}
      {summarized && result && (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Summary</span>
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-300">
                {stats.reduction}% shorter
              </span>
              <span className="text-xs text-slate-500">{stats.resultWords} words</span>
            </div>
            <button
              onClick={copy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 transition hover:bg-emerald-500/20"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="whitespace-pre-wrap text-sm leading-7 text-slate-200">{result}</div>
        </div>
      )}
    </div>
  );
}
