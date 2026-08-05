import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PROMPT_CATEGORIES } from "@/data/categories";

export default function CategoriesPage() {
  return (
    <section className="site-container section-lg">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-400 mb-2">✦ Browse</p>
        <h1 className="font-headline font-bold text-4xl sm:text-5xl text-white mb-4">
          Prompt Categories
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Find the perfect prompt for your use case.
        </p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PROMPT_CATEGORIES.map((cat, idx) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -4 }}
            className="group relative flex flex-col rounded-[16px] border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-400 hover:border-white/[0.15] hover:bg-white/[0.04] hover:shadow-lg hover:shadow-amber-500/5"
          >
            {/* Icon with color circle */}
            <div
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-[12px] text-xl transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${cat.color}22, ${cat.color}11)`,
                border: `1px solid ${cat.color}33`,
              }}
            >
              <span>{cat.icon}</span>
            </div>

            {/* Category name */}
            <h3 className="font-headline font-bold text-white text-lg mb-2">
              {cat.name}
            </h3>

            {/* Description */}
            <p className="flex-1 text-sm text-slate-400 mb-4">
              {cat.description}
            </p>

            {/* Template count */}
            <div className="flex items-center gap-1.5 text-xs font-medium text-amber-400/80 group-hover:text-amber-300 transition-colors">
              <span>{cat.count} templates</span>
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
