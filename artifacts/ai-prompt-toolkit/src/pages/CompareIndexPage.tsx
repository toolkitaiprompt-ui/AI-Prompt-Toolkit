import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { COMPARISONS } from "../data/comparisons";

export default function CompareIndexPage() {
  return (
    <section className="site-container section-lg">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-400 mb-2">✦ Comparisons</p>
        <h1 className="font-headline font-bold text-4xl sm:text-5xl text-white mb-4">AI Model Comparisons</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Compare leading AI models side by side. Features, pricing, strengths, and example prompts to help you choose the right model for your needs.
        </p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {COMPARISONS.map((cmp, idx) => (
          <Link key={cmp.slug} to={`/compare/${cmp.slug}`} className="block group">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="relative rounded-[20px] border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-400 hover:border-white/[0.15] hover:bg-white/[0.04] hover:shadow-lg hover:shadow-amber-500/5"
            >
              <h3 className="font-headline font-bold text-white text-lg mb-2">{cmp.modelA} vs {cmp.modelB}</h3>
              <p className="text-sm text-slate-400 mb-4 line-clamp-2">{cmp.description}</p>
              <div className="flex items-center gap-1.5 text-xs font-medium text-amber-400/80 group-hover:text-amber-300 transition-colors">
                <span>View Comparison</span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}
