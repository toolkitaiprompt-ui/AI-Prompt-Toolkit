/**
 * SEO CONFIG — Saare titles, keywords, descriptions yahan.
 * 
 * FUTURE ME BADLAW: Sirf is file me change karo.
 * App.tsx ko KABHI chhede mat.
 * 
 * useSeo() function automatically current URL ke hisaab se
 * is file se data utha lega.
 */

export type SeoData = {
  title: string;
  description: string;
  keywords: string;
};

const DEFAULT_SEO: SeoData = {
  title: "Best Free AI Tools for Everyone | AI Prompt Engineering",
  description:
    "Best free AI tools for everyone — 9 prompt engineering tools for formatting, validating, extracting, and optimizing prompts. No sign-up, 100% in-browser.",
  keywords:
    "Best AI Tools, Free AI Tools, ChatGPT Prompts, Prompt Engineering, AI Tools Directory, How to Use ChatGPT",
};

const SEO_MAP: Record<string, SeoData> = {
  // ── Homepage ──
  "/": {
    title: "Best Free AI Tools for Everyone | AI Prompt Engineering",
    description:
      "Best free AI tools for everyone — 9 prompt engineering tools for formatting, validating, extracting, and optimizing prompts. JSON schema, token estimator, persona builder & more.",
    keywords:
      "Best AI Tools, Free AI Tools, ChatGPT Prompts, Prompt Engineering, AI Tools Directory, How to Use ChatGPT",
  },

  // ── Tools Directory ──
  "/tools": {
    title: "Free AI Tools Directory — 9 Best Tools | AI World Hub",
    description:
      "Browse the best free AI tools for prompt engineering — variable extractor, JSON schema generator, JSON validator, prompt formatter, cleaner, token estimator, converter, persona builder & optimizer.",
    keywords:
      "Best AI Tools, Free AI Tools, AI Tools Directory, Prompt Engineering Tools, Free AI Prompt Tools",
  },

  // ── Blog ──
  "/blog": {
    title: "ChatGPT Prompts & Prompt Engineering Blog | AI World Hub",
    description:
      "Free ChatGPT prompts, prompt engineering guides, and AI tool reviews. Learn how to write better prompts, use AI tools effectively, and boost productivity with practical tutorials.",
    keywords:
      "ChatGPT Prompts, Prompt Engineering, Best AI Tools, Free AI Tools, AI Tools Directory",
  },

  // ── About ──
  "/about": {
    title: "About — Best Free AI Prompt Engineering Tools | AI World Hub",
    description:
      "AI World Hub offers the best free AI prompt engineering tools for everyone — students, developers, marketers, and teams. 9 in-browser tools, no sign-up, no data collection.",
    keywords: "About AI World Hub, Best AI Tools, Free AI Tools, Prompt Engineering",
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

  // ═══ TOOL PAGES ═══
  "/tools/prompt-variable-extractor": {
    title: "Free Prompt Variable Extractor — AI Prompt Tools",
    description:
      "Extract prompt variables like {name}, {{city}}, [tone] from any AI prompt. Free in-browser tool for building reusable prompt templates.",
    keywords: "Prompt Variable Extractor, Free AI Tools, Prompt Engineering",
  },
  "/tools/json-schema-generator": {
    title: "Free JSON Schema Generator for AI — AI Prompt Tools",
    description:
      "Generate JSON Schema from sample data for reliable AI output. Free in-browser tool — paste JSON, get schema instantly. Draft 2020-12 compliant.",
    keywords: "JSON Schema Generator, Free AI Tools, Prompt Engineering, AI Output",
  },
  "/tools/json-validator": {
    title: "Free JSON Validator for AI Output — AI Prompt Tools",
    description:
      "Validate AI-generated JSON against your schema in real time. Catch missing fields, type mismatches, and errors before production.",
    keywords: "JSON Validator, Free AI Tools, Prompt Engineering, AI Output",
  },
  "/tools/prompt-formatter": {
    title: "Free Prompt Formatter for ChatGPT — AI Prompt Tools",
    description:
      "Format messy prompt notes into clean, numbered instruction blocks for ChatGPT, Claude, and Gemini. Free in-browser tool.",
    keywords: "Prompt Formatter, ChatGPT Prompts, Free AI Tools, Prompt Engineering",
  },
  "/tools/prompt-cleaner": {
    title: "Free Prompt Cleaner — Remove Noise from AI Prompts",
    description:
      "Clean noisy text, hidden characters, and formatting issues from AI prompts. Free in-browser tool.",
    keywords: "Prompt Cleaner, Free AI Tools, Prompt Engineering",
  },
  "/tools/token-estimator": {
    title: "Free AI Token Estimator & Calculator — AI Prompt Tools",
    description:
      "Estimate token count, characters, and words for AI prompts before sending to GPT, Claude, or Gemini APIs. Free token calculator.",
    keywords: "Token Estimator, Token Calculator, Free AI Tools, Prompt Engineering",
  },
  "/tools/prompt-converter": {
    title: "Free Prompt Converter — ChatGPT to Claude & Gemini | AI Tools",
    description:
      "Convert ChatGPT prompts to Claude, Gemini, or Cursor format instantly. Free in-browser tool.",
    keywords: "Prompt Converter, ChatGPT to Claude, Free AI Tools, Prompt Engineering",
  },
  "/tools/persona-builder": {
    title: "Free AI Persona Builder — System Prompt Generator | AI Tools",
    description:
      "Generate expert system prompts for AI roles like Marketer, Developer, Analyst. Free in-browser persona builder for ChatGPT, Claude & Gemini.",
    keywords: "Persona Builder, System Prompt, ChatGPT Prompts, Free AI Tools",
  },
  "/tools/advanced-prompt-optimizer": {
    title: "Free Advanced Prompt Optimizer — Best AI Prompt Tool",
    description:
      "Polish and optimize AI prompts with advanced controls — reduce tokens, add structure, compare before-and-after. Best free prompt optimizer.",
    keywords: "Prompt Optimizer, Best AI Tools, Free AI Tools, Prompt Engineering",
  },
  "/tools/prompt-comparison": {
    title: "Free Prompt Comparison Tool — Compare 2 Prompts | AI Prompt Tools",
    description:
      "Compare two AI prompts side by side. See token count, word count, readability, structure score, clarity score, and visual diff highlighting. Free in-browser tool.",
    keywords: "Prompt Comparison, Compare Prompts, Free AI Tools, Prompt Engineering, Diff Tool",
  },


  // ═══ NEW FEATURES ═══
  "/templates": {
    title: "Free Prompt Templates Library — 100+ Ready-to-Use Prompts | AI World Hub",
    description:
      "Browse 100+ ready-to-use AI prompt templates for writing, marketing, coding, business, education, and more. Copy, paste, get results instantly. Free prompt templates library.",
    keywords: "Prompt Templates, AI Prompts, ChatGPT Prompts, Free AI Tools, Prompt Engineering Library",
  },
  "/categories": {
    title: "AI Prompt Categories — Browse by Use Case | AI World Hub",
    description:
      "Browse AI prompts by category — Writing & Content, Marketing & Sales, Development & Code, Business & Strategy, Education & Learning, and more. Find the perfect prompt.",
    keywords: "AI Prompts, Prompt Categories, Prompt Engineering, Free AI Tools, ChatGPT Categories",
  },
  "/image-generator": {
    title: "Free AI Image Prompt Generator — Optimized for Midjourney & DALL-E | AI World Hub",
    description:
      "Generate optimized AI image prompts for Midjourney, DALL-E 3, and Stable Diffusion. Choose from 10 art styles and get copy-ready prompts instantly. Free in-browser tool.",
    keywords: "AI Image Prompt Generator, Midjourney Prompts, DALL-E Prompts, Stable Diffusion, Free AI Tools",
  },

  // ═══ HIGH-TRAFFIC BLOG POSTS ═══
  "/blog/best-ai-tools-2026-complete-directory": {
    title: "Best AI Tools 2026 — Complete Directory of 50+ Tools | AI World Hub",
    description:
      "Discover the 50 best AI tools in 2026 for writing, image generation, coding, video, and productivity. Ranked by popularity with free plans.",
    keywords: "Best AI Tools, Free AI Tools, AI Tools Directory 2026",
  },
  "/blog/100-chatgpt-prompts-for-every-task": {
    title: "100+ ChatGPT Prompts for Every Task — Copy & Paste | AI World Hub",
    description:
      "100+ ready-to-use ChatGPT prompts for writing, marketing, coding, business, education, and more. Copy, paste, and get professional results.",
    keywords: "ChatGPT Prompts, AI Prompts, Prompt Engineering, Free AI Tools",
  },
  "/blog/how-to-use-chatgpt-complete-guide": {
    title: "How to Use ChatGPT — Complete Beginner Guide 2026 | AI World Hub",
    description:
      "Learn how to use ChatGPT from scratch — creating an account, writing effective prompts, using advanced features.",
    keywords: "How to Use ChatGPT, ChatGPT Guide, Free AI Tools, Prompt Engineering",
  },
  "/blog/free-ai-tools-50-best-tested": {
    title: "50 Best Free AI Tools 2026 — Tested & Ranked | AI World Hub",
    description:
      "50 genuinely free AI tools tested and ranked for 2026 — writing, images, video, coding, audio, and productivity.",
    keywords: "Free AI Tools, Best AI Tools, AI Tools 2026",
  },
  "/blog/prompt-engineering-complete-guide": {
    title: "Prompt Engineering Complete Guide — Beginner to Expert 2026 | AI World Hub",
    description:
      "Master prompt engineering in 2026. Learn proven techniques — role prompting, chain-of-thought, few-shot examples, JSON schema output.",
    keywords: "Prompt Engineering, AI Prompts, ChatGPT Prompts, Free AI Tools",
  },
  "/blog/ai-tools-directory-categorized-list": {
    title: "AI Tools Directory — 50+ Tools by Category | AI World Hub",
    description:
      "Browse 50+ AI tools organized by category — text generation, image creation, video editing, coding, audio, and productivity.",
    keywords: "AI Tools Directory, Best AI Tools, Free AI Tools",
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

  // Blog posts — generic blog SEO
  if (pathname.startsWith("/blog/")) {
    return {
      title: "AI Prompt Engineering Guides & ChatGPT Prompts | AI World Hub",
      description:
        "Free prompt engineering guides, ChatGPT prompt templates, and AI tool reviews. Learn how to write better prompts and get professional results from any AI model.",
      keywords: "ChatGPT Prompts, Prompt Engineering, Free AI Tools, AI Tools Directory",
    };
  }

  return DEFAULT_SEO;
}
