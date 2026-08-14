/**
 * Static routes — hand-curated page list (titles/descriptions live here).
 * Combined with programmatic /prompts/:role/:task routes in scripts/seo-routes.mjs.
 * Priorities/changefreq mirrored from public/sitemap.xml.
 * Rebuild with: node scripts/build-static-routes.mjs
 */
export const STATIC_ROUTES = [
  {
    "path": "/",
    "title": "19 Free AI Prompt Engineering Tools | AI World Hub",
    "desc": "Use 19 free AI prompt engineering tools to build, format, debug, secure, translate, and optimize prompts in your browser. No sign-up required.",
    "type": "home",
    "priority": 1,
    "changefreq": "daily"
  },
  {
    "path": "/tools",
    "title": "Free AI Tools Directory — 19 Best Tools | AI World Hub",
    "desc": "Choose from 19 free AI tools for prompt engineering — variable extractor, JSON schema generator, JSON validator, prompt formatter, cleaner, token estimator, converter, persona builder, optimizer, comparison tool, mega prompt builder, prompt debugger, security scanner, prompt chain builder, prompt translator, API request builder, image prompt generator, content summarizer & regex generator.",
    "type": "page",
    "priority": 0.9,
    "changefreq": "daily"
  },
  {
    "path": "/blog",
    "title": "ChatGPT Prompts & Prompt Engineering Blog | AI World Hub",
    "desc": "Free ChatGPT prompts, prompt engineering guides, and AI tool reviews. Learn how to write better prompts, use AI tools effectively, and boost productivity with practical tutorials.",
    "type": "page",
    "priority": 0.9,
    "changefreq": "daily"
  },
  {
    "path": "/about",
    "title": "About — Best Free AI Prompt Engineering Tools | AI World Hub",
    "desc": "AI World Hub offers the best free AI prompt engineering tools for everyone — students, developers, marketers, and teams. 19 in-browser tools, no sign-up, no data collection.",
    "type": "page",
    "priority": 0.6,
    "changefreq": "weekly"
  },
  {
    "path": "/contact",
    "title": "Contact — Free AI Prompt Tools Support | AI World Hub",
    "desc": "Contact AI World Hub for prompt engineering support, partnerships, and feedback. Email toolkitaiprompt@gmail.com — we respond within 24 hours.",
    "type": "page",
    "priority": 0.6,
    "changefreq": "weekly"
  },
  {
    "path": "/privacy-policy",
    "title": "Privacy Policy | Free AI Prompt Tools — AI World Hub",
    "desc": "Privacy policy for AI World Hub — free AI prompt engineering tools. All tool processing happens in-browser. No personal data collected, stored, or shared.",
    "type": "page",
    "priority": 0.6,
    "changefreq": "weekly"
  },
  {
    "path": "/terms-of-service",
    "title": "Terms of Service | Free AI Prompt Tools — AI World Hub",
    "desc": "Terms of service for AI World Hub — free AI prompt engineering tools. Use our tools for personal or commercial projects. No warranty, use at your own discretion.",
    "type": "page",
    "priority": 0.6,
    "changefreq": "weekly"
  },
  {
    "path": "/tools/prompt-variable-extractor",
    "title": "Free Prompt Variable Extractor — AI Prompt Tools",
    "desc": "Extract prompt variables like {name}, {{city}}, [tone] from any AI prompt. Free in-browser tool for building reusable prompt templates. Supports 4 variable syntaxes, sorted output.",
    "type": "tool",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/tools/json-schema-generator",
    "title": "Free JSON Schema Generator for AI — AI Prompt Tools",
    "desc": "Generate JSON Schema from sample data for reliable AI output. Free in-browser tool — paste JSON, get schema instantly. Draft 2020-12 compliant with nested object support.",
    "type": "tool",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/tools/json-validator",
    "title": "Free JSON Validator for AI Output — AI Prompt Tools",
    "desc": "Validate AI-generated JSON against your schema in real time. Catch missing fields, type mismatches, and structural errors before production. Free in-browser tool.",
    "type": "tool",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/tools/prompt-formatter",
    "title": "Free Prompt Formatter for ChatGPT — AI Prompt Tools",
    "desc": "Format messy prompt notes into clean, numbered instruction blocks for ChatGPT, Claude, and Gemini. Free in-browser tool — get better AI results with structured prompts.",
    "type": "tool",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/tools/prompt-cleaner",
    "title": "Free Prompt Cleaner — Remove Noise from AI Prompts",
    "desc": "Clean noisy text, hidden characters, and formatting issues from AI prompts. Free in-browser tool that normalizes whitespace, strips control characters, and trims line breaks.",
    "type": "tool",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/tools/token-estimator",
    "title": "Free AI Token Estimator & Calculator — AI Prompt Tools",
    "desc": "Estimate token count, characters, and words for AI prompts before sending to GPT, Claude, or Gemini APIs. Free in-browser token calculator for cost planning and budget optimization.",
    "type": "tool",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/tools/prompt-converter",
    "title": "Free Prompt Converter — ChatGPT to Claude & Gemini | AI Tools",
    "desc": "Convert ChatGPT prompts to Claude, Gemini, or Cursor format instantly. Free in-browser tool that adapts tone, structure, and directives for each AI model. No sign-up required.",
    "type": "tool",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/tools/persona-builder",
    "title": "Free AI Persona Builder — System Prompt Generator | AI Tools",
    "desc": "Generate expert system prompts for AI roles like Marketer, Developer, Analyst, Writer, Teacher, and Business Consultant. Free in-browser persona builder for ChatGPT, Claude & Gemini.",
    "type": "tool",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/tools/advanced-prompt-optimizer",
    "title": "Free Advanced Prompt Optimizer — Best AI Prompt Tool",
    "desc": "Polish and optimize AI prompts with advanced controls — reduce tokens, add structure, compare before-and-after. The best free prompt optimizer for ChatGPT, Claude & Gemini.",
    "type": "tool",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/tools/prompt-comparison",
    "title": "Free Prompt Comparison Tool — Compare AI Prompts",
    "desc": "Compare two AI prompts side by side with token count, word count, readability, structure score, clarity score, and visual diff highlighting. Free in-browser tool for choosing the best prompt.",
    "type": "tool",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/tools/mega-prompt-builder",
    "title": "Free Mega Prompt Builder — AI Prompt Generator",
    "desc": "Build structured mega prompts with an 8-step wizard — role, task, context, audience, format, tone, constraints, and examples. Free in-browser mega prompt builder for ChatGPT, Claude & Gemini.",
    "type": "tool",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/tools/prompt-debugger",
    "title": "Free Prompt Debugger — Diagnose AI Prompts",
    "desc": "Diagnose AI prompts with a health score (0-100), 12+ issue detectors, and instant auto-fix suggestions. Free in-browser prompt debugger for ChatGPT, Claude & Gemini prompts.",
    "type": "tool",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/tools/security-scanner",
    "title": "Free Prompt Security Scanner — AI Prompt Injection Check",
    "desc": "Scan prompts for injection attacks, jailbreaks, PII leaks, and security threats with risk level scoring and actionable remediation. Free in-browser prompt security scanner for AI prompts.",
    "type": "tool",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/tools/prompt-chain-builder",
    "title": "Free Prompt Chain Builder — AI Prompt Sequencing",
    "desc": "Chain up to 5 sequential prompt steps with different output formats. Copy all steps or export as Markdown. Free in-browser prompt chain builder for complex AI workflows.",
    "type": "tool",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/tools/prompt-translator",
    "title": "Free Prompt Translator — Translate AI Prompts",
    "desc": "Translate prompts into 8 languages — Hindi, Spanish, French, German, Japanese, Chinese, Portuguese, Arabic — while preserving variables. Free in-browser prompt translator for global AI use.",
    "type": "tool",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/tools/api-request-builder",
    "title": "Free API Request Builder — OpenAI, Anthropic & Gemini",
    "desc": "Build API requests for OpenAI, Anthropic, and Gemini with model selection, temperature, max tokens, and cURL export. Free in-browser API request builder for AI developers.",
    "type": "tool",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/tools/image-prompt-generator",
    "title": "Free AI Image Prompt Generator — DALL-E & Midjourney",
    "desc": "Generate production-ready image prompts for DALL-E, Midjourney, and Stable Diffusion. Choose art style, mood, and camera angle. Free in-browser tool with instant copy-paste.",
    "type": "tool",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/tools/content-summarizer",
    "title": "Free AI Content Summarizer — TL;DR & Bullet Points",
    "desc": "Summarize long articles, reports, and documents into TL;DR, bullet points, paragraphs, or academic abstracts. Free in-browser tool with word reduction stats.",
    "type": "tool",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/tools/regex-generator",
    "title": "Free AI Regex Generator — From Plain English",
    "desc": "Generate regex patterns from plain English descriptions. Test instantly against sample strings with built-in syntax cheatsheet. Free in-browser regex tool.",
    "type": "tool",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/playground",
    "title": "Free AI Prompt Playground — Test & Build Prompts",
    "desc": "Interactive AI prompt playground with blog, code, and email templates. Live token estimation and prompt health scoring. Free in-browser prompt testing tool for ChatGPT, Claude & Gemini.",
    "type": "page",
    "priority": 0.9,
    "changefreq": "weekly"
  },
  {
    "path": "/prompts",
    "title": "Free AI Prompt Library — 225+ ChatGPT Prompts for Every Role",
    "desc": "Browse 225+ free ChatGPT prompts for 15 roles — content writer, developer, marketer, SEO specialist, data analyst, business analyst, and more. Copy and paste AI prompts for every task.",
    "type": "page",
    "priority": 0.9,
    "changefreq": "daily"
  },
  {
    "path": "/changelog",
    "title": "AI Prompt Toolkit Changelog — New Features & Updates",
    "desc": "Track the latest updates to AI World Hub's 19 free AI prompt tools. New tools, features, and improvements in each release version. See what's new in our AI prompt toolkit.",
    "type": "page",
    "priority": 0.6,
    "changefreq": "weekly"
  },
  {
    "path": "/templates",
    "title": "Free Prompt Templates Library — 100+ Ready-to-Use Prompts | AI World Hub",
    "desc": "Browse 100+ ready-to-use AI prompt templates for writing, image generation, coding, video, and productivity. Copy, paste, get results instantly. Free prompt templates library.",
    "type": "page",
    "priority": 0.9,
    "changefreq": "weekly"
  },
  {
    "path": "/categories",
    "title": "AI Prompt Categories — Browse by Use Case | AI World Hub",
    "desc": "Browse AI prompts by category — Writing & Content, Marketing & Sales, Development & Code, Business & Strategy, Education & Learning, and more. Find the perfect prompt.",
    "type": "page",
    "priority": 0.9,
    "changefreq": "weekly"
  },
  {
    "path": "/image-generator",
    "title": "Free AI Image Prompt Generator — Midjourney & DALL-E | AI World Hub",
    "desc": "Generate optimized AI image prompts for Midjourney, DALL-E 3, and Stable Diffusion. Select an art style and get copy-ready prompts instantly. Free in-browser tool.",
    "type": "page",
    "priority": 0.9,
    "changefreq": "weekly"
  },
  {
    "path": "/prompts/chatgpt",
    "title": "ChatGPT Prompts — 15 Ready-to-Use Templates | AI World Hub",
    "desc": "Best ChatGPT prompts for writing, coding, brainstorming, and productivity. Copy and customize 15 ready-to-use prompt templates for ChatGPT. Free in-browser prompt library.",
    "type": "role",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/prompts/content-writer",
    "title": "Content Writer Prompts — 15 Templates | AI World Hub",
    "desc": "Blog posts, SEO articles, social media, and email copywriting prompts for content writers. 15 ready-to-use ChatGPT prompt templates. Free prompt library.",
    "type": "role",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/prompts/developer",
    "title": "Developer Prompts — 15 Templates | AI World Hub",
    "desc": "Code generation, debugging, code review, refactoring, and documentation prompts for developers. 15 ready-to-use ChatGPT prompt templates. Free prompt library.",
    "type": "role",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/prompts/marketer",
    "title": "Marketer Prompts — 15 Templates | AI World Hub",
    "desc": "Campaign strategy, ad copy, social media, and growth marketing prompts for marketers. 15 ready-to-use ChatGPT prompt templates. Free prompt library.",
    "type": "role",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/prompts/seo-specialist",
    "title": "SEO Specialist Prompts — 15 Templates | AI World Hub",
    "desc": "Keyword research, on-page SEO, technical SEO, and content optimization prompts. 15 ready-to-use ChatGPT prompt templates for SEO specialists. Free prompt library.",
    "type": "role",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/prompts/data-analyst",
    "title": "Data Analyst Prompts — 15 Templates | AI World Hub",
    "desc": "Data analysis, SQL queries, data visualization, and reporting prompts for data analysts. 15 ready-to-use ChatGPT prompt templates. Free prompt library.",
    "type": "role",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/prompts/business-analyst",
    "title": "Business Analyst Prompts — 15 Templates | AI World Hub",
    "desc": "Requirements gathering, process mapping, and stakeholder communication prompts for business analysts. 15 ready-to-use ChatGPT prompt templates. Free prompt library.",
    "type": "role",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/prompts/graphic-designer",
    "title": "Graphic Designer Prompts — 15 Templates | AI World Hub",
    "desc": "Logo design, brand identity, UI/UX, and creative direction prompts for graphic designers. 15 ready-to-use ChatGPT prompt templates. Free prompt library.",
    "type": "role",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/prompts/sales",
    "title": "Sales Prompts — 15 Templates | AI World Hub",
    "desc": "Cold outreach, sales scripts, objection handling, and follow-up prompts for sales teams. 15 ready-to-use ChatGPT prompt templates. Free prompt library.",
    "type": "role",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/prompts/customer-support",
    "title": "Customer Support Prompts — 15 Templates | AI World Hub",
    "desc": "Support responses, ticket triage, FAQ generation, and escalation prompts for support teams. 15 ready-to-use ChatGPT prompt templates. Free prompt library.",
    "type": "role",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/prompts/product-manager",
    "title": "Product Manager Prompts — 15 Templates | AI World Hub",
    "desc": "Product specs, user stories, roadmap planning, and feature prioritization prompts for product managers. 15 ready-to-use ChatGPT prompt templates. Free prompt library.",
    "type": "role",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/prompts/researcher",
    "title": "Researcher Prompts — 15 Templates | AI World Hub",
    "desc": "Literature review, data collection, survey design, and analysis prompts for researchers. 15 ready-to-use ChatGPT prompt templates. Free prompt library.",
    "type": "role",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/prompts/student",
    "title": "Student Prompts — 15 Templates | AI World Hub",
    "desc": "Study guides, essay writing, exam prep, and learning assistance prompts for students. 15 ready-to-use ChatGPT prompt templates. Free prompt library.",
    "type": "role",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/prompts/entrepreneur",
    "title": "Entrepreneur Prompts — 15 Templates | AI World Hub",
    "desc": "Business planning, pitch decks, investor outreach, and strategy prompts for entrepreneurs. 15 ready-to-use ChatGPT prompt templates. Free prompt library.",
    "type": "role",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/prompts/consultant",
    "title": "Consultant Prompts — 15 Templates | AI World Hub",
    "desc": "Client analysis, strategy development, recommendations, and reporting prompts for consultants. 15 ready-to-use ChatGPT prompt templates. Free prompt library.",
    "type": "role",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/best-ai-tools-2026-complete-directory",
    "title": "Best AI Tools 2026 — Complete Directory of 50+ Tools | AI World Hub",
    "desc": "Discover the 50 best AI tools in 2026 for writing, image generation, coding, video, and productivity. Ranked by popularity with free plans and direct links. ChatGPT, Midjourney, Claude & more.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/100-chatgpt-prompts-for-every-task",
    "title": "100+ ChatGPT Prompts for Every Task — Copy & Paste | AI World Hub",
    "desc": "100+ ready-to-use ChatGPT prompts for writing, marketing, coding, business, education, and more. Copy, paste, and get professional results instantly. Free prompt library.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/how-to-use-chatgpt-complete-guide",
    "title": "How to Use ChatGPT — Complete Beginner Guide 2026 | AI World Hub",
    "desc": "Learn how to use ChatGPT from scratch — creating an account, writing effective prompts, using advanced features like image generation and file analysis. Step-by-step guide for beginners.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/free-ai-tools-50-best-tested",
    "title": "50 Best Free AI Tools 2026 — Tested & Ranked | AI World Hub",
    "desc": "50 genuinely free AI tools tested and ranked for 2026 — writing, images, video, coding, audio, and productivity. No hidden fees, no credit card required. ChatGPT, Canva, Leonardo & more.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/prompt-engineering-complete-guide",
    "title": "Prompt Engineering Complete Guide — Beginner to Expert 2026 | AI World Hub",
    "desc": "Master prompt engineering in 2026. Learn proven techniques — role prompting, chain-of-thought, few-shot examples, JSON schema output. Get professional results from any AI model.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/ai-tools-directory-categorized-list",
    "title": "AI Tools Directory — 50+ Tools by Category | AI World Hub",
    "desc": "Browse 50+ AI tools organized by category — text generation, image creation, video editing, coding, audio, and productivity. Compare features, pricing, and use cases. Free directory.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/master-prompt-engineering-workflow",
    "title": "Prompt Engineering Workflow Guide — Best Practices | AI World Hub",
    "desc": "Step-by-step prompt engineering workflow for teams — discover, draft, test, validate, review, deploy. Reduce iteration time and ship reliable AI prompts faster. Free guide.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/craft-high-impact-chatgpt-prompts",
    "title": "How to Write High-Impact ChatGPT Prompts — Free Guide | AI World Hub",
    "desc": "Learn how to design ChatGPT prompts that produce clearer, more consistent, and more useful AI responses. Free guide with copy-paste examples and prompt templates.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/build-ai-prompt-templates-that-scale",
    "title": "Build AI Prompt Templates That Scale — Free Guide | AI World Hub",
    "desc": "Create scalable AI prompt templates that support team collaboration, reduce rework, and improve consistency. Free guide with template examples for ChatGPT, Claude & Gemini.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/claude-prompt-best-practices",
    "title": "Claude Prompt Best Practices — Free AI Prompt Guide | AI World Hub",
    "desc": "Learn how to write Claude prompts that deliver consistent, structured, and reliable AI responses. Best practices for context management, prompt structure, and guardrails.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/midjourney-prompt-techniques",
    "title": "Midjourney Prompt Techniques — Create Better AI Art | AI World Hub",
    "desc": "Discover Midjourney prompt strategies that generate more compelling and consistent AI art. Free guide with prompt examples for photorealistic, artistic, and stylized images.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/design-json-schema-for-ai-output",
    "title": "Design JSON Schema for Reliable AI Output — Free Guide | AI World Hub",
    "desc": "Learn how to create JSON schema for AI output and ensure your model responses are structured and reliable. Free guide with examples for ChatGPT, Claude, and Gemini API.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/boost-ai-productivity-with-prompt-systems",
    "title": "Boost AI Productivity with Prompt Systems — Free Guide | AI World Hub",
    "desc": "Explore how prompt systems, reusable templates, and automation can significantly boost AI productivity. Free guide for teams using ChatGPT, Claude, and Gemini.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/optimize-prompts-for-better-ai-performance",
    "title": "Optimize AI Prompts for Better Performance — Free Guide | AI World Hub",
    "desc": "Learn practical prompt optimization techniques to improve AI model accuracy, reduce token costs, and speed up delivery. Free guide with before-and-after examples.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/automate-ai-tasks-with-prompt-workflows",
    "title": "Automate AI Tasks with Prompt Workflows — Free Guide | AI World Hub",
    "desc": "Discover how to automate common AI tasks using prompt workflows that save time and maintain quality. Free guide for building automated AI pipelines.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/orchestrate-llm-workflows-for-productive-teams",
    "title": "Orchestrate LLM Workflows for Teams — Free AI Guide | AI World Hub",
    "desc": "Learn how to orchestrate LLM workflows that connect prompt design, validation, and deployment. Free guide for teams building production AI applications.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/prompt-audit-and-iteration-strategies",
    "title": "Prompt Audit & Iteration Strategies — Free AI Guide | AI World Hub",
    "desc": "Explore prompt audit practices and iteration strategies that keep AI output reliable over time. Free guide with audit checklists and testing frameworks.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/customer-support-prompt-templates",
    "title": "Customer Support Prompt Templates — Free ChatGPT Guide | AI World Hub",
    "desc": "Learn how to create prompt templates for customer support that improve AI response quality and speed. Free ChatGPT prompt templates for support teams.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/marketing-chatgpt-prompt-patterns",
    "title": "ChatGPT Prompt Patterns for Marketing — Free Guide | AI World Hub",
    "desc": "Discover reliable ChatGPT prompt patterns for marketing teams to create content faster and more consistently. Free prompt library for ads, emails, social media & SEO.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/enterprise-claude-prompt-engineering",
    "title": "Enterprise Claude Prompt Engineering — Free AI Guide | AI World Hub",
    "desc": "Explore Claude prompt engineering practices for enterprise use cases where reliability and compliance matter. Free guide with production-ready prompt patterns.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/midjourney-prompts-for-creative-visuals",
    "title": "Midjourney Prompts for Creative Visuals — Free AI Art Guide | AI World Hub",
    "desc": "Learn how to write Midjourney prompts that accelerate creative production and improve visual quality. Free guide with prompt examples for every art style.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/validate-ai-outputs-with-json-schema",
    "title": "Validate AI Outputs with JSON Schema — Free Guide | AI World Hub",
    "desc": "A hands-on guide to validating AI outputs with JSON schema, reducing failures and improving reliability. Free tutorial with code examples for production AI.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/scale-ai-productivity-with-reusable-prompts",
    "title": "Scale AI Productivity with Reusable Prompts — Free Guide | AI World Hub",
    "desc": "Explore reusable prompt patterns that help teams scale AI productivity without sacrificing quality. Free guide with template library examples.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/prompt-optimization-for-cost-and-quality",
    "title": "Prompt Optimization for Cost & Quality — Free AI Guide | AI World Hub",
    "desc": "Learn how prompt optimization improves both AI output quality and cost efficiency for production systems. Free guide with token-saving techniques.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/business-automation-with-ai-prompts",
    "title": "Business Automation with AI Prompts — Free Guide | AI World Hub",
    "desc": "Explore how AI prompts and workflow templates can automate business processes and improve efficiency. Free guide for small businesses and enterprises.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/deploy-llm-workflows-for-team-collaboration",
    "title": "Deploy LLM Workflows for Team Collaboration — Free Guide | AI World Hub",
    "desc": "Learn how to deploy LLM workflows that help teams collaborate and scale AI delivery. Free guide with workflow templates and best practices.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/prompts-for-ai-reliability-and-governance",
    "title": "Prompts for AI Reliability & Governance — Free Guide | AI World Hub",
    "desc": "Discover how reliable prompts and governance practices help teams manage AI risk and quality. Free guide with governance frameworks and testing strategies.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/trusted-prompt-templates-for-team-use",
    "title": "Trusted Prompt Templates for Teams — Free AI Guide | AI World Hub",
    "desc": "Learn how to build trusted prompt templates for collaborative, reliable AI use across teams. Free guide with review, testing, and reuse strategies.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/ai-workflow-automation-for-operations",
    "title": "AI Workflow Automation for Operations — Free Guide | AI World Hub",
    "desc": "Discover how to automate operations and support workflows with AI prompts and templates. Free guide for operations teams using ChatGPT and Claude.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/llm-workflow-best-practices-for-innovation",
    "title": "LLM Workflow Best Practices for Innovation — Free AI Guide | AI World Hub",
    "desc": "Explore best practices for LLM workflows that balance innovation, reliability, and speed. Free guide for teams building with large language models.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/ai-prompt-template-governance-for-growth",
    "title": "AI Prompt Template Governance for Growth — Free Guide | AI World Hub",
    "desc": "Learn how prompt template governance helps teams scale AI safely and sustainably. Free guide with governance templates and growth strategies.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  }
];
