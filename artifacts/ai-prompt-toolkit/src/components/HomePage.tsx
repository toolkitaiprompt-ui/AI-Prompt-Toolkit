import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Play,
  Star,
  Shield,
  Clock,
  Users,
  TrendingUp,
  Award,
  ChevronDown,
  Quote,
} from 'lucide-react';

// Import your actual data
import { BLOG_POSTS } from '../data/blogPosts';
import BlogCard from './BlogCard';
import ToolCard from './ToolCard';
import CategoryShowcase from './CategoryShowcase';

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
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const demoTools = [
    { name: 'Prompt Optimizer', icon: Sparkles, color: 'from-amber-500 to-rose-500' },
    { name: 'Token Estimator', icon: Zap, color: 'from-cyan-500 to-blue-500' },
    { name: 'JSON Validator', icon: CheckCircle2, color: 'from-green-500 to-emerald-500' },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'AI Engineer at Google',
      avatar: 'SC',
      content: 'AI Prompt Toolkit has transformed our workflow. The Token Estimator alone saved us $50K+ in API costs. Absolutely essential for any serious AI team.',
      rating: 5,
    },
    {
      name: 'Marcus Rodriguez',
      role: 'CTO at TechStartup',
      avatar: 'MR',
      content: "We've tried every prompt tool out there. This is the only one that actually understands what developers need. Game changer for our entire team.",
      rating: 5,
    },
    {
      name: 'Emily Watson',
      role: 'Product Manager at Meta',
      avatar: 'EW',
      content: "The Prompt Optimizer improved our output quality by 40%. It's like having a senior prompt engineer reviewing every prompt before deployment.",
      rating: 5,
    },
  ];

  const stats = [
    { icon: Users, value: '10,000+', label: 'Active Users', color: 'from-blue-500 to-cyan-500' },
    { icon: Star, value: '4.9/5', label: 'User Rating', color: 'from-yellow-500 to-orange-500' },
    { icon: TrendingUp, value: '1M+', label: 'Prompts Optimized', color: 'from-amber-500 to-rose-500' },
    { icon: Award, value: '$500K+', label: 'API Costs Saved', color: 'from-green-500 to-emerald-500' },
  ];

  const faqs = [
    {
      question: 'Is AI Prompt Toolkit really free?',
      answer: 'Yes! All 10 tools are completely free with no signup required. We offer optional Pro features for power users, but the core toolkit is 100% free forever.',
    },
    {
      question: 'How does in-browser processing work?',
      answer: 'All processing happens directly in your browser using JavaScript. Your prompts never leave your device, ensuring complete privacy and security.',
    },
    {
      question: 'Can I use this for commercial projects?',
      answer: 'Absolutely! You can use AI Prompt Toolkit for any purpose - personal, commercial, or client work. No restrictions on usage.',
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

  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(testimonialInterval);
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
          <img src="/images/hero-ai.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#09090f] via-transparent to-[#09090f]" />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-amber-500/20 to-rose-500/20 blur-3xl"
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
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative z-10 site-container section-lg">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
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
                <span className="text-sm text-amber-300">Trusted by 10,000+ AI teams worldwide</span>
              </motion.div>

              {/* Heading */}
              <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-[1.15]">
                Build{' '}
                <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-pink-400 bg-clip-text text-transparent">
                  Perfect
                </span>
                <br />
                AI Prompts
                <br />
                <span className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl text-slate-400">in Seconds</span>
              </h1>

              {/* Description */}
              <p className="text-lg sm:text-xl text-slate-300 mb-8 leading-relaxed">
                10 professional tools to format, validate, optimize, and deploy AI prompts at scale.
                No signup required. 100% in-browser. Enterprise-ready.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 mb-12">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/tools"
                    className="group px-8 py-4 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full font-semibold text-white shadow-lg shadow-amber-500/50 flex items-center gap-2"
                  >
                    Start Building Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-full font-semibold text-white flex items-center gap-2 hover:bg-white/10 transition-colors">
                    <Play className="w-5 h-5" />
                    Watch Demo
                  </button>
                </motion.div>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-rose-500 border-2 border-slate-950 flex items-center justify-center text-white font-bold text-sm"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-400">4.9/5 from 2,500+ reviews</p>
                </div>
              </div>
            </motion.div>

            {/* Right: Interactive Demo */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Tool Switcher */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2 z-20">
                {demoTools.map((tool, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTool(idx)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      currentTool === idx
                        ? `bg-gradient-to-r ${tool.color} text-white shadow-lg`
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
                className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl mt-10"
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
                    className={`w-full py-3 bg-gradient-to-r ${demoTools[currentTool].color} rounded-lg font-semibold text-white mb-4 hover:shadow-lg transition-shadow`}
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
                className="absolute -top-4 -right-8 lg:-right-12 w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-amber-500 to-rose-500 rounded-2xl blur-2xl opacity-40"
              />
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-4 -left-8 lg:-left-12 w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl blur-2xl opacity-40"
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
            <p className="text-sm text-slate-400 mb-8">Trusted by teams at</p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-50">
              {['Google', 'Microsoft', 'OpenAI', 'Anthropic', 'Meta'].map((company) => (
                <div key={company} className="flex items-center gap-2">
                  <img src={`/icons/${company.toLowerCase()}.svg`} alt={company} className="h-6 w-6 opacity-50" />
                  <span className="text-base md:text-lg font-semibold text-slate-500">{company}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-lg bg-slate-900/50 mt-16">
        <div className="site-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
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

      {/* Tools Showcase */}
      <section className="section-lg">
        <div className="site-container">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              10 Professional Tools
              <br />
              <span className="bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
                For Perfect Prompts
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mt-2">
              Everything you need to create, validate, optimize, and deploy AI prompts at scale.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {toolPages.map((tool, idx) => (
              <motion.div
                key={tool.path}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
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
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full font-semibold text-white shadow-lg shadow-amber-500/50 hover:shadow-xl hover:shadow-amber-500/60 transition-shadow"
            >
              View All Tools
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>



      {/* Testimonials */}
      <section className="section-lg bg-slate-900/50 mt-16">
        <div className="site-container">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Loved by AI Professionals
              <br />
              <span className="bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
                Worldwide
              </span>
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
              >
                <Quote className="w-10 h-10 text-amber-400 mb-6" />
                <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                  "{testimonials[activeTestimonial].content}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center text-white font-bold">
                    {testimonials[activeTestimonial].avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonials[activeTestimonial].name}</div>
                    <div className="text-sm text-slate-400">{testimonials[activeTestimonial].role}</div>
                  </div>
                  <div className="ml-auto flex gap-1">
                    {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === activeTestimonial ? 'bg-amber-500 w-8' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      {BLOG_POSTS.length > 0 && (
        <section className="section-lg">
          <div className="site-container">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Latest from Our Blog
                <br />
                <span className="bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
                  Expert Insights
                </span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Frequently Asked
              <br />
              <span className="bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <FAQItem key={idx} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-lg">
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
              <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-pink-400 bg-clip-text text-transparent">
                Perfect AI Prompts?
              </span>
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join 10,000+ AI professionals who trust AI Prompt Toolkit to create, optimize, and deploy prompts that deliver results.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/tools"
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full font-semibold text-white shadow-lg shadow-amber-500/50 hover:shadow-xl hover:shadow-amber-500/60 transition-shadow"
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
