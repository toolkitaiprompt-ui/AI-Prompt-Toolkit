import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Copy, Check, Search } from "lucide-react";
import { ROLE_PROMPTS } from "../data/rolePrompts";

export default function RolePromptsPage() {
  const { roleSlug } = useParams<{ roleSlug: string }>();
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState("");

  const role = ROLE_PROMPTS.find((r) => r.roleSlug === roleSlug);

  const filtered = useMemo(() => {
    if (!role) return [];
    if (!search.trim()) return role.prompts;
    const q = search.toLowerCase();
    return role.prompts.filter((p) => p.title.toLowerCase().includes(q) || p.prompt.toLowerCase().includes(q));
  }, [role, search]);

  const copyPrompt = async (id: string, prompt: string) => {
    await navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(""), 2000);
  };

  if (!role) {
    return (
      <section className="site-container section-lg">
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🔍</p>
          <h1 className="text-3xl font-bold text-white mb-4">Role Not Found</h1>
          <p className="text-slate-400 mb-8">The role you're looking for doesn't exist.</p>
          <Link to="/prompts" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500/10 border border-amber-400/30 rounded-full text-amber-300 hover:bg-amber-500/20 transition">
            ← Browse All Roles
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="site-container section-lg">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <Link to="/prompts" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-amber-300 transition mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to All Roles
        </Link>
        <h1 className="font-headline font-bold text-3xl sm:text-4xl text-white mb-3">{role.roleName} Prompts — Ready to Use</h1>
        <p className="text-slate-400 max-w-3xl leading-relaxed">{role.description}</p>
      </motion.div>

      {/* Search */}
      <div className="relative max-w-md mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${role.roleName} prompts...`}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400/50 transition"
        />
      </div>

      {/* Prompts grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((prompt, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            className="group relative rounded-[20px] border border-white/[0.06] bg-white/[0.02] p-6 shadow-lg transition-all duration-500 hover:border-white/[0.15] hover:bg-white/[0.04] hover:shadow-xl"
          >
            <h3 className="font-headline font-bold text-white text-base mb-3">{prompt.title}</h3>
            <pre className="text-xs text-slate-300 leading-relaxed line-clamp-6 font-mono whitespace-pre-wrap mb-4">
              {prompt.prompt}
            </pre>
            <button
              onClick={() => copyPrompt(`p${idx}`, prompt.prompt)}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-300 text-xs font-medium hover:bg-amber-500/20 transition"
            >
              {copiedId === `p${idx}` ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy Prompt</>}
            </button>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 border border-dashed border-slate-700/60 rounded-2xl bg-slate-900/30">
          <p className="text-slate-400 text-sm">No prompts found matching your search</p>
        </div>
      )}

      {/* Related Tools */}
      <div className="mt-16 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-8 text-center">
        <h3 className="text-lg font-semibold text-white mb-2">Need Help Crafting Your Prompt?</h3>
        <p className="text-sm text-slate-400 mb-6 max-w-lg mx-auto">Use these free tools to refine, optimize, and perfect your prompt before sending it to an AI.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/tools/prompt-debugger" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm text-slate-300 hover:bg-white/10 transition">
            Prompt Debugger
          </Link>
          <Link to="/tools/mega-prompt-builder" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm text-slate-300 hover:bg-white/10 transition">
            Mega Prompt Builder
          </Link>
          <Link to="/tools/prompt-comparison" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm text-slate-300 hover:bg-white/10 transition">
            Prompt Comparison
          </Link>
        </div>
      </div>
    </section>
  );
}
