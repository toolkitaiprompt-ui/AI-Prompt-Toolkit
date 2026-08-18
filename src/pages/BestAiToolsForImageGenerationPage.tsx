import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { getSeoForPath } from "@/seoConfig";
import { toCanonical } from "@/lib/structuredData";
import AdBanner from "@/components/AdBanner";
import { TOOL_PAGES } from "@/data/tools";

export default function BestAiToolsForImageGenerationPage() {
  useEffect(() => {
    const seo = getSeoForPath("/best-ai-tools-for-image-generation");
    if (!seo.title && !seo.description) return;

    document.title = seo.title || "AI World Hub";

    const ensureMeta = (name: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      return tag;
    };

    const ensureProp = (prop: string) => {
      let tag = document.querySelector(`meta[prop="${prop}"]`) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", prop);
        document.head.appendChild(tag);
      }
      return tag;
    };

    ensureMeta("description").setAttribute("content", seo.description || "");
    ensureMeta("keywords").setAttribute("content", seo.keywords || "");
    ensureMeta("robots").setAttribute("content", "index, follow");

    ensureProp("og:title").setAttribute("content", seo.title || "AI World Hub");
    ensureProp("og:description").setAttribute("content", seo.description || "");
    ensureProp("og:type").setAttribute("content", "website");
    ensureProp("og:url").setAttribute("content", toCanonical("/best-ai-tools-for-image-generation"));

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute("href", toCanonical("/best-ai-tools-for-image-generation"));
    }

    // Hreflang
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
    const hreflangs = ["en", "en-US", "en-GB", "en-IN", "x-default"];
    const canonicalUrl = toCanonical("/best-ai-tools-for-image-generation");
    hreflangs.forEach((lang) => {
      const link = document.createElement("link");
      link.setAttribute("rel", "alternate");
      link.setAttribute("hreflang", lang);
      link.setAttribute("href", canonicalUrl);
      document.head.appendChild(link);
    });
  }, []);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const terms = query.toLowerCase();
    const matched: string[] = [];

    for (const tool of TOOL_PAGES) {
      const desc = tool.description.toLowerCase();
      if (desc.includes(terms)) {
        matched.push(tool.title);
      }
    }

    setResults(matched);
    setQuery("");
  };

  const relevantTools = [
    "/tools/image-prompt-generator",
    "/tools/prompt-formatter",
    "/tools/prompt-debugger",
    "/tools/prompt-converter",
    "/tools/mega-prompt-builder",
  ];

  const rolePrompts = [
    "/prompts/graphic-designer",
    "/prompts/artist",
    "/prompts/designer",
  ];

  return (
    <section className="site-container section-lg">
      <div className="mb-10"><AdBanner size="rectangle" /></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-400 mb-2">
          ✦ AI Image Generation Tools
        </p>
        <h1 className="font-headline font-bold text-4xl sm:text-5xl text-white mb-4">
          Best AI Tools for Image Generation 2026
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Discover the best AI tools for image generation and AI art. Compare top tools for AI art, illustrations, and design projects.
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto mb-12">
        <form onSubmit={handleSearch} className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 max-w-xl mx-auto">
          <div className="grid grid-cols-1 gap-2 mb-4">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search AI image tools..."
              aria-label="Search AI image tools"
              className="w-full pl-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white outline-none focus:border-amber-400/50 transition"
            />
            <button
              type="submit"
              className="pl-4 py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-500 transition"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {TOOL_PAGES.map((tool) => {
          if (
            !(
              tool.path === "/tools/image-prompt-generator" ||
              tool.path === "/tools/prompt-formatter" ||
              tool.path === "/tools/prompt-debugger" ||
              tool.path === "/tools/prompt-converter" ||
              tool.path === "/tools/mega-prompt-builder"
            )
          )
            return null;
          return (
            <div
              key={tool.path}
              className="group relative flex flex-col rounded-[20px] border border-white/[0.06] bg-white/[0.02] p-6 shadow-lg transition-all duration-500 hover:border-white/[0.15] hover:bg-white/[0.04] hover:shadow-xl hover:shadow-amber-500/5"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-headline font-bold text-white mb-2">
                  {tool.title}
                </h3>
                <span className="text-amber-400 text-sm font-medium">Free</span>
              </div>
              <p className="text-sm text-slate-400 mb-4 line-clamp-3">
                {tool.description}
              </p>
              <div className="mt-auto">
                <a
                  href={tool.path}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-300 text-sm font-medium hover:bg-amber-500/20 transition"
                >
                  Try Tool →
                  <svg className="w-3.5 h-3.5" viewBox="0 0 64 64" fill="none">
                    <path d="M18 20 L28 32 L18 44" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="32" y1="44" x2="46" y2="44" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                    <path d="M46 24 L48 28 L52 30 L48 32 L46 36 L44 32 L40 30 L44 28 Z" fill="currentColor" />
                  </svg>
                </a>
              </div>
            </div>
          );
        })}

        {results.length > 0 && (
          <div className="pt-6 border-t border-white/10">
            <h3 className="font-bold text-white mb-3">Also relevant:</h3>
            <ul className="text-sm text-slate-400 space-y-1">
              {results.map((name, i) => (
                <li key={i} className="flex gap-2">
                  <svg
                    className="w-3.5 h-3.5 text-amber-400"
                    viewBox="0 0 64 64"
                    fill="none"
                  >
                    <path d="M18 20 L28 32 L18 44" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="32" y1="44" x2="46" y2="44" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                    <path d="M46 24 L48 28 L52 30 L48 32 L46 36 L44 32 L40 30 L44 28 Z" fill="currentColor" />
                  </svg>
                  <span>{name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-12 pt-12 border-t border-white/10">
        <h3 className="font-bold text-white mb-4">
          AI Prompts for Creative Projects
        </h3>
        <p className="text-slate-400 mb-6">
          Ready-to-use prompts for AI art and creative image generation. Copy, paste, and get stunning results.
        </p>
        <div className="grid grid-cols-2 gap-4">
          {rolePrompts.map((path) => {
            const role = path.split("/")[2];
            return (
              <a
                key={path}
                href={path}
                className="flex items-center gap-2 p-3 rounded-full bg-slate-900/50 border border-slate-700/50 hover:bg-slate-900/60 transition text-sm text-slate-300"
              >
                <svg
                  className="w-4 h-4 text-amber-400"
                  viewBox="0 0 64 64"
                  fill="none"
                >
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="1" />
                  <path d="M20 30 L44 30 M30 20 L30 44" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span>{role.replace("-", " ")} prompts</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}