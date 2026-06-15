import React, { useState } from "react";
import { Link } from "react-router-dom";
import type { BlogPost } from "../data/blogPosts";

function getBlogPostVisual(postSlug: string) {
  const visuals: Record<string, { url: string; alt: string }> = {
    "master-prompt-engineering-workflow": {
      url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      alt: "Abstract AI command console with glowing data streams",
    },
    "craft-high-impact-chatgpt-prompts": {
      url: "https://images.unsplash.com/photo-1556012018-9c6de6e1d5e6?auto=format&fit=crop&w=1200&q=80",
      alt: "Futuristic interface glowing with chat and prompt analytics",
    },
    "build-ai-prompt-templates-that-scale": {
      url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
      alt: "Modern blueprint style illustration of scalable AI templates",
    },
  };

  return (
    visuals[postSlug] ?? {
      url: "https://images.unsplash.com/photo-1517430816045-df4b7de01b88?auto=format&fit=crop&w=1200&q=80",
      alt: "Abstract AI gradient illustration with layered glass and glow",
    }
  );
}

export default function BlogCard({ post }: { post: BlogPost }) {
  const [loaded, setLoaded] = useState(false);
  const visual = getBlogPostVisual(post.slug);

  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-[0_18px_60px_-28px_rgba(15,23,42,0.65)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_-28px_rgba(56,189,248,0.25)]">
      <div className="relative overflow-hidden bg-slate-900">
        <div className={`absolute inset-0 animate-pulse bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 transition-opacity ${loaded ? "opacity-0" : "opacity-100"}`} />
        <img
          src={visual.url}
          alt={visual.alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className="aspect-[16/9] w-full object-cover object-center transition duration-700 ease-out"
        />
      </div>
      <div className="space-y-4 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/80">{post.category}</p>
        <h3 className="text-2xl font-semibold tracking-tight text-white">{post.title}</h3>
        <p className="text-sm leading-7 text-slate-300">{post.excerpt}</p>
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <span>{post.date}</span>
          <span>{post.readTime}</span>
        </div>
      </div>
      <Link
        to={`/blog/${post.slug}`}
        className="block border-t border-slate-800/90 bg-slate-900/70 px-6 py-4 text-sm font-semibold text-cyan-200 transition hover:bg-slate-900"
      >
        Read the full guide
      </Link>
    </article>
  );
}
