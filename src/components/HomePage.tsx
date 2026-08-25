import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Play,
  Shield,
  Clock,
  Users,
  TrendingUp,
  Award,
  ChevronDown,
} from 'lucide-react';

// Import your actual data
import { ACTIVE_TOOL_COUNT } from '../data/tools';
import { PROMPT_ROLE_META } from '../lib/contentHub';
import { estimateTokens } from '../lib/toolkit';
import ToolCard from './ToolCard';
import CategoryShowcase from './CategoryShowcase';
import AdBanner from './AdBanner';
import useSeo from '../hooks/useSeo';
import { lazy, Suspense } from 'react';
// Lazy: blog data (197KB) loads after first paint — not in the critical path.
const LatestBlogStrip = lazy(() => import('./LatestBlogStrip'));


interface ToolMeta {
  title: string;
  path: string;
  description: string;
  icon: any;
  accent: string;
  premium?: boolean;
  keyBenefits?: string[];
}

interface HomePageProps {
  toolPages: ToolMeta[];
}

export default function HomePage({ toolPages }: HomePageProps) {
  useSeo();
  const [currentTool, setCurrentTool] = useState(0);
  const [prompt, setPrompt] = useState('write a summary about AI risks in business');
  const [optimized, setOptimized] = useState('');
  const demoRef = useRef<HTMLDivElement>(null);

  const scrollToDemo = () => {
    demoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const demoTools = [
    { name: 'Prompt Optimizer', icon: Sparkles, color: 'from-amber-500 to-amber-600' },
    { name: 'Token Estimator', icon: Zap, color: 'from-cyan-500 to-blue-500' },
    { name: 'JSON Validator', icon: CheckCircle2, color: 'from-green-500 to-emerald-500' },
  ];


  const stats = [
    { icon: Zap, value: String(ACTIVE_TOOL_COUNT), label: 'Free Tools', color: 'from-blue-500 to-cyan-500' },
    { icon: Shield, value: '100%', label: 'In-Browser & Private', color: 'from-yellow-500 to-orange-500' },
    { icon: Clock, value: '0', label: 'Sign-ups Required', color: 'from-amber-500 to-amber-600' },
    { icon: Award, value: 'Free', label: 'Forever', color: 'from-green-500 to-emerald-500' },
  ];

  const faqs = [
    {
      question: 'Is AI World Hub really free?',
      answer: `Yes! All ${ACTIVE_TOOL_COUNT} tools are completely free with no signup required. Every tool runs in your browser, so your prompts stay on your device. Limited website analytics and hosting logs are described in our Privacy Policy.`,
    },
    {
      question: 'How does in-browser processing work?',
      answer: 'All processing happens directly in your browser using JavaScript. Your prompts never leave your device, ensuring complete privacy and security.',
    },
    {
      question: 'Can I use this for commercial projects?',
      answer: 'Absolutely! You can use AI World Hub for any purpose - personal, commercial, or client work. No restrictions on usage.',
    },
    {
      question: 'Which AI models are supported?',
      answer: 'Our tools work with all major AI models including ChatGPT (GPT-4), Claude, Gemini, Llama, and more. The tools are model-agnostic.',
    },
  ];

  useEffect(() => {
    // Demo intentionally stays on Prompt Optimizer (the most useful tool) —
    // users can switch tabs manually. Auto-rotation was removed so first-time
    // visitors always see the Optimizer as the default demo.
    return undefined;
  }, []);


  // ─── Honest live demo: every tab computes real output in the browser ───
  const tokenStats = useMemo(() => estimateTokens(prompt), [prompt]);
  const [jsonResult, setJsonResult] = useState<{ valid: boolean; message: string } | null>(null);
  const [improvement, setImprovement] = useState<{ before: number; after: number; pct: number } | null>(null);

  const runDemo = () => {
    const name = demoTools[currentTool].name;
    setJsonResult(null);
    if (name === 'Prompt Optimizer') {
      const optimizedText = `Role: Expert AI Analyst\nTask: ${prompt}\nFormat: Structured report with executive summary\nConstraints: Max 500 words, professional tone\nOutput: Markdown with clear sections`;
      setOptimized(optimizedText);
      const before = estimateTokens(prompt).estimatedTokens;
      const after = estimateTokens(optimizedText).estimatedTokens;
      setImprovement({
        before,
        after,
        pct: before > 0 ? Math.max(0, Math.round(((before - after) / before) * 100)) : 0,
      });
    } else if (name === 'JSON Validator') {
      setOptimized('');
      setImprovement(null);
      try {
        JSON.parse(prompt);
        setJsonResult({ valid: true, message: 'Valid JSON — head to the full JSON Validator tool to check it against your schema.' });
      } catch {
        setJsonResult({ valid: false, message: 'Not valid JSON. Paste a JSON object (e.g. {"name": "Ava"}) and try again.' });
      }
    } else {
      // Token Estimator — stats update live as you type
      setOptimized('');
      setImprovement(null);
    }
  };

  const demoStatus =
    demoTools[currentTool].name === 'Token Estimator'
      ? 'Live'
      : jsonResult
        ? jsonResult.valid ? 'Valid' : 'Invalid'
        : improvement
          ? 'Optimized'
          : 'Ready';

return (
    <div className="bg-slate-950">

      {/* Hero Section */}
      <section className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with real image */}
        <div className="absolute inset-0">
          <img src="/images/hero-ai.webp" alt="" width="1600" height="900" fetchPriority="high" className="hidden md:block absolute inset-0 w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#09090f] via-transparent to-[#09090f]" />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-amber-500/20 to-amber-600/20 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 blur-3xl"
          />
        </div>

        {/* Grid Pattern */}
        <div className="hidden md:block absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative z-10 site-container section-lg">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Content — LCP critical: rendered visible (no hidden initial) so the
                H1 paints instantly from static HTML; no entrance animation on mount */}
            <motion.div
              initial={false}
              animate={{ opacity: 1, x: 0 }}
            >
              {/* Badge */}
              <motion.div
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6 max-w-full text-xs sm:text-sm"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-amber-300">100% Free · No Sign-up · Runs in Your Browser</span>
              </motion.div>

              {/* Heading */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-[1.4]">
                Free AI Prompt Tools{' '}
                <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                  &amp; Optimizer
                </span>{' '}
                <span className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl text-slate-400">in Seconds</span>
              </h1>

              {/* Conversion line */}
              <p className="text-lg sm:text-xl font-medium text-amber-200 mb-4 leading-relaxed">
                Paste any weak prompt → get a stronger version in seconds. No account needed.
              </p>

              {/* Description */}
              <p className="text-lg sm:text-xl text-slate-300 mb-8 leading-relaxed">
                {ACTIVE_TOOL_COUNT} professional tools to format, validate, optimize, and deploy AI prompts at scale.
                No signup required. 100% in-browser. Enterprise-ready.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 mb-12">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/tools/advanced-prompt-optimizer"
                    className="group px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full font-semibold text-black shadow-lg shadow-amber-500/50 flex items-center gap-2"
                  >
                    Try Prompt Optimizer Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <button onClick={scrollToDemo} className="px-8 py-4 bg-white/5 border border-white/10 rounded-full font-semibold text-white flex items-center gap-2 hover:bg-white/10 transition-colors cursor-pointer">
                    <Play className="w-5 h-5" />
                    Watch Demo
                  </button>
                </motion.div>
              </div>

              {/* Key Benefits */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm text-slate-300">{ACTIVE_TOOL_COUNT} free tools</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm text-slate-300">Prompts never leave your device</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <span className="text-sm text-slate-300">Instant results, no account</span>
                </div>
              </div>
            </motion.div>

            {/* Right: Interactive Demo — visible from first paint (LCP-safe) */}
            <motion.div
              ref={demoRef}
              initial={false}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              {/* Tool Switcher */}
              <div className="relative mx-auto md:absolute md:-top-5 md:left-1/2 md:-translate-x-1/2 flex flex-wrap justify-center gap-1.5 md:gap-2 z-20 max-w-[280px] sm:max-w-none mb-3 md:mb-0">
                {demoTools.map((tool, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTool(idx)}
                    aria-pressed={currentTool === idx}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      currentTool === idx
                        ? `bg-gradient-to-r ${tool.color} text-black shadow-lg`
                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    <tool.icon className="w-4 h-4 inline mr-2" />
                    {tool.name}
                  </button>
                ))}
              </div>

              {/* Demo Card */}
              <motion.div
                key={currentTool}
                initial={false}
                animate={{ opacity: 1, scale: 1 }}
                className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 md:p-8 shadow-2xl mt-0 md:mt-10"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${demoTools[currentTool].color} opacity-10 blur-2xl rounded-2xl`} />

                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${demoTools[currentTool].color} flex items-center justify-center`}>
                        {(() => {
                          const Icon = demoTools[currentTool].icon;
                          return <Icon className="w-6 h-6 text-white" />;
                        })()}
                      </div>
                      <div>
                        <h3 className="text-base md:text-lg font-semibold text-white">{demoTools[currentTool].name}</h3>
                        <p className="text-sm text-slate-400">Live Demo</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full animate-pulse ${demoStatus === 'Invalid' ? 'bg-red-400' : 'bg-green-400'}`} />
                      <span className="text-xs text-slate-400">{demoStatus}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {demoTools[currentTool].name === 'JSON Validator' ? 'JSON Input' : 'Your Prompt'}
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
                      rows={3}
                      placeholder={demoTools[currentTool].name === 'JSON Validator' ? 'Paste a JSON object, e.g. {"name": "Ava"}' : 'Enter your prompt...'}
                    />
                  </div>

                  {demoTools[currentTool].name !== 'Token Estimator' && (
                    <button
                      onClick={runDemo}
                      className={`w-full py-3 bg-gradient-to-r ${demoTools[currentTool].color} rounded-lg font-semibold text-black mb-4 hover:shadow-lg transition-shadow`}
                    >
                      {demoTools[currentTool].name === 'JSON Validator' ? 'Validate JSON' : 'Optimize Prompt'}
                    </button>
                  )}

                  {/* ── Optimizer result (real token improvement) ──
                       Always-rendered with reserved min-height: content swaps in
                       place, so the demo can NEVER cause layout shift (CLS). */}
                  <div className="min-h-[150px]">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Optimized Result</label>
                    {optimized ? (
                      <div className="px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <pre className="text-sm text-green-300 whitespace-pre-wrap font-mono">{optimized}</pre>
                      </div>
                    ) : (
                      <div className="px-4 py-3 rounded-lg border border-dashed border-slate-700/60 text-sm text-slate-600">
                        Paste a weak prompt above — the optimized version appears here…
                      </div>
                    )}
                    {improvement && (
                      <div className="mt-3 flex items-center justify-between gap-2 text-sm flex-wrap">
                        <span className="text-slate-400">
                          Tokens: <span className="text-slate-300 font-semibold">{improvement.before}</span>
                          <span className="text-slate-500"> → </span>
                          <span className="text-white font-semibold">{improvement.after}</span>
                        </span>
                        <span className="text-slate-400">
                          Reduction: <span className="text-green-400 font-semibold">{improvement.pct}%</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* ── Token Estimator: real live stats ── */}
                  {demoTools[currentTool].name === 'Token Estimator' && (
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Characters', value: tokenStats.characters.toLocaleString() },
                        { label: 'Words', value: tokenStats.words.toLocaleString() },
                        { label: 'Tokens', value: tokenStats.estimatedTokens.toLocaleString() },
                      ].map((s) => (
                        <div key={s.label} className="rounded-lg bg-slate-800/40 border border-white/10 px-3 py-2.5 text-center">
                          <p className="text-xs text-slate-400">{s.label}</p>
                          <p className="text-base font-bold text-white">{s.value}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ── JSON Validator: real parse result ── */}
                  {demoTools[currentTool].name === 'JSON Validator' && jsonResult && (
                    <div className={`px-4 py-3 rounded-lg border text-sm ${jsonResult.valid ? 'bg-green-500/10 border-green-500/20 text-green-300' : 'bg-red-500/10 border-red-500/20 text-red-300'}`}>
                      {jsonResult.valid ? '✓ ' : '✗ '}{jsonResult.message}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-3 -right-6 lg:-right-12 w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl blur-2xl opacity-20 md:opacity-40 pointer-events-none"
              />
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-3 -left-6 lg:-left-12 w-20 h-20 lg:w-32 lg:h-32 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl blur-2xl opacity-20 md:opacity-40 pointer-events-none"
              />
            </motion.div>
          </div>

          {/* Company Logos */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <p className="text-sm text-slate-400 mb-8">Works with prompts for</p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {[
                { name: 'ChatGPT', icon: 'openai' },
                { name: 'Claude', icon: 'anthropic' },
                { name: 'Gemini', icon: 'google' },
                { name: 'Copilot', icon: 'microsoft' },
                { name: 'Llama', icon: 'meta' },
              ].map((model) => (
                <div key={model.name} className="flex items-center gap-2.5">
                  <img src={`/icons/${model.icon}.svg`} alt={model.name} width="28" height="28" className="h-7 w-7 opacity-60" />
                  <span className="text-sm md:text-base font-semibold text-slate-500">{model.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Banner Ad */}
      <div className="site-container pt-8">
        <AdBanner size="leaderboard" />
      </div>

      {/* Stats Section */}
      <section className="section-lg bg-slate-900/50 mt-16">
        <div className="site-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="text-center"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} mb-4`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Clearly labelled Monetag offer, separate from navigation and tool controls. */}
      <div className="site-container pt-8">
        <AdBanner network="custom" placement="home-stats-sponsored-offer" />
      </div>

      {/* Popular Tools — quick links to the most-used tools */}
      <section className="section-lg mt-16">
        <div className="site-container">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Popular Tools
            </h2>
            <p className="text-base text-slate-400 mt-2">Jump straight into the tools visitors use most.</p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "/tools/advanced-prompt-optimizer",
              "/tools/prompt-chain-builder",
              "/tools/prompt-debugger",
              "/tools/token-estimator",
              "/tools/mega-prompt-builder",
              "/tools/security-scanner",
            ].map((path) => {
              const tool = TOOL_PAGES.find((t) => t.path === path);
              if (!tool) return null;
              return (
                <Link
                  key={path}
                  to={path}
                  className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/60 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-amber-400/40 hover:bg-slate-900 hover:text-white"
                >
                  {tool.title}
                  <ArrowRight className="w-4 h-4 text-amber-400 transition-transform group-hover:translate-x-0.5" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Useful Prompts — prompt-library role pages visitors can explore next */}
      <section className="section-lg mt-16">
        <div className="site-container">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-400/80">Prompt Library</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-1">
              Useful Prompts
            </h2>
            <p className="text-base text-slate-400 mt-2">Ready-to-copy prompts for 15 professional roles — pair them with the free tools above.</p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "chatgpt",
              "content-writer",
              "developer",
              "marketer",
              "seo-specialist",
              "student",
            ].map((slug) => {
              const role = PROMPT_ROLE_META[slug];
              if (!role) return null;
              return (
                <Link
                  key={slug}
                  to={role.path}
                  className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/60 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-amber-400/40 hover:bg-slate-900 hover:text-white"
                >
                  {role.title}
                  <ArrowRight className="w-4 h-4 text-amber-400 transition-transform group-hover:translate-x-0.5" />
                </Link>
              );
            })}
            <Link
              to="/prompts"
              className="group inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300 transition hover:bg-amber-500/20 hover:text-amber-200"
            >
              Browse all 15 collections
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Tools Showcase — Featured AI Tools */}
      <section className="section-lg mt-16">
        <div className="site-container">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-300 font-medium">Featured Tools</span>
            </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                {ACTIVE_TOOL_COUNT} Professional Tools
                <br />
                <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                  For Perfect Prompts
                </span>
              </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Everything you need to create, validate, optimize, and deploy AI prompts at scale.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {toolPages.map((tool, idx) => (
              <motion.div
                key={tool.path}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="h-full"
              >
                <ToolCard tool={tool} />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link
              to="/tools"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full font-semibold text-black shadow-lg shadow-amber-500/50 hover:shadow-xl hover:shadow-amber-500/60 transition-shadow"
            >
              View All Tools
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Banner Ad */}
      <div className="site-container pt-8">
        <AdBanner size="banner" />
      </div>


      {/* Trending AI Tools */}
      <section className="section-lg bg-slate-900/30 mt-16">
        <div className="site-container">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-amber-300 font-medium">Trending Now</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                Most Used Tools
              </h2>
              <p className="text-base text-slate-400 max-w-xl">
                Our community's favorite tools — trusted by thousands of AI engineers daily.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 lg:mt-0 shrink-0"
            >
              <Link
                to="/tools"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-all"
              >
                Browse All Tools
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[5, 2, 3, 6].map((idx) => (
              <motion.div
                key={toolPages[idx].path}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="h-full"
              >
                <ToolCard tool={toolPages[idx]} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Clearly labelled Monetag offer, separate from navigation and tool controls. */}
      <div className="site-container pt-8">
        <AdBanner network="custom" placement="home-trending-sponsored-offer" />
      </div>


      {/* Why Choose Us */}
      <section className="section-lg bg-slate-900/50 mt-16">
        <div className="site-container">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Why Use
              <br />
              <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                AI World Hub?
              </span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Shield, title: 'Private by Design', text: 'Every tool runs 100% in your browser. Your prompts are never uploaded, stored, or shared — ever.' },
              { icon: Zap, title: 'Instant & Free', text: 'No sign-up walls, no credit cards, no limits. Open a tool and get results in seconds.' },
              { icon: CheckCircle2, title: 'Model-Agnostic', text: 'Works with prompts for ChatGPT, Claude, Gemini, Llama, Midjourney, and any other AI model.' },
              { icon: Clock, title: 'Save Time', text: 'Stop rewriting prompts from scratch. Format, clean, convert, and optimize in one place.' },
              { icon: TrendingUp, title: 'Cut API Costs', text: 'Estimate tokens before sending prompts to paid APIs and trim unnecessary bloat.' },
              { icon: Users, title: 'Built for Everyone', text: 'From students to developers to marketers — simple enough for beginners, powerful for pros.' },
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner Ad */}
      <div className="site-container pt-8">
        <AdBanner size="leaderboard" />
      </div>

      {/* Blog Section — lazy-loaded strip (blogPosts data stays out of first paint) */}
      <Suspense fallback={null}>
        <LatestBlogStrip />
      </Suspense>

      {/* Clearly labelled Monetag offer, separate from navigation and tool controls. */}
      <div className="site-container pt-8">
        <AdBanner network="custom" placement="home-blog-sponsored-offer" />
      </div>

      {/* Popular Solutions — problem-based guides visitors can share */}
      <section className="section-lg mt-16">
        <div className="site-container">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-400/80">Problem Solved</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-1">
              Popular Solutions
            </h2>
            <p className="text-base text-slate-400 mt-2">Short, shareable guides for the AI problems everyone hits.</p>
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { to: "/ai-prompts-not-working", label: "AI prompts not working?", sub: "Fix them in 5 minutes" },
              { to: "/cut-ai-token-costs", label: "API bills too high?", sub: "Cut token costs" },
              { to: "/make-ai-content-sound-human", label: "AI text sounds robotic?", sub: "Make it sound human" },
              { to: "/stop-ai-hallucinations", label: "AI makes things up?", sub: "Stop hallucinations" },
            ].map((s) => (
              <Link
                key={s.to}
                to={s.to}
                className="group flex flex-col rounded-2xl border border-white/10 bg-slate-900/40 p-5 transition hover:border-amber-400/30 hover:bg-slate-900/70"
              >
                <span className="text-sm font-semibold text-slate-200 group-hover:text-white">{s.label}</span>
                <span className="mt-1 text-xs text-slate-500">{s.sub}</span>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-amber-400">
                  Open guide
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/learn-prompt-engineering-fast"
              className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition"
            >
              New to prompt engineering? Learn the basics in 1 hour free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <CategoryShowcase />

      {/* FAQ Section */}
      <section className="section-lg bg-slate-900/50 mt-16">
        <div className="site-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Frequently Asked
              <br />
              <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, idx) => (
              <FAQItem key={idx} question={faq.question} answer={faq.answer} />
            ))}
          </div>
</div>
      </section>

      {/* Banner Ad */}
      <div className="site-container pt-8">
        <AdBanner size="halfpage" />
      </div>

      {/* Final CTA */}
      <section className="section-lg mt-16">
        <div className="site-container text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8">
              Ready to Build
              <br />
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                Perfect AI Prompts?
              </span>
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Use {ACTIVE_TOOL_COUNT} free, private, in-browser tools to create, optimize, and deploy prompts that deliver results.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/tools/advanced-prompt-optimizer"
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full font-semibold text-black shadow-lg shadow-amber-500/50 hover:shadow-xl hover:shadow-amber-500/60 transition-shadow"
              >
                Try Prompt Optimizer Free
              </Link>
              <Link
                to="/blog"
                className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Read Our Blog
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// FAQ Item Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${question.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase()}`}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
      >
        <span className="font-semibold text-white">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={`faq-answer-${question.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase()}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-4 text-slate-300 leading-relaxed">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
