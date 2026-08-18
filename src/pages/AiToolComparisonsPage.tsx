import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { getSeoForPath } from "@/seoConfig";
import { toCanonical } from "@/lib/structuredData";
import AdBanner from "@/components/AdBanner";
import { TOOL_PAGES } from "@/data/tools";

export default function AiToolComparisonsPage() {
  useEffect(() => {
    const seo = getSeoForPath("/ai-tool-comparisons");
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
    ensureProp("og:url").setAttribute("content", toCanonical("/ai-tool-comparisons"));

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute("href", toCanonical("/ai-tool-comparisons"));
    }

    // Hreflang
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
    const hreflangs = ["en", "en-US", "en-GB", "en-IN", "x-default"];
    const canonicalUrl = toCanonical("/ai-tool-comparisons");
    hreflangs.forEach((lang) => {
      const link = document.createElement("link");
      link.setAttribute("rel", "alternate");
      link.setAttribute("hreflang", lang);
      link.setAttribute("href", canonicalUrl);
      document.head.appendChild(link);
    });
  }, []);

  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const terms = query.toLowerCase();
    setQuery("");
  };

  const writingTools = TOOL_PAGES.filter(
    (t) =>
      t.path === "/tools/prompt-variable-extractor" ||
      t.path === "/tools/prompt-formatter" ||
      t.path === "/tools/prompt-debugger" ||
      t.path === "/tools/content-summarizer" ||
      t.path === "/tools/advanced-prompt-optimizer"
  );

  const codingTools = TOOL_PAGES.filter(
    (t) =>
      t.path === "/tools/prompt-variable-extractor" ||
      t.path === "/tools/json-schema-generator" ||
      t.path === "/tools/api-request-builder" ||
      t.path === "/tools/prompt-converter" ||
      t.path === "/tools/security-scanner"
  );

  const imageTools = TOOL_PAGES.filter(
    (t) =>
      t.path === "/tools/image-prompt-generator" ||
      t.path === "/tools/prompt-formatter" ||
      t.path === "/tools/prompt-debugger" ||
      t.path === "/tools/prompt-converter" ||
      t.path === "/tools/mega-prompt-builder"
  );

  const comparisonSets = useMemo(
    () => [
      {
        name: "Prompt Optimizer vs Chain Builder",
        tools: [
          {
            title: "Advanced Prompt Optimizer",
            path: "/tools/advanced-prompt-optimizer",
            description:
              "Polish and amplify prompts with advanced structuring — role, format, tone, and constraint patterns applied automatically.",
            icon: "Sparkles",
          },
          {
            title: "Prompt Chain Builder",
            path: "/tools/prompt-chain-builder",
            description:
              "Build multi-step prompt chains with up to 5 sequential steps. Each step supports custom output formats.",
            icon: "Link2",
          },
        ],
      },
      {
        name: "Prompt Converter Showdown",
        tools: [
          {
            title: "Prompt Converter",
            path: "/tools/prompt-converter",
            description:
              "Convert ChatGPT prompts to Claude, Gemini, or Cursor format instantly. Adapt tone, structure, and directives.",
            icon: "ArrowLeftRight",
          },
          {
            title: "Persona Builder",
            path: "/tools/persona-builder",
            description:
              "Generate expert system prompts for AI roles like Marketer, Developer, or Analyst instantly.",
            icon: "UserCircle",
          },
        ],
      },
      {
        name: "Image Prompt Generators",
        tools: [
          {
            title: "AI Image Prompt Generator",
            path: "/tools/image-prompt-generator",
            description:
              "Generate production-ready image prompts for DALL-E, Midjourney, and Stable Diffusion. Choose art style, mood, and camera angle.",
            icon: "Image",
          },
          {
            title: "Mega Prompt Builder",
            path: "/tools/mega-prompt-builder",
            description:
              "Build production-grade AI prompts with an 8-step guided wizard — role, task, context, audience, format, tone, constraints, and examples.",
            icon: "Hammer",
          },
        ],
      },
    ],
    []
  );

  return (
    <section className="site-container section-lg">
      <div className="mb-10"><AdBanner size="rectangle" /></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-400 mb-2">
          ✦ AI Tool Comparisons
        </p>
        <h1 className="font-headline font-bold text-4xl sm:text-5xl text-white mb-4">
          AI Tool Comparisons 2026
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Compare the top AI tools side-by-side. Find the right tool for your needs with detailed comparisons of features, pricing, and capabilities.
        </p>
      </motion.div>

      <div className="mb-8">
        <div className="flex gap-2 justify-center mb-4">
          <button
            onClick={() => setCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              category === "all"
                ? "bg-amber-500/15 text-amber-300 border border-amber-400/30"
                : "bg-slate-900/50 text-slate-400 border border-slate-700/50 hover:border-slate-600"
            }`}
          >
            All Tools
          </button>
          <button
            onClick={() => setCategory("writing")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              category === "writing"
                ? "bg-amber-500/15 text-amber-300 border border-amber-400/30"
                : "bg-slate-900/50 text-slate-400 border border-slate-700/50 hover:border-slate-600"
            }`}
          >
            Writing
          </button>
          <button
            onClick={() => setCategory("coding")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              category === "coding"
                ? "bg-amber-500/15 text-amber-300 border border-amber-400/30"
                : "bg-slate-900/50 text-slate-400 border border-slate-700/50 hover:border-slate-600"
            }`}
          >
            Coding
          </button>
          <button
            onClick={() => setCategory("image")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              category === "image"
                ? "bg-amber-500/15 text-amber-300 border border-amber-400/30"
                : "bg-slate-900/50 text-slate-400 border border-slate-700/50 hover:border-slate-600"
            }`}
          >
            Image Generation
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {comparisonSets
          .filter((set) => category === "all" || set.name.toLowerCase().includes(category))
          .map((set, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col rounded-[20px] border border-white/[0.06] bg-white/[0.02] p-6 shadow-lg transition-all duration-500 hover:border-white/[0.15] hover:bg-white/[0.04] hover:shadow-xl hover:shadow-amber-500/5"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-headline font-bold text-white mb-2">
                  {set.name}
                </h3>
              </div>
              <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                Compare top AI tools side-by-side for your use case.
              </p>
              <div className="space-y-3">
                {set.tools.map((t, i) => (
                  <div key={i} className="flex items-start gap-3 mb-3">
                    <span
                      className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0"
                    />
                    <div>
                      <h4 className="font-medium text-white">{t.title}</h4>
                      <p className="text-sm text-slate-400 line-clamp-2">
                        {t.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <a
                  href={set.tools[0].path}
                  className="mt-auto inline-flex items-center gap-2 py-2.5 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-300 text-sm font-medium hover:bg-amber-500/20 transition"
                >
                  Try First Tool →
                  <svg
                    className="w-3.5 h-3.5"
                    viewBox="0 0 64 64"
                    fill="none"
                  >
                    <path d="M18 20 L28 32 L18 44" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="32" y1="44" x2="46" y2="44" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                    <path d="M46 24 L48 28 L52 30 L48 32 L46 36 L44 32 L40 30 L44 28 Z" fill="currentColor" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
      </div>

      <div className="mt-12 pt-12 border-t border-white/10">
        <h3 className="font-bold text-white mb-4">
          Related AI Prompt Tools
        </h3>
        <p className="text-slate-400 mb-6">
          Use these complementary prompt tools to get better results from any AI platform.
        </p>
        <div className="grid grid-cols-2 gap-4">
          {[
            "/tools/prompt-formatter",
            "/tools/prompt-debugger",
            "/tools/prompt-variable-extractor",
            "/tools/json-schema-generator",
          ].map((path) => {
            const tool = TOOL_PAGES.find((t) => t.path === path);
            if (!tool) return null;
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
                <span>{tool.title}</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}