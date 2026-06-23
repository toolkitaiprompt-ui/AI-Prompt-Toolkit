import { useState } from "react";
import { Link } from "react-router-dom";
import type { BlogPost } from "../data/blogPosts";

const IMG = "https://images.unsplash.com";

function getBlogPostVisual(postSlug: string): { url: string; alt: string } {
  const visuals: Record<string, { url: string; alt: string }> = {
    "master-prompt-engineering-workflow": {
      url: `${IMG}/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80`,
      alt: "Circuit board representing AI prompt engineering workflows and data processing",
    },
    "craft-high-impact-chatgpt-prompts": {
      url: `${IMG}/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80`,
      alt: "ChatGPT AI chatbot interface on a screen for crafting effective prompts",
    },
    "build-ai-prompt-templates-that-scale": {
      url: `${IMG}/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80`,
      alt: "Developer building scalable AI prompt template code on a laptop",
    },
    "claude-prompt-best-practices": {
      url: `${IMG}/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1200&q=80`,
      alt: "Person working with an AI assistant interface for Claude prompt best practices",
    },
    "midjourney-prompt-techniques": {
      url: `${IMG}/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=1200&q=80`,
      alt: "Creative digital artwork generated with Midjourney prompt techniques",
    },
    "design-json-schema-for-ai-output": {
      url: `${IMG}/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80`,
      alt: "Code editor showing JSON schema design for structured AI output",
    },
    "boost-ai-productivity-with-prompt-systems": {
      url: `${IMG}/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1200&q=80`,
      alt: "Productive workspace with AI prompt systems boosting team efficiency",
    },
    "optimize-prompts-for-better-ai-performance": {
      url: `${IMG}/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80`,
      alt: "Analytics dashboard for optimizing AI prompt performance and metrics",
    },
    "automate-ai-tasks-with-prompt-workflows": {
      url: `${IMG}/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=1200&q=80`,
      alt: "Automation system for AI task workflows and prompt processing",
    },
    "orchestrate-llm-workflows-for-productive-teams": {
      url: `${IMG}/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80`,
      alt: "Team collaborating to orchestrate LLM workflows for productivity",
    },
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

  return (
    visuals[postSlug] ?? {
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
    <article className="group overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-[0_18px_60px_-28px_rgba(15,23,42,0.65)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_-28px_rgba(56,189,248,0.25)]">
      <div className="relative overflow-hidden bg-slate-900">
        <div className={`absolute inset-0 animate-pulse bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 transition-opacity ${loaded ? "opacity-0" : "opacity-100"}`} />
        {imgError ? (
          <div className="flex aspect-[16/9] w-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950">
            <span className="text-3xl font-bold tracking-tight text-cyan-400/40">AI Prompt Toolkit</span>
          </div>
        ) : (
          <img
            src={visual.url}
            alt={visual.alt}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => setImgError(true)}
            className="aspect-[16/9] w-full object-cover object-center transition duration-700 ease-out"
          />
        )}
      </div>
      <div className="space-y-3 p-4 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/80">{post.category}</p>
        <h3 className="text-lg sm:text-2xl font-semibold tracking-tight text-white">{post.title}</h3>
        <p className="text-sm leading-6 sm:leading-7 text-slate-300">{post.excerpt}</p>
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
