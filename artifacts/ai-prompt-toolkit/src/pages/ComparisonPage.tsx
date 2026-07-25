import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Copy, Check, ChevronDown } from "lucide-react";
import { COMPARISONS } from "../data/comparisons";

export default function ComparisonPage() {
  const { slug } = useParams<{ slug: string }>();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [copied, setCopied] = useState<string>("");

  const cmp = COMPARISONS.find((c) => c.slug === slug);

  const copyText = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(""), 2000);
  };

  if (!cmp) {
    return (
      <section className="site-container section-lg">
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🔍</p>
          <h1 className="text-3xl font-bold text-white mb-4">Comparison Not Found</h1>
          <Link to="/compare" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500/10 border border-amber-400/30 rounded-full text-amber-300 hover:bg-amber-500/20 transition">← All Comparisons</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="site-container section-lg">
      <Link to="/compare" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-amber-300 transition mb-6"><ArrowLeft className="w-4 h-4" /> All Comparisons</Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-headline font-bold text-3xl sm:text-4xl text-white mb-3">{cmp.modelA} vs {cmp.modelB} — Prompting Comparison</h1>
        <p className="text-slate-400 max-w-3xl leading-relaxed mb-10">{cmp.description}</p>

        {/* Features Table */}
        <div className="rounded-[20px] border border-white/10 bg-slate-900/50 p-5 mb-8 overflow-x-auto">
          <h2 className="text-lg font-semibold text-white mb-4">Features Comparison</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50 text-xs text-slate-500 uppercase tracking-wider">
                <th className="text-left py-3 pr-4">Feature</th>
                <th className="text-left py-3 px-4 text-amber-400">{cmp.modelA}</th>
                <th className="text-left py-3 pl-4 text-cyan-400">{cmp.modelB}</th>
              </tr>
            </thead>
            <tbody>
              {cmp.features.map((f, i) => (
                <tr key={i} className="border-b border-slate-800/50">
                  <td className="py-3 pr-4 text-slate-300 font-medium">{f.name}</td>
                  <td className="py-3 px-4 text-slate-400">{f.a}</td>
                  <td className="py-3 pl-4 text-slate-400">{f.b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pricing Table */}
        <div className="rounded-[20px] border border-white/10 bg-slate-900/50 p-5 mb-8 overflow-x-auto">
          <h2 className="text-lg font-semibold text-white mb-4">Pricing Comparison</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50 text-xs text-slate-500 uppercase tracking-wider">
                <th className="text-left py-3 pr-4"></th>
                <th className="text-left py-3 px-4 text-amber-400">{cmp.modelA}</th>
                <th className="text-left py-3 pl-4 text-cyan-400">{cmp.modelB}</th>
              </tr>
            </thead>
            <tbody>
              {cmp.pricing.map((p, i) => (
                <tr key={i} className="border-b border-slate-800/50">
                  <td className="py-3 pr-4 text-slate-300 font-medium">{p.name}</td>
                  <td className="py-3 px-4 text-slate-400">{p.a}</td>
                  <td className="py-3 pl-4 text-slate-400">{p.b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Strengths */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <div className="rounded-[20px] border border-amber-400/20 bg-amber-500/5 p-5">
            <h3 className="text-sm font-bold text-amber-400 mb-3">{cmp.modelA} Strengths</h3>
            <ul className="space-y-2">
              {cmp.strengthsA.map((s, i) => <li key={i} className="text-sm text-slate-300 flex items-start gap-2"><span className="text-amber-400 mt-0.5">✓</span>{s}</li>)}
            </ul>
            <h4 className="text-xs font-semibold text-amber-400/80 mt-4 mb-2">Best for:</h4>
            <ul className="space-y-1">
              {cmp.bestForA.map((b, i) => <li key={i} className="text-xs text-slate-400 flex items-start gap-2"><span className="text-amber-400/60">→</span>{b}</li>)}
            </ul>
          </div>
          <div className="rounded-[20px] border border-cyan-400/20 bg-cyan-500/5 p-5">
            <h3 className="text-sm font-bold text-cyan-400 mb-3">{cmp.modelB} Strengths</h3>
            <ul className="space-y-2">
              {cmp.strengthsB.map((s, i) => <li key={i} className="text-sm text-slate-300 flex items-start gap-2"><span className="text-cyan-400 mt-0.5">✓</span>{s}</li>)}
            </ul>
            <h4 className="text-xs font-semibold text-cyan-400/80 mt-4 mb-2">Best for:</h4>
            <ul className="space-y-1">
              {cmp.bestForB.map((b, i) => <li key={i} className="text-xs text-slate-400 flex items-start gap-2"><span className="text-cyan-400/60">→</span>{b}</li>)}
            </ul>
          </div>
        </div>

        {/* Example Prompts */}
        <h2 className="text-lg font-semibold text-white mb-4">Same Prompt, Different Results</h2>
        <div className="space-y-6 mb-8">
          {cmp.examples.map((ex, i) => (
            <div key={i} className="rounded-[20px] border border-white/10 bg-slate-950/80 p-5">
              <div className="bg-slate-900/80 rounded-xl p-4 mb-4">
                <p className="text-xs font-semibold text-slate-500 mb-1">Prompt {i + 1}</p>
                <p className="text-sm text-white font-mono whitespace-pre-wrap">{ex.prompt}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-amber-400/20 bg-amber-500/5 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-amber-400">{cmp.modelA}</p>
                    <button onClick={() => copyText(`a${i}`, ex.responseA)} className="text-xs text-amber-400 hover:text-amber-300 transition flex items-center gap-1">
                      {copied === `a${i}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}{copied === `a${i}` ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto">{ex.responseA}</pre>
                </div>
                <div className="rounded-xl border border-cyan-400/20 bg-cyan-500/5 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-cyan-400">{cmp.modelB}</p>
                    <button onClick={() => copyText(`b${i}`, ex.responseB)} className="text-xs text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1">
                      {copied === `b${i}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}{copied === `b${i}` ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto">{ex.responseB}</pre>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Verdict */}
        <div className="rounded-[20px] border border-emerald-400/20 bg-emerald-500/5 p-6 mb-8">
          <h2 className="text-lg font-semibold text-emerald-300 mb-3">🏆 Verdict</h2>
          <p className="text-sm text-slate-200 leading-relaxed">{cmp.verdict}</p>
        </div>

        {/* Prompt Converter CTA */}
        <div className="rounded-[20px] border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6 text-center mb-8">
          <h3 className="text-base font-semibold text-white mb-2">Need to Convert Prompts Between Models?</h3>
          <p className="text-sm text-slate-400 mb-4">Use the Prompt Converter tool to adapt your prompts for ChatGPT, Claude, Gemini, and more.</p>
          <Link to="/tools/prompt-converter" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition">Try Prompt Converter →</Link>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl">
          <h2 className="text-lg font-semibold text-white mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {cmp.faq.map((item, i) => (
              <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/5 transition">
                  <span className="text-sm font-medium text-white pr-8">{item.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && <div className="px-5 pb-4 text-sm text-slate-400 leading-relaxed">{item.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
