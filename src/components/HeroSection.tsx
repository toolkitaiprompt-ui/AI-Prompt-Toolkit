import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Sparkles,
  FileJson2,
  Braces,
  WandSparkles,
  ShieldCheck,
  Sigma,
  Code2,
  CheckCircle2,
  Zap,
} from "lucide-react";

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const floatingVariants = {
    float: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
      {/* Background Effects */}
      <div className="mesh-background absolute inset-0 opacity-80" />
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-cyan-500/15 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-96 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="absolute inset-y-0 left-20 w-96 rounded-full bg-indigo-500/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          {/* Main Hero Content */}
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            {/* Left: Value Proposition & CTAs */}
            <div className="space-y-6">
              {/* Eyebrow Badge */}
              <motion.div variants={itemVariants} className="flex items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300">
                  <Zap className="h-3 w-3" aria-hidden="true" />
                  Trusted by AI Teams Worldwide
                </span>
              </motion.div>

              {/* Main Headline - Clear Value Prop */}
              <motion.div variants={itemVariants} className="space-y-3">
                <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-6xl">
                  Build Reliable AI Prompts,
                  <span className="block bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                    Faster & Smarter
                  </span>
                </h1>
              </motion.div>

              {/* Subheadline: What + Who + Why (3-Second Brief) */}
              <motion.p
                variants={itemVariants}
                className="max-w-xl text-lg leading-8 text-slate-300"
              >
                Professional AI prompt engineering tools built for teams. Format prompts, validate JSON output, estimate costs, extract variables — all
                in one premium platform.
              </motion.p>

              {/* Key Benefits - Quick Scan */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-3"
              >
                {[
                  "In-browser processing — no data sent to servers",
                  "Instant tool results — format, validate, optimize",
                  "Enterprise-ready workflows — scale across teams",
                ].map((benefit) => (
                  <motion.div
                    key={benefit}
                    variants={itemVariants}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-400 mt-0.5" aria-hidden="true" />
                    <span className="text-sm text-slate-300">{benefit}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Section - Primary + Secondary */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap gap-4 pt-2"
              >
                {/* Primary CTA: High Visual Emphasis */}
                <Link
                  to="/tools"
                  className="group inline-flex items-center justify-center gap-2 rounded-full border border-cyan-300/40 bg-gradient-to-r from-cyan-500 to-indigo-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition duration-300 hover:shadow-xl hover:shadow-cyan-500/50 hover:scale-105"
                >
                  Explore All Tools
                  <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
                </Link>

                {/* Secondary CTA: Lower Visual Weight */}
                <Link
                  to="/blog"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-4 text-sm font-semibold text-slate-100 transition duration-300 hover:bg-white/10 hover:border-white/25 backdrop-blur"
                >
                  Read Guides
                  <Code2 className="h-4 w-4" aria-hidden="true" />
                </Link>
              </motion.div>

              {/* Platform Stats - Social Proof */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap gap-8 pt-4"
              >
                <div>
                  <p className="text-xl font-bold text-white">7</p>
                  <p className="text-xs text-slate-400 font-medium">Pro Tools</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-white">25+</p>
                  <p className="text-xs text-slate-400 font-medium">Blog Guides</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-white">100%</p>
                  <p className="text-xs text-slate-400 font-medium">Secure</p>
                </div>
              </motion.div>
            </div>

            {/* Right: Interactive Hero Showcase */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {/* Hero Preview Card Stack */}
              <motion.div
                animate="float"
                transition={{ duration: 5, ease: "easeInOut" }}
                className="relative"
              >
                {/* Main Tool Showcase */}
                <div className="relative rounded-[24px] border border-white/15 bg-gradient-to-br from-slate-900/90 via-slate-950/70 to-slate-950/95 p-5 shadow-2xl shadow-indigo-500/20 backdrop-blur-xl">
                  <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-cyan-400/5 via-indigo-500/5 to-violet-500/5 blur-2xl opacity-60" />

                  <div className="relative space-y-4">
                    {/* Header: Tool Type */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/30 to-indigo-500/20 border border-cyan-400/30">
                          <WandSparkles className="h-5 w-5 text-cyan-300" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-cyan-200">Prompt Optimizer</p>
                          <p className="text-[10px] text-slate-500">Before & After</p>
                        </div>
                      </div>
                      <Sparkles className="h-4 w-4 text-violet-400" aria-hidden="true" />
                    </div>

                    {/* Before/After Comparison */}
                    <div className="grid gap-2">
                      {/* Before */}
                      <div className="rounded-[12px] border border-red-500/25 bg-red-500/8 p-3">
                        <p className="text-[10px] font-semibold text-red-300 mb-1.5">BEFORE</p>
                        <p className="text-xs leading-relaxed text-slate-400 font-mono">
                          write a summary about risks in a smart way with bullet points
                        </p>
                      </div>

                      {/* After */}
                      <div className="rounded-[12px] border border-emerald-500/25 bg-emerald-500/8 p-3">
                        <p className="text-[10px] font-semibold text-emerald-300 mb-1.5">AFTER</p>
                        <p className="text-xs leading-relaxed text-slate-300 font-mono">
                          Role: Expert analyst<br/>
                          Task: Summarize quarterly risks<br/>
                          Format: Numbered bullets
                        </p>
                      </div>
                    </div>

                    {/* Result Metrics */}
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <div className="rounded-[10px] border border-blue-500/25 bg-blue-500/8 p-2">
                        <Sigma className="h-3.5 w-3.5 text-blue-400 mb-0.5" aria-hidden="true" />
                        <p className="text-[9px] font-bold text-blue-200">142</p>
                        <p className="text-[8px] text-slate-500">tokens</p>
                      </div>
                      <div className="rounded-[10px] border border-indigo-500/25 bg-indigo-500/8 p-2">
                        <FileJson2 className="h-3.5 w-3.5 text-indigo-400 mb-0.5" aria-hidden="true" />
                        <p className="text-[9px] font-bold text-indigo-200">Valid</p>
                        <p className="text-[8px] text-slate-500">JSON</p>
                      </div>
                      <div className="rounded-[10px] border border-emerald-500/25 bg-emerald-500/8 p-2">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 mb-0.5" aria-hidden="true" />
                        <p className="text-[9px] font-bold text-emerald-200">100%</p>
                        <p className="text-[8px] text-slate-500">clean</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Tool Cards - Creates Visual Interest */}
                <div className="absolute -bottom-6 -right-6 h-20 w-20 rounded-[14px] border border-indigo-500/40 bg-gradient-to-br from-indigo-500/15 to-indigo-600/8 p-3 shadow-lg backdrop-blur-sm transform hover:scale-105 transition">
                  <FileJson2 className="h-5 w-5 text-indigo-300 mb-1" aria-hidden="true" />
                  <p className="text-[9px] font-bold text-indigo-200">Schema</p>
                  <p className="text-[8px] text-slate-500">Generator</p>
                </div>

                <div className="absolute -top-6 -right-12 h-20 w-20 rounded-[14px] border border-cyan-500/40 bg-gradient-to-br from-cyan-500/15 to-cyan-600/8 p-3 shadow-lg backdrop-blur-sm transform hover:scale-105 transition">
                  <Braces className="h-5 w-5 text-cyan-300 mb-1" aria-hidden="true" />
                  <p className="text-[9px] font-bold text-cyan-200">Variable</p>
                  <p className="text-[8px] text-slate-500">Extractor</p>
                </div>
              </motion.div>

              {/* Trust Badge */}
              <motion.div
                variants={itemVariants}
                className="rounded-[12px] border border-slate-700/50 bg-slate-900/50 px-4 py-3 text-center"
              >
                <p className="text-[11px] text-slate-400">
                  ✓ <span className="text-emerald-400 font-semibold">In-browser processing</span> — your data stays private
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom: Feature Highlights with Icons */}
          <motion.div
            variants={itemVariants}
            className="rounded-[20px] border border-slate-800/60 bg-gradient-to-r from-slate-900/40 via-slate-950/50 to-slate-900/40 p-6 backdrop-blur-sm sm:p-8"
          >
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: WandSparkles,
                  label: "Prompt Formatter",
                  desc: "Clean messy prompts instantly",
                },
                {
                  icon: FileJson2,
                  label: "JSON Schema Gen",
                  desc: "Enforce output structure",
                },
                {
                  icon: ShieldCheck,
                  label: "JSON Validator",
                  desc: "Validate AI responses",
                },
                {
                  icon: Sigma,
                  label: "Token Estimator",
                  desc: "Predict API costs",
                },
              ].map((feature) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.label}
                    variants={itemVariants}
                    className="flex gap-3 rounded-[12px] border border-slate-700/30 bg-slate-900/50 p-4 transition hover:border-slate-600/50 hover:bg-slate-800/50"
                  >
                    <Icon className="h-5 w-5 flex-shrink-0 text-cyan-400 mt-1" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-semibold text-white">{feature.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{feature.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
