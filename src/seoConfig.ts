/**
 * SEO CONFIG — Saare titles, keywords, descriptions yahan.
 *
 * FUTURE ME BADLAW: Sirf is file me change karo.
 * App.tsx ko KABHI chhede mat.
 *
 * useSeo() function automatically current URL ke hisaab se
 * is file se data utha lega.
 */
import PROMPT_SEO from "./data/prompt-seo.json";

export type SeoData = {
  title: string;
  description: string;
  keywords: string;
};

type PromptRole = { slug: string; title: string; description: string };
type PromptTask = {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
};

const PROMPT_ROLES = new Map<string, PromptRole>();
const PROMPT_TASKS = new Map<string, PromptTask>();
for (const role of PROMPT_SEO.roles) {
  PROMPT_ROLES.set(role.slug, { slug: role.slug, title: role.title, description: role.description });
  for (const task of PROMPT_SEO.tasks) {
    if (task.role === role.slug) {
      PROMPT_TASKS.set(`${role.slug}/${task.slug}`, {
        slug: task.slug,
        title: task.title,
        seoTitle: task.seoTitle,
        seoDescription: task.seoDescription,
      });
    }
  }
}


const DEFAULT_SEO: SeoData = {
  title: "19 Free AI Prompt Engineering Tools | AI World Hub",
  description:
    "Use 19 free AI prompt engineering tools to build, format, debug, secure, translate, and optimize prompts in your browser. No sign-up required.",
  keywords:
    "Best AI Tools, Free AI Tools, ChatGPT Prompts, Prompt Engineering, AI Tools Directory, AI Prompt Builder, How to Use ChatGPT, Prompt Optimization, AI Prompting, ChatGPT Prompt Generator",
};

