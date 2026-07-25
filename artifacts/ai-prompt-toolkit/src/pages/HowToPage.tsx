import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ChevronDown, Copy, Check, Sparkles } from "lucide-react";
import { HOW_TO_GUIDES } from "../data/howToGuides";

export default function HowToPage() {
  const { slug } = useParams<{ slug: string }>();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<string>("");

  const guide = HOW_TO_GUIDES.find((g) => g.slug === slug);

  const copyPrompt = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedPrompt(id);
    setTimeout(() => setCopiedPrompt(""), 2000);
  };

  if (!guide) {
    return (
      <section className="site-container section-lg">
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🔍</p>
          <h1 className="text-3xl font-bold text-white mb-4">Guide Not Found</h1>
          <Link to="/how-to" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500/10 border border-amber-400/30 rounded-full text-amber-300 hover:bg-amber-500/20 transition">← Browse All Guides</Link>
        </div>
      </section>
    );
  }

  const related = HOW_TO_GUIDES.filter((g) => g.slug !== slug).slice(0, 3);

  return (
    <section className="site-container section-lg">
      <Link to="/how-to" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-amber-300 transition mb-6"><ArrowLeft className="w-4 h-4" /> All How-To Guides</Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-headline font-bold text-3xl sm:text-4xl text-white mb-3">{guide.title}</h1>
        <p className="text-slate-400 max-w-3xl leading-relaxed mb-8">{guide.subtitle}</p>

        {/* Intro */}
        <p className="text-slate-300 leading-relaxed mb-10 max-w-3xl">{guide.intro}</p>

        {/* Steps */}
        <h2 className="text-lg font-semibold text-white mb-6">Step-by-Step Guide</h2>
        <div className="space-y-6 mb-10">
          {guide.steps.map((step, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-[20px] border border-white/[0.06] bg-white/[0.02] p-6">
              <div className="flex items-start gap-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-rose-500 text-sm font-bold text-white shrink-0 mt-0.5">{i + 1}</span>
                <div>
                  <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{step.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Example Prompts */}
        {guide.examplePrompts.length > 0 && (
          <>
            <h2 className="text-lg font-semibold text-white mb-4">Example Prompts</h2>
            <div className="grid gap-6 md:grid-cols-2 mb-10">
              {guide.examplePrompts.map((ex, i) => (
                <div key={i} className="rounded-[20px] border border-amber-400/20 bg-amber-500/5 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">{ex.label}</span>
                    <button onClick={() => copyPrompt(ex.label, ex.prompt)} className="text-xs text-amber-400 hover:text-amber-300 transition flex items-center gap-1">
                      {copiedPrompt === ex.label ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}{copiedPrompt === ex.label ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-[200px] overflow-y-auto">{ex.prompt}</pre>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Tool CTA */}
        <div className="rounded-[20px] border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6 text-center mb-10">
          <h3 className="text-base font-semibold text-white mb-2 flex items-center justify-center gap-2"><Sparkles className="w-4 h-4 text-amber-400" /> Try It With Our Tool</h3>
          <p className="text-sm text-slate-400 mb-4">Put these techniques into practice with our free AI tool.</p>
          <Link to={guide.toolLink} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition">{guide.toolText} →</Link>
        </div>

        {/* FAQ */}
        <h2 className="text-lg font-semibold text-white mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3 mb-10 max-w-3xl">
          {guide.faq.map((item, i) => (
            <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/5 transition">
                <span className="text-sm font-medium text-white pr-8">{item.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              {openFaq === i && <div className="px-5 pb-4 text-sm text-slate-400 leading-relaxed">{item.a}</div>}
            </div>
          ))}
        </div>

        {/* Related Guides */}
        <h2 className="text-lg font-semibold text-white mb-4">Related Guides</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {related.map((r) => (
            <Link key={r.slug} to={`/how-to/${r.slug}`} className="block group">
              <div className="rounded-[16px] border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-400 hover:border-white/[0.15] hover:bg-white/[0.04]">
                <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-amber-300 transition">{r.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{r.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
