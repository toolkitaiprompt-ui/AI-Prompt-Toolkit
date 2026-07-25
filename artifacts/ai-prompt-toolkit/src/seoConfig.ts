/**
 * SEO CONFIG — Sab pages ke unique titles, descriptions, keywords.
 * Har page ka apna SEO data hai. Koi bhi page DEFAULT nahi aata.
 */

export type SeoData = {
  title: string;
  description: string;
  keywords: string;
};

const DEFAULT_SEO: SeoData = {
  title: "AI World Hub — Best Free AI Tools for Everyone",
  description: "Best free AI tools for everyone — prompt engineering tools for formatting, validating, extracting, and optimizing AI prompts. No sign-up, 100% in-browser.",
  keywords: "Best AI Tools, Free AI Tools, ChatGPT Prompts, Prompt Engineering, AI Tools Directory",
};

const SEO_MAP: Record<string, SeoData> = {
  // ═══ MAIN PAGES ═══
  "/": {
    title: "AI World Hub — Best Free AI Tools for Everyone",
    description: "Best free AI tools for everyone — 10 prompt engineering tools for formatting, validating, extracting, and optimizing prompts. JSON schema, token estimator, persona builder & more.",
    keywords: "Best AI Tools, Free AI Tools, ChatGPT Prompts, Prompt Engineering, AI Tools Directory, How to Use ChatGPT",
  },
  "/tools": {
    title: "Free AI Tools Directory — 16 Best Tools | AI World Hub",
    description: "Browse 16 free AI tools for prompt engineering — variable extractor, JSON schema generator, validator, formatter, cleaner, token estimator, converter, persona builder & more.",
    keywords: "Best AI Tools, Free AI Tools, AI Tools Directory, Prompt Engineering Tools, Free AI Prompt Tools",
  },
  "/blog": {
    title: "ChatGPT Prompts & Prompt Engineering Blog | AI World Hub",
    description: "Free ChatGPT prompts, prompt engineering guides, and AI tool reviews. Learn how to write better prompts and use AI tools effectively with practical tutorials.",
    keywords: "ChatGPT Prompts, Prompt Engineering, Best AI Tools, Free AI Tools, AI Tools Directory",
  },
  "/about": {
    title: "About AI World Hub — Free AI Prompt Engineering Tools for Everyone",
    description: "We built AI World Hub because professional prompt engineering tools should be free. No signup, no data collection, just great tools for everyone.",
    keywords: "About AI World Hub, Free AI Tools, Prompt Engineering, AI Tools for Free",
  },
  "/contact": {
    title: "Contact — Free AI Prompt Tools Support | AI World Hub",
    description: "Contact AI World Hub for prompt engineering support, partnerships, and feedback. Email toolkitaiprompt@gmail.com — we respond within 24 hours.",
    keywords: "Contact AI World Hub, Free AI Tools, Prompt Engineering",
  },
  "/changelog": {
    title: "Changelog — What's New at AI World Hub | AI World Hub",
    description: "See the latest updates, new tools, improvements, and fixes at AI World Hub. We ship fast and keep you informed every step of the way.",
    keywords: "Changelog, AI World Hub Updates, New AI Tools, Prompt Engineering",
  },
  "/playground": {
    title: "Prompt Playground — Free AI Prompt Analyzer & Optimizer | AI World Hub",
    description: "Write, analyze, and optimize your AI prompts in real-time. Token counts, structure checklist, debug scoring, and instant optimization — all free, in your browser.",
    keywords: "Prompt Playground, AI Prompt Analyzer, Prompt Optimizer, Free AI Tools, Prompt Engineering",
  },
  "/privacy-policy": {
    title: "Privacy Policy | Free AI Prompt Tools — AI World Hub",
    description: "Privacy policy for AI World Hub — free AI prompt engineering tools. All tool processing happens in-browser. No personal data collected, stored, or shared.",
    keywords: "Privacy Policy, Free AI Tools, Prompt Engineering",
  },
  "/terms-of-service": {
    title: "Terms of Service | Free AI Prompt Tools — AI World Hub",
    description: "Terms of service for AI World Hub — free AI prompt engineering tools. Use our tools for personal or commercial projects. No warranty, use at your own discretion.",
    keywords: "Terms of Service, Free AI Tools, Prompt Engineering",
  },
  "/templates": {
    title: "Free Prompt Templates Library — 100+ Ready-to-Use Prompts | AI World Hub",
    description: "Browse 100+ ready-to-use AI prompt templates for writing, marketing, coding, business, education, and more. Copy, paste, get results instantly. Free library.",
    keywords: "Prompt Templates, AI Prompts, ChatGPT Prompts, Free AI Tools, Prompt Engineering Library",
  },
  "/categories": {
    title: "AI Prompt Categories — Browse by Use Case | AI World Hub",
    description: "Browse AI prompts by category — Writing, Marketing, Development, Business, Education, and more. Find the perfect prompt for your use case.",
    keywords: "AI Prompts, Prompt Categories, Prompt Engineering, Free AI Tools, ChatGPT Categories",
  },
  "/image-generator": {
    title: "Free AI Image Prompt Generator — Midjourney & DALL-E | AI World Hub",
    description: "Generate optimized AI image prompts for Midjourney, DALL-E 3, and Stable Diffusion. Choose from 10 art styles and get copy-ready prompts instantly. Free in-browser tool.",
    keywords: "AI Image Prompt Generator, Midjourney Prompts, DALL-E Prompts, Stable Diffusion, Free AI Tools",
  },

  // ═══ COMPARE PAGES ═══
  "/compare": {
    title: "AI Model Comparisons — ChatGPT vs Claude vs Gemini | AI World Hub",
    description: "Compare leading AI models side by side — ChatGPT vs Claude, ChatGPT vs Gemini, Claude vs Gemini, and more. Features, pricing, and example prompts.",
    keywords: "AI Model Comparison, ChatGPT vs Claude, ChatGPT vs Gemini, Claude vs Gemini, AI Tools",
  },
  "/compare/chatgpt-vs-claude": {
    title: "ChatGPT vs Claude — Prompting Comparison 2026 | AI World Hub",
    description: "Compare ChatGPT vs Claude for prompt engineering. Features, pricing, strengths, and example responses. Find which AI model is best for your needs.",
    keywords: "ChatGPT vs Claude, AI Comparison, Best AI, Prompt Engineering, Free AI Tools",
  },
  "/compare/chatgpt-vs-gemini": {
    title: "ChatGPT vs Gemini — Prompting Comparison 2026 | AI World Hub",
    description: "Compare ChatGPT vs Google Gemini for prompt engineering. Features, pricing, strengths, and example responses. Which model fits your workflow?",
    keywords: "ChatGPT vs Gemini, Google Gemini, AI Comparison, Prompt Engineering",
  },
  "/compare/claude-vs-gemini": {
    title: "Claude vs Gemini — Prompting Comparison 2026 | AI World Hub",
    description: "Compare Claude vs Google Gemini for prompt engineering. Features, pricing, strengths, and example responses. Find which AI model fits your workflow.",
    keywords: "Claude vs Gemini, AI Comparison, Best AI, Prompt Engineering",
  },
  "/compare/gpt4o-vs-gpt4o-mini": {
    title: "GPT-4o vs GPT-4o-mini — Prompting Comparison | AI World Hub",
    description: "Compare GPT-4o vs GPT-4o-mini for prompt engineering. Features, speed, pricing, and when to use each model. Optimize your prompting costs.",
    keywords: "GPT-4o vs GPT-4o-mini, OpenAI Models, AI Comparison, Prompt Engineering",
  },
  "/compare/midjourney-vs-dalle": {
    title: "Midjourney vs DALL-E 3 — Prompting Comparison | AI World Hub",
    description: "Compare Midjourney vs DALL-E 3 for image prompt engineering. Features, quality, pricing, and example prompts. Find the best AI image generator.",
    keywords: "Midjourney vs DALL-E, AI Image Generator, AI Art, Prompt Engineering",
  },
  "/compare/claude-sonnet-vs-haiku": {
    title: "Claude Sonnet vs Haiku — Prompting Comparison | AI World Hub",
    description: "Compare Claude Sonnet vs Claude Haiku for prompt engineering. Features, speed, pricing, and when to use each model for optimal results.",
    keywords: "Claude Sonnet vs Haiku, Anthropic, AI Comparison, Prompt Engineering",
  },

  // ═══ PROMPTS PAGES ═══
  "/prompts": {
    title: "Ready-to-Use AI Prompts by Role — 225+ Templates | AI World Hub",
    description: "Browse 225+ copy-paste AI prompts organized by professional role — marketing, engineering, writing, data, design, sales, and more. Free prompts for any AI model.",
    keywords: "AI Prompts, ChatGPT Prompts, Prompt Templates, Free AI Tools, Role-Based Prompts",
  },
  "/prompts/marketing-manager": {
    title: "Marketing Manager Prompts — 15 AI Templates | AI World Hub",
    description: "15 ready-to-use AI prompts for marketing managers. Campaign strategy, competitor analysis, content calendars, email campaigns, and more. Free copy-paste templates.",
    keywords: "Marketing Prompts, ChatGPT Marketing, AI Marketing Templates, Free AI Tools",
  },
  "/prompts/software-engineer": {
    title: "Software Engineer Prompts — 15 AI Coding Templates | AI World Hub",
    description: "15 ready-to-use AI prompts for software engineers. Code review, debugging, system design, refactoring, and performance optimization. Free AI coding templates.",
    keywords: "Coding Prompts, AI for Developers, ChatGPT Coding, Free AI Tools, Prompt Engineering",
  },
  "/prompts/content-writer": {
    title: "Content Writer Prompts — 15 AI Writing Templates | AI World Hub",
    description: "15 ready-to-use AI prompts for content writers. Blog posts, newsletters, SEO articles, case studies, and email sequences. Free copy-paste writing templates.",
    keywords: "Writing Prompts, AI Content Writing, ChatGPT Writing, Free AI Tools, Content Creation",
  },
  "/prompts/data-analyst": {
    title: "Data Analyst Prompts — 15 AI Analytics Templates | AI World Hub",
    description: "15 ready-to-use AI prompts for data analysts. SQL queries, Python scripts, statistical analysis, dashboards, and data visualization. Free AI analytics templates.",
    keywords: "Data Analytics Prompts, AI for Data Science, ChatGPT Analytics, Free AI Tools",
  },
  "/prompts/product-manager": {
    title: "Product Manager Prompts — 15 AI Product Templates | AI World Hub",
    description: "15 ready-to-use AI prompts for product managers. PRDs, user stories, roadmaps, feature prioritization, and competitive analysis. Free AI product templates.",
    keywords: "Product Management Prompts, AI for PMs, ChatGPT Product, Free AI Tools",
  },
  "/prompts/ux-designer": {
    title: "UX Designer Prompts — 15 AI Design Templates | AI World Hub",
    description: "15 ready-to-use AI prompts for UX designers. User research, wireframe feedback, usability testing, design systems, and accessibility reviews. Free AI design templates.",
    keywords: "UX Design Prompts, AI for Designers, ChatGPT Design, Free AI Tools, UI UX",
  },
  "/prompts/sales-representative": {
    title: "Sales Representative Prompts — 15 AI Sales Templates | AI World Hub",
    description: "15 ready-to-use AI prompts for sales representatives. Cold emails, follow-ups, discovery calls, objection handling, and proposals. Free AI sales templates.",
    keywords: "Sales Prompts, AI for Sales, ChatGPT Sales, Free AI Tools, Sales Templates",
  },
  "/prompts/hr-manager": {
    title: "HR Manager Prompts — 15 AI HR Templates | AI World Hub",
    description: "15 ready-to-use AI prompts for HR managers. Job descriptions, interview questions, performance reviews, onboarding plans, and HR policies. Free AI HR templates.",
    keywords: "HR Prompts, AI for HR, ChatGPT HR, Free AI Tools, HR Templates",
  },
  "/prompts/teacher": {
    title: "Teacher Prompts — 15 AI Education Templates | AI World Hub",
    description: "15 ready-to-use AI prompts for teachers. Lesson plans, quizzes, rubrics, classroom activities, and discussion questions. Free AI education templates.",
    keywords: "Teacher Prompts, AI for Education, ChatGPT Teaching, Free AI Tools, Lesson Plans",
  },
  "/prompts/startup-founder": {
    title: "Startup Founder Prompts — 15 AI Entrepreneur Templates | AI World Hub",
    description: "15 ready-to-use AI prompts for startup founders. Pitch decks, business plans, fundraising emails, product strategy, and customer discovery. Free AI startup templates.",
    keywords: "Startup Prompts, AI for Entrepreneurs, ChatGPT Startup, Free AI Tools, Business",
  },
  "/prompts/social-media-manager": {
    title: "Social Media Manager Prompts — 15 AI Templates | AI World Hub",
    description: "15 ready-to-use AI prompts for social media managers. Content calendars, Instagram posts, LinkedIn articles, Twitter threads, and ad copy. Free AI social media templates.",
    keywords: "Social Media Prompts, AI Marketing, ChatGPT Social Media, Free AI Tools",
  },
  "/prompts/financial-analyst": {
    title: "Financial Analyst Prompts — 15 AI Finance Templates | AI World Hub",
    description: "15 ready-to-use AI prompts for financial analysts. Financial models, valuation, investment memos, budgets, and risk assessment. Free AI finance templates.",
    keywords: "Finance Prompts, AI for Finance, ChatGPT Finance, Free AI Tools, Analysis",
  },
  "/prompts/customer-support": {
    title: "Customer Support Prompts — 15 AI Support Templates | AI World Hub",
    description: "15 ready-to-use AI prompts for customer support teams. Reply templates, escalation scripts, satisfaction surveys, and live chat scripts. Free AI support templates.",
    keywords: "Support Prompts, AI Customer Service, ChatGPT Support, Free AI Tools, Templates",
  },
  "/prompts/project-manager": {
    title: "Project Manager Prompts — 15 AI PM Templates | AI World Hub",
    description: "15 ready-to-use AI prompts for project managers. Project plans, risk registers, status reports, stakeholder analysis, and sprint retrospectives. Free AI project templates.",
    keywords: "Project Management Prompts, AI for PMs, ChatGPT Project, Free AI Tools",
  },
  "/prompts/graphic-designer": {
    title: "Graphic Designer Prompts — 15 AI Design Templates | AI World Hub",
    description: "15 ready-to-use AI prompts for graphic designers. Design briefs, brand identity proposals, creative briefs, mood boards, and portfolio strategies. Free AI design templates.",
    keywords: "Design Prompts, AI for Designers, ChatGPT Design, Free AI Tools, Graphic Design",
  },

  // ═══ HOW-TO GUIDES ═══
  "/how-to": {
    title: "Prompt Engineering How-To Guides — 10 Step-by-Step Tutorials | AI World Hub",
    description: "10 step-by-step how-to guides for prompt engineering. Learn system prompts, reduce token costs, chain prompts, use few-shot examples, format JSON output, and more.",
    keywords: "How-To Guides, Prompt Engineering Tutorials, AI Tutorials, Free AI Tools",
  },
  "/how-to/write-system-prompt": {
    title: "How to Write a System Prompt — Step-by-Step Guide | AI World Hub",
    description: "Learn how to write effective system prompts for ChatGPT, Claude, and Gemini. Step-by-step guide with examples, templates, and best practices.",
    keywords: "How to Write System Prompt, System Prompt Guide, Prompt Engineering, AI Tutorial",
  },
  "/how-to/reduce-token-cost": {
    title: "How to Reduce AI Token Costs — 7 Strategies | AI World Hub",
    description: "Learn how to reduce AI API token costs by 40-80%. Strategies for prompt compression, model selection, caching, and batch processing. Save money on AI APIs.",
    keywords: "Reduce Token Costs, AI Cost Saving, Token Optimization, Prompt Engineering, API Costs",
  },
  "/how-to/chain-prompts": {
    title: "How to Chain Prompts — Multi-Step AI Workflow Guide | AI World Hub",
    description: "Learn how to chain prompts together for complex AI tasks. Step-by-step guide to building multi-step prompt workflows with examples and the Prompt Chain Builder.",
    keywords: "Chain Prompts, Multi-Step AI, Prompt Workflows, Prompt Engineering, AI Automation",
  },
  "/how-to/use-few-shot-examples": {
    title: "How to Use Few-Shot Examples — AI Prompt Guide | AI World Hub",
    description: "Learn how to use few-shot examples in AI prompts to dramatically improve output consistency. Step-by-step guide with templates for classification and extraction.",
    keywords: "Few-Shot Prompting, AI Examples, Prompt Engineering, ChatGPT Guide, AI Tutorial",
  },
  "/how-to/format-json-output": {
    title: "How to Format JSON Output from AI — Complete Guide | AI World Hub",
    description: "Learn how to get reliable JSON output from ChatGPT, Claude, and Gemini. Step-by-step guide with schema definitions, examples, and validation techniques.",
    keywords: "JSON Output, AI JSON, Structured Output, Prompt Engineering, ChatGPT JSON",
  },
  "/how-to/create-ai-persona": {
    title: "How to Create an AI Persona — Guide with 30+ Templates | AI World Hub",
    description: "Learn how to create effective AI personas for customer support, sales, content creation, and more. Step-by-step guide with 30+ pre-built persona templates.",
    keywords: "AI Persona, System Prompt, Persona Template, Prompt Engineering, ChatGPT Persona",
  },
  "/how-to/test-prompts": {
    title: "How to Test AI Prompts — Systematic Evaluation Guide | AI World Hub",
    description: "Learn how to systematically test AI prompts for quality, consistency, and reliability. Guide with evaluation criteria, A/B comparison, and improvement techniques.",
    keywords: "Test Prompts, AI Prompt Testing, Prompt Evaluation, Prompt Engineering, A/B Testing",
  },
  "/how-to/optimize-for-speed": {
    title: "How to Optimize AI Prompts for Speed — Latency Guide | AI World Hub",
    description: "Learn how to optimize AI prompts for faster response times. Reduce latency by up to 60% with prompt compression, model selection, and output length control.",
    keywords: "Optimize Prompt Speed, AI Latency, Fast AI Responses, Prompt Engineering, Performance",
  },
  "/how-to/handle-long-context": {
    title: "How to Handle Long Context in AI Prompts — Guide | AI World Hub",
    description: "Learn strategies for handling long context in AI prompts. Techniques for document analysis, multi-turn conversations, and staying within token limits.",
    keywords: "Long Context, AI Context Window, Token Limits, Prompt Engineering, Document Analysis",
  },
  "/how-to/prevent-hallucination": {
    title: "How to Prevent AI Hallucination — 7 Techniques | AI World Hub",
    description: "Learn how to reduce AI hallucinations and improve factual accuracy. 7 proven techniques including grounding, confidence thresholds, and verification prompts.",
    keywords: "Prevent AI Hallucination, Reduce AI Errors, Factual AI, Prompt Engineering, AI Accuracy",
  },

  // ═══ TOOL PAGES ═══
  "/tools/prompt-variable-extractor": {
    title: "Free Prompt Variable Extractor — AI Prompt Tools",
    description: "Extract prompt variables like {name}, {{city}}, [tone] from any AI prompt. Free in-browser tool for building reusable prompt templates.",
    keywords: "Prompt Variable Extractor, Free AI Tools, Prompt Engineering",
  },
  "/tools/json-schema-generator": {
    title: "Free JSON Schema Generator for AI — AI Prompt Tools",
    description: "Generate JSON Schema from sample data for reliable AI output. Free in-browser tool — paste JSON, get schema instantly. Draft 2020-12 compliant.",
    keywords: "JSON Schema Generator, Free AI Tools, Prompt Engineering, AI Output",
  },
  "/tools/json-validator": {
    title: "Free JSON Validator for AI Output — AI Prompt Tools",
    description: "Validate AI-generated JSON against your schema in real time. Catch missing fields, type mismatches, and errors before production.",
    keywords: "JSON Validator, Free AI Tools, Prompt Engineering, AI Output",
  },
  "/tools/prompt-formatter": {
    title: "Free Prompt Formatter for ChatGPT — AI Prompt Tools",
    description: "Format messy prompt notes into clean, numbered instruction blocks for ChatGPT, Claude, and Gemini. Free in-browser tool.",
    keywords: "Prompt Formatter, ChatGPT Prompts, Free AI Tools, Prompt Engineering",
  },
  "/tools/prompt-cleaner": {
    title: "Free Prompt Cleaner — Remove Noise from AI Prompts",
    description: "Clean noisy text, hidden characters, and formatting issues from AI prompts. Free in-browser tool.",
    keywords: "Prompt Cleaner, Free AI Tools, Prompt Engineering",
  },
  "/tools/token-estimator": {
    title: "Free AI Token Estimator & Calculator — AI Prompt Tools",
    description: "Estimate token count, characters, and words for AI prompts before sending to GPT, Claude, or Gemini APIs. Free token calculator.",
    keywords: "Token Estimator, Token Calculator, Free AI Tools, Prompt Engineering",
  },
  "/tools/prompt-converter": {
    title: "Free Prompt Converter — ChatGPT to Claude & Gemini | AI Tools",
    description: "Convert ChatGPT prompts to Claude, Gemini, or Cursor format instantly. Free in-browser tool.",
    keywords: "Prompt Converter, ChatGPT to Claude, Free AI Tools, Prompt Engineering",
  },
  "/tools/persona-builder": {
    title: "Free AI Persona Builder — System Prompt Generator | AI Tools",
    description: "Generate expert system prompts for AI roles like Marketer, Developer, Analyst. Free in-browser persona builder for ChatGPT, Claude & Gemini.",
    keywords: "Persona Builder, System Prompt, ChatGPT Prompts, Free AI Tools",
  },
  "/tools/advanced-prompt-optimizer": {
    title: "Free Advanced Prompt Optimizer — Best AI Prompt Tool",
    description: "Polish and optimize AI prompts with advanced controls — reduce tokens, add structure, compare before-and-after. Best free prompt optimizer.",
    keywords: "Prompt Optimizer, Best AI Tools, Free AI Tools, Prompt Engineering",
  },
  "/tools/mega-prompt-builder": {
    title: "Free Mega Prompt Builder — 8-Step Wizard | AI World Hub",
    description: "Build perfect prompts step-by-step with an 8-step guided wizard. Choose role, task, context, audience, format, tone, constraints, and examples.",
    keywords: "Mega Prompt Builder, Prompt Wizard, AI Prompt Builder, Free AI Tools, Prompt Engineering",
  },
  "/tools/prompt-debugger": {
    title: "Free Prompt Debugger — AI Prompt Health Score | AI World Hub",
    description: "Paste any prompt to get a health score, detect vague words, missing role/format, conflicting instructions, and token warnings. Free AI prompt debugger.",
    keywords: "Prompt Debugger, AI Prompt Analysis, Prompt Health Score, Free AI Tools, Debug Prompts",
  },
  "/tools/security-scanner": {
    title: "Free AI Security Scanner — Prompt Injection Detection | AI World Hub",
    description: "Scan your prompts for injection attacks, jailbreak attempts, data leak risks, PII exposure, and unsafe content. Free in-browser security scanner.",
    keywords: "AI Security Scanner, Prompt Injection, Jailbreak Detection, Free AI Tools, Prompt Security",
  },
  "/tools/prompt-comparison": {
    title: "Free Prompt Comparison Tool — Compare 2 Prompts | AI World Hub",
    description: "Compare two AI prompts side by side. See token count, word count, readability, structure score, clarity score, and visual diff highlighting.",
    keywords: "Prompt Comparison, Compare Prompts, Free AI Tools, Prompt Engineering, Diff Tool",
  },
  "/tools/prompt-chain-builder": {
    title: "Free Prompt Chain Builder — Multi-Step AI Workflows | AI World Hub",
    description: "Build multi-step AI prompt chains with up to 5 sequential steps. Each step has its own prompt and output format. Export as Markdown. Free in-browser tool.",
    keywords: "Prompt Chain Builder, Multi-Step AI, AI Workflows, Free AI Tools, Prompt Chains",
  },
  "/tools/prompt-translator": {
    title: "Free Prompt Translator — 8 Languages | AI World Hub",
    description: "Translate English prompts to 8 languages — Hindi, Spanish, French, German, Japanese, Chinese, Portuguese, Arabic. Preserves variables and prompt structure.",
    keywords: "Prompt Translator, AI Translation, Multilingual Prompts, Free AI Tools, Language Translation",
  },
  "/tools/api-request-builder": {
    title: "Free API Request Builder — OpenAI, Anthropic & Gemini | AI World Hub",
    description: "Build ready-to-use API request bodies for OpenAI, Anthropic & Gemini. Includes cURL commands, temperature, and token control. Free in-browser tool.",
    keywords: "API Request Builder, OpenAI API, Anthropic API, Gemini API, Free AI Tools, cURL",
  },

  // ═══ BLOG POSTS — HIGH TRAFFIC ═══
  "/blog/best-ai-tools-2026-complete-directory": {
    title: "Best AI Tools 2026 — Complete Directory of 50+ Tools",
    description: "Discover the 50 best AI tools in 2026 for writing, image generation, coding, video, and productivity. Ranked by popularity with free plans.",
    keywords: "Best AI Tools, Free AI Tools, AI Tools Directory 2026",
  },
  "/blog/100-chatgpt-prompts-for-every-task": {
    title: "100+ ChatGPT Prompts for Every Task — Copy & Paste",
    description: "100+ ready-to-use ChatGPT prompts for writing, marketing, coding, business, education, and more. Copy, paste, and get professional results instantly.",
    keywords: "ChatGPT Prompts, AI Prompts, Prompt Engineering, Free AI Tools",
  },
  "/blog/how-to-use-chatgpt-complete-guide": {
    title: "How to Use ChatGPT — Complete Beginner Guide 2026",
    description: "Learn how to use ChatGPT from scratch — creating an account, writing effective prompts, and using advanced features like image generation and file analysis.",
    keywords: "How to Use ChatGPT, ChatGPT Guide, Free AI Tools, Prompt Engineering",
  },
  "/blog/free-ai-tools-50-best-tested": {
    title: "50 Best Free AI Tools 2026 — Tested & Ranked",
    description: "50 genuinely free AI tools tested and ranked for 2026 — writing, images, video, coding, audio, and productivity. No hidden fees, no credit card required.",
    keywords: "Free AI Tools, Best AI Tools, AI Tools 2026",
  },
  "/blog/prompt-engineering-complete-guide": {
    title: "Prompt Engineering Complete Guide — Beginner to Expert 2026",
    description: "Master prompt engineering in 2026. Learn proven techniques — role prompting, chain-of-thought, few-shot examples, JSON schema output, and more.",
    keywords: "Prompt Engineering, AI Prompts, ChatGPT Prompts, Free AI Tools",
  },
  "/blog/ai-tools-directory-categorized-list": {
    title: "AI Tools Directory — 50+ Tools by Category",
    description: "Browse 50+ AI tools organized by category — text generation, image creation, video editing, coding, audio, and productivity. Compare features and pricing.",
    keywords: "AI Tools Directory, Best AI Tools, Free AI Tools",
  },
};

