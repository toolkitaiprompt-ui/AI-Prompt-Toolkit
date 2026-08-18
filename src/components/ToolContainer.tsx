import { useJsonLd, softwareAppJsonLd, faqPageJsonLd, breadcrumbJsonLd, toolFaq, toolNameFromTitle } from "../lib/structuredData";
import useSeo from "../hooks/useSeo";
import { BLOG_POSTS } from "../data/blogPosts";
import { TOOL_PAGES, type ToolMeta } from "../data/tools";
import AdBanner from "./AdBanner";
import BlogCard from "./BlogCard";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";

export function getBlogPostsForTool(toolSlug: string) {
  return BLOG_POSTS.filter((post) => post.relatedToolSlugs.includes(toolSlug));
}

function ToolContainer({
  title, description, toolSlug, tool, children,
}: {
  title: string; description: string; toolSlug?: string; tool?: ToolMeta; children: ReactNode;
}) {
  const keywords = `${title}, Best AI Tools, Free AI Tools, Prompt Engineering, ChatGPT Prompts`;
  const relatedBlogs = toolSlug ? getBlogPostsForTool(toolSlug) : [];

  useSeo(title, description, keywords);

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

  return (
    <section className="site-container section-lg space-y-16">
      <div className="rounded-[20px] sm:rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-950/60 to-slate-950/80 p-5 sm:p-8 shadow-2xl shadow-indigo-500/10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          {tool && (
            <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br ${tool.accent} border border-white/10`}>
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
          </div>
        </div>
      </div>



      <AdBanner size="rectangle" />

      <div className="rounded-[24px] border border-white/10 bg-slate-950/80 p-6 shadow-xl">
        <div className="space-y-4">{children}</div>
      </div>

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

      {/* More tools — cross-linking: more pageviews = more ad impressions */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-400/80">Explore more</p>
            <h2 className="mt-1 text-2xl font-bold text-white">More Free AI Tools</h2>
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
          {TOOL_PAGES.filter((t) => t.path !== tool?.path).slice(0, 6).map((t) => (
            <Link
              key={t.path}
              to={t.path}
              className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/40 p-4 transition hover:border-amber-400/30 hover:bg-slate-900/70"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${t.accent} border border-white/10`}>
                <t.icon className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <span className="flex-1 text-sm font-medium text-slate-200 group-hover:text-white">{t.title}</span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-500 transition group-hover:text-amber-400" />
            </Link>
          ))}
        </div>
      </section>

      <AdBanner network="custom" />
    </section>
  );
}

export default ToolContainer;
