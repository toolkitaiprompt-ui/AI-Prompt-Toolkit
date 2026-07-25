import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Finally, tools without credit card.",
    author: "Developer",
    role: "Indie Hacker",
    stars: 5,
  },
  {
    quote: "Replaced Jasper for our team. Saved \$85/month.",
    author: "Marketing Manager",
    role: "SaaS Company",
    stars: 5,
  },
  {
    quote: "Token estimator saved me from \$200 surprise bill.",
    author: "Startup Founder",
    role: "AI Startup",
    stars: 5,
  },
];

export default function SocialProof() {
  return (
    <section className="section-lg mt-16">
      <div className="site-container">
        {/* ── Part A: Pain Point Headline ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 mb-5">
            <span className="text-sm">😤</span>
            <span className="text-sm font-medium text-rose-300">The Reality of AI Tool Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Tired of Paying for{" "}
            <span className="bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent">
              Basic AI Tools?
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            We get it. \$20/month ChatGPT Plus. \$49/month Jasper. \$150/month for things that should be free.
            <br />
            <span className="text-amber-300 font-semibold">That's why we built this — actually free. Forever.</span>
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-8"
          >
            <Link
              to="/tools"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full font-semibold text-white shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:scale-105 transition-all duration-300"
            >
              Explore Free Tools
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>

        {/* ── Part B: Trust Badges Row ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8 mb-10"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 text-center mb-4">
            Works seamlessly with
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {[
              { name: "ChatGPT", emoji: "🤖" },
              { name: "Claude", emoji: "🟣" },
              { name: "Gemini", emoji: "🔵" },
              { name: "Midjourney", emoji: "🎨" },
              { name: "Llama", emoji: "🦙" },
              { name: "Copilot", emoji: "🧑‍💻" },
            ].map((model) => (
              <div
                key={model.name}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-sm font-medium text-slate-300"
              >
                <span>{model.emoji}</span>
                <span>{model.name}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-400">✕</span> No signup
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-400">✕</span> No credit card
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-400">✕</span> No data collection
            </span>
          </div>
        </motion.div>

        {/* ── Part C: Testimonial Cards ── */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * idx }}
              className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:border-white/[0.15] hover:bg-white/[0.04] transition-all duration-400 group"
            >
              {/* Quote icon */}
              <div className="absolute top-4 right-4 text-3xl text-slate-700/50 group-hover:text-amber-500/20 transition-colors duration-300">
                <Quote className="w-8 h-8" />
              </div>

              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-base sm:text-lg font-medium text-white leading-relaxed mb-4">
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-rose-500/20 border border-white/10 flex items-center justify-center text-sm font-bold text-amber-300">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.author}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>

              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/0 via-transparent to-rose-500/0 group-hover:from-amber-500/5 group-hover:to-rose-500/5 transition-all duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