const SEO_MAP: Record<string, SeoData> = {
  // ── Homepage ──
  "/": {
    title: "19 Free AI Prompt Engineering Tools | AI World Hub",
    description:
      "Use 19 free AI prompt engineering tools to build, format, debug, secure, translate, and optimize prompts in your browser. No sign-up required.",
    keywords:
      "Best AI Tools, Free AI Tools, ChatGPT Prompts, Prompt Engineering, AI Tools Directory, AI Prompt Builder, How to Use ChatGPT, Prompt Optimization, AI Prompting, ChatGPT Prompt Generator",
  },

  // ── Playground ──
  "/playground": {
    title: "AI Prompt Playground — Test & Debug Prompts Live | AI World Hub",
    description:
      "Free AI prompt playground. Generate blog post, code review, and cold email prompt templates, estimate tokens, and debug prompt health in real time — all in your browser.",
    keywords:
      "AI Prompt Playground, Prompt Testing, Prompt Debugging, Token Estimation, Prompt Templates, ChatGPT Playground, Prompt Engineering, AI Prompting Tools",
  },

  // ── Tools Directory ──
  "/tools": {
    title: "Free AI Tools Directory — 19 Best Tools | AI World Hub",
    description:
      "Choose from 19 free AI prompt engineering tools — build, format, debug, optimize, secure, and translate prompts in your browser. No sign-up required.",
    keywords:
      "Best AI Tools, Free AI Tools, AI Tools Directory, Prompt Engineering Tools, Free AI Prompt Tools, AI Prompt Builder, ChatGPT Prompt Tools, Prompt Optimization Tools",
  },

  // ── Prompts Library ──
  "/prompts": {
    title: "AI Prompt Library — 225+ Prompts for 15 Roles | AI World Hub",
    description:
      "Free AI prompt library with 225+ ready-to-use prompts for 15 professional roles — ChatGPT, content writers, developers, marketers, SEO, data analysts, designers, sales, customer support, and more. Copy and customize instantly.",
    keywords:
      "AI Prompts, ChatGPT Prompts, Prompt Library, Prompt Templates, Best AI Prompts, Prompt Engineering, Role-Based Prompts, AI Prompt Collection, AI Prompting, Prompt Database",
  },

  // ── Changelog ──
  "/changelog": {
    title: "Changelog — Latest Updates & New Features | AI World Hub",
    description:
      "Track all updates and new features added to AI World Hub's AI prompt engineering toolkit. See version history, new tools, improvements, and bug fixes.",
    keywords:
      "AI World Hub Changelog, Updates, New Features, Version History, AI Tools Updates, Prompt Engineering Tools",
  },

  // ── Blog ──
  "/blog": {
    title: "ChatGPT Prompts & Prompt Engineering Blog | AI World Hub",
    description:
      "Free ChatGPT prompts, prompt engineering guides, and AI tool reviews. Learn how to write better prompts, use AI tools effectively, and boost productivity with practical tutorials.",
    keywords:
      "ChatGPT Prompts, Prompt Engineering, Best AI Tools, Free AI Tools, AI Tools Directory, AI Prompting",
  },

  // ── About ──
  "/about": {
    title: "About — Best Free AI Prompt Engineering Tools | AI World Hub",
    description:
      "AI World Hub offers the best free AI prompt engineering tools for everyone — students, developers, marketers, and teams. 19 in-browser tools, no sign-up, no data collection.",
    keywords:
      "About AI World Hub, Best AI Tools, Free AI Tools, Prompt Engineering",
  },

  // ── Contact ──
  "/contact": {
    title: "Contact — Free AI Prompt Tools Support | AI World Hub",
    description:
      "Contact AI World Hub for prompt engineering support, partnerships, and feedback. Email toolkitaiprompt@gmail.com — we respond within 24 hours.",
    keywords: "Contact AI World Hub, Free AI Tools, Prompt Engineering",
  },

  // ── Privacy ──
  "/privacy-policy": {
    title: "Privacy Policy | Free AI Prompt Tools — AI World Hub",
    description:
      "Privacy policy for AI World Hub — free AI prompt engineering tools. All tool processing happens in-browser. No personal data collected, stored, or shared.",
    keywords: "Privacy Policy, Free AI Tools, Prompt Engineering",
  },

  // ── Terms ──
  "/terms-of-service": {
    title: "Terms of Service | Free AI Prompt Tools — AI World Hub",
    description:
      "Terms of service for AI World Hub — free AI prompt engineering tools. Use our tools for personal or commercial projects. No warranty, use at your own discretion.",
    keywords: "Terms of Service, Free AI Tools, Prompt Engineering",
  },

  // ══ TOOL PAGES ══
  "/tools/prompt-variable-extractor": {
    title: "Free Prompt Variable Extractor — Extract {Variables} | AI World Hub",
    description:
      "Extract prompt variables like {name}, {{city}}, [tone] from any AI prompt. Free in-browser tool for building reusable prompt templates.",
    keywords: "Prompt Variable Extractor, Free AI Tools, Prompt Engineering, AI Prompting, Prompt Template Builder",
  },
  "/tools/json-schema-generator": {
    title: "Free JSON Schema Generator for AI Output | AI World Hub",
    description:
      "Generate JSON Schema from sample data for reliable AI output. Free in-browser tool — paste JSON, get schema instantly. Draft 2020-12 compliant.",
    keywords: "JSON Schema Generator, Free AI Tools, Prompt Engineering, AI Output, Structured AI Output",
  },
  "/tools/json-validator": {
    title: "Free JSON Validator for AI Output | AI World Hub",
    description:
      "Validate AI-generated JSON against your schema in real time. Catch missing fields, type mismatches, and errors before production.",
    keywords: "JSON Validator, Free AI Tools, Prompt Engineering, AI Output, AI Output Validation",
  },
  "/tools/prompt-formatter": {
    title: "Free Prompt Formatter for ChatGPT & Claude | AI World Hub",
    description:
      "Format messy prompt notes into clean, numbered instruction blocks for ChatGPT, Claude, and Gemini. Free in-browser tool.",
    keywords: "Prompt Formatter, ChatGPT Prompts, Free AI Tools, Prompt Engineering, AI Prompting, Prompt Formatting",
  },
  "/tools/prompt-cleaner": {
    title: "Free Prompt Cleaner — Remove Noise from AI Prompts | AI World Hub",
    description:
      "Clean noisy text, hidden characters, and formatting issues from AI prompts. Free in-browser tool.",
    keywords: "Prompt Cleaner, Free AI Tools, Prompt Engineering, AI Prompt Cleanup",
  },
  "/tools/token-estimator": {
    title: "Free AI Token Estimator & Counter — GPT, Claude | AI World Hub",
    description:
      "Estimate token count, characters, and words for AI prompts before sending to GPT, Claude, or Gemini APIs. Free token calculator.",
    keywords: "Token Estimator, Token Calculator, Free AI Tools, Prompt Engineering, AI Token Counter, ChatGPT Token Calculator",
  },
  "/tools/prompt-converter": {
    title: "Free Prompt Converter — ChatGPT to Claude & Gemini | AI World Hub",
    description:
      "Convert ChatGPT prompts to Claude, Gemini, or Cursor format instantly. Free in-browser tool.",
    keywords: "Prompt Converter, ChatGPT to Claude, Free AI Tools, Prompt Engineering, AI Prompt Conversion",
  },
  "/tools/persona-builder": {
    title: "Free AI Persona Builder — System Prompt Generator | AI World Hub",
    description:
      "Generate expert system prompts for AI roles like Marketer, Developer, Analyst. Free in-browser persona builder for ChatGPT, Claude & Gemini.",
    keywords: "Persona Builder, System Prompt, ChatGPT Prompts, Free AI Tools, AI Persona Generator, Role-Based Prompts",
  },
  "/tools/advanced-prompt-optimizer": {
    title: "Free Advanced Prompt Optimizer — Best AI Prompt Tool | AI World Hub",
    description:
      "Polish and optimize AI prompts with advanced controls — reduce tokens, add structure, compare before-and-after. Best free prompt optimizer.",
    keywords: "Prompt Optimizer, Best AI Tools, Free AI Tools, Prompt Engineering, AI Prompt Optimization, ChatGPT Prompt Optimizer",
  },
  "/tools/prompt-comparison": {
    title: "Free Prompt Comparison Tool — Compare 2 AI Prompts | AI World Hub",
    description:
      "Compare two AI prompts side by side. See token count, word count, readability, structure score, clarity score, and visual diff highlighting. Free in-browser tool.",
    keywords: "Prompt Comparison, Compare Prompts, Free AI Tools, Prompt Engineering, Diff Tool, AI Prompt Comparison",
  },
  "/tools/mega-prompt-builder": {
    title: "Free Mega Prompt Builder — 8-Step Prompt Wizard | AI World Hub",
    description:
      "Build structured mega prompts with an 8-step wizard — role, task, context, audience, format, tone, constraints, and examples. Get production-ready prompts instantly. Free in-browser tool.",
    keywords: "Mega Prompt Builder, Prompt Builder, AI Prompt Generator, Prompt Engineering, ChatGPT Prompt Builder, AI Prompting, Prompt Wizard, Structured Prompts",
  },
  "/tools/prompt-debugger": {
    title: "Free Prompt Debugger — Health Score & Issue Detection | AI World Hub",
    description:
      "Diagnose AI prompts with a health score (0-100), 12+ issue detectors, and instant auto-fix suggestions. Find and fix prompt problems before using them. Free in-browser tool.",
    keywords: "Prompt Debugger, Prompt Health Score, AI Prompt Debugging, Prompt Engineering, Free AI Tools, ChatGPT Prompt Debugger, Prompt Quality Checker",
  },
  "/tools/security-scanner": {
    title: "Free Prompt Security Scanner — Detect Injection & PII | AI World Hub",
    description:
      "Scan AI prompts for injection attacks, jailbreaks, PII leaks, and security threats. Get risk level scoring and actionable remediation. Free in-browser security scanner.",
    keywords: "Prompt Security Scanner, AI Prompt Security, Prompt Injection Detection, PII Detection, Free AI Tools, Prompt Engineering, AI Safety, Prompt Threat Detection",
  },
  "/tools/prompt-chain-builder": {
    title: "Free Prompt Chain Builder — Sequential AI Workflows | AI World Hub",
    description:
      "Chain up to 5 sequential prompt steps with different output formats. Copy all steps or export as Markdown. Build multi-step AI workflows. Free in-browser tool.",
    keywords: "Prompt Chain Builder, Prompt Chaining, AI Prompt Workflow, Sequential Prompts, Free AI Tools, Prompt Engineering, Multi-Step Prompts",
  },
  "/tools/prompt-translator": {
    title: "Free Prompt Translator — 8 Languages | AI World Hub",
    description:
      "Translate AI prompts into 8 languages — Hindi, Spanish, French, German, Japanese, Chinese, Portuguese, Arabic — while preserving variables like {name} and [tone]. Free in-browser tool.",
    keywords: "Prompt Translator, AI Prompt Translation, Translate Prompts, Hindi Prompts, Spanish Prompts, Free AI Tools, Prompt Engineering, Multi-Language Prompts",
  },
  "/tools/api-request-builder": {
    title: "Free API Request Builder — OpenAI, Anthropic, Gemini | AI World Hub",
    description:
      "Build API requests for OpenAI, Anthropic, and Gemini with model selection, temperature, max tokens, and cURL export. Generate JSON request bodies instantly. Free in-browser tool.",
    keywords: "API Request Builder, OpenAI API, Anthropic API, Gemini API, cURL Generator, Free AI Tools, Prompt Engineering, AI API Builder, ChatGPT API",
  },
  "/tools/image-prompt-generator": {
    title: "Free AI Image Prompt Generator — DALL-E & Midjourney | AI World Hub",
    description:
      "Generate production-ready image prompts for DALL-E, Midjourney, and Stable Diffusion. Choose art style, mood, and camera angle. Free in-browser tool with instant copy-paste.",
    keywords: "Image Prompt Generator, AI Image Prompts, Midjourney Prompts, DALL-E Prompts, Stable Diffusion, Free AI Tools, Prompt Engineering",
  },
  "/tools/content-summarizer": {
    title: "Free AI Content Summarizer — TL;DR & Bullet Points | AI World Hub",
    description:
      "Summarize long articles, reports, and documents into TL;DR, bullet points, paragraphs, or academic abstracts. Free in-browser tool with word reduction stats.",
    keywords: "Content Summarizer, AI Summarizer, TL;DR Generator, Article Summarizer, Free AI Tools, Prompt Engineering",
  },
  "/tools/regex-generator": {
    title: "Free AI Regex Generator — From Plain English | AI World Hub",
    description:
      "Generate regex patterns from plain English descriptions. Test instantly against sample strings with built-in syntax cheatsheet. Free in-browser regex tool.",
    keywords: "Regex Generator, AI Regex, Regular Expression Generator, Regex Tester, Free AI Tools, Prompt Engineering",
  },

  // ══ NEW FEATURES ══
  "/templates": {
    title: "Prompt Templates Library — 12 Ready-to-Use Prompts | AI World Hub",
    description:
      "Browse 12 ready-to-use AI prompt templates for writing, marketing, coding, business, education, e-commerce, career, and support. Copy, paste, get results instantly. Free prompt templates library.",
    keywords: "Prompt Templates, AI Prompts, ChatGPT Prompts, Free AI Tools, Prompt Engineering Library, AI Prompting Templates",
  },
  "/categories": {
    title: "AI Prompt Categories — Browse by Use Case | AI World Hub",
    description:
      "Browse AI prompts by category — Writing & Content, Marketing & Sales, Development & Code, Business & Strategy, Education & Learning, and more. Find the perfect prompt.",
    keywords: "AI Prompts, Prompt Categories, Prompt Engineering, Free AI Tools, ChatGPT Categories, AI Prompting",
  },
  "/image-generator": {
    title: "AI Image Prompt Generator — Midjourney & DALL-E | AI World Hub",
    description:
      "Generate optimized AI image prompts for Midjourney, DALL-E 3, and Stable Diffusion. Select an art style and get copy-ready prompts instantly. Free in-browser tool.",
    keywords: "AI Image Prompt Generator, Midjourney Prompts, DALL-E Prompts, Stable Diffusion, Free AI Tools, AI Image Prompts",
  },

  // ══ HIGH-TRAFFIC BLOG POSTS ══
  "/blog/best-ai-tools-2026-complete-directory": {
    title: "Best AI Tools 2026 — Complete Directory of 50+ Tools | AI World Hub",
    description:
      "Discover the 50 best AI tools in 2026 for writing, image generation, coding, video, and productivity. Ranked by popularity with free plans and direct links.",
    keywords: "Best AI Tools, Free AI Tools, AI Tools Directory 2026, AI Prompting Tools",
  },
  "/blog/100-chatgpt-prompts-for-every-task": {
    title: "15 ChatGPT Prompts for Every Task — Copy & Paste | AI World Hub",
    description:
      "15 ready-to-use ChatGPT prompts for writing, marketing, coding, education, and productivity. Copy, paste, and get professional results instantly.",
    keywords: "ChatGPT Prompts, AI Prompts, Prompt Engineering, Free AI Tools, AI Prompting",
  },
  "/blog/how-to-use-chatgpt-complete-guide": {
    title: "How to Use ChatGPT — Complete Beginner Guide 2026 | AI World Hub",
    description:
      "Learn how to use ChatGPT from scratch — creating an account, writing effective prompts, using advanced features, and avoiding common mistakes. Step-by-step guide for beginners.",
    keywords: "How to Use ChatGPT, ChatGPT Guide, Free AI Tools, Prompt Engineering, AI Prompting",
  },
  "/blog/free-ai-tools-50-best-tested": {
    title: "50 Best Free AI Tools 2026 — Tested & Ranked | AI World Hub",
    description:
      "50 genuinely free AI tools tested and ranked for 2026 — writing, images, video, coding, audio, and productivity. No hidden fees, no credit card required.",
    keywords: "Free AI Tools, Best AI Tools, AI Tools 2026, AI Prompting Tools",
  },
  "/blog/prompt-engineering-complete-guide": {
    title: "Prompt Engineering Guide — Beginner to Expert 2026 | AI World Hub",
    description:
      "Master prompt engineering in 2026. Learn proven techniques, frameworks, and best practices for writing AI prompts that get professional results with ChatGPT, Claude, and Gemini.",
    keywords: "Prompt Engineering, AI Prompts, ChatGPT Prompts, Free AI Tools, AI Prompting, Prompt Optimization",
  },
  "/blog/ai-tools-directory-categorized-list": {
    title: "AI Tools Directory — 50+ Tools by Category | AI World Hub",
    description:
      "Browse 50+ AI tools organized by category — text generation, image creation, video editing, coding, audio, and productivity. Find the perfect AI tool for any task.",
    keywords: "AI Tools Directory, Best AI Tools, Free AI Tools, AI Prompting Tools",
  },
};

