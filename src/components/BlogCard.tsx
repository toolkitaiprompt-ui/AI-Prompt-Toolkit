import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { BlogPost } from "../data/blogPosts";

const IMG = "https://images.unsplash.com";

const VISUALS: Record<string, { url: string; alt: string }> = {
    // ═══ BATCH 1: PREMIUM 3D IMAGES (6 SEO POSTS) ═══
    "best-ai-tools-2026-complete-directory": {
      url: `/images/blog-best-ai-tools.webp`,
      alt: "Premium 3D collection of the best AI tools for 2026 with floating golden icons",
    },
    "100-chatgpt-prompts-for-every-task": {
      url: `/images/blog-100-chatgpt-prompts.webp`,
      alt: "Premium 3D golden terminal window with ChatGPT prompt templates floating in space",
    },
    "how-to-use-chatgpt-complete-guide": {
      url: `/images/blog-how-to-use-chatgpt.webp`,
      alt: "Premium 3D ChatGPT chat interface with glowing golden UI elements",
    },
    "free-ai-tools-50-best-tested": {
      url: `/images/blog-free-ai-tools.webp`,
      alt: "Premium 3D floating grid of free AI tool icons with golden borders",
    },
    "prompt-engineering-complete-guide": {
      url: `/images/blog-prompt-engineering.webp`,
      alt: "Premium 3D golden prompt engineering diagram with connected nodes and code blocks",
    },
    "ai-tools-directory-categorized-list": {
      url: `/images/blog-ai-tools-directory.webp`,
      alt: "Premium 3D luxury directory grid of AI tools with golden glass panels",
    },

    // ═══ BATCH 2: PREMIUM 3D IMAGES (10 EXISTING POSTS) ═══
    "master-prompt-engineering-workflow": {
      url: `/images/blog-prompt-workflow.webp`,
      alt: "Premium 3D golden workflow diagram with connected nodes for AI prompt engineering",
    },
    "craft-high-impact-chatgpt-prompts": {
      url: `/images/blog-chatgpt-prompts-craft.webp`,
      alt: "Premium 3D golden chat bubble with structured prompt text floating in space",
    },
    "build-ai-prompt-templates-that-scale": {
      url: `/images/blog-prompt-templates-scale.webp`,
      alt: "Premium 3D golden template system showing multiple AI prompt cards stacked",
    },
    "claude-prompt-best-practices": {
      url: `/images/blog-claude-best-practices.webp`,
      alt: "Premium 3D golden AI brain neural network with Claude interface elements",
    },
    "midjourney-prompt-techniques": {
      url: `/images/blog-midjourney-techniques.webp`,
      alt: "Premium 3D golden creative palette with floating AI art elements",
    },
    "design-json-schema-for-ai-output": {
      url: `/images/blog-json-schema-design.webp`,
      alt: "Premium 3D golden JSON code editor with structured schema blocks",
    },
    "boost-ai-productivity-with-prompt-systems": {
      url: `/images/blog-ai-productivity.webp`,
      alt: "Premium 3D golden productivity dashboard with floating metrics and charts",
    },
    "optimize-prompts-for-better-ai-performance": {
      url: `/images/blog-optimize-prompts.webp`,
      alt: "Premium 3D golden optimization graph with upward trending arrows",
    },
    "automate-ai-tasks-with-prompt-workflows": {
      url: `/images/blog-automate-tasks.webp`,
      alt: "Premium 3D golden automation pipeline with connected gears and data streams",
    },
    "orchestrate-llm-workflows-for-productive-teams": {
      url: `/images/blog-llm-workflows.webp`,
      alt: "Premium 3D golden LLM architecture diagram with interconnected nodes",
    },

    // ═══ BATCH 3: UNSPLASH (baki posts - achhi quality) ═══
    "prompt-audit-and-iteration-strategies": {
      url: `${IMG}/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80`,
      alt: "Desk with notes and planning for prompt audit and iteration strategies",
    },
    "customer-support-prompt-templates": {
      url: `${IMG}/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80`,
      alt: "Customer support agent using AI prompt templates for faster responses",
    },
    "marketing-chatgpt-prompt-patterns": {
      url: `${IMG}/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80`,
      alt: "Marketing team using ChatGPT prompt patterns for content creation",
    },
    "enterprise-claude-prompt-engineering": {
      url: `${IMG}/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80`,
      alt: "Modern enterprise building representing Claude prompt engineering at scale",
    },
    "midjourney-prompts-for-creative-visuals": {
      url: `${IMG}/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=1200&q=80`,
      alt: "Vibrant creative visuals produced with Midjourney prompts",
    },
    "validate-ai-outputs-with-json-schema": {
      url: `${IMG}/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80`,
      alt: "Computer screen showing JSON schema validation for AI output checking",
    },
    "scale-ai-productivity-with-reusable-prompts": {
      url: `${IMG}/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80`,
      alt: "Scalable workspace for reusing AI prompts to boost productivity",
    },
    "prompt-optimization-for-cost-and-quality": {
      url: `${IMG}/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80`,
      alt: "Financial analytics for prompt cost optimization and quality balance",
    },
    "business-automation-with-ai-prompts": {
      url: `${IMG}/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=80`,
      alt: "Laptop showing business automation powered by AI prompts",
    },
    "deploy-llm-workflows-for-team-collaboration": {
      url: `${IMG}/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80`,
      alt: "Cloud infrastructure for deploying LLM workflows across teams",
    },
    "prompts-for-ai-reliability-and-governance": {
      url: `${IMG}/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80`,
      alt: "Security shield representing AI reliability and prompt governance",
    },
    "trusted-prompt-templates-for-team-use": {
      url: `${IMG}/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80`,
      alt: "Diverse team building trusted prompt templates for collaboration",
    },
    "ai-workflow-automation-for-operations": {
      url: `${IMG}/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80`,
      alt: "Operations specialist managing AI workflow automation",
    },
    "llm-workflow-best-practices-for-innovation": {
      url: `${IMG}/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=1200&q=80`,
      alt: "Innovative technology workspace for LLM workflow best practices",
    },
    "ai-prompt-template-governance-for-growth": {
      url: `${IMG}/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80`,
      alt: "Business strategy planning for AI prompt template governance and growth",
    },
};

