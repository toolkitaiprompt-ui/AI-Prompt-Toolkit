import { Link, useLocation } from "react-router-dom";
import { ArrowRight, ArrowUpRight, BookOpen, Sparkles, Wrench } from "lucide-react";
import useSeo from "../hooks/useSeo";
import { useJsonLd, faqPageJsonLd } from "../lib/structuredData";
import { TOOL_PAGES } from "../data/tools";
import { BLOG_POSTS } from "../data/blogPosts";

/**
 * Generic SEO landing page — fixes orphan pages that were prerendered and in
 * the sitemap but had no SPA route (soft 404s). Renders a real page with the
 * route's title/meta, popular tools, related guides, a genuine FAQ section and
 * FAQPage structured data. Not a doorway page: every section links to real,
 * working content.
 */

interface FaqItem {
  question: string;
  answer: string;
}

interface LandingConfig {
  title: string;
  desc: string;
  intro: string;
  tools: string[]; // tool paths
  guides: string[]; // blog slugs
  cta: string;
  faq: FaqItem[];
}

const LANDINGS: Record<string, LandingConfig> = {
  "/ai-tools-for-students": {
    title: "Top Free AI Tools for Students | AI World Hub",
    desc: "Free AI tools for students — writing, research, study aids, and productivity without subscription required.",
    intro: "Students get better results with AI when they use the right tools. These free, in-browser prompt tools cover essays, research, studying, and daily productivity — no signup, no cost, and your work never leaves your device.",
    tools: ["/tools/advanced-prompt-optimizer", "/tools/prompt-debugger", "/tools/token-estimator", "/tools/prompt-chain-builder"],
    guides: ["chatgpt-prompts-for-students", "how-to-write-better-ai-prompts-2026", "what-is-prompt-engineering-guide"],
    cta: "Optimize your study prompts",
    faq: [
      { question: "Are these AI tools really free for students?", answer: "Yes. Every tool on AI World Hub runs in your browser with no account and no subscription, so students can use them as much as they need without spending anything." },
      { question: "Will using AI tools count as cheating?", answer: "That depends on your college's policy. Used for drafting, structuring, and studying — not for submitting AI-written work as your own — these tools are widely accepted study aids." },
      { question: "Do I need to know prompt engineering to use them?", answer: "No. Tools like the Prompt Optimizer and Prompt Debugger apply the structure for you — you just paste your task and copy the improved prompt." },
    ],
  },
  "/ai-tools-for-small-business": {
    title: "Top Free AI Tools for Small Business | AI World Hub",
    desc: "Free AI tools that help small businesses with content, design, marketing, and productivity — no budget required.",
    intro: "Small businesses can do marketing, content, and customer support with free AI tools. These in-browser prompt tools help you write better, plan faster, and automate repetitive work — without a marketing budget.",
    tools: ["/tools/advanced-prompt-optimizer", "/tools/prompt-chain-builder", "/tools/security-scanner", "/tools/mega-prompt-builder"],
    guides: ["ai-tools-for-small-business-india", "ai-prompts-for-business-growth", "how-to-make-money-with-chatgpt-in-india"],
    cta: "Build better business prompts",
    faq: [
      { question: "Can a small business really use AI without technical skills?", answer: "Yes. The tools here are point-and-click: paste a task, get a structured prompt, copy it into ChatGPT or Claude. No coding or AI expertise needed." },
      { question: "Are these AI tools safe for business content?", answer: "They run entirely in your browser, so your text never leaves your device. For extra safety, run anything sensitive through the free Security Scanner before pasting it into a cloud chatbot." },
      { question: "How much time can AI save a small business?", answer: "Businesses that systematize prompts for content, replies, and planning typically save several hours per week — the Prompt Chain Builder makes repeating those workflows easy." },
    ],
  },
  "/ai-prompt-templates-business": {
    title: "AI Prompt Templates for Business | AI World Hub",
    desc: "Browse and use reusable AI prompt templates for common business tasks — marketing, sales, customer support, operations.",
    intro: "Reusable AI prompt templates save hours every week. These business-focused templates cover marketing, sales, support, and operations — copy, customize, and use them in ChatGPT, Claude, or Gemini.",
    tools: ["/tools/advanced-prompt-optimizer", "/tools/prompt-chain-builder", "/tools/prompt-formatter", "/tools/prompt-variable-extractor"],
    guides: ["ai-prompts-for-business-growth", "how-to-write-better-ai-prompts-2026", "build-ai-prompt-templates-that-scale"],
    cta: "Polish a business template",
    faq: [
      { question: "Can the same prompt template be used for every task?", answer: "Not every task, but most. Templates work best when you swap in variables like {audience} or {topic}. The Prompt Variable Extractor finds those placeholders for you." },
      { question: "How do I make a business prompt template my team can reuse?", answer: "Keep each template short, fill in the variables, and run it through the Prompt Optimizer once. Then store the cleaned version and reuse it for every similar task." },
      { question: "Do these templates work in ChatGPT, Claude, and Gemini?", answer: "Yes — the templates are model-agnostic. If one model answers differently, the Prompt Converter rewrites the template for that model's style." },
    ],
  },
  "/ai-prompt-templates-marketing": {
    title: "AI Prompt Templates for Marketing | AI World Hub",
    desc: "30 ChatGPT prompts for content writers — blogs, SEO, social, email newsletters. Copy-paste templates that cut writing time in half.",
    intro: "Marketing teams write the same kinds of content every week — ads, emails, posts, blogs. These ready-to-use prompt templates speed that up, and the Optimizer keeps every template sharp.",
    tools: ["/tools/advanced-prompt-optimizer", "/tools/prompt-chain-builder", "/tools/token-estimator", "/tools/prompt-debugger"],
    guides: ["marketing-chatgpt-prompt-patterns", "chatgpt-prompts-for-content-writers", "how-to-write-better-ai-prompts-2026"],
    cta: "Optimize a marketing prompt",
    faq: [
      { question: "Will AI marketing content sound repetitive?", answer: "Only if the prompt is vague. Adding audience, tone, and a format — which the Prompt Optimizer does for you — produces noticeably more varied, on-brand copy." },
      { question: "How do I keep my brand voice consistent with AI?", answer: "Save a 'brand voice' prompt with your tone rules, then run every new marketing prompt through the Optimizer so the same instructions are always included." },
      { question: "Can AI write a full ad or newsletter from one template?", answer: "Yes, but treat the output as a draft. Templates give you a strong structure in minutes; your edits add the final quality." },
    ],
  },
  "/ai-prompt-templates-developers": {
    title: "AI Prompt Templates for Developers | AI World Hub",
    desc: "Code generation, debugging, and documentation prompts for developers. Free prompt templates to accelerate development workflows.",
    intro: "Developers can turn ChatGPT, Claude, and Gemini into faster pair-programmers with structured prompts — code generation, debugging, review, and docs. These templates give you the structure; the tools keep it reliable.",
    tools: ["/tools/advanced-prompt-optimizer", "/tools/prompt-debugger", "/tools/api-request-builder", "/tools/regex-generator"],
    guides: ["chatgpt-prompts-for-coding-interviews", "best-ai-coding-tools-2026", "claude-prompt-best-practices"],
    cta: "Improve a coding prompt",
    faq: [
      { question: "Can AI-generated code be trusted in production?", answer: "Always review and test AI code like you would a colleague's. Use prompts that ask for edge cases and trade-offs — the Prompt Debugger helps you spot what a coding prompt is missing." },
      { question: "Which model is best for coding prompts?", answer: "ChatGPT and Claude both handle coding well; Claude is strong with long context, ChatGPT with structured steps. Convert prompts between them with the Prompt Converter." },
      { question: "How do I prompt for better code reviews?", answer: "Ask for issues by severity with one-line fixes, and specify the language and framework. A structured review prompt gets structured feedback." },
    ],
  },
  "/ai-models-comparison": {
    title: "ChatGPT vs Claude vs Gemini — Full Comparison | AI World Hub",
    desc: "Side-by-side comparison of the top three AI models — strengths, weaknesses, and best use cases for 2026.",
    intro: "ChatGPT, Claude, and Gemini all excel — at different things. This guide breaks down their strengths, weaknesses, and best use cases, and shows you how to write prompts that get the most out of each model.",
    tools: ["/tools/prompt-converter", "/tools/advanced-prompt-optimizer", "/tools/prompt-comparison", "/tools/prompt-debugger"],
    guides: ["how-to-write-better-prompts-claude-chatgpt-2026", "chatgpt-vs-claude-vs-gemini-comparison", "claude-vs-chatgpt-for-coding"],
    cta: "Convert a prompt between models",
    faq: [
      { question: "Which AI model is best overall in 2026?", answer: "There is no single winner — ChatGPT is strong at structured output, Claude at long-context analysis, and Gemini at Google-ecosystem tasks. Choose by task, not by hype." },
      { question: "Do all three models have free tiers?", answer: "Yes. ChatGPT, Claude, and Gemini all offer genuinely free tiers, which is enough for most prompt testing and everyday work." },
      { question: "Can I move prompts between models easily?", answer: "Yes. The free Prompt Converter rewrites any prompt for ChatGPT, Claude, or Gemini, adjusting structure and phrasing for the target model." },
    ],
  },
  "/ai-trends-2026-guide": {
    title: "AI Trends to Watch in 2026 | AI World Hub",
    desc: "The definitive guide to AI trends shaping 2026 — what's new, what's changing, and what to watch.",
    intro: "From agentic workflows to multimodal models, 2026 is moving fast. This guide explains the trends that matter and the free tools you can use to stay ahead of them.",
    tools: ["/tools/advanced-prompt-optimizer", "/tools/prompt-chain-builder", "/tools/token-estimator", "/tools/security-scanner"],
    guides: ["ai-trends-2026-complete-guide", "how-to-write-better-ai-prompts-2026", "best-free-ai-prompt-tools-2026"],
    cta: "Build prompts for the new AI era",
    faq: [
      { question: "What is the biggest AI trend in 2026?", answer: "Agentic workflows — AI that plans and executes multi-step tasks. That's exactly what the Prompt Chain Builder models: step-by-step sequences with clear handoffs." },
      { question: "Will AI trends change how I write prompts?", answer: "Partly. Longer context windows mean less cramming, but structure still matters more than length. The 6-part prompt structure remains the foundation." },
      { question: "How can a small user keep up with AI changes?", answer: "Follow one good newsletter, test new models on your own prompts, and keep a small prompt library you can upgrade as tools evolve." },
    ],
  },
  "/ai-for-productivity": {
    title: "Boost AI Productivity 2026 | AI World Hub",
    desc: "AI tools that boost productivity for work and personal projects — writing, coding, design, and automation.",
    intro: "AI is the fastest productivity upgrade available today. These free in-browser tools help you write, plan, code, and automate faster — the practical side of AI productivity.",
    tools: ["/tools/advanced-prompt-optimizer", "/tools/prompt-chain-builder", "/tools/content-summarizer", "/tools/token-estimator"],
    guides: ["boost-ai-productivity-with-prompt-systems", "automate-ai-tasks-with-prompt-workflows", "how-to-write-better-ai-prompts-2026"],
    cta: "Streamline your AI workflow",
    faq: [
      { question: "What is the fastest productivity win with AI?", answer: "Stop rewriting prompts from scratch. Save your best prompts as templates and run new ones through the Optimizer — structure alone improves most outputs." },
      { question: "Can AI handle entire workflows, not just single tasks?", answer: "Yes, when you break work into steps. The Prompt Chain Builder sequences multi-step workflows so each output feeds the next." },
      { question: "How do I avoid spending more time fixing AI output?", answer: "Measure your prompts with the Token Estimator and Debugger before sending them — a clean, constrained prompt needs far fewer edits." },
    ],
  },
  "/ai-for-content-creation": {
    title: "AI for Content Creation 2026 | AI World Hub",
    desc: "Free AI tools that help content creators with writing, ideas, and production — no budget required.",
    intro: "Creators who use AI publish more and faster. These free prompt tools handle the writing and planning side of content creation — scripts, captions, outlines, and edits.",
    tools: ["/tools/advanced-prompt-optimizer", "/tools/prompt-chain-builder", "/tools/content-summarizer", "/tools/prompt-translator"],
    guides: ["free-ai-tools-for-youtube-creators", "chatgpt-prompts-for-content-writers", "best-midjourney-prompts-2026"],
    cta: "Create better content prompts",
    faq: [
      { question: "Can AI write my entire video script?", answer: "It can draft it, but your voice makes it watchable. Use AI for the structure and first draft, then edit — that's where the quality comes from." },
      { question: "Will AI-generated content hurt my originality?", answer: "AI mirrors what you feed it. Prompts with your specific examples and tone keep the output yours — the Optimizer makes sure those instructions are always included." },
      { question: "Do creators need paid AI tools?", answer: "No. Free tiers of ChatGPT, Claude, and Gemini plus free prompt tools cover scripting, titles, and descriptions for most creators." },
    ],
  },
  "/ai-for-research": {
    title: "AI for Research and Analysis | AI World Hub",
    desc: "How to use AI for research — literature review, data collection, survey design, and analysis prompts.",
    intro: "AI can speed up literature review, data collection, and analysis — when you prompt it correctly. These free tools help you structure research prompts and keep your findings organized.",
    tools: ["/tools/advanced-prompt-optimizer", "/tools/prompt-chain-builder", "/tools/content-summarizer", "/tools/security-scanner"],
    guides: ["prompt-engineering-complete-guide", "rag-prompt-engineering-guide", "how-to-write-better-ai-prompts-2026"],
    cta: "Structure a research prompt",
    faq: [
      { question: "Can AI be trusted for research?", answer: "Use AI for organization and first-pass analysis, but verify facts against primary sources. Ask for citations and flag anything the model is unsure about." },
      { question: "How do I summarize many papers efficiently?", answer: "Summarize one paper at a time with a structured prompt, then chain the summaries — the Prompt Chain Builder keeps the sequence repeatable." },
      { question: "Should I paste raw data into AI tools?", answer: "Only anonymized data. Run anything sensitive through the Security Scanner first, and replace real identifiers with placeholders." },
    ],
  },
  "/free-ai-tools-content-creators": {
    title: "Free AI Tools for Content Creators | AI World Hub",
    desc: "10 free AI tools for YouTube creators — scripts, titles, descriptions, thumbnails, channel growth. Publish faster, grow without spending.",
    intro: "From scripts to titles to thumbnails, free AI tools help creators publish faster. These prompt tools handle the writing workflow; the guides cover the full creator stack.",
    tools: ["/tools/advanced-prompt-optimizer", "/tools/prompt-chain-builder", "/tools/prompt-translator", "/tools/token-estimator"],
    guides: ["free-ai-tools-for-youtube-creators", "chatgpt-prompts-for-content-writers", "how-to-write-better-ai-prompts-2026"],
    cta: "Optimize your creator prompts",
    faq: [
      { question: "What free AI tools do YouTubers actually need?", answer: "A script prompt, a title generator, and a description template cover most of the writing work. The rest — editing and thumbnails — has its own free tools." },
      { question: "How do I make AI scripts sound like me?", answer: "Include your niche, your format, and a sample of your style in the prompt. The Optimizer keeps those instructions in every script you generate." },
      { question: "Can AI help with non-English audiences?", answer: "Yes — the Prompt Translator moves your scripts and titles into 8 languages while keeping placeholders intact." },
    ],
  },
  "/ai-tools-for-social-media": {
    title: "Free AI Tools for Social Media 2026 | AI World Hub",
    desc: "10 free AI tools for social media — caption generators, hashtag optimizers, image & video editors, and schedulers. In-browser, no sign-up.",
    intro: "Social media runs on content volume. These free prompt tools help you write captions, plan posts, and keep your voice consistent across every platform.",
    tools: ["/tools/advanced-prompt-optimizer", "/tools/prompt-chain-builder", "/tools/prompt-formatter", "/tools/prompt-translator"],
    guides: ["chatgpt-prompts-for-content-writers", "free-ai-tools-for-youtube-creators", "marketing-chatgpt-prompt-patterns"],
    cta: "Write better social prompts",
    faq: [
      { question: "Can AI write captions that actually get engagement?", answer: "AI gives you 5-10 strong options in seconds; the hook and the question at the end matter most. Prompt for those explicitly." },
      { question: "How do I keep my social voice consistent?", answer: "Save a voice prompt with your tone and banned words, and reuse it. The Prompt Formatter keeps every caption in the same clean structure." },
      { question: "Does AI scheduling exist for free?", answer: "Yes — several free schedulers exist, and AI handles the content side. Combine them: AI writes, the scheduler posts." },
    ],
  },
  "/ai-prompt-patterns": {
    title: "AI Prompt Patterns & Structures | AI World Hub",
    desc: "Learn proven prompt patterns that work across ChatGPT, Claude, and Gemini — with ready-to-use examples and model-specific variations.",
    intro: "Prompt patterns are reusable structures that get reliable results. This guide covers the most effective patterns and pairs them with free tools that apply them automatically.",
    tools: ["/tools/advanced-prompt-optimizer", "/tools/prompt-chain-builder", "/tools/prompt-debugger", "/tools/prompt-comparison"],
    guides: ["prompt-engineering-complete-guide", "chain-of-thought-prompting-guide", "few-shot-prompting-guide"],
    cta: "Apply a pattern to your prompt",
    faq: [
      { question: "What is a prompt pattern?", answer: "A prompt pattern is a reusable structure — like role + task + format — that reliably produces good output. Patterns save you from rethinking every prompt." },
      { question: "Which pattern should a beginner learn first?", answer: "The role-task-format pattern. It's the foundation of most others, and the Prompt Optimizer applies it automatically." },
      { question: "Do patterns work on every AI model?", answer: "The core patterns work across ChatGPT, Claude, and Gemini. Model-specific variations are covered in the related guides." },
    ],
  },
  "/ai-prompts-not-working": {
    title: "AI Prompts Not Working? Fix Them in 5 Minutes | AI World Hub",
    desc: "Generic AI answers? Fix weak prompts in 5 minutes with a free prompt debugger and optimizer — works for ChatGPT, Claude, and Gemini.",
    intro: "If every AI answer comes back vague, off-topic, or half-baked, the problem is almost never the model — it's the prompt. Vague prompts get vague answers. This guide shows you the 4 most common prompt failures and gives you free tools that fix all of them in minutes.",
    tools: ["/tools/advanced-prompt-optimizer", "/tools/prompt-debugger", "/tools/prompt-chain-builder", "/tools/prompt-formatter"],
    guides: ["prompt-audit-and-iteration-strategies", "optimize-prompts-for-better-ai-performance", "how-to-write-better-ai-prompts-2026"],
    cta: "Fix your prompt now",
    faq: [
      { question: "Why does my AI prompt give generic answers?", answer: "Because it lacks constraints. Without a role, audience, format, and length, the model picks its own — usually the most generic version. The Prompt Debugger scores your prompt and lists exactly what's missing." },
      { question: "How fast can I actually fix a bad prompt?", answer: "2–5 minutes. Paste it into the free Prompt Debugger, see the issues, then run it through the Optimizer to get a structured version with role, tone, and format added." },
      { question: "Do better prompts work on every AI model?", answer: "Yes — ChatGPT, Claude, and Gemini all respond to the same structure principles. If a prompt works poorly everywhere, it's the prompt, not the model." },
    ],
  },
  "/cut-ai-token-costs": {
    title: "Cut AI Token Costs & API Bills | AI World Hub",
    desc: "Reduce ChatGPT and API token costs — trim bloated prompts, estimate usage, and keep quality. Free in-browser tools, no sign-up.",
    intro: "Token costs creep up silently: long instructions, repeated context, and bloated formatting all burn money on every request. The fix is measurable — count tokens before you send, cut the fat, and keep the structure that matters. These free tools do all three.",
    tools: ["/tools/token-estimator", "/tools/prompt-cleaner", "/tools/advanced-prompt-optimizer", "/tools/prompt-formatter"],
    guides: ["prompt-optimization-for-cost-and-quality", "optimize-prompts-for-better-ai-performance", "best-free-ai-prompt-tools-2026"],
    cta: "Estimate your next prompt",
    faq: [
      { question: "What exactly is a token and why does it cost money?", answer: "Tokens are the chunks of text an AI model reads and writes. Every API call bills input tokens + output tokens, so longer prompts and longer replies both cost more. Trimming a prompt from 400 to 200 tokens cuts that request's cost in half." },
      { question: "How much can prompt cleaning save on API bills?", answer: "Most people can cut 30–60% of a prompt's tokens without losing quality — repeated context, filler words, and redundant instructions are the usual culprits. The Token Estimator shows the before/after count instantly." },
      { question: "Does a shorter prompt reduce output quality?", answer: "Not if you keep the structure — role, task, format, constraints. The Optimizer compresses wording while keeping those elements, so quality stays up and tokens drop." },
    ],
  },
  "/make-ai-content-sound-human": {
    title: "Make AI Content Sound Human (Not Robotic) | AI World Hub",
    desc: "AI text sounds robotic? Add tone, voice, and constraints with free prompt tools — make ChatGPT content read like a human wrote it.",
    intro: "AI writing gets flagged as robotic because of one thing: a flat, unconstrained prompt. Without a voice, the model defaults to its most neutral tone. The fix is a prompt with personality — audience, tone, rhythm, banned phrases, and examples. Here's how to build one in minutes.",
    tools: ["/tools/advanced-prompt-optimizer", "/tools/persona-builder", "/tools/prompt-debugger", "/tools/prompt-translator"],
    guides: ["chatgpt-prompts-for-content-writers", "craft-high-impact-chatgpt-prompts", "how-to-write-better-ai-prompts-2026"],
    cta: "Give your prompt a voice",
    faq: [
      { question: "Why does AI content always sound the same?", answer: "Because the default prompt asks for 'a blog post' with no voice attached. Models pick their most neutral register. Adding audience, tone, and banned words changes the output dramatically." },
      { question: "What prompt elements make text sound human?", answer: "Four things: a defined reader, a tone (e.g. 'plain-spoken, like a friend explaining'), short sentences, and 2–3 banned words like 'delve' or 'crucial'. The Optimizer adds all of these in one click." },
      { question: "Will adding a persona really change the writing?", answer: "Yes. The Persona Builder generates a full expert persona prompt — role, background, tone rules — and models visibly shift style when they're given a consistent character to write as." },
    ],
  },
  "/stop-ai-hallucinations": {
    title: "Stop AI Hallucinations: A Practical Guide | AI World Hub",
    desc: "Reduce AI hallucinations with structured prompts, JSON validation, and verification chains — a practical free toolkit for reliable output.",
    intro: "AI models invent facts confidently. You can't fully eliminate hallucinations, but you can cut them dramatically — by constraining the task, forcing structured output, and validating it before it reaches your users. This page shows the exact free tools that do each step.",
    tools: ["/tools/prompt-chain-builder", "/tools/json-schema-generator", "/tools/json-validator", "/tools/prompt-debugger"],
    guides: ["validate-ai-outputs-with-json-schema", "prompts-for-ai-reliability-and-governance", "design-json-schema-for-ai-output"],
    cta: "Build a verification chain",
    faq: [
      { question: "Can AI hallucinations ever be fully stopped?", answer: "No — models are probabilistic. But you can reduce them by 80–90% with constraints: 'answer only from this source', 'say I don't know when unsure', and structured output you can validate programmatically." },
      { question: "What is the fastest way to catch a hallucination?", answer: "Force structured output with a JSON schema, then validate the response automatically. If the model can't produce valid data, you fail fast instead of shipping a wrong answer. The JSON Validator does this in seconds." },
      { question: "How do verification chains reduce hallucinations?", answer: "The Prompt Chain Builder sequences steps: generate → self-check → cross-verify against the source. Each step catches errors the previous one missed, so the final output is far more reliable." },
    ],
  },
  "/learn-prompt-engineering-fast": {
    title: "Learn Prompt Engineering Fast (Free, 1 Hour) | AI World Hub",
    desc: "Learn prompt engineering in about an hour — the 6-part structure, common mistakes, and free tools that apply it for you automatically.",
    intro: "Prompt engineering is the highest-leverage AI skill you can learn, and you don't need a course to start. This guide teaches the one structure that covers 90% of cases, shows the mistakes beginners make, and gives you free tools that apply the structure automatically while you learn.",
    tools: ["/tools/mega-prompt-builder", "/tools/advanced-prompt-optimizer", "/tools/prompt-debugger", "/tools/prompt-comparison"],
    guides: ["what-is-prompt-engineering-guide", "master-prompt-engineering-workflow", "best-ai-prompt-engineering-tools"],
    cta: "Build your first structured prompt",
    faq: [
      { question: "How long does it really take to learn prompt engineering?", answer: "The core — one reliable structure plus 3–4 common mistakes — takes about an hour of practice. Mastery comes from repetition: run every prompt you write through a debugger for a week and you'll internalize it." },
      { question: "Do I need to learn coding to write good prompts?", answer: "No. Prompt engineering is a writing and thinking skill. The free tools here apply the technical structure for you, so you can learn by comparing before/after versions." },
      { question: "What is the single most important prompt skill?", answer: "Constraint-setting: role, audience, format, length, and tone. Every other technique builds on it, and the Prompt Optimizer demonstrates it on your own text in seconds." },
    ],
  },
  "/fix-ai-output-formatting": {
    title: "Fix AI Output Formatting (JSON, Tables, Markdown) | AI World Hub",
    desc: "AI won't follow your format? Force clean JSON, tables, and markdown with schema generation and validation — free, in-browser tools.",
    intro: "'Give me the answer as JSON' — and the model gives you a paragraph with a JSON-looking blob inside it. Formatting failures are one of the most common AI frustrations. The fix is to specify structure precisely and validate it automatically, not ask politely.",
    tools: ["/tools/json-schema-generator", "/tools/json-validator", "/tools/prompt-formatter", "/tools/prompt-converter"],
    guides: ["design-json-schema-for-ai-output", "validate-ai-outputs-with-json-schema", "llm-workflow-best-practices-for-innovation"],
    cta: "Force valid JSON output",
    faq: [
      { question: "Why does my AI model ignore my format instructions?", answer: "Because 'use JSON' is ambiguous — models don't know your exact schema, field names, or nesting. Define the schema explicitly and the model follows it far more reliably." },
      { question: "What's the fastest way to force valid JSON from ChatGPT?", answer: "Generate a JSON Schema from a sample of the output you want, include it in the prompt, then run the response through the JSON Validator. Invalid responses get caught instantly instead of breaking your code." },
      { question: "Does this work with tables and markdown too?", answer: "Yes — the same principle applies: specify the exact columns, delimiters, or heading structure in the prompt, and use the Prompt Formatter to normalize the output into a clean structure." },
    ],
  },
};

