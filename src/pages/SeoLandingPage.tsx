import { Link, useLocation } from "react-router-dom";
import { ArrowRight, ArrowUpRight, BookOpen, Sparkles, Wrench } from "lucide-react";
import useSeo from "../hooks/useSeo";
import { TOOL_PAGES } from "../data/tools";
import { BLOG_POSTS } from "../data/blogPosts";

/**
 * Generic SEO landing page — fixes orphan pages that were prerendered and in
 * the sitemap but had no SPA route (soft 404s). Renders a real page with the
 * route's title/meta, popular tools, and related guides. Not a doorway page:
 * every section links to real, working content.
 */

interface LandingConfig {
  title: string;
  desc: string;
  intro: string;
  tools: string[]; // tool paths
  guides: string[]; // blog slugs
  cta: string;
}

const LANDINGS: Record<string, LandingConfig> = {
  "/ai-tools-for-students": {
    title: "Top Free AI Tools for Students | AI World Hub",
    desc: "Free AI tools for students — writing, research, study aids, and productivity without subscription required.",
    intro: "Students get better results with AI when they use the right tools. These free, in-browser prompt tools cover essays, research, studying, and daily productivity — no signup, no cost, and your work never leaves your device.",
    tools: ["/tools/advanced-prompt-optimizer", "/tools/prompt-debugger", "/tools/token-estimator", "/tools/prompt-chain-builder"],
    guides: ["chatgpt-prompts-for-students", "how-to-write-better-ai-prompts-2026", "what-is-prompt-engineering-guide"],
    cta: "Optimize your study prompts",
  },
  "/ai-tools-for-small-business": {
    title: "Top Free AI Tools for Small Business | AI World Hub",
    desc: "Free AI tools that help small businesses with content, design, marketing, and productivity — no budget required.",
    intro: "Small businesses can do marketing, content, and customer support with free AI tools. These in-browser prompt tools help you write better, plan faster, and automate repetitive work — without a marketing budget.",
    tools: ["/tools/advanced-prompt-optimizer", "/tools/prompt-chain-builder", "/tools/security-scanner", "/tools/mega-prompt-builder"],
    guides: ["ai-tools-for-small-business-india", "ai-prompts-for-business-growth", "how-to-make-money-with-chatgpt-in-india"],
    cta: "Build better business prompts",
  },
  "/ai-prompt-templates-business": {
    title: "AI Prompt Templates for Business | AI World Hub",
    desc: "Browse and use reusable AI prompt templates for common business tasks — marketing, sales, customer support, operations.",
    intro: "Reusable AI prompt templates save hours every week. These business-focused templates cover marketing, sales, support, and operations — copy, customize, and use them in ChatGPT, Claude, or Gemini.",
    tools: ["/tools/advanced-prompt-optimizer", "/tools/prompt-chain-builder", "/tools/prompt-formatter", "/tools/prompt-variable-extractor"],
    guides: ["ai-prompts-for-business-growth", "how-to-write-better-ai-prompts-2026", "build-ai-prompt-templates-that-scale"],
    cta: "Polish a business template",
  },
  "/ai-prompt-templates-marketing": {
    title: "AI Prompt Templates for Marketing | AI World Hub",
    desc: "30 ChatGPT prompts for content writers — blogs, SEO, social, email newsletters. Copy-paste templates that cut writing time in half.",
    intro: "Marketing teams write the same kinds of content every week — ads, emails, posts, blogs. These ready-to-use prompt templates speed that up, and the Optimizer keeps every template sharp.",
    tools: ["/tools/advanced-prompt-optimizer", "/tools/prompt-chain-builder", "/tools/token-estimator", "/tools/prompt-debugger"],
    guides: ["marketing-chatgpt-prompt-patterns", "chatgpt-prompts-for-content-writers", "how-to-write-better-ai-prompts-2026"],
    cta: "Optimize a marketing prompt",
  },
  "/ai-prompt-templates-developers": {
    title: "AI Prompt Templates for Developers | AI World Hub",
    desc: "Code generation, debugging, and documentation prompts for developers. Free prompt templates to accelerate development workflows.",
    intro: "Developers can turn ChatGPT, Claude, and Gemini into faster pair-programmers with structured prompts — code generation, debugging, review, and docs. These templates give you the structure; the tools keep it reliable.",
    tools: ["/tools/advanced-prompt-optimizer", "/tools/prompt-debugger", "/tools/api-request-builder", "/tools/regex-generator"],
    guides: ["chatgpt-prompts-for-coding-interviews", "best-ai-coding-tools-2026", "claude-prompt-best-practices"],
    cta: "Improve a coding prompt",
  },
  "/ai-models-comparison": {
    title: "ChatGPT vs Claude vs Gemini — Full Comparison | AI World Hub",
    desc: "Side-by-side comparison of the top three AI models — strengths, weaknesses, and best use cases for 2026.",
    intro: "ChatGPT, Claude, and Gemini all excel — at different things. This guide breaks down their strengths, weaknesses, and best use cases, and shows you how to write prompts that get the most out of each model.",
    tools: ["/tools/prompt-converter", "/tools/advanced-prompt-optimizer", "/tools/prompt-comparison", "/tools/prompt-debugger"],
    guides: ["how-to-write-better-prompts-claude-chatgpt-2026", "chatgpt-vs-claude-vs-gemini-comparison", "claude-vs-chatgpt-for-coding"],
    cta: "Convert a prompt between models",
  },
  "/ai-trends-2026-guide": {
    title: "AI Trends to Watch in 2026 | AI World Hub",
    desc: "The definitive guide to AI trends shaping 2026 — what's new, what's changing, and what to watch.",
    intro: "From agentic workflows to multimodal models, 2026 is moving fast. This guide explains the trends that matter and the free tools you can use to stay ahead of them.",
    tools: ["/tools/advanced-prompt-optimizer", "/tools/prompt-chain-builder", "/tools/token-estimator", "/tools/security-scanner"],
    guides: ["ai-trends-2026-complete-guide", "how-to-write-better-ai-prompts-2026", "best-free-ai-prompt-tools-2026"],
    cta: "Build prompts for the new AI era",
  },
  "/ai-for-productivity": {
    title: "Boost AI Productivity 2026 | AI World Hub",
    desc: "AI tools that boost productivity for work and personal projects — writing, coding, design, and automation.",
    intro: "AI is the fastest productivity upgrade available today. These free in-browser tools help you write, plan, code, and automate faster — the practical side of AI productivity.",
    tools: ["/tools/advanced-prompt-optimizer", "/tools/prompt-chain-builder", "/tools/content-summarizer", "/tools/token-estimator"],
    guides: ["boost-ai-productivity-with-prompt-systems", "automate-ai-tasks-with-prompt-workflows", "how-to-write-better-ai-prompts-2026"],
    cta: "Streamline your AI workflow",
  },
  "/ai-for-content-creation": {
    title: "AI for Content Creation 2026 | AI World Hub",
    desc: "Free AI tools that help content creators with writing, ideas, and production — no budget required.",
    intro: "Creators who use AI publish more and faster. These free prompt tools handle the writing and planning side of content creation — scripts, captions, outlines, and edits.",
    tools: ["/tools/advanced-prompt-optimizer", "/tools/prompt-chain-builder", "/tools/content-summarizer", "/tools/prompt-translator"],
    guides: ["free-ai-tools-for-youtube-creators", "chatgpt-prompts-for-content-writers", "best-midjourney-prompts-2026"],
    cta: "Create better content prompts",
  },
  "/ai-for-research": {
    title: "AI for Research and Analysis | AI World Hub",
    desc: "How to use AI for research — literature review, data collection, survey design, and analysis prompts.",
    intro: "AI can speed up literature review, data collection, and analysis — when you prompt it correctly. These free tools help you structure research prompts and keep your findings organized.",
    tools: ["/tools/advanced-prompt-optimizer", "/tools/prompt-chain-builder", "/tools/content-summarizer", "/tools/security-scanner"],
    guides: ["prompt-engineering-complete-guide", "rag-prompt-engineering-guide", "how-to-write-better-ai-prompts-2026"],
    cta: "Structure a research prompt",
  },
  "/free-ai-tools-content-creators": {
    title: "Free AI Tools for Content Creators | AI World Hub",
    desc: "10 free AI tools for YouTube creators — scripts, titles, descriptions, thumbnails, channel growth. Publish faster, grow without spending.",
    intro: "From scripts to titles to thumbnails, free AI tools help creators publish faster. These prompt tools handle the writing workflow; the guides cover the full creator stack.",
    tools: ["/tools/advanced-prompt-optimizer", "/tools/prompt-chain-builder", "/tools/prompt-translator", "/tools/token-estimator"],
    guides: ["free-ai-tools-for-youtube-creators", "chatgpt-prompts-for-content-writers", "how-to-write-better-ai-prompts-2026"],
    cta: "Optimize your creator prompts",
  },
  "/ai-tools-for-social-media": {
    title: "Free AI Tools for Social Media 2026 | AI World Hub",
    desc: "10 free AI tools for social media — caption generators, hashtag optimizers, image & video editors, and schedulers. In-browser, no sign-up.",
    intro: "Social media runs on content volume. These free prompt tools help you write captions, plan posts, and keep your voice consistent across every platform.",
    tools: ["/tools/advanced-prompt-optimizer", "/tools/prompt-chain-builder", "/tools/prompt-formatter", "/tools/prompt-translator"],
    guides: ["chatgpt-prompts-for-content-writers", "free-ai-tools-for-youtube-creators", "marketing-chatgpt-prompt-patterns"],
    cta: "Write better social prompts",
  },
  "/ai-prompt-patterns": {
    title: "AI Prompt Patterns & Structures | AI World Hub",
    desc: "Learn proven prompt patterns that work across ChatGPT, Claude, and Gemini — with ready-to-use examples and model-specific variations.",
    intro: "Prompt patterns are reusable structures that get reliable results. This guide covers the most effective patterns and pairs them with free tools that apply them automatically.",
    tools: ["/tools/advanced-prompt-optimizer", "/tools/prompt-chain-builder", "/tools/prompt-debugger", "/tools/prompt-comparison"],
    guides: ["prompt-engineering-complete-guide", "chain-of-thought-prompting-guide", "few-shot-prompting-guide"],
    cta: "Apply a pattern to your prompt",
  },
};

