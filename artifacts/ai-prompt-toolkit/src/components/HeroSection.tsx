import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, ArrowRight, Play, CheckCircle2 } from 'lucide-react';

export default function HeroSection() {
  const [currentTool, setCurrentTool] = useState(0);
  const [prompt, setPrompt] = useState('write a summary about risks');
  const [optimized, setOptimized] = useState('');

  const tools = [
    { name: 'Prompt Optimizer', icon: Sparkles, color: 'from-purple-500 to-pink-500' },
    { name: 'Token Estimator', icon: Zap, color: 'from-cyan-500 to-blue-500' },
    { name: 'JSON Validator', icon: CheckCircle2, color: 'from-green-500 to-emerald-500' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTool((prev) => (prev + 1) % tools.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleOptimize = () => {
    setOptimized(`Role: Expert analyst\nTask: ${prompt}\nFormat: Structured report with key insights\nTone: Professional and concise`);
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 blur-3xl"
        />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300">Trusted by 10,000+ AI teams worldwide</span>
            </motion.div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Build{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Perfect
              </span>
              <br />
              AI Prompts
              <br />
              <span className="text-4xl sm:text-5xl lg:text-6xl text-slate-400">in Seconds</span>
            </h1>

            {/* Description */}
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              10 professional tools to format, validate, optimize, and deploy AI prompts at scale. 
              No signup required. 100% in-browser. Enterprise-ready.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-white shadow-lg shadow-purple-500/50 flex items-center gap-2"
              >
                Start Building Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold text-white flex items-center gap-2 hover:bg-white/10 transition-colors"
              >
                <Play className="w-5 h-5" />
                Watch Demo
              </motion.button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-slate-950 flex items-center justify-center text-white font-bold text-sm"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
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
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {tools.map((tool, idx) => (
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
              className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
            >
              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${tools[currentTool].color} opacity-10 blur-2xl rounded-2xl`} />

              <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tools[currentTool].color} flex items-center justify-center`}>
                      {(() => {
                        const Icon = tools[currentTool].icon;
                        return <Icon className="w-6 h-6 text-white" />;
                      })()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{tools[currentTool].name}</h3>
                      <p className="text-sm text-slate-400">Live Demo</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-slate-400">Processing</span>
                  </div>
                </div>

                {/* Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Your Prompt</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                    rows={3}
                    placeholder="Enter your prompt..."
                  />
                </div>

                {/* Optimize Button */}
                <button
                  onClick={handleOptimize}
                  className={`w-full py-3 bg-gradient-to-r ${tools[currentTool].color} rounded-lg font-semibold text-white mb-4 hover:shadow-lg transition-shadow`}
                >
                  Optimize Prompt
                </button>

                {/* Output */}
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
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl blur-2xl opacity-50"
            />
            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
              className="absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl blur-2xl opacity-50"
            />
          </motion.div>
        </div>

        {/* Company Logos */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 text-center"
        >
          <p className="text-sm text-slate-400 mb-8">Trusted by teams at</p>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-50">
            {['Google', 'Microsoft', 'OpenAI', 'Anthropic', 'Meta'].map((company) => (
              <div key={company} className="text-2xl font-bold text-slate-500">
                {company}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
