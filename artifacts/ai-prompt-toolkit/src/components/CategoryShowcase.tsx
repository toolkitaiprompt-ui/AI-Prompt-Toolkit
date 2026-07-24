import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PROMPT_CATEGORIES } from "@/data/categories";

export default function CategoryShowcase() {
  return (
    <section className="section-lg mt-16">
      <div className="site-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-400 mb-2">✦ Browse by Category</p>
          <h2 className="font-headline font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
            Find What You Need
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Explore prompts organized by use case — from writing to coding to business strategy.
          </p>
        </motion.div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {PROMPT_CATEGORIES.slice(0, 8).map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
              className="group relative rounded-[16px] border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-400 hover:border-white/[0.15] hover:bg-white/[0.04] hover:shadow-lg hover:shadow-amber-500/5"
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
              <h3 className="font-headline font-bold text-white text-base mb-1.5">
                {cat.name}
              </h3>

              {/* Description */}
              <p className="text-xs leading-relaxed text-slate-500 mb-4 line-clamp-2">
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

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link to="/categories" className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/10 transition">
            View All Categories →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
