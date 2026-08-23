import { useJsonLd, softwareAppJsonLd, faqPageJsonLd, breadcrumbJsonLd, toolFaq, toolNameFromTitle } from "../lib/structuredData";
import useSeo from "../hooks/useSeo";
import { BLOG_POSTS } from "../data/blogPosts";
import { ACTIVE_TOOL_COUNT, TOOL_PAGES, TOOL_CATEGORIES, type ToolMeta } from "../data/tools";
import { getRolesForTool } from "../lib/contentHub";
import AdBanner, { ADSTERRA_ZONES } from "./AdBanner";
import BlogCard from "./BlogCard";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import type { ReactNode } from "react";

function getRelatedTools(toolPath: string, limit: number = 4): ToolMeta[] {
  const currentTool = TOOL_PAGES.find((t) => t.path === toolPath);
  if (!currentTool) return [];

  const currentCategory = currentTool.category;
  const currentBenefits = new Set(currentTool.keyBenefits ?? []);

  const scored: Array<{ tool: ToolMeta; score: number }> = [];

  for (const candidate of TOOL_PAGES) {
    if (candidate.path === toolPath) continue;

    let score = 0;
    if (candidate.category === currentCategory) score += 3;
    const candidateBenefits = new Set(candidate.keyBenefits ?? []);
    const benefitOverlap = [...currentBenefits].filter((b) => candidateBenefits.has(b));
    score += benefitOverlap.length * 2;

    if (score > 0) {
      scored.push({ tool: candidate, score });
    }
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ tool }) => tool);
}

export function getBlogPostsForTool(toolSlug: string) {
  return BLOG_POSTS.filter((post) => post.relatedToolSlugs.includes(toolSlug));
}

function getCategoryName(category: string | undefined): string {
  const mapping: Record<string, string> = {
    writing: "Writing & Content",
    coding: "Development & Code",
    marketing: "Marketing & Sales",
    business: "Business & Strategy",
    creative: "Creative & Design",
  };
  return mapping[category] || "prompt engineering";
}

