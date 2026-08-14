import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Copy, Check, Star, TrendingUp } from "lucide-react";
import { TEMPLATES, CATEGORIES } from "@/data/templates";
import useSeo from "@/hooks/useSeo";

export default function TemplatesPage() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [activeCat, setActiveCat] = useState("All");
  const [copiedId, setCopiedId] = useState("");

  useSeo(
    "Free Prompt Templates Library — 100+ Ready-to-Use Prompts | AI World Hub",
    "Browse 100+ ready-to-use AI prompt templates for writing, image generation, coding, video, and productivity. Copy, paste, get results instantly. Free prompt templates library.",
  );

  const filtered = useMemo(() => {
    return TEMPLATES.filter(t => {
      const matchCategory = activeCat === "All" || t.category === activeCat;
      const matchSearch = !search || 
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.prompt.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [search, activeCat]);

  const copyPrompt = async (id: string, prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedId(id);
      setTimeout(() => setCopiedId(""), 2000);
    } catch {
      // Clipboard unavailable (permissions/insecure context) — ignore
    }
  };

  return (
    <section className="site-container section-lg">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-400 mb-2">✦ Templates</p>
        <h1 className="font-headline font-bold text-4xl sm:text-5xl text-white mb-4">
          Prompt Templates Library
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Ready-to-use prompt templates for writing, marketing, coding, and more. Copy, paste, get results instantly.
        </p>
      </motion.div>

      {/* Search */}
      <div className="relative max-w-lg mx-auto mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search templates..."
          aria-label="Search templates"
          className="w-full pl-12 pr-4 py-3.5 bg-slate-900/80 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 outline-none focus:border-amber-400/50 transition"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {CATEGORIES.map(c => (
          <button
            key={c.name}
            onClick={() => setActiveCat(c.name)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCat === c.name
                ? "bg-amber-500/15 text-amber-300 border border-amber-400/30"
                : "bg-slate-900/50 text-slate-400 border border-slate-700/50 hover:border-slate-600"
            }`}
          >
            {c.name} ({c.count})
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((template, idx) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            className="group relative flex flex-col rounded-[20px] border border-white/[0.06] bg-white/[0.02] p-6 shadow-lg transition-all duration-500 hover:border-white/[0.15] hover:bg-white/[0.04] hover:shadow-xl hover:shadow-amber-500/5"
          >
            <div className="flex items-start justify-between mb-4">
              <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                {template.category}
              </span>
              <div className="flex items-center gap-1 text-xs text-amber-400">
                <Star className="w-3 h-3 fill-amber-400" />
                {template.rating}
              </div>
            </div>

            <h3 className="font-headline font-bold text-lg text-white mb-2">{template.title}</h3>
            <p className="flex-1 text-sm text-slate-400 mb-4">{template.description}</p>

            <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {template.usage.toLocaleString()} uses
              </span>
              <span className="px-2 py-0.5 bg-slate-800 rounded text-slate-400">{template.model}</span>
            </div>

            <div className="rounded-[14px] border border-white/5 bg-white/5 p-4 mb-4 backdrop-blur-sm">
              <pre className="text-xs text-slate-300 leading-relaxed line-clamp-4 font-mono whitespace-pre-wrap">
                {template.prompt}
              </pre>
            </div>

            <button
              onClick={() => copyPrompt(template.id, template.prompt)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-300 text-sm font-medium hover:bg-amber-500/20 transition"
            >
              {copiedId === template.id ? (
                <><Check className="w-4 h-4" /> Copied!</>
              ) : (
                <><Copy className="w-4 h-4" /> Copy Prompt</>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-slate-500">
          No templates found. Try a different search.
        </div>
      )}
    </section>
  );
}
