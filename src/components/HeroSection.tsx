import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles, FileJson2, Braces, WandSparkles, ShieldCheck, Sigma, Code2 } from "lucide-react";

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const floatingVariants = {
    float: {
      y: [0, -12, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const pulseVariants = {
    pulse: {
      boxShadow: [
        "0 0 0 0 rgba(34, 197, 94, 0.7)",
        "0 0 0 10px rgba(34, 197, 94, 0)",
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
      },
    },
  };

  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
      <div className="mesh-background absolute inset-0 opacity-80" />
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-cyan-500/15 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-72 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="absolute inset-y-0 left-0 w-96 rounded-full bg-indigo-500/5 blur-3xl" />
      
      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[48px] border border-white/10 bg-slate-950/90 p-8 shadow-[0_48px_140px_-60px_rgba(15,23,42,0.8)] backdrop-blur-3xl sm:p-12"
        >
          <div className="absolute inset-0 rounded-[48px] bg-gradient-to-br from-slate-950/70 via-slate-900/50 to-slate-950/90 opacity-95" />
          
          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.95fr] lg:items-center">
            {/* Left Content */}
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
                  className="shimmer-button inline-flex items-center justify-center rounded-full border border-cyan-300/20 px-6 py-3 text-sm font-semibold text-white shadow-[0_15px_40px_-25px_rgba(34,211,238,0.5)] transition hover:shadow-[0_20px_50px_-20px_rgba(34,211,238,0.7)]"
                >
                  Launch the Toolkit
                  <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/tools/advanced-prompt-optimizer"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-100 transition duration-300 hover:bg-white/10 hover:border-white/20"
                >
                  Premium Optimizer
                </Link>
              </div>
            </div>

            {/* Right - Interactive Tool Preview & Workflow Cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="relative space-y-3"
            >
              {/* Main Tool Preview Card */}
              <motion.div
                variants={itemVariants}
                animate="float"
                transition={{ duration: 5, ease: "easeInOut" }}
                className="relative rounded-[24px] border border-white/15 bg-gradient-to-br from-slate-900/80 via-slate-950/60 to-slate-950/90 p-4 shadow-[0_30px_90px_-50px_rgba(99,102,241,0.65)] backdrop-blur-xl"
              >
                <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-cyan-400/5 via-indigo-500/5 to-violet-500/5 blur-2xl opacity-60" />
                <div className="relative space-y-3">
                  {/* Before/After Prompt Example */}
                  <div className="grid gap-2 sm:grid-cols-2">
                    {/* Before */}
                    <div className="rounded-[16px] border border-red-500/20 bg-red-500/5 p-3">
                      <p className="text-xs font-semibold text-red-300 mb-2">BEFORE</p>
                      <p className="text-xs leading-relaxed text-slate-400 font-mono">
                        write a thing about risk. make it smart. bullet points ok
                      </p>
                    </div>
                    {/* After */}
                    <div className="rounded-[16px] border border-green-500/20 bg-green-500/5 p-3">
                      <p className="text-xs font-semibold text-green-300 mb-2">AFTER</p>
                      <p className="text-xs leading-relaxed text-slate-300 font-mono">
                        1. Role: Expert analyst<br/>
                        2. Task: Summarize risks<br/>
                        3. Format: Bullets
                      </p>
                    </div>
                  </div>
                  
                  {/* Token & Schema Stats */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-[12px] border border-blue-500/20 bg-blue-500/5 p-2">
                      <Sigma className="h-3 w-3 text-blue-400 mb-1" aria-hidden="true" />
                      <p className="text-xs text-blue-200 font-semibold">142</p>
                      <p className="text-[10px] text-slate-400">tokens</p>
                    </div>
                    <div className="rounded-[12px] border border-indigo-500/20 bg-indigo-500/5 p-2">
                      <FileJson2 className="h-3 w-3 text-indigo-400 mb-1" aria-hidden="true" />
                      <p className="text-xs text-indigo-200 font-semibold">Valid</p>
                      <p className="text-[10px] text-slate-400">schema</p>
                    </div>
                    <div className="rounded-[12px] border border-emerald-500/20 bg-emerald-500/5 p-2">
                      <ShieldCheck className="h-3 w-3 text-emerald-400 mb-1" aria-hidden="true" />
                      <p className="text-xs text-emerald-200 font-semibold">100%</p>
                      <p className="text-[10px] text-slate-400">clean</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Tool Icons - Workflow Cards */}
              <div className="relative h-20 perspective">
                {/* Tool 1 - JSON Schema */}
                <motion.div
                  animate="float"
                  transition={{ duration: 3.5, ease: "easeInOut", delay: 0.2 }}
                  className="absolute top-0 left-0 w-20 h-16 rounded-[16px] border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 p-2 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition"
                >
                  <FileJson2 className="h-5 w-5 text-indigo-300 mb-1" aria-hidden="true" />
                  <span className="text-[10px] font-semibold text-indigo-200 text-center">JSON Schema</span>
                </motion.div>

                {/* Tool 2 - Variable Extractor */}
                <motion.div
                  animate="float"
                  transition={{ duration: 4, ease: "easeInOut", delay: 0.4 }}
                  className="absolute top-2 left-24 w-20 h-16 rounded-[16px] border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 p-2 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition"
                >
                  <Braces className="h-5 w-5 text-cyan-300 mb-1" aria-hidden="true" />
                  <span className="text-[10px] font-semibold text-cyan-200 text-center">Variables</span>
                </motion.div>

                {/* Tool 3 - Formatter */}
                <motion.div
                  animate="float"
                  transition={{ duration: 3.8, ease: "easeInOut", delay: 0.6 }}
                  className="absolute top-4 right-0 w-20 h-16 rounded-[16px] border border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-500/10 to-fuchsia-600/5 p-2 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition"
                >
                  <WandSparkles className="h-5 w-5 text-fuchsia-300 mb-1" aria-hidden="true" />
                  <span className="text-[10px] font-semibold text-fuchsia-200 text-center">Formatter</span>
                </motion.div>
              </div>

              {/* Active Status Indicator */}
              <motion.div
                variants={pulseVariants}
                animate="pulse"
                className="relative rounded-full h-3 w-3 bg-emerald-400 mx-auto"
              >
                <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-30 animate-ping" />
              </motion.div>

              {/* Workflow Status */}
              <motion.div
                variants={itemVariants}
                className="rounded-[12px] border border-slate-700/50 bg-slate-900/50 px-3 py-2 text-center"
              >
                <p className="text-[11px] text-slate-400">
                  <span className="text-emerald-400 font-semibold">Live</span> workflow processing
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom Feature Strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 pt-8 border-t border-white/5"
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-start gap-3">
                <Code2 className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-white">6 Pro Tools</p>
                  <p className="text-xs text-slate-400">Token, JSON, Schema & More</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-white">AI Optimizer</p>
                  <p className="text-xs text-slate-400">Premium Polish & Copyflow</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-white">100% Secure</p>
                  <p className="text-xs text-slate-400">In-Browser Processing Only</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
