import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, type LucideIcon, Zap, Crown } from "lucide-react";

type ToolMeta = {
  title: string;
  path: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  premium?: boolean;
  popular?: boolean;
  badge?: string;
};

type ToolCardProps = {
  tool: ToolMeta;
};

// Tool-specific preview components
const PromptVariableExtractorPreview = () => (
  <div className="space-y-2 text-[11px] font-mono">
    <div className="text-amber-300">Input:</div>
    <div className="text-slate-400">Generate {'{tone}'} summary</div>
    <div className="text-emerald-400 mt-2">Output:</div>
    <div className="text-slate-300">• tone<br/>• summary</div>
  </div>
);
const JsonSchemaGeneratorPreview = () => (
  <div className="space-y-1.5 text-[11px] font-mono">
    <div className="text-amber-300">Input:</div>
    <div className="text-slate-400">{`{ "name": "Alex", "age": 28 }`}</div>
    <div className="text-emerald-400 mt-2">Schema:</div>
    <div className="text-slate-300">{`"properties": {`}<br/>{`  "name": "string"`}<br/>{`}`}</div>
  </div>
);
const JsonValidatorPreview = () => (
  <div className="space-y-2 text-[11px]">
    <div className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-emerald-400" /><span className="text-emerald-400">Valid JSON</span></div>
    <div className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-slate-600" /><span className="text-slate-400">Schema match</span></div>
    <div className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-emerald-400" /><span className="text-emerald-400">All fields</span></div>
  </div>
);
const PromptFormatterPreview = () => (
  <div className="space-y-1.5 text-[10px]">
    <div className="text-amber-300 font-semibold">Structured Output:</div>
    <div className="space-y-1 text-slate-300 font-mono"><div>1. Objective</div><div>2. Context</div><div>3. Format</div></div>
  </div>
);
const PromptCleanerPreview = () => (
  <div className="space-y-2 text-[10px]">
    <div className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-red-400" /><span className="text-red-400">Remove noise</span></div>
    <div className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-yellow-400" /><span className="text-yellow-400">Fix spacing</span></div>
    <div className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-emerald-400" /><span className="text-emerald-400">Polish text</span></div>
  </div>
);
const TokenEstimatorPreview = () => (
  <div className="space-y-2 text-[11px]">
    <div className="flex justify-between"><span className="text-slate-400">Characters:</span><span className="text-amber-300 font-semibold">2,048</span></div>
    <div className="flex justify-between"><span className="text-slate-400">Words:</span><span className="text-amber-300 font-semibold">256</span></div>
    <div className="flex justify-between"><span className="text-slate-400">Tokens:</span><span className="text-amber-300 font-semibold">512</span></div>
  </div>
);
const AdvancedOptimizerPreview = () => (
  <div className="space-y-2 text-[10px]">
    <div className="flex items-center gap-2"><Zap className="h-3 w-3 text-yellow-400" /><span className="text-yellow-300">Premium</span></div>
    <div className="text-slate-400">AI-powered optimization</div>
  </div>
);

const ToolBadge = ({ type }: { type: "free" | "popular" | "advanced" }) => {
  const badges = {
    free: { bg: "bg-emerald-500/15", border: "border-emerald-400/30", text: "text-emerald-300", label: "Free" },
    popular: { bg: "bg-violet-500/15", border: "border-violet-400/30", text: "text-violet-300", label: "Popular" },
    advanced: { bg: "bg-yellow-500/15", border: "border-yellow-400/30", text: "text-yellow-300", label: "Premium" },
  };
  const badge = badges[type];
  return (
    <span className={`rounded-full border ${badge.border} ${badge.bg} px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${badge.text}`}>
      {badge.label}
    </span>
  );
};

export default function ToolCard({ tool }: ToolCardProps) {
  const Icon = tool.icon;
  const isPremium = tool.premium;

  const getPreviewComponent = () => {
    switch (tool.path) {
      case "/tools/prompt-variable-extractor": return <PromptVariableExtractorPreview />;
      case "/tools/json-schema-generator": return <JsonSchemaGeneratorPreview />;
      case "/tools/json-validator": return <JsonValidatorPreview />;
      case "/tools/prompt-formatter": return <PromptFormatterPreview />;
      case "/tools/prompt-cleaner": return <PromptCleanerPreview />;
      case "/tools/token-estimator": return <TokenEstimatorPreview />;
      case "/tools/advanced-prompt-optimizer": return <AdvancedOptimizerPreview />;
      default: return null;
    }
  };

  const getBadgeType = (): "free" | "popular" | "advanced" | null => {
    if (tool.premium) return "advanced";
    if (tool.popular) return "popular";
    return "free";
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className="group relative h-full"
    >
      <Link
        to={tool.path}
        className={`relative block h-full overflow-hidden rounded-[20px] p-8 shadow-lg transition-all duration-500 ${
          isPremium
            ? "card-featured-premium before:opacity-100"
            : "card-premium"
        } group-hover:border-white/20 hover:shadow-xl hover:shadow-amber-500/5`}
      >
        {/* Top gradient bar - runs full width */}
        <div className="card-bar" />

        {/* Shine effect */}
        <div className="card-shine" />

        {/* Accent glow */}
        <div className={`absolute -right-12 top-6 h-32 w-32 rounded-full bg-gradient-to-br ${tool.accent} blur-3xl opacity-40 transition-all duration-500 group-hover:opacity-70 group-hover:scale-110`} />

        <div className="relative z-10 space-y-5">
          {/* Top Row: Icon + Badge */}
          <div className="flex items-start justify-between">
            <div className="flex h-14 w-14 items-center justify-center rounded-[14px] mb-1 bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 group-hover:border-amber-400/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-amber-500/20">
              <Icon className="h-7 w-7 text-white group-hover:text-amber-300 transition-colors" aria-hidden="true" />
            </div>
            {getBadgeType() && <ToolBadge type={getBadgeType()!} />}
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold tracking-tight text-white font-headline mb-2">
            {tool.title}
          </h3>

          {/* Description */}
          <p className="text-xs leading-5 text-slate-400 mb-3">
            {tool.description}
          </p>

          {/* Tool Preview */}
          <div className="rounded-[14px] border border-white/5 bg-white/5 p-4 backdrop-blur-sm">
            {getPreviewComponent()}
          </div>

          {/* Bottom */}
          <div className="card-divider !my-0" />

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-slate-500">
                {isPremium ? "Premium Tool" : "Ready to use"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-amber-400 group-hover:text-amber-300 transition-colors">
              <span>Explore</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
          </div>

          {/* Crown for Premium */}
          {isPremium && (
            <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500/30 to-orange-500/20 border border-yellow-400/40 shadow-lg shadow-yellow-500/20">
              <Crown className="h-4 w-4 text-yellow-400" />
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
