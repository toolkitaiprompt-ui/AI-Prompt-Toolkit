import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Home, Wrench, BookOpen, Sparkles, Search, ArrowRight } from "lucide-react";

const suggestions = [
  { text: "Write a marketing email", path: "/tools/prompt-formatter" },
  { text: "Calculate token costs", path: "/tools/token-estimator" },
  { text: "Build a system prompt", path: "/tools/advanced-prompt-optimizer" },
  { text: "Compare AI models", path: "/compare" },
];

export default function NotFoundPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/blog?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <section className="site-container section-lg min-h-[70vh] flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center">
        {/* Big 404 with glitch/gradient effect */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative"
        >
          <p className="text-[120px] sm:text-[180px] font-black leading-none tracking-tighter select-none">
            <span className="bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 bg-clip-text text-transparent">
              404
            </span>
          </p>
          {/* Glitch overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <p className="text-[120px] sm:text-[180px] font-black leading-none tracking-tighter text-cyan-400/30 blur-[2px] translate-x-1 translate-y-1">
              404
            </p>
          </div>
        </motion.div>

        {/* Fun message */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4 -mt-4"
        >
          <p className="text-5xl mb-2">🌌</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Lost in the AI Void?
          </h1>
          <p className="text-lg text-slate-400 max-w-md mx-auto leading-relaxed">
            This page doesn't exist — but don't worry, even the best AI hallucinates sometimes! 🤖
          </p>
          <p className="text-sm text-slate-500">
            Let's get you back on track! 🚀
          </p>
        </motion.div>

        {/* Navigation buttons */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-wrap justify-center gap-3 mt-8"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-sm font-semibold text-white shadow-lg shadow-amber-500/30 hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <Home className="w-4 h-4" /> Home
          </Link>
          <Link
            to="/tools"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 border border-white/10 text-sm font-semibold text-slate-200 hover:bg-white/10 hover:border-white/20 hover:text-white transition-all"
          >
            <Wrench className="w-4 h-4" /> Tools
          </Link>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 border border-white/10 text-sm font-semibold text-slate-200 hover:bg-white/10 hover:border-white/20 hover:text-white transition-all"
          >
            <BookOpen className="w-4 h-4" /> Blog
          </Link>
          <Link
            to="/playground"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 border border-white/10 text-sm font-semibold text-slate-200 hover:bg-white/10 hover:border-white/20 hover:text-white transition-all"
          >
            <Sparkles className="w-4 h-4" /> Playground
          </Link>
        </motion.div>

        {/* Quick suggestions */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
            Or try one of these:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestions.map((s) => (
              <Link
                key={s.path}
                to={s.path}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-xs text-slate-400 hover:text-amber-300 hover:border-amber-400/20 hover:bg-amber-500/5 transition-all"
              >
                {s.text} <ArrowRight className="w-3 h-3" />
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="mt-10"
        >
          <form onSubmit={handleSearch} className="max-w-sm mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guides & tools..."
                className="w-full pl-11 pr-4 py-3 rounded-full bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 outline-none transition focus:border-amber-400/40 focus:ring-2 focus:ring-amber-400/10"
              />
            </div>
          </form>
        </motion.div>

        {/* Debugging tip toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8"
        >
          <details className="group cursor-pointer">
            <summary className="text-xs text-slate-500 hover:text-slate-300 transition list-none flex items-center justify-center gap-1.5">
              <span className="group-open:hidden">💡 Show me a debugging tip</span>
              <span className="hidden group-open:inline">🙈 Hide debugging tip</span>
            </summary>
            <div className="mt-3 max-w-md mx-auto p-4 rounded-xl bg-amber-500/10 border border-amber-400/20 text-xs text-slate-300 text-left">
              <p className="font-semibold text-amber-300 mb-1">🔍 Pro debugging tip:</p>
              <p>
                If you clicked a link from another site, the URL might be mistyped. Try searching for what you need on our{" "}
                <Link to="/blog" className="text-amber-400 underline">blog</Link>{" "}
                or use the{" "}
                <Link to="/tools/prompt-debugger" className="text-amber-400 underline">Prompt Debugger</Link>{" "}
                to check your own prompts!
              </p>
            </div>
          </details>
        </motion.div>

        {/* Decorative floating elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 left-10 text-2xl opacity-20"
          >
            ✨
          </motion.div>
          <motion.div
            animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-20 right-10 text-2xl opacity-20"
          >
            🚀
          </motion.div>
        </div>
      </div>
    </section>
  );
}
