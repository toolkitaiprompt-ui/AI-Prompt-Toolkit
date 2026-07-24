import { motion } from "framer-motion";

case "/tools/prompt-variable-extractor":
  return <PromptVariableExtractorPreview />;

case "/tools/json-schema-generator":
  return <JsonSchemaGeneratorPreview />;

case "/tools/json-validator":
  return <JsonValidatorPreview />;

case "/tools/prompt-formatter":
  return <PromptFormatterPreview />;

case "/tools/prompt-cleaner":
  return <PromptCleanerPreview />;

case "/tools/token-estimator":
  return <TokenEstimatorPreview />;

case "/tools/advanced-prompt-optimizer":
  return <AdvancedOptimizerPreview />;

default:
  return null;
}
};

const getBadgeType = (): "free" | "popular" | "advanced" | null => {
  if (tool.premium) return "advanced";
  if (tool.popular) return "popular";
  return "free";
};

return (
  <motion.div
    whileHover={{ y: -4 }}
    transition={{ type: "spring", stiffness: 220, damping: 22 }}
    className="group relative h-full"
  >
    <Link
      to={tool.path}
      className={`relative block h-full overflow-hidden rounded-[15px] p-3 shadow-lg transition-all duration-600 ${
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
      <div
        className={`absolute -right-10 top-5 h-24 w-24 rounded-full bg-gradient-to-br ${
          tool.accent
        } blur-3xl opacity-30 transition-all duration-500 group-hover:opacity-50 group-hover:scale-110`}
      />

      <div className="relative z-10 flex h-full flex-col">
        {/* Top Row: Icon + Badge */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[11px] border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 transition-all duration-300 group-hover:scale-105 group-hover:border-amber-400/30 group-hover:shadow-lg group-hover:shadow-amber-500/20">
            <Icon
              className="h-5 w-5 text-white transition-colors group-hover:text-amber-300"
              aria-hidden="true"
            />
          </div>

          {getBadgeType() && <ToolBadge type={getBadgeType()!} />}
        </div>

        {/* Title */}
        <h3 className="mb-1.5 font-headline text-base font-semibold tracking-tight text-white">
          {tool.title}
        </h3>

        {/* Description */}
        <p className="mb-3 text-xs leading-5 text-slate-400">
          {tool.description}
        </p>

        {/* Tool Preview */}
        <div className="flex-1 rounded-[11px] border border-white/5 bg-white/5 p-2.5 backdrop-blur-sm">
          {getPreviewComponent()}
        </div>

        {/* Divider */}
        <div className="card-divider my-3" />

        {/* Bottom: Status + CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />

            <span className="text-[11px] font-medium text-slate-500">
              {isPremium ? "Premium Tool" : "Ready to use"}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold text-amber-400 transition-colors group-hover:text-amber-300">
            <span>Explore</span>

            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);
