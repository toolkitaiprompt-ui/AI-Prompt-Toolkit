import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

type ToolMeta = {
  title: string;
  path: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  premium?: boolean;
};

export default function ToolCard({ tool }: { tool: ToolMeta }) {
  const Icon = tool.icon;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="group relative"
    >
      <Link
        to={tool.path}
        className="relative block overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/85 p-6 shadow-[0_32px_90px_-40px_rgba(15,23,42,0.75)] transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-slate-900/95"
      >
        <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/5 via-slate-950/60 to-slate-900/80" />
        <div className="absolute -right-10 top-6 h-28 w-28 rounded-full bg-cyan-500/10 blur-3xl opacity-70" />
        <div className="relative space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className={`inline-flex h-14 w-14 items-center justify-center rounded-3xl border border-white/10 ${tool.premium ? "bg-violet-500/15 text-violet-300" : "bg-cyan-500/10 text-cyan-300"}`}>
              <Icon className="h-6 w-6" aria-hidden="true" />
            </div>
            {tool.premium ? (
              <span className="rounded-full border border-violet-300/20 bg-violet-400/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-violet-200">
                Premium
              </span>
            ) : null}
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-semibold tracking-tight text-white">{tool.title}</h3>
            <p className="text-sm leading-7 text-slate-300">{tool.description}</p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300 transition group-hover:text-white">
              Explore tool
              <ArrowUpRight className="h-4 w-4 transition" aria-hidden="true" />
            </span>
            <span className={`h-2.5 w-2.5 rounded-full bg-gradient-to-br ${tool.accent}`} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
