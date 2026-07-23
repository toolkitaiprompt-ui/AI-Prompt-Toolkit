import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PROMPT_CATEGORIES } from "@/data/categories";

export default function CategoryShowcase() {
  return (
    <section className="py-24">
      <div className="site-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400 mb-2">✦ Browse by Category</p>
          <h2 className="font-headline font-bold text-4xl text-white mb-4">
            Find What You Need
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Explore prompts organized by use case — from writing to coding to business strategy.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PROMPT_CATEGORIES.slice(0, 8).map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="card group cursor-pointer hover:border-slate-600"
            >
              <div className="text-2xl mb-3">{cat.icon}</div>
              <h3 className="font-headline font-bold text-white text-base mb-1">{cat.name}</h3>
              <p className="text-xs text-slate-500">{cat.count} templates</p>
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
