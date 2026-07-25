import React from "react";
import { motion } from "framer-motion";
import { Sparkles, GitCommit, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { CHANGELOG_ENTRIES, getTypeConfig, type ChangelogEntry } from "../data/changelog";

function ChangelogCard({ entry, index }: { entry: ChangelogEntry; index: number }) {
  const config = getTypeConfig(entry.type);
  const isLatest = index === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="relative group"
    >
      {/* Timeline line */}
      {index < CHANGELOG_ENTRIES.length - 1 && (
        <div className="absolute left-[19px] top-10 bottom-0 w-px bg-gradient-to-b from-amber-400/30 via-white/[0.06] to-transparent" />
      )}

      <div className="flex gap-5">
        {/* Timeline dot */}
        <div className="relative shrink-0">
          <div className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-sm ${
            isLatest ? "bg-amber-500/20 border-amber-400/30" : "bg-slate-900/80"
          }`}>
            <span className={isLatest ? "animate-pulse" : ""}>{config.dot}</span>
          </div>
        </div>

        {/* Content card */}
        <div className={`flex-1 rounded-2xl border p-5 transition-all duration-300 ${
          isLatest
            ? "border-amber-400/20 bg-gradient-to-br from-amber-500/8 to-rose-500/5"
            : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]"
        }`}>
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Type badge */}
              <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${config.bg} ${config.color}`}>
                {config.dot} {config.label}
              </span>

              {/* Date */}
              <span className="text-[11px] text-slate-500">{entry.date}</span>

              {/* NEW badge for latest */}
              {isLatest && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-400/25 px-2 py-0.5 text-[10px] font-bold text-emerald-300 animate-pulse">
                  ✨ NEW
                </span>
              )}
            </div>
          </div>

          <h3 className="text-base font-semibold text-white mb-1.5">{entry.title}</h3>
          {entry.description && (
            <p className="text-sm text-slate-400 leading-relaxed">{entry.description}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ChangelogPage() {
  return (
    <section className="site-container section-lg">
      {/* Breadcrumb schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://aiworldhub.site/" },
            { "@type": "ListItem", "position": 2, "name": "Changelog", "item": "https://aiworldhub.site/changelog" },
          ],
        }),
      }} />

      {/* Page SEO */}
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-400/20 mb-5">
            <GitCommit className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-300">Updates</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            What's New{" "}
            <span className="bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
              🚀
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-lg mx-auto leading-relaxed">
            Every update, improvement, and fix — all in one place. We ship fast and break nothing. ✨
          </p>
        </motion.div>

        {/* Changelog timeline */}
        <div className="space-y-6">
          {CHANGELOG_ENTRIES.map((entry, idx) => (
            <ChangelogCard key={entry.id} entry={entry} index={idx} />
          ))}
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 text-center p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]"
        >
          <p className="text-sm text-slate-400 mb-3">
            Have a suggestion? Found a bug? We'd love to hear from you! 💬
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-400/20 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition"
            >
              Send Feedback <ArrowUpRight className="w-3 h-3" />
            </Link>
            <a
              href="https://github.com/toolkitaiprompt-ui/AI-Prompt-Toolkit/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 hover:bg-white/10 transition"
            >
              Open GitHub Issue <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