function ToolContainer({
  title, description, toolSlug, tool, children,
}: {
  title: string; description: string; toolSlug?: string; tool?: ToolMeta; children: ReactNode;
}) {
  const keywords = `${title}, Best AI Tools, Free AI Tools, Prompt Engineering, ChatGPT Prompts`;
  const relatedBlogs = toolSlug ? getBlogPostsForTool(toolSlug) : [];

  const seoTitle = title.includes("AI World Hub") ? title : `${title} | AI World Hub`;
  useSeo(seoTitle, description, keywords);

  const toolName = toolNameFromTitle(title);
  useJsonLd(
    tool
      ? [
          softwareAppJsonLd(toolName, description, window.location.pathname),
          faqPageJsonLd(toolFaq(toolName, description)),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: toolName, path: window.location.pathname },
          ]),
        ]
      : null,
    [title, description, toolSlug],
  );

  const relatedTools = useMemo(() => {
    const currentPath = tool?.path ?? (toolSlug ? `/tools/${toolSlug}` : "");
    const auto = getRelatedTools(currentPath, 3);
    // Curated high-traffic core tools — always cross-link these so users
    // discover the most useful tools, then append the automatic matches.
    const corePaths = [
      "/tools/advanced-prompt-optimizer",
      "/tools/prompt-chain-builder",
      "/tools/prompt-debugger",
      "/tools/token-estimator",
      "/tools/mega-prompt-builder",
    ].filter((p) => p !== currentPath);
    const core = corePaths
      .map((p) => TOOL_PAGES.find((t) => t.path === p))
      .filter((t): t is ToolMeta => Boolean(t));
    const seen = new Set<string>();
    return [...core, ...auto].filter((t) => {
      if (seen.has(t.path)) return false;
      seen.add(t.path);
      return true;
    });
  }, [toolSlug, tool?.path]);

  return (
    <section className="site-container section-lg space-y-16">
      <div className="rounded-[20px] sm:rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-950/60 to-slate-950/80 p-5 sm:p-8 shadow-2xl shadow-indigo-500/10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          {tool && (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[14px] bg-slate-900/80 border border-white/10">
              <tool.icon className="h-8 w-8 text-white" aria-hidden="true" />
            </div>
          )}
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-400/80">
                {tool?.premium ? "Premium Tool" : "Free Tool"}
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">{title}</h1>
            </div>
            <p className="max-w-2xl text-base leading-7 text-slate-400">{description}</p>
            {tool?.keyBenefits && (
              <div className="flex flex-wrap gap-3 pt-1">
                {tool.keyBenefits.map((benefit) => (
                  <span
                    key={benefit}
                    className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    {benefit}
                  </span>
                ))}
              </div>
            )}
            {/* Share bar — make tool pages easy to share */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Share:</span>
              {[
                { label: "X", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent("https://aiworldhub.site" + window.location.pathname)}` },
                { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(title + " " + "https://aiworldhub.site" + window.location.pathname)}` },
                { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://aiworldhub.site" + window.location.pathname)}` },
                { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://aiworldhub.site" + window.location.pathname)}` },
              ].map((soc) => (
                <a
                  key={soc.label}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 transition hover:border-amber-400/40 hover:text-amber-300"
                >
                  {soc.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-white/10 bg-slate-950/80 p-6 shadow-xl">
        <div className="space-y-4">{children}</div>
      </div>

      {/* One controlled display-ad test after the completed tool workflow.
          It is visibly labelled by AdBanner and separated from controls/navigation. */}
      <AdBanner
        network="adsterra"
        zoneId={ADSTERRA_ZONES.rectangle.key}
        size="rectangle"
      />

      {relatedBlogs.length > 0 && (
        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-400">Related reading</p>
              <h2 className="mt-1 text-2xl font-bold text-white">Deep-dive guides for this tool</h2>
            </div>
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-400 hover:text-amber-300 transition"
            >
              View all guides
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {relatedBlogs.slice(0, 4).map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      {relatedTools.length > 0 && (
        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-400/80">
                Related tools
              </p>
              <h2 className="mt-1 text-2xl font-bold text-white">Related tools to try next</h2>
            </div>
            <Link
              to="/tools"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-400 hover:text-amber-300 transition"
            >
              View all tools
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedTools.map((t) => (
              <Link
                key={t.path}
                to={t.path}
                className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/40 p-4 transition hover:border-amber-400/30 hover:bg-slate-900/70"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900/80 border border-white/10">
                  <t.icon className="h-5 w-5 text-white" aria-hidden="true" />
                </div>
                <span className="flex-1 text-sm font-medium text-slate-200 group-hover:text-white">
                  {t.title}</span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-500 transition group-hover:text-amber-400" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {tool && (
        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-400/80">
                Useful prompts for {getCategoryName(tool.category)}
              </p>
              <h2 className="mt-1 text-xl font-bold text-white">Learn & get results faster</h2>
            </div>
          </div>

          {/* Prompt-library role pages that fit this tool */}
          <div className="mb-6 flex flex-wrap gap-3">
            {getRolesForTool(tool.path, 4).map((role) => (
              <Link
                key={role.slug}
                to={role.path}
                className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/40 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-amber-400/40 hover:bg-slate-900/70 hover:text-white"
              >
                {role.title}
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-500 transition group-hover:text-amber-400" />
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/prompts"
              className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/40 p-4 transition hover:border-amber-400/30 hover:bg-slate-900/70"
            >
              <svg
                className="w-5 h-5 text-amber-400"
                viewBox="0 0 64 64"
                fill="none"
              >
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="1" />
                <path d="M20 30 L44 30 M30 20 L30 44" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span>
                <span className="font-medium text-white">Browse the prompt library</span>
                <span className="text-sm text-slate-500">/ prompts · 15 role collections</span>
              </span>
            </Link>
            <Link
              to="/blog/best-ai-tools-2026-complete-directory"
              className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/40 p-4 transition hover:border-amber-400/30 hover:bg-slate-900/70"
            >
              <svg
                className="w-5 h-5 text-amber-400"
                viewBox="0 0 64 64"
                fill="none"
              >
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="1" />
                <path d="M20 30 L44 30 M30 20 L30 44" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span>
                <span className="font-medium text-white">Best AI Tools 2026 Directory</span>
                <span className="text-sm text-slate-500">/ blog</span>
              </span>
            </Link>
          </div>
        </section>
      )}

<AdBanner network="custom" />

      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-400/80">
              More tools
            </p>
            <h2 className="mt-1 text-xl font-bold text-white">Expand your prompt engineering toolkit</h2>
          </div>
          <Link
            to="/tools"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-400 hover:text-amber-300 transition"
          >
            View all {ACTIVE_TOOL_COUNT} free AI tools
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Browse all — clear text link near the bottom of every tool page */}
      <div className="pt-2">
        <Link
          to="/tools"
          className="group inline-flex items-center gap-1.5 text-base font-semibold text-amber-400 transition hover:text-amber-300"
        >
          Browse all free tools
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </section>
  );
}
export default ToolContainer;