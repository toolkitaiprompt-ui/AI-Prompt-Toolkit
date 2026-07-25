import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Terminal, Braces, FileCode, Globe } from "lucide-react";
import { getOpenAIFormat, getAnthropicFormat, getGoogleFormat, getCurlCommand } from "../../lib/apiFormats";
import { savePrompt } from "../../lib/promptHistory";

const MODELS = ["GPT-4o", "GPT-4o-mini", "Claude 3.5 Sonnet", "Claude Haiku", "Gemini Pro", "Gemini Flash"];
const TABS = [
  { id: "openai", label: "OpenAI", icon: Braces },
  { id: "anthropic", label: "Anthropic", icon: FileCode },
  { id: "google", label: "Gemini", icon: Globe },
  { id: "curl", label: "cURL", icon: Terminal },
];

function syntaxHighlight(json: string): string {
  return json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /("(?:[^"\\]|\\.)*")\s*:/g,
      '<span class="text-amber-300">$1</span>:'
    )
    .replace(
      /:\s*("(?:[^"\\]|\\.)*")/g,
      ': <span class="text-emerald-300">$1</span>'
    )
    .replace(/: (\d+\.?\d*)/g, ': <span class="text-blue-300">$1</span>')
    .replace(/: (true|false)/g, ': <span class="text-violet-300">$1</span>')
    .replace(/: (null)/g, ': <span class="text-slate-400">$1</span>');
}

export default function ApiRequestBuilder() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("GPT-4o");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1000);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [activeTab, setActiveTab] = useState("openai");
  const [copied, setCopied] = useState("");

  const settings = useMemo(() => ({ prompt, model, temperature, maxTokens, systemPrompt }), [prompt, model, temperature, maxTokens, systemPrompt]);

  const outputs = useMemo(() => {
    const s = settings;
    return {
      openai: getOpenAIFormat(s),
      anthropic: s.model.startsWith("GPT") ? getAnthropicFormat({ ...s, model: "GPT-4o" }) : getAnthropicFormat(s),
      google: s.model.startsWith("Claude") ? getGoogleFormat({ ...s, model: "Claude 3.5 Sonnet" }) : getGoogleFormat(s),
      curl: getCurlCommand(s),
    };
  }, [settings]);

  const handleCopy = async (tabId: string) => {
    const text = outputs[tabId as keyof typeof outputs];
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(tabId);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Your Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            if (e.target.value.trim().length > 10) savePrompt(e.target.value, "API Request Builder", "/tools/api-request-builder");
          }}
          placeholder="Enter your prompt here..."
          rows={3}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20 resize-none"
        />
      </div>

      {/* System prompt */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">System Prompt (optional)</label>
        <textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          placeholder="You are a helpful assistant..."
          rows={2}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20 resize-none"
        />
      </div>

      {/* Settings */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="text-xs font-medium text-slate-400 mb-1.5 block">Model</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-amber-400/60"
          >
            {MODELS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-400 mb-1.5 block">Temperature: {temperature}</label>
          <input
            type="range"
            min={0}
            max={2}
            step={0.1}
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none bg-slate-700 accent-amber-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-600 mt-0.5"><span>0</span><span>1</span><span>2</span></div>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-400 mb-1.5 block">Max Tokens: {maxTokens}</label>
          <input
            type="range"
            min={100}
            max={4000}
            step={100}
            value={maxTokens}
            onChange={(e) => setMaxTokens(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none bg-slate-700 accent-amber-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-600 mt-0.5"><span>100</span><span>2K</span><span>4K</span></div>
        </div>
      </div>

      {/* Tabs */}
      {prompt.trim() && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center gap-1 bg-slate-900/60 rounded-full p-1 border border-white/[0.06] overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition whitespace-nowrap ${
                  activeTab === tab.id ? "bg-amber-500/15 text-amber-300" : "text-slate-400 hover:text-white"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" /> {tab.label}
              </button>
            ))}
          </div>

          <div className="relative rounded-[20px] border border-white/10 bg-slate-950/80 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {TABS.find((t) => t.id === activeTab)?.label} Request Body
              </h3>
              <button
                onClick={() => handleCopy(activeTab)}
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition"
              >
                {copied === activeTab ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied === activeTab ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre
              className="text-sm font-mono whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto text-slate-300"
              dangerouslySetInnerHTML={{
                __html: activeTab === "curl"
                  ? outputs.curl.replace(/\n/g, "<br>").replace(/\s{2,}/g, (m) => "&nbsp;".repeat(m.length))
                  : syntaxHighlight(outputs[activeTab as keyof typeof outputs]),
              }}
            />
          </div>
        </motion.div>
      )}

      {!prompt.trim() && (
        <div className="text-center py-8 border border-dashed border-slate-700/60 rounded-2xl bg-slate-900/30">
          <Terminal className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Enter a prompt to generate API request bodies</p>
          <p className="text-slate-600 text-xs mt-1">Supports OpenAI, Anthropic & Gemini formats + ready-to-use cURL commands</p>
        </div>
      )}
    </div>
  );
}