export default function SeoLandingPage() {
  const { pathname } = useLocation();
  const cfg = LANDINGS[pathname];
  useSeo(cfg?.title, cfg?.desc);

  if (!cfg) {
    return (
      <div className="site-container section-lg">
        <h1 className="text-3xl font-bold text-white">Page not found</h1>
        <Link to="/" className="mt-4 inline-block text-amber-400 hover:text-amber-300">Back to home</Link>
      </div>
    );
  }

  const tools = cfg.tools.map((p) => TOOL_PAGES.find((t) => t.path === p)).filter((t): t is (typeof TOOL_PAGES)[number] => Boolean(t));
  const guides = cfg.guides.map((s) => BLOG_POSTS.find((p) => p.slug === s)).filter((g): g is (typeof BLOG_POSTS)[number] => Boolean(g));

  return (
    <div className="site-container section-lg">
      <div className="rounded-[20px] sm:rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-950/60 to-slate-950/80 p-5 sm:p-8 shadow-2xl shadow-indigo-500/10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-400/80">Free AI Tools Guide</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">{cfg.title.replace(" | AI World Hub", "")}</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-400">{cfg.intro}</p>
      </div>

      {/* Popular tools */}
      <section className="mt-10">
        <div className="mb-5 flex items-center gap-2">
          <Wrench className="h-5 w-5 text-amber-400" aria-hidden="true" />
          <h2 className="text-xl font-bold text-white">Free tools to use right now</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => (
            <Link
              key={tool.path}
              to={tool.path}
              className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/40 p-4 transition hover:border-amber-400/30 hover:bg-slate-900/70"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900/80 border border-white/10">
                <tool.icon className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <span className="flex-1 text-sm font-medium text-slate-200 group-hover:text-white">{tool.title}</span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-500 transition group-hover:text-amber-400" />
            </Link>
          ))}
        </div>
      </section>

      {/* Related guides */}
      {guides.length > 0 && (
        <section className="mt-10">
          <div className="mb-5 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-amber-400" aria-hidden="true" />
            <h2 className="text-xl font-bold text-white">Related guides</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group rounded-2xl border border-white/10 bg-slate-900/40 p-4 transition hover:border-amber-400/30 hover:bg-slate-900/70"
              >
                <p className="text-sm font-semibold text-slate-200 group-hover:text-white">{post.title}</p>
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mt-10 rounded-[20px] border border-amber-500/20 bg-slate-950/50 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-amber-400" aria-hidden="true" />
            <p className="text-base font-semibold text-white">{cfg.cta} — free, in-browser, no signup</p>
          </div>
          <Link
            to="/tools/advanced-prompt-optimizer"
            className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-400"
          >
            Try the free Prompt Optimizer
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
