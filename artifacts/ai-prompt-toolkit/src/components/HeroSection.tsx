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
  Workflow,
  Zap as ZapIcon,
  GitBranch,
  BarChart3,
  Layers,
} from "lucide-react";
import AdsterraSlot from "./AdsterraSlot";

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
    <section className="relative overflow-x-hidden px-4 py-12 sm:py-20 sm:px-6 lg:px-8 min-h-[90vh] sm:min-h-screen flex items-center">
      {/* Background Image with Lazy Loading */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/prompt-toolkit-hero.jpg')",
        }}
        role="img"
        aria-label="Modern tech team workspace with city skyline"
      />

      {/* Dark Overlay for Readability - Layered Gradient */}
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/50" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/60" />

      {/* Subtle mesh overlay for premium feel */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: "radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
      }} />
      <div className="absolute inset-0 opacity-15" style={{
        backgroundImage: "radial-gradient(circle at 80% 50%, rgba(34, 211, 238, 0.1) 0%, transparent 50%)",
      }} />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8 sm:space-y-12"
        >
          {/* Main Hero Content */}
          <div className="grid gap-6 lg:gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            {/* Left: Value Proposition & CTAs */}
            <div className="space-y-4 sm:space-y-6">
              {/* Eyebrow Badge */}
              <motion.div variants={itemVariants} className="flex items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/50 bg-emerald-500/20 backdrop-blur px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-200">
                  <Zap className="h-3 w-3" aria-hidden="true" />
                  Trusted by AI Teams Worldwide
                </span>
              </motion.div>

              {/* Main Headline - Premium Glassmorphic Style */}
              <motion.div variants={itemVariants} className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-7xl drop-shadow-lg">
                  Build Reliable AI Prompts,
                  <span className="block bg-gradient-to-r from-cyan-300 via-indigo-300 to-violet-300 bg-clip-text text-transparent drop-shadow-2xl">
                    Faster & Smarter
                  </span>
                </h1>
              </motion.div>

              {/* Subheadline: What + Who + Why (3-Second Brief) */}
              <motion.p
                variants={itemVariants}
                className="max-w-xl text-lg leading-8 text-slate-100 drop-shadow"
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
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-300 mt-0.5 drop-shadow" aria-hidden="true" />
                    <span className="text-sm text-slate-100 drop-shadow">{benefit}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Section - Secondary only */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap gap-4 pt-2"
              >
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

              {/* Ad slot — below stats, responsive for mobile & desktop */}
              <motion.div variants={itemVariants} style={{ width: "100%" }}>
                <AdsterraSlot variant="A" layout="auto" />
              </motion.div>
            </div>

            {/* Right: Interactive Hero Showcase — hidden on mobile to avoid overflow & long scroll */}
            <div className="hidden lg:block">
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
          </div>

          {/* PREMIUM FEATURE SHOWCASE - 5 Blocks */}
          <motion.div
            variants={itemVariants}
            className="space-y-4"
          >
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Powerful Features for AI Teams</h2>
              <p className="mt-2 text-sm sm:text-base text-slate-400">Everything you need to build, validate, and deploy AI prompts at scale</p>
            </div>

            {/* 5 Feature Blocks Grid */}
            <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 pt-4">
              {/* Feature 1: Prompt Engineering */}
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="group relative rounded-[16px] border border-slate-800/60 bg-gradient-to-br from-slate-900/80 via-slate-950/60 to-slate-950/80 p-5 transition duration-300 hover:border-cyan-500/40 hover:bg-slate-900/90 overflow-hidden"
              >
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-indigo-500/0 group-hover:from-cyan-500/5 group-hover:to-indigo-500/5 transition duration-300" />

                <div className="relative space-y-3">
                  {/* Icon Container */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-400/30 group-hover:from-cyan-500/30 group-hover:to-cyan-600/20 transition">
                    <WandSparkles className="h-6 w-6 text-cyan-300" aria-hidden="true" />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition">
                      Prompt Engineering
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                      Format, clean, and optimize prompts for better AI results.
                    </p>
                  </div>

                  {/* Visual Element: Mini Prompt Preview */}
                  <div className="mt-3 rounded-[8px] border border-cyan-500/20 bg-cyan-500/5 p-2">
                    <p className="text-[10px] font-mono text-cyan-200 leading-relaxed">
                      Role: {'{expert}'}
                      <br/>
                      Task: {'{task}'}
                    </p>
                  </div>

                  {/* Hover Indicator */}
                  <div className="flex items-center gap-1 text-xs text-cyan-400 opacity-0 group-hover:opacity-100 transition">
                    <span>Explore</span>
                    <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  </div>
                </div>
              </motion.div>

              {/* Feature 2: AI Automation */}
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="group relative rounded-[16px] border border-slate-800/60 bg-gradient-to-br from-slate-900/80 via-slate-950/60 to-slate-950/80 p-5 transition duration-300 hover:border-indigo-500/40 hover:bg-slate-900/90 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-violet-500/0 group-hover:from-indigo-500/5 group-hover:to-violet-500/5 transition duration-300" />

                <div className="relative space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 border border-indigo-400/30 group-hover:from-indigo-500/30 group-hover:to-indigo-600/20 transition">
                    <Workflow className="h-6 w-6 text-indigo-300" aria-hidden="true" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition">
                      AI Automation
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                      Automate prompt workflows and validate outputs at scale.
                    </p>
                  </div>

                  {/* Visual Element: Workflow Flow */}
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                      <span className="text-slate-500">Input</span>
                      <div className="flex-1 h-px bg-indigo-500/30" />
                      <span className="text-slate-500">Process</span>
                      <div className="flex-1 h-px bg-indigo-500/30" />
                      <span className="text-slate-500">Output</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-indigo-400 opacity-0 group-hover:opacity-100 transition">
                    <span>Explore</span>
                    <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  </div>
                </div>
              </motion.div>

              {/* Feature 3: JSON Schema Tools */}
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="group relative rounded-[16px] border border-slate-800/60 bg-gradient-to-br from-slate-900/80 via-slate-950/60 to-slate-950/80 p-5 transition duration-300 hover:border-violet-500/40 hover:bg-slate-900/90 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 to-purple-500/0 group-hover:from-violet-500/5 group-hover:to-purple-500/5 transition duration-300" />

                <div className="relative space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-gradient-to-br from-violet-500/20 to-violet-600/10 border border-violet-400/30 group-hover:from-violet-500/30 group-hover:to-violet-600/20 transition">
                    <FileJson2 className="h-6 w-6 text-violet-300" aria-hidden="true" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-violet-300 transition">
                      JSON Schema Tools
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                      Generate and validate structured AI output instantly.
                    </p>
                  </div>

                  {/* Visual Element: JSON Structure */}
                  <div className="mt-3 rounded-[8px] border border-violet-500/20 bg-violet-500/5 p-2">
                    <p className="text-[10px] font-mono text-violet-200">
                      {'{'}
                      <br/>
                      &nbsp;&nbsp;"data": [...],
                      <br/>
                      &nbsp;&nbsp;"valid": true
                      <br/>
                      {'}'}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-violet-400 opacity-0 group-hover:opacity-100 transition">
                    <span>Explore</span>
                    <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  </div>
                </div>
              </motion.div>

              {/* Feature 4: Prompt Optimization */}
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="group relative rounded-[16px] border border-slate-800/60 bg-gradient-to-br from-slate-900/80 via-slate-950/60 to-slate-950/80 p-5 transition duration-300 hover:border-fuchsia-500/40 hover:bg-slate-900/90 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/0 to-pink-500/0 group-hover:from-fuchsia-500/5 group-hover:to-pink-500/5 transition duration-300" />

                <div className="relative space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-gradient-to-br from-fuchsia-500/20 to-fuchsia-600/10 border border-fuchsia-400/30 group-hover:from-fuchsia-500/30 group-hover:to-fuchsia-600/20 transition">
                    <Sparkles className="h-6 w-6 text-fuchsia-300" aria-hidden="true" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-fuchsia-300 transition">
                      Prompt Optimization
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                      Reduce tokens, improve clarity, and polish for production.
                    </p>
                  </div>

                  {/* Visual Element: Token Savings */}
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500">Original</span>
                      <span className="font-mono text-fuchsia-400">245 tokens</span>
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full w-3/5 bg-gradient-to-r from-fuchsia-500 to-fuchsia-600" />
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500">Optimized</span>
                      <span className="font-mono text-emerald-400">142 tokens</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-fuchsia-400 opacity-0 group-hover:opacity-100 transition">
                    <span>Explore</span>
                    <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  </div>
                </div>
              </motion.div>

              {/* Feature 5: LLM Workflows */}
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="group relative rounded-[16px] border border-slate-800/60 bg-gradient-to-br from-slate-900/80 via-slate-950/60 to-slate-950/80 p-5 transition duration-300 hover:border-emerald-500/40 hover:bg-slate-900/90 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition duration-300" />

                <div className="relative space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-400/30 group-hover:from-emerald-500/30 group-hover:to-emerald-600/20 transition">
                    <Layers className="h-6 w-6 text-emerald-300" aria-hidden="true" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition">
                      LLM Workflows
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                      Build production-ready AI workflows with validation gates.
                    </p>
                  </div>

                  {/* Visual Element: Validation Steps */}
                  <div className="mt-3 space-y-1">
                    {['Design', 'Validate', 'Deploy'].map((step, idx) => (
                      <div key={step} className="flex items-center gap-2 text-[10px]">
                        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[8px] font-bold">
                          ✓
                        </div>
                        <span className="text-slate-400">{step}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 text-xs text-emerald-400 opacity-0 group-hover:opacity-100 transition">
                    <span>Explore</span>
                    <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
