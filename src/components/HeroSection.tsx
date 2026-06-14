import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
      <div className="mesh-background absolute inset-0 opacity-80" />
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-cyan-500/15 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-72 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[48px] border border-white/10 bg-slate-950/90 p-10 shadow-[0_48px_140px_-60px_rgba(15,23,42,0.8)] backdrop-blur-3xl sm:p-14"
        >
          <div className="absolute inset-0 rounded-[48px] bg-gradient-to-br from-slate-950/70 via-slate-900/50 to-slate-950/90 opacity-95" />
          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.28em] text-cyan-200">
                <Sparkles className="h-4 w-4 text-cyan-300" aria-hidden="true" />
                Command Center for AI Experts
              </span>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                The Professional&apos;s AI Prompt Command Center.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                Streamline your prompt workflows with premium prompt utilities, secure prompt mechanics, and next-gen optimizer tools built for modern AI teams.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/tools"
                  className="shimmer-button inline-flex items-center justify-center rounded-full border border-cyan-300/20 px-6 py-3 text-sm font-semibold text-white shadow-[0_15px_40px_-25px_rgba(56,189,248,0.9)] transition duration-300 hover:scale-[1.02]"
                >
                  Launch the Toolkit
                  <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/tools/advanced-prompt-optimizer"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-100 transition duration-300 hover:bg-white/10"
                >
                  Premium Optimizer
                </Link>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-slate-900/50 p-6 shadow-[0_24px_60px_-28px_rgba(99,102,241,0.45)] backdrop-blur-xl">
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Premium workflow</p>
                    <p className="mt-2 text-2xl font-semibold text-white">6 tools • Instant prompt refresh</p>
                  </div>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-white/10 text-cyan-300 ring-1 ring-cyan-300/20">
                    <Sparkles className="h-6 w-6" aria-hidden="true" />
                  </div>
                </div>
                <div className="rounded-3xl border border-cyan-400/10 bg-slate-950/60 p-4 text-sm text-slate-300">
                  <p className="font-semibold text-slate-100">Why teams choose this toolkit</p>
                  <ul className="mt-4 space-y-3 text-slate-400">
                    <li>• Glassmorphism dashboard for UI-forward prompt workflows</li>
                    <li>• Built-in token and prompt optimization controls</li>
                    <li>• Premium, production-ready AI command center</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