/**
 * Current URL ke hisaab se SEO data return karo.
 * Fallback logic ensures EVERY page gets unique-ish SEO.
 */
export function getSeoForPath(pathname: string): SeoData {
  // Exact match
  if (SEO_MAP[pathname]) return SEO_MAP[pathname];

  // Remove trailing slash
  const cleanPath = pathname.replace(/\/$/, "");
  if (SEO_MAP[cleanPath]) return SEO_MAP[cleanPath];

  // Blog posts — specific blog SEO
  if (pathname.startsWith("/blog/")) {
    const slug = pathname.replace("/blog/", "").replace(/\/$/, "");
    const title = slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return {
      title: `${title} — Free AI Prompt Guide | AI World Hub`,
      description: `Learn about ${slug.replace(/-/g, " ")} in our comprehensive AI prompt engineering guide. Free tips, templates, and best practices for ChatGPT, Claude & Gemini.`,
      keywords: `${slug.replace(/-/g, " ")}, ChatGPT Prompts, Prompt Engineering, Free AI Tools`,
    };
  }

  // Compare pages
  if (pathname.startsWith("/compare/")) {
    return {
      title: `${pathname.replace("/compare/", "").replace(/-/g, " ").replace(/\//g, "")} — Comparison Guide | AI World Hub`,
      description: `Compare AI models side by side. Features, pricing, strengths, and example prompts to help you choose the best AI for your needs.`,
      keywords: "AI Comparison, ChatGPT, Claude, Gemini, Free AI Tools",
    };
  }

  // How-to pages
  if (pathname.startsWith("/how-to/")) {
    const topic = pathname.replace("/how-to/", "").replace(/-/g, " ");
    return {
      title: `How to ${topic.charAt(0).toUpperCase() + topic.slice(1)} — AI Guide | AI World Hub`,
      description: `Learn how to ${topic} with our step-by-step AI prompt engineering guide. Free tips, examples, and best practices for better AI results.`,
      keywords: `How to ${topic}, Prompt Engineering, AI Guide, Free AI Tools, ChatGPT`,
    };
  }

  // Role prompts pages
  if (pathname.startsWith("/prompts/")) {
    const role = pathname.replace("/prompts/", "").replace(/-/g, " ");
    return {
      title: `${role.charAt(0).toUpperCase() + role.slice(1)} Prompts — 15 AI Role Templates | AI World Hub`,
      description: `15 ready-to-use AI prompts for ${role}. Free copy-paste templates optimized for ChatGPT, Claude, and Gemini. Get professional results instantly.`,
      keywords: `${role} Prompts, AI Role Templates, ChatGPT Prompts, Free AI Tools, Prompt Engineering`,
    };
  }

  return DEFAULT_SEO;
}
