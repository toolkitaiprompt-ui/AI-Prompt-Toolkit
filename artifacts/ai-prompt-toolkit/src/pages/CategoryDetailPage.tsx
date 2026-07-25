import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Copy, Check, Star, TrendingUp, Search } from "lucide-react";
import { PROMPT_CATEGORIES } from "@/data/categories";
import { TEMPLATES } from "@/data/templates";

export default function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState("");

  const category = PROMPT_CATEGORIES.find(c => c.id === id);

  const filtered = useMemo(() => {
    if (!category) return [];
    return TEMPLATES.filter(t => {
      const matchCategory = t.category.toLowerCase() === category.name.split(" ")[0].toLowerCase() ||
                            t.category.toLowerCase() === category.name.toLowerCase();
      const matchSearch = !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [category, search]);

  const copyPrompt = async (id: string, prompt: string) => {
    await navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(""), 2000);
  };

  if (!category) {
    return (
      <section className="site-container section-lg">
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🔍</p>
          <h1 className="text-3xl font-bold text-white mb-4">Category Not Found</h1>
          <p className="text-slate-400 mb-8">The category you're looking for doesn't exist.</p>
          <Link to="/categories" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500/10 border border-amber-400/30 rounded-full text-amber-300 hover:bg-amber-500/20 transition">
            ← Back to Categories
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="site-container section-lg">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <Link to="/categories" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-amber-300 transition mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Categories
        </Link>
        <div className="flex items-center gap-4 mb-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-[14px] text-2xl"
            style={{
              background: `linear-gradient(135deg, ${category.color}22, ${category.color}11)`,
              border: `1px solid ${category.color}33`,
            }}
          >
            <span>{category.icon}</span>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-400 mb-1">{category.name}</p>
            <p className="text-slate-400 text-sm">{category.description}</p>
          </div>
        </div>
      </motion.div>

      {filtered.length === 0 ? (
        /* Coming Soon */
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20 max-w-lg mx-auto">
          <div className="text-5xl mb-6">🚧</div>
          <h2 className="text-2xl font-bold text-white mb-3">Coming Soon</h2>
          <p className="text-slate-400 mb-2">
            We're working on templates for <span className="text-white font-semibold">{category.name}</span>.
          </p>
          <p className="text-slate-500 text-sm mb-8">
            Check back soon — new templates are added every week.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/templates" className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-sm text-slate-300 hover:bg-white/10 transition">
              Browse All Templates
            </Link>
            <Link to="/tools" className="px-6 py-3 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full text-sm font-semibold text-white shadow-lg">
              Try Our Free Tools
            </Link>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Search */}
          <div className="relative max-w-md mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={`Search ${category.name} templates...`}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400/50 transition"
            />
          </div>

          {/* Templates Grid */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((template, idx) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative rounded-[20px] border border-white/[0.06] bg-white/[0.02] p-6 shadow-lg transition-all duration-500 hover:border-white/[0.15] hover:bg-white/[0.04] hover:shadow-xl"
              >
                <div className="flex items-start justify-between mb-3">
                  <span
                    className="inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider"
                    style={{
                      borderColor: `${category.color}44`,
                      background: `${category.color}15`,
                      color: category.color,
                    }}
                  >
                    {template.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-amber-400">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {template.rating}
                  </div>
                </div>

                <h3 className="font-headline font-bold text-lg text-white mb-2">{template.title}</h3>
                <p className="text-sm text-slate-400 mb-3">{template.description}</p>

                <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {template.usage.toLocaleString()} uses
                  </span>
                  <span className="px-2 py-0.5 bg-slate-800 rounded text-slate-400">{template.model}</span>
                </div>

                <div className="rounded-[14px] border border-white/5 bg-white/5 p-3.5 mb-4 backdrop-blur-sm">
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
        </>
      )}
    </section>
  );
}
