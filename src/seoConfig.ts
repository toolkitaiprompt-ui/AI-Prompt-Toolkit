/**
 * SEO CONFIG â€” Saare titles, keywords, descriptions yahan.
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
  title: "16 Free AI Prompt Engineering Tools | AI World Hub",
  description:
    "Use 16 free AI prompt engineering tools to build, format, debug, secure, translate, and optimize prompts in your browser. No sign-up required.",
  keywords:
    "Best AI Tools, Free AI Tools, ChatGPT Prompts, Prompt Engineering, AI Tools Directory, AI Prompt Builder, How to Use ChatGPT, Prompt Optimization, AI Prompting, ChatGPT Prompt Generator",
};

const SEO_MAP: Record<string, SeoData> = {
  // â”€â”€ Homepage â”€â”€
  "/": {
    title: "16 Free AI Prompt Engineering Tools | AI World Hub",
    description:
      "Use 16 free AI prompt engineering tools to build, format, debug, secure, translate, and optimize prompts in your browser. No sign-up required.",
    keywords:
      "Best AI Tools, Free AI Tools, ChatGPT Prompts, Prompt Engineering, AI Tools Directory, AI Prompt Builder, How to Use ChatGPT, Prompt Optimization, AI Prompting, ChatGPT Prompt Generator",
  },

  // â”€â”€ Playground â”€â”€
  "/playground": {
    title: "AI Prompt Playground â€” Test & Debug Prompts Live | AI World Hub",
    description:
      "Free AI prompt playground. Generate blog post, code review, and cold email prompt templates, estimate tokens, and debug prompt health in real time â€” all in your browser.",
    keywords:
      "AI Prompt Playground, Prompt Testing, Prompt Debugging, Token Estimation, Prompt Templates, ChatGPT Playground, Prompt Engineering, AI Prompting Tools",
  },

  // â”€â”€ Tools Directory â”€â”€
  "/tools": {
    title: "Free AI Tools Directory â€” 16 Best Tools | AI World Hub",
    description:
      "Choose from 16 best free AI tools for prompt engineering â€” variable extractor, JSON schema generator, JSON validator, prompt formatter, cleaner, token estimator, converter, persona builder, optimizer, comparison tool, mega prompt builder, debugger, security scanner, chain builder, translator, and API request builder.",
    keywords:
      "Best AI Tools, Free AI Tools, AI Tools Directory, Prompt Engineering Tools, Free AI Prompt Tools, AI Prompt Builder, ChatGPT Prompt Tools, Prompt Optimization Tools",
  },

  // â”€â”€ Prompts Library â”€â”€
  "/prompts": {
    title: "AI Prompt Library â€” 225+ Prompts for 15 Roles | AI World Hub",
    description:
      "Free AI prompt library with 225+ ready-to-use prompts for 15 professional roles â€” ChatGPT, content writers, developers, marketers, SEO, data analysts, designers, sales, customer support, and more. Copy and customize instantly.",
    keywords:
      "AI Prompts, ChatGPT Prompts, Prompt Library, Prompt Templates, Best AI Prompts, Prompt Engineering, Role-Based Prompts, AI Prompt Collection, AI Prompting, Prompt Database",
  },

  // â”€â”€ Changelog â”€â”€
  "/changelog": {
    title: "Changelog â€” Latest Updates & New Features | AI World Hub",
    description:
      "Track all updates and new features added to AI World Hub's AI prompt engineering toolkit. See version history, new tools, improvements, and bug fixes.",
    keywords:
      "AI World Hub Changelog, Updates, New Features, Version History, AI Tools Updates, Prompt Engineering Tools",
  },

  // â”€â”€ Blog â”€â”€
  "/blog": {
    title: "ChatGPT Prompts & Prompt Engineering Blog | AI World Hub",
    description:
      "Free ChatGPT prompts, prompt engineering guides, and AI tool reviews. Learn how to write better prompts, use AI tools effectively, and boost productivity with practical tutorials.",
    keywords:
      "ChatGPT Prompts, Prompt Engineering, Best AI Tools, Free AI Tools, AI Tools Directory, AI Prompting",
  },

  // â”€â”€ About â”€â”€
  "/about": {
    title: "About â€” Best Free AI Prompt Engineering Tools | AI World Hub",
    description:
      "AI World Hub offers the best free AI prompt engineering tools for everyone â€” students, developers, marketers, and teams. 16 in-browser tools, no sign-up, no data collection.",
    keywords:
      "About AI World Hub, Best AI Tools, Free AI Tools, Prompt Engineering",
  },

  // â”€â”€ Contact â”€â”€
  "/contact": {
    title: "Contact â€” Free AI Prompt Tools Support | AI World Hub",
    description:
      "Contact AI World Hub for prompt engineering support, partnerships, and feedback. Email toolkitaiprompt@gmail.com â€” we respond within 24 hours.",
    keywords: "Contact AI World Hub, Free AI Tools, Prompt Engineering",
  },

  // â”€â”€ Privacy â”€â”€
  "/privacy-policy": {
    title: "Privacy Policy | Free AI Prompt Tools â€” AI World Hub",
    description:
      "Privacy policy for AI World Hub â€” free AI prompt engineering tools. All tool processing happens in-browser. No personal data collected, stored, or shared.",
    keywords: "Privacy Policy, Free AI Tools, Prompt Engineering",
  },

  // â”€â”€ Terms â”€â”€
  "/terms-of-service": {
    title: "Terms of Service | Free AI Prompt Tools â€” AI World Hub",
    description:
      "Terms of service for AI World Hub â€” free AI prompt engineering tools. Use our tools for personal or commercial projects. No warranty, use at your own discretion.",
    keywords: "Terms of Service, Free AI Tools, Prompt Engineering",
  },

  // â•â• TOOL PAGES â•â•
  "/tools/prompt-variable-extractor": {
    title: "Free Prompt Variable Extractor â€” Extract {Variables} | AI World Hub",
    description:
      "Extract prompt variables like {name}, {{city}}, [tone] from any AI prompt. Free in-browser tool for building reusable prompt templates.",
    keywords: "Prompt Variable Extractor, Free AI Tools, Prompt Engineering, AI Prompting, Prompt Template Builder",
  },
  "/tools/json-schema-generator": {
    title: "Free JSON Schema Generator for AI Output | AI World Hub",
    description:
      "Generate JSON Schema from sample data for reliable AI output. Free in-browser tool â€” paste JSON, get schema instantly. Draft 2020-12 compliant.",
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
    title: "Free Prompt Cleaner â€” Remove Noise from AI Prompts | AI World Hub",
    description:
      "Clean noisy text, hidden characters, and formatting issues from AI prompts. Free in-browser tool.",
    keywords: "Prompt Cleaner, Free AI Tools, Prompt Engineering, AI Prompt Cleanup",
  },
  "/tools/token-estimator": {
    title: "Free AI Token Estimator & Counter â€” GPT, Claude | AI World Hub",
    description:
      "Estimate token count, characters, and words for AI prompts before sending to GPT, Claude, or Gemini APIs. Free token calculator.",
    keywords: "Token Estimator, Token Calculator, Free AI Tools, Prompt Engineering, AI Token Counter, ChatGPT Token Calculator",
  },
  "/tools/prompt-converter": {
    title: "Free Prompt Converter â€” ChatGPT to Claude & Gemini | AI World Hub",
    description:
      "Convert ChatGPT prompts to Claude, Gemini, or Cursor format instantly. Free in-browser tool.",
    keywords: "Prompt Converter, ChatGPT to Claude, Free AI Tools, Prompt Engineering, AI Prompt Conversion",
  },
  "/tools/persona-builder": {
    title: "Free AI Persona Builder â€” System Prompt Generator | AI World Hub",
    description:
      "Generate expert system prompts for AI roles like Marketer, Developer, Analyst. Free in-browser persona builder for ChatGPT, Claude & Gemini.",
    keywords: "Persona Builder, System Prompt, ChatGPT Prompts, Free AI Tools, AI Persona Generator, Role-Based Prompts",
  },
  "/tools/advanced-prompt-optimizer": {
    title: "Free Advanced Prompt Optimizer â€” Best AI Prompt Tool | AI World Hub",
    description:
      "Polish and optimize AI prompts with advanced controls â€” reduce tokens, add structure, compare before-and-after. Best free prompt optimizer.",
    keywords: "Prompt Optimizer, Best AI Tools, Free AI Tools, Prompt Engineering, AI Prompt Optimization, ChatGPT Prompt Optimizer",
  },
  "/tools/prompt-comparison": {
    title: "Free Prompt Comparison Tool â€” Compare 2 AI Prompts | AI World Hub",
    description:
      "Compare two AI prompts side by side. See token count, word count, readability, structure score, clarity score, and visual diff highlighting. Free in-browser tool.",
    keywords: "Prompt Comparison, Compare Prompts, Free AI Tools, Prompt Engineering, Diff Tool, AI Prompt Comparison",
  },
  "/tools/mega-prompt-builder": {
    title: "Free Mega Prompt Builder â€” 8-Step Prompt Wizard | AI World Hub",
    description:
      "Build structured mega prompts with an 8-step wizard â€” role, task, context, audience, format, tone, constraints, and examples. Get production-ready prompts instantly. Free in-browser tool.",
    keywords: "Mega Prompt Builder, Prompt Builder, AI Prompt Generator, Prompt Engineering, ChatGPT Prompt Builder, AI Prompting, Prompt Wizard, Structured Prompts",
  },
  "/tools/prompt-debugger": {
    title: "Free Prompt Debugger â€” Health Score & Issue Detection | AI World Hub",
    description:
      "Diagnose AI prompts with a health score (0-100), 12+ issue detectors, and instant auto-fix suggestions. Find and fix prompt problems before using them. Free in-browser tool.",
    keywords: "Prompt Debugger, Prompt Health Score, AI Prompt Debugging, Prompt Engineering, Free AI Tools, ChatGPT Prompt Debugger, Prompt Quality Checker",
  },
  "/tools/security-scanner": {
    title: "Free Prompt Security Scanner â€” Detect Injection & PII | AI World Hub",
    description:
      "Scan AI prompts for injection attacks, jailbreaks, PII leaks, and security threats. Get risk level scoring and actionable remediation. Free in-browser security scanner.",
    keywords: "Prompt Security Scanner, AI Prompt Security, Prompt Injection Detection, PII Detection, Free AI Tools, Prompt Engineering, AI Safety, Prompt Threat Detection",
  },
  "/tools/prompt-chain-builder": {
    title: "Free Prompt Chain Builder â€” Sequential AI Workflows | AI World Hub",
    description:
      "Chain up to 5 sequential prompt steps with different output formats. Copy all steps or export as Markdown. Build multi-step AI workflows. Free in-browser tool.",
    keywords: "Prompt Chain Builder, Prompt Chaining, AI Prompt Workflow, Sequential Prompts, Free AI Tools, Prompt Engineering, Multi-Step Prompts",
  },
  "/tools/prompt-translator": {
    title: "Free Prompt Translator â€” 8 Languages | AI World Hub",
    description:
      "Translate AI prompts into 8 languages â€” Hindi, Spanish, French, German, Japanese, Chinese, Portuguese, Arabic â€” while preserving variables like {name} and [tone]. Free in-browser tool.",
    keywords: "Prompt Translator, AI Prompt Translation, Translate Prompts, Hindi Prompts, Spanish Prompts, Free AI Tools, Prompt Engineering, Multi-Language Prompts",
  },
  "/tools/api-request-builder": {
    title: "Free API Request Builder â€” OpenAI, Anthropic, Gemini | AI World Hub",
    description:
      "Build API requests for OpenAI, Anthropic, and Gemini with model selection, temperature, max tokens, and cURL export. Generate JSON request bodies instantly. Free in-browser tool.",
    keywords: "API Request Builder, OpenAI API, Anthropic API, Gemini API, cURL Generator, Free AI Tools, Prompt Engineering, AI API Builder, ChatGPT API",
  },

  // â•â• NEW FEATURES â•â•
  "/templates": {
    title: "Free Prompt Templates Library â€” 100+ Ready-to-Use Prompts | AI World Hub",
    description:
      "Browse 100+ ready-to-use AI prompt templates for writing, image generation, coding, video, and productivity. Copy, paste, get results instantly. Free prompt templates library.",
    keywords: "Prompt Templates, AI Prompts, ChatGPT Prompts, Free AI Tools, Prompt Engineering Library, AI Prompting Templates",
  },
  "/categories": {
    title: "AI Prompt Categories â€” Browse by Use Case | AI World Hub",
    description:
      "Browse AI prompts by category â€” Writing & Content, Marketing & Sales, Development & Code, Business & Strategy, Education & Learning, and more. Find the perfect prompt.",
    keywords: "AI Prompts, Prompt Categories, Prompt Engineering, Free AI Tools, ChatGPT Categories, AI Prompting",
  },
  "/image-generator": {
    title: "Free AI Image Prompt Generator â€” Midjourney & DALL-E | AI World Hub",
    description:
      "Generate optimized AI image prompts for Midjourney, DALL-E 3, and Stable Diffusion. Select an art style and get copy-ready prompts instantly. Free in-browser tool.",
    keywords: "AI Image Prompt Generator, Midjourney Prompts, DALL-E Prompts, Stable Diffusion, Free AI Tools, AI Image Prompts",
  },

  // â•â• HIGH-TRAFFIC BLOG POSTS â•â•
  "/blog/best-ai-tools-2026-complete-directory": {
    title: "Best AI Tools 2026 â€” Complete Directory of 50+ Tools | AI World Hub",
    description:
      "Discover the 50 best AI tools in 2026 for writing, image generation, coding, video, and productivity. Ranked by popularity with free plans.",
    keywords: "Best AI Tools, Free AI Tools, AI Tools Directory 2026, AI Prompting Tools",
  },
  "/blog/100-chatgpt-prompts-for-every-task": {
    title: "100+ ChatGPT Prompts for Every Task â€” Copy & Paste | AI World Hub",
    description:
      "100+ ready-to-use ChatGPT prompts for writing, marketing, coding, business, education, and more. Copy, paste, and get professional results.",
    keywords: "ChatGPT Prompts, AI Prompts, Prompt Engineering, Free AI Tools, AI Prompting",
  },
  "/blog/how-to-use-chatgpt-complete-guide": {
    title: "How to Use ChatGPT â€” Complete Beginner Guide 2026 | AI World Hub",
    description:
      "Learn how to use ChatGPT from scratch â€” creating an account, writing effective prompts, using advanced features.",
    keywords: "How to Use ChatGPT, ChatGPT Guide, Free AI Tools, Prompt Engineering, AI Prompting",
  },
  "/blog/free-ai-tools-50-best-tested": {
    title: "50 Best Free AI Tools 2026 â€” Tested & Ranked | AI World Hub",
    description:
      "50 genuinely free AI tools tested and ranked for 2026 â€” writing, images, video, coding, audio, and productivity.",
    keywords: "Free AI Tools, Best AI Tools, AI Tools 2026, AI Prompting Tools",
  },
  "/blog/prompt-engineering-complete-guide": {
    title: "Prompt Engineering Complete Guide â€” Beginner to Expert 2026 | AI World Hub",
    description:
      "Master prompt engineering in 2026. Learn proven techniques â€” role prompting, chain-of-thought, few-shot examples, JSON schema output.",
    keywords: "Prompt Engineering, AI Prompts, ChatGPT Prompts, Free AI Tools, AI Prompting, Prompt Optimization",
  },
  "/blog/ai-tools-directory-categorized-list": {
    title: "AI Tools Directory â€” 50+ Tools by Category | AI World Hub",
    description:
      "Browse 50+ AI tools organized by category â€” text generation, image creation, video editing, coding, audio, and productivity.",
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

  // Prompt role pages â€” /prompts/:role
  if (pathname.startsWith("/prompts/")) {
    return {
      title: "AI Prompts by Role â€” Ready-to-Use Prompt Templates | AI World Hub",
      description:
        "Browse role-based AI prompt templates â€” ready to copy, customize, and use with ChatGPT, Claude, Gemini, and any AI model. Free prompt library.",
      keywords: "AI Prompts, ChatGPT Prompts, Prompt Templates, Role-Based Prompts, Prompt Engineering, AI Prompting, Free AI Tools",
    };
  }

  // Blog posts â€” generic blog SEO
  if (pathname.startsWith("/blog/")) {
    return {
      title: "AI Prompt Engineering Guides & ChatGPT Prompts | AI World Hub",
      description:
        "Free prompt engineering guides, ChatGPT prompt templates, and AI tool reviews. Learn how to write better prompts and get professional results from any AI model.",
      keywords: "ChatGPT Prompts, Prompt Engineering, Free AI Tools, AI Tools Directory, AI Prompting",
    };
  }

  return DEFAULT_SEO;
}
