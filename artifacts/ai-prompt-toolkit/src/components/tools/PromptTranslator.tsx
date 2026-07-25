import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Globe, Copy, Check, ArrowRight, Languages } from "lucide-react";
import { LANGUAGES, translatePrompt } from "../../data/translations";
import { savePrompt } from "../../lib/promptHistory";

export default function PromptTranslator() {
  const [input, setInput] = useState("");
  const [selectedLang, setSelectedLang] = useState("hi");
  const [translated, setTranslated] = useState(false);
  const [copied, setCopied] = useState(false);

  const langName = LANGUAGES.find((l) => l.id === selectedLang)?.name || "Selected Language";
  const nativeName = LANGUAGES.find((l) => l.id === selectedLang)?.nativeName || "";

  const output = useMemo(() => {
    if (!input.trim()) return "";
    return translatePrompt(input, selectedLang);
  }, [input, selectedLang]);

  const handleTranslate = () => {
    if (!input.trim()) return;
    setTranslated(true);
    savePrompt(input, "Prompt Translator", "/tools/prompt-translator");
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Language selection */}
      <div>
        <label className="text-sm font-medium text-slate-300 mb-3 block flex items-center gap-2">
          <Globe className="w-4 h-4 text-amber-400" /> Translate to
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => { setSelectedLang(lang.id); setTranslated(false); }}
              className={`px-4 py-3 rounded-xl text-sm font-medium text-center transition-all border ${
                selectedLang === lang.id
                  ? "bg-amber-500/15 border-amber-400/30 text-amber-300"
                  : "bg-slate-900/60 border-slate-700/50 text-slate-400 hover:border-slate-600"
              }`}
            >
              <span className="block text-xs text-slate-500">{lang.name}</span>
              <span className="block text-sm font-semibold mt-0.5">{nativeName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">English Prompt</label>
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setTranslated(false); }}
          placeholder="Paste your English prompt here..."
          rows={5}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20 resize-none"
        />
      </div>

      {/* Translate button */}
      <div className="text-center">
        <button
          onClick={handleTranslate}
          disabled={!input.trim()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-sm font-semibold text-white shadow-lg shadow-amber-500/30 hover:shadow-xl transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Languages className="w-4 h-4" /> Translate to {langName}
        </button>
      </div>

      {/* Output */}
      {translated && output && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Flow arrow */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center">
              <div className="w-px h-4 bg-gradient-to-b from-amber-400/40 to-rose-400/40" />
              <ArrowRight className="w-4 h-4 text-amber-400/60" />
            </div>
          </div>

          <div className="rounded-[20px] border border-emerald-400/20 bg-emerald-500/5 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-emerald-300 flex items-center gap-2">
                <Globe className="w-4 h-4" /> {langName} ({nativeName})
              </h3>
              <button
                onClick={copyOutput}
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="text-sm text-slate-200 font-mono whitespace-pre-wrap leading-relaxed max-h-[350px] overflow-y-auto">
              {output}
            </pre>
          </div>

          {/* Disclaimer */}
          <div className="rounded-xl border border-amber-400/20 bg-amber-500/5 p-4">
            <p className="text-xs text-amber-300/80">
              ⚠️ This is an approximate translation using a dictionary-based approach. For best results, review and adjust the output.
              Variables in [brackets] have been preserved as-is.
            </p>
          </div>
        </motion.div>
      )}

      {translated && !output && input.trim() && (
        <div className="text-center py-6">
          <p className="text-slate-400 text-sm">Translation generated — but output is empty. Check your prompt.</p>
        </div>
      )}

      {!input.trim() && (
        <div className="text-center py-8 border border-dashed border-slate-700/60 rounded-2xl bg-slate-900/30">
          <Globe className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Paste an English prompt above to translate</p>
          <p className="text-slate-600 text-xs mt-1">Supports Hindi, Spanish, French, German, Japanese, Chinese, Portuguese, Arabic</p>
        </div>
      )}
    </div>
  );
}