/**
 * Current URL ke hisaab se SEO data return karo.
 * Agar URL map me nahi hai toh DEFAULT return karo.
 */
export function getSeoForPath(pathname: string): SeoData {
  // Exact match
  if (SEO_MAP[pathname]) return SEO_MAP[pathname];

  // Remove trailing slash and try again
  const cleanPath = pathname.replace(/\/$/, "");
  if (SEO_MAP[cleanPath]) return SEO_MAP[cleanPath];

  // Programmatic prompt pages — /prompts/:role/:task (225 long-tail landing pages)
  const parts = pathname.split("/").filter(Boolean); // ["prompts", role, task?]
  if (parts[0] === "prompts" && parts.length >= 3) {
    const task = PROMPT_TASKS.get(`${parts[1]}/${parts[2]}`);
    const roleTitle = PROMPT_ROLES.get(parts[1])?.title ?? "";
    if (task) {
      return {
        title: task.seoTitle,
        description: task.seoDescription,
        keywords: `${task.title}, ${roleTitle}, AI Prompts, ChatGPT Prompts, Prompt Templates, Prompt Engineering`,
      };
    }
  }

  // Prompt role pages — /prompts/:role (component provides role-specific SEO)
  if (parts[0] === "prompts" && parts.length === 2) {
    const role = PROMPT_ROLES.get(parts[1]);
    if (role) {
      return {
        title: `${role.title} — 15 Ready-to-Use Templates | AI World Hub`,
        description:
          role.description +
          " Copy and customize these prompts for ChatGPT, Claude, Gemini, and any AI model.",
        keywords: `${role.title}, AI Prompts, Prompt Templates, ChatGPT Prompts, Prompt Engineering`,
      };
    }
    return { title: "", description: "", keywords: "" };
  }

  // Blog posts — post-specific SEO passed by BlogPostPage via useSeo()
  if (pathname.startsWith("/blog/")) {
    return {
      title: "",
      description: "",
      keywords: "",
    };
  }

  return DEFAULT_SEO;
}
