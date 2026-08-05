import React, { useState, useEffect, useRef } from 'react';
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
import { BLOG_POSTS } from '../data/blogPosts';
import BlogCard from './BlogCard';
import ToolCard from './ToolCard';
import CategoryShowcase from './CategoryShowcase';
import MonetagAd from './MonetagAd';

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
    { icon: Zap, value: '16', label: 'Free Tools', color: 'from-blue-500 to-cyan-500' },
    { icon: Shield, value: '100%', label: 'In-Browser & Private', color: 'from-yellow-500 to-orange-500' },
    { icon: Clock, value: '0', label: 'Sign-ups Required', color: 'from-amber-500 to-amber-600' },
    { icon: Award, value: 'Free', label: 'Forever', color: 'from-green-500 to-emerald-500' },
  ];

  const faqs = [
    {
      question: 'Is AI World Hub really free?',
      answer: 'Yes! All 16 tools are completely free with no signup required. We offer optional Pro features for power users, but the core toolkit is 100% free forever.',
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
    const interval = setInterval(() => {
      setCurrentTool((prev) => (prev + 1) % demoTools.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);


  const handleOptimize = () => {
    setOptimized(`Role: Expert AI Analyst\nTask: ${prompt}\nFormat: Structured report with executive summary\nConstraints: Max 500 words, professional tone\nOutput: Markdown with clear sections`);
  };

return (
    <div className="bg-slate-950">

      {/* Hero Section */}
      <section className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with real image */}
        <div className="absolute inset-0">
          <img src="/images/hero-ai.jpg" alt="" className="hidden md:block absolute inset-0 w-full h-full object-cover opacity-20" />
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
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-amber-300">100% Free · No Sign-up · Runs in Your Browser</span>
              </motion.div>

              {/* Heading */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-[1.4]">
                Build{' '}
                <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                  Perfect
                </span>{' '}
                AI Prompts{' '}
                <span className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl text-slate-400">in Seconds</span>
              </h1>

              {/* Description */}
              <p className="text-lg sm:text-xl text-slate-300 mb-8 leading-relaxed">
                16 professional tools to format, validate, optimize, and deploy AI prompts at scale.
                No signup required. 100% in-browser. Enterprise-ready.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 mb-12">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/tools"
                    className="group px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full font-semibold text-black shadow-lg shadow-amber-500/50 flex items-center gap-2"
                  >
                    Start Building Free
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
                  <span className="text-sm text-slate-300">16 free tools</span>
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

            {/* Right: Interactive Demo */}
            <motion.div
              ref={demoRef}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Tool Switcher */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-1.5 md:gap-2 z-20 max-w-[280px] sm:max-w-none">
                {demoTools.map((tool, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTool(idx)}
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
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 md:p-8 shadow-2xl mt-6 md:mt-10"
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
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-xs text-slate-400">Processing</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Your Prompt</label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
                      rows={3}
                      placeholder="Enter your prompt..."
                    />
                  </div>

                  <button
                    onClick={handleOptimize}
                    className={`w-full py-3 bg-gradient-to-r ${demoTools[currentTool].color} rounded-lg font-semibold text-black mb-4 hover:shadow-lg transition-shadow`}
                  >
                    Optimize Prompt
                  </button>

                  <AnimatePresence>
                    {optimized && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <label className="block text-sm font-medium text-slate-300 mb-2">Optimized Result</label>
                        <div className="px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                          <pre className="text-sm text-green-300 whitespace-pre-wrap font-mono">{optimized}</pre>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-sm">
                          <span className="text-slate-400">Tokens: <span className="text-white font-semibold">142</span></span>
                          <span className="text-slate-400">Improvement: <span className="text-green-400 font-semibold">+42%</span></span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-3 -right-6 lg:-right-12 w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl blur-2xl opacity-20 md:opacity-40"
              />
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-3 -left-6 lg:-left-12 w-20 h-20 lg:w-32 lg:h-32 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl blur-2xl opacity-20 md:opacity-40"
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
                  <img src={`/icons/${model.icon}.svg`} alt={model.name} className="h-7 w-7 opacity-60" />
                  <span className="text-sm md:text-base font-semibold text-slate-500">{model.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

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

      {/* Monetag banner — between trust stats and tools showcase */}
      <div className="site-container my-4">
        <MonetagAd format="banner" />
      </div>

      {/* Tools Showcase — Featured AI Tools */}
      <section className="section-lg mt-16">
        <div className="site-container">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-300 font-medium">Featured Tools</span>
            </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                16 Professional Tools
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

      {/* Blog Section */}
      {BLOG_POSTS.length > 0 && (
        <section className="section-lg mt-16">
          <div className="site-container">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Latest from Our Blog
                <br />
                <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                  Expert Insights
                </span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {BLOG_POSTS.slice(0, 3).map((post, idx) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <BlogCard post={post} />
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
                to="/blog"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold text-white hover:bg-white/10 transition-colors"
              >
                View All Articles
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}


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
              Use 16 free, private, in-browser tools to create, optimize, and deploy prompts that deliver results.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/tools"
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full font-semibold text-black shadow-lg shadow-amber-500/50 hover:shadow-xl hover:shadow-amber-500/60 transition-shadow"
              >
                Start Building Free
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