function getBlogPostVisual(postSlug: string): { url: string; alt: string } {
  return (
    VISUALS[postSlug] ?? {
      url: `${IMG}/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80`,
      alt: "AI prompt engineering tools and interfaces",
    }
  );
}

export default function BlogCard({ post }: { post: BlogPost }) {
  const [loaded, setLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const visual = getBlogPostVisual(post.slug);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[20px] border border-white/[0.06] bg-white/[0.02] shadow-lg transition-all duration-500 hover:border-white/[0.15] hover:bg-white/[0.04] hover:shadow-xl hover:shadow-amber-500/5">
      {/* Image */}
      <div className="relative overflow-hidden bg-slate-900">
        <div className={`absolute inset-0 animate-pulse bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 transition-opacity ${loaded ? "opacity-0" : "opacity-100"}`} />
        {imgError ? (
          <div className="flex aspect-[16/9] w-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950">
            <span className="text-3xl font-bold tracking-tight text-cyan-400/40">AI World Hub</span>
          </div>
        ) : (
          <img
            src={visual.url}
            alt={visual.alt}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => setImgError(true)}
            className="aspect-[16/9] w-full object-cover object-center transition duration-700 ease-out group-hover:scale-105"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Category */}
        <p className="mb-2 inline-flex self-start rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300/90">
          {post.category}
        </p>

        {/* Title */}
        <h3 className="mb-2 text-base font-semibold leading-snug tracking-tight text-white">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="mb-3 text-xs leading-5 text-slate-400 flex-1">
          {post.excerpt}
        </p>

        {/* Meta + CTA */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] pt-4">
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
            <span>{post.date}</span>
            <span className="hidden sm:inline">·</span>
            <span>{post.readTime}</span>
          </div>
          <Link
            to={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-amber-400 transition-colors hover:text-amber-300"
          >
            <span>Read</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