export default function SeoLandingPage() {
  const { pathname } = useLocation();
  // Normalize trailing slash (Cloudflare canonicalizes to /path/)
  const path = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const cfg = LANDINGS[path];
  useSeo(cfg?.title, cfg?.desc);
  useJsonLd(
    cfg
      ? [
          faqPageJsonLd(cfg.faq),
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: cfg.title.replace(" | AI World Hub", ""),
            description: cfg.desc,
            url: "https://aiworldhub.site" + path + "/",
          },
        ]
      : null,
    [path],
  );

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

        {/* Share bar — make the page easy to share (X, WhatsApp, LinkedIn, Facebook, copy) */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Share this guide:</span>
          {[
            { label: "X", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(cfg.title.replace(" | AI World Hub", ""))}&url=${encodeURIComponent("https://aiworldhub.site" + path + "/")}` },
            { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(cfg.title.replace(" | AI World Hub", "") + " " + "https://aiworldhub.site" + path + "/")}` },
            { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://aiworldhub.site" + path + "/")}` },
            { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://aiworldhub.site" + path + "/")}` },
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
          <button
            onClick={() => {
              const url = "https://aiworldhub.site" + path + "/";
              navigator.clipboard?.writeText(url).then(() => {
                const btn = document.getElementById("copy-share-btn");
                if (btn) { const old = btn.textContent; btn.textContent = "✓ Copied!"; setTimeout(() => { btn.textContent = old; }, 2000); }
              }).catch(() => {});
            }}
            id="copy-share-btn"
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 transition hover:border-amber-400/40 hover:text-amber-300"
          >
            Copy link
          </button>
        </div>
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

      {/* FAQ */}
      {cfg.faq.length > 0 && (
        <section className="mt-10 rounded-[20px] border border-slate-800 bg-slate-950/50 p-6">
          <h2 className="text-xl font-bold text-white">Frequently asked questions</h2>
          <div className="mt-4 space-y-4">
            {cfg.faq.map((item) => (
              <div key={item.question} className="space-y-1.5">
                <p className="font-semibold text-white">{item.question}</p>
                <p className="text-sm leading-7 text-slate-400">{item.answer}</p>
              </div>
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
