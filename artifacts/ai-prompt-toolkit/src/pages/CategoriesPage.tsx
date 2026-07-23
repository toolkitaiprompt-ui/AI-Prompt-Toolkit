import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PROMPT_CATEGORIES } from "@/data/categories";

export default function CategoriesPage() {
  return (
    <section className="site-container py-16 lg:py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400 mb-2">✦ Browse</p>
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
            className="card group cursor-pointer hover:border-slate-600"
          >
            <div className="text-3xl mb-4">{cat.icon}</div>
            <h3 className="font-headline font-bold text-lg text-white mb-2">{cat.name}</h3>
            <p className="text-sm text-slate-400 mb-4">{cat.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">{cat.count} templates</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
