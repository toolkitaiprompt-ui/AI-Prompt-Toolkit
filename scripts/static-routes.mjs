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
    "desc": "Choose from 19 free AI prompt engineering tools — build, format, debug, optimize, secure, and translate prompts in your browser. No sign-up required.",
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
    "title": "Free Prompt Variable Extractor — Extract {Variables} | AI World Hub",
    "desc": "Extract prompt variables like {name}, {{city}}, [tone] from any AI prompt. Free in-browser tool for building reusable prompt templates.",
    "type": "tool",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/tools/json-schema-generator",
    "title": "Free JSON Schema Generator for AI Output | AI World Hub",
    "desc": "Generate JSON Schema from sample data for reliable AI output. Free in-browser tool — paste JSON, get schema instantly. Draft 2020-12 compliant.",
    "type": "tool",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/tools/json-validator",
    "title": "Free JSON Validator for AI Output | AI World Hub",
    "desc": "Validate AI-generated JSON against your schema in real time. Catch missing fields, type mismatches, and errors before production.",
    "type": "tool",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/tools/prompt-formatter",
    "title": "Free Prompt Formatter for ChatGPT & Claude | AI World Hub",
    "desc": "Format messy prompt notes into clean, numbered instruction blocks for ChatGPT, Claude, and Gemini. Free in-browser tool.",
    "type": "tool",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/tools/prompt-cleaner",
    "title": "Free Prompt Cleaner — Remove Noise from AI Prompts | AI World Hub",
    "desc": "Clean noisy text, hidden characters, and formatting issues from AI prompts. Free in-browser tool.",
    "type": "tool",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/tools/token-estimator",
    "title": "Free AI Token Estimator & Counter — GPT, Claude | AI World Hub",
    "desc": "Estimate token count, characters, and words for AI prompts before sending to GPT, Claude, or Gemini APIs. Free token calculator.",
    "type": "tool",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/tools/prompt-converter",
    "title": "Free Prompt Converter — ChatGPT to Claude & Gemini | AI World Hub",
    "desc": "Convert ChatGPT prompts to Claude, Gemini, or Cursor format instantly. Free in-browser tool.",
    "type": "tool",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/tools/persona-builder",
    "title": "Free AI Persona Builder — System Prompt Generator | AI World Hub",
    "desc": "Generate expert system prompts for AI roles like Marketer, Developer, Analyst. Free in-browser persona builder for ChatGPT, Claude & Gemini.",
    "type": "tool",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/tools/advanced-prompt-optimizer",
    "title": "Free Advanced Prompt Optimizer — Best AI Prompt Tool | AI World Hub",
    "desc": "Polish and optimize AI prompts with advanced controls — reduce tokens, add structure, compare before-and-after. Best free prompt optimizer.",
    "type": "tool",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/tools/prompt-comparison",
    "title": "Free Prompt Comparison Tool — Compare 2 AI Prompts | AI World Hub",
    "desc": "Compare two AI prompts side by side. See token count, word count, readability, structure score, clarity score, and visual diff highlighting. Free in-browser tool.",
    "type": "tool",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/tools/mega-prompt-builder",
    "title": "Free Mega Prompt Builder — 8-Step Prompt Wizard | AI World Hub",
    "desc": "Build structured mega prompts with an 8-step wizard — role, task, context, audience, format, tone, constraints, and examples. Get production-ready prompts instantly. Free in-browser tool.",
    "type": "tool",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/tools/prompt-debugger",
    "title": "Free Prompt Debugger — Health Score & Issue Detection | AI World Hub",
    "desc": "Diagnose AI prompts with a health score (0-100), 12+ issue detectors, and instant auto-fix suggestions. Find and fix prompt problems before using them. Free in-browser tool.",
    "type": "tool",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/tools/security-scanner",
    "title": "Free Prompt Security Scanner — Detect Injection & PII | AI World Hub",
    "desc": "Scan AI prompts for injection attacks, jailbreaks, PII leaks, and security threats. Get risk level scoring and actionable remediation. Free in-browser security scanner.",
    "type": "tool",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/tools/prompt-chain-builder",
    "title": "Free Prompt Chain Builder — Sequential AI Workflows | AI World Hub",
    "desc": "Chain up to 5 sequential prompt steps with different output formats. Copy all steps or export as Markdown. Build multi-step AI workflows. Free in-browser tool.",
    "type": "tool",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/tools/prompt-translator",
    "title": "Free Prompt Translator — 8 Languages | AI World Hub",
    "desc": "Translate AI prompts into 8 languages — Hindi, Spanish, French, German, Japanese, Chinese, Portuguese, Arabic — while preserving variables like {name} and [tone]. Free in-browser tool.",
    "type": "tool",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/tools/api-request-builder",
    "title": "Free API Request Builder — OpenAI, Anthropic, Gemini | AI World Hub",
    "desc": "Build API requests for OpenAI, Anthropic, and Gemini with model selection, temperature, max tokens, and cURL export. Generate JSON request bodies instantly. Free in-browser tool.",
    "type": "tool",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/tools/image-prompt-generator",
    "title": "Free AI Image Prompt Generator — DALL-E & Midjourney | AI World Hub",
    "desc": "Generate production-ready image prompts for DALL-E, Midjourney, and Stable Diffusion. Choose art style, mood, and camera angle. Free in-browser tool with instant copy-paste.",
    "type": "tool",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/tools/content-summarizer",
    "title": "Free AI Content Summarizer — TL;DR & Bullet Points | AI World Hub",
    "desc": "Summarize long articles, reports, and documents into TL;DR, bullet points, paragraphs, or academic abstracts. Free in-browser tool with word reduction stats.",
    "type": "tool",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/tools/regex-generator",
    "title": "Free AI Regex Generator — From Plain English | AI World Hub",
    "desc": "Generate regex patterns from plain English descriptions. Test instantly against sample strings with built-in syntax cheatsheet. Free in-browser regex tool.",
    "type": "tool",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/playground",
    "title": "AI Prompt Playground — Test & Debug Prompts Live | AI World Hub",
    "desc": "Free AI prompt playground. Generate blog post, code review, and cold email prompt templates, estimate tokens, and debug prompt health in real time — all in your browser.",
    "type": "page",
    "priority": 0.9,
    "changefreq": "weekly"
  },
  {
    "path": "/prompts",
    "title": "AI Prompt Library — 225+ Prompts | AI World Hub",
    "desc": "Free AI prompt library with 225+ ready-to-use prompts for 15 professional roles — ChatGPT, content writers, developers, marketers, SEO, data analysts, designers, sales, customer support, and more. Copy and customize instantly.",
    "type": "page",
    "priority": 0.9,
    "changefreq": "daily"
  },
  {
    "path": "/changelog",
    "title": "Changelog — Latest Updates & New Features | AI World Hub",
    "desc": "Track all updates and new features added to AI World Hub's AI prompt engineering toolkit. See version history, new tools, improvements, and bug fixes.",
    "type": "page",
    "priority": 0.6,
    "changefreq": "weekly"
  },
  {
    "path": "/templates",
    "title": "Prompt Templates Library — 12 Ready-to-Use Prompts | AI World Hub",
    "desc": "Browse 12 ready-to-use AI prompt templates for writing, marketing, coding, business, education, e-commerce, career, and support. Copy, paste, get results instantly. Free prompt templates library.",
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
    "path": "/prompts/chatgpt",
    "title": "ChatGPT Prompts — 15 Ready-to-Use Templates | AI World Hub",
    "desc": "Best ChatGPT prompts for writing, coding, brainstorming, and productivity. Copy and customize 15 ready-to-use prompt templates for ChatGPT. Free in-browser prompt library.",
    "type": "role",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/prompts/content-writer",
    "title": "Content Writer Prompts — 15 Ready-to-Use Templates | AI World Hub",
    "desc": "Blog posts, SEO articles, social media, and email copywriting prompts for content writers. 15 ready-to-use ChatGPT prompt templates. Free prompt library.",
    "type": "role",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/prompts/developer",
    "title": "Developer Prompts — 15 Ready-to-Use Templates | AI World Hub",
    "desc": "Code generation, debugging, code review, refactoring, and documentation prompts for developers. 15 ready-to-use ChatGPT prompt templates. Free prompt library.",
    "type": "role",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/prompts/marketer",
    "title": "Marketer Prompts — 15 Ready-to-Use Templates | AI World Hub",
    "desc": "Campaign strategy, ad copy, social media, and growth marketing prompts for marketers. 15 ready-to-use ChatGPT prompt templates. Free prompt library.",
    "type": "role",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/prompts/seo-specialist",
    "title": "SEO Specialist Prompts — 15 Ready-to-Use Templates | AI World Hub",
    "desc": "Keyword research, on-page SEO, technical SEO, and content optimization prompts. 15 ready-to-use ChatGPT prompt templates for SEO specialists. Free prompt library.",
    "type": "role",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/prompts/data-analyst",
    "title": "Data Analyst Prompts — 15 Ready-to-Use Templates | AI World Hub",
    "desc": "Data analysis, SQL queries, data visualization, and reporting prompts for data analysts. 15 ready-to-use ChatGPT prompt templates. Free prompt library.",
    "type": "role",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/prompts/business-analyst",
    "title": "Business Analyst Prompts — 15 Ready-to-Use Templates | AI World Hub",
    "desc": "Requirements gathering, process mapping, and stakeholder communication prompts for business analysts. 15 ready-to-use ChatGPT prompt templates. Free prompt library.",
    "type": "role",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/prompts/graphic-designer",
    "title": "Graphic Designer Prompts — 15 Ready-to-Use Templates | AI World Hub",
    "desc": "Logo design, brand identity, UI/UX, and creative direction prompts for graphic designers. 15 ready-to-use ChatGPT prompt templates. Free prompt library.",
    "type": "role",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/prompts/sales",
    "title": "Sales Prompts — 15 Ready-to-Use Templates | AI World Hub",
    "desc": "Cold outreach, sales scripts, objection handling, and follow-up prompts for sales teams. 15 ready-to-use ChatGPT prompt templates. Free prompt library.",
    "type": "role",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/prompts/customer-support",
    "title": "Customer Support Prompts — 15 Ready-to-Use Templates | AI World Hub",
    "desc": "Support responses, ticket triage, FAQ generation, and escalation prompts for support teams. 15 ready-to-use ChatGPT prompt templates. Free prompt library.",
    "type": "role",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/prompts/product-manager",
    "title": "Product Manager Prompts — 15 Ready-to-Use Templates | AI World Hub",
    "desc": "Product specs, user stories, roadmap planning, and feature prioritization prompts for product managers. 15 ready-to-use ChatGPT prompt templates. Free prompt library.",
    "type": "role",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/prompts/researcher",
    "title": "Researcher Prompts — 15 Ready-to-Use Templates | AI World Hub",
    "desc": "Literature review, data collection, survey design, and analysis prompts for researchers. 15 ready-to-use ChatGPT prompt templates. Free prompt library.",
    "type": "role",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/prompts/student",
    "title": "Student Prompts — 15 Ready-to-Use Templates | AI World Hub",
    "desc": "Study guides, essay writing, exam prep, and learning assistance prompts for students. 15 ready-to-use ChatGPT prompt templates. Free prompt library.",
    "type": "role",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/prompts/entrepreneur",
    "title": "Entrepreneur Prompts — 15 Ready-to-Use Templates | AI World Hub",
    "desc": "Business planning, pitch decks, investor outreach, and strategy prompts for entrepreneurs. 15 ready-to-use ChatGPT prompt templates. Free prompt library.",
    "type": "role",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/prompts/consultant",
    "title": "Consultant Prompts — 15 Ready-to-Use Templates | AI World Hub",
    "desc": "Client analysis, strategy development, recommendations, and reporting prompts for consultants. 15 ready-to-use ChatGPT prompt templates. Free prompt library.",
    "type": "role",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/best-ai-tools-2026-complete-directory",
    "title": "Best AI Tools 2026 — Complete Directory | AI World Hub",
    "desc": "Discover the 50 best AI tools in 2026 for writing, image generation, coding, video, and productivity. Ranked by popularity with free plans and direct links.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/100-chatgpt-prompts-for-every-task",
    "title": "15 ChatGPT Prompts for Every Task — Copy & Paste | AI World Hub",
    "desc": "15 ready-to-use ChatGPT prompts for writing, marketing, coding, education, and productivity. Copy, paste, and get professional results instantly.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/how-to-use-chatgpt-complete-guide",
    "title": "How to Use ChatGPT — Beginner Guide 2026 | AI World Hub",
    "desc": "Learn how to use ChatGPT from scratch — creating an account, writing effective prompts, using advanced features, and avoiding common mistakes. Step-by-step guide for beginners.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/free-ai-tools-50-best-tested",
    "title": "50 Best Free AI Tools 2026 — Tested & Ranked | AI World Hub",
    "desc": "50 genuinely free AI tools tested and ranked for 2026 — writing, images, video, coding, audio, and productivity. No hidden fees, no credit card required.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/prompt-engineering-complete-guide",
    "title": "Prompt Engineering Guide — Beginner to Expert | AI World Hub",
    "desc": "Master prompt engineering in 2026. Learn proven techniques, frameworks, and best practices for writing AI prompts that get professional results with ChatGPT, Claude, and Gemini.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/ai-tools-directory-categorized-list",
    "title": "AI Tools Directory — 50+ Tools by Category | AI World Hub",
    "desc": "Browse 50+ AI tools organized by category — text generation, image creation, video editing, coding, audio, and productivity. Find the perfect AI tool for any task.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/master-prompt-engineering-workflow",
    "title": "Master Prompt Engineering Workflows | AI World Hub",
    "desc": "Discover a step-by-step prompt engineering workflow that helps teams reduce iteration time and ship reliable AI prompts faster.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/craft-high-impact-chatgpt-prompts",
    "title": "Craft High-Impact ChatGPT Prompts | AI World Hub",
    "desc": "Learn how to design ChatGPT prompts that produce clearer, more actionable answers while reducing ambiguity and unwanted responses.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/build-ai-prompt-templates-that-scale",
    "title": "Build AI Prompt Templates That Scale | AI World Hub",
    "desc": "Explore how to create scalable AI prompt templates that support collaboration, versioning, and repeated use in enterprise workflows.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/claude-prompt-best-practices",
    "title": "Claude Prompt Best Practices | AI World Hub",
    "desc": "Learn how to write Claude prompts that deliver consistent, safe, and task-oriented responses for enterprise applications.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/midjourney-prompt-techniques",
    "title": "Midjourney Prompt Techniques | AI World Hub",
    "desc": "Discover Midjourney prompt strategies that generate more compelling visuals, improve style control, and help you iterate on creative concepts.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/design-json-schema-for-ai-output",
    "title": "Design JSON Schema for Reliable AI Output | AI World Hub",
    "desc": "Learn how to create JSON schema for AI output and ensure your model responses are structured, validated, and ready for production use.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/boost-ai-productivity-with-prompt-systems",
    "title": "Boost AI Productivity with Prompt Systems | AI World Hub",
    "desc": "Explore how prompt systems, reusable templates, and automation workflows help teams do more with AI while keeping quality high.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/optimize-prompts-for-better-ai-performance",
    "title": "Optimize Prompts for Better AI Performance | AI World Hub",
    "desc": "Learn practical prompt optimization techniques to improve model performance, reduce tokens, and get more reliable AI output.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/automate-ai-tasks-with-prompt-workflows",
    "title": "Automate AI Tasks with Prompt Workflows | AI World Hub",
    "desc": "Discover how to automate common AI tasks using prompt workflows, templates, and validation tools to deliver consistent results.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/orchestrate-llm-workflows-for-productive-teams",
    "title": "Orchestrate LLM Workflows for Productive Teams | AI World Hub",
    "desc": "Learn how to orchestrate LLM workflows that connect prompt design, validation, and operations for productive AI teams.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/prompt-audit-and-iteration-strategies",
    "title": "Prompt Audit and Iteration Strategies | AI World Hub",
    "desc": "Explore prompt audit practices and iteration strategies that help teams improve AI results, reduce errors, and learn from model feedback.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/customer-support-prompt-templates",
    "title": "Design Prompt Templates for Customer Support | AI World Hub",
    "desc": "Learn how to create prompt templates for customer support that help AI agents respond consistently, empathetically, and accurately.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/marketing-chatgpt-prompt-patterns",
    "title": "ChatGPT Prompt Patterns for Marketing | AI World Hub",
    "desc": "Discover reliable ChatGPT prompt patterns for marketing teams that generate compelling copy, campaign ideas, and audience messaging.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/enterprise-claude-prompt-engineering",
    "title": "Enterprise Claude Prompt Engineering | AI World Hub",
    "desc": "Explore Claude prompt engineering practices for enterprise use cases that demand safety, accuracy, and predictable behavior.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/midjourney-prompts-for-creative-visuals",
    "title": "Midjourney Prompts for Creative Visuals | AI World Hub",
    "desc": "Learn how to write Midjourney prompts that accelerate creative iteration and produce richer visual concepts.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/validate-ai-outputs-with-json-schema",
    "title": "Validate AI Outputs with JSON Schema | AI World Hub",
    "desc": "A hands-on guide to validating AI outputs with JSON schema, so your LLM responses are reliable and easier to integrate.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/scale-ai-productivity-with-reusable-prompts",
    "title": "Scale AI Productivity with Reusable Prompts | AI World Hub",
    "desc": "Explore reusable prompt patterns that help teams scale AI productivity while maintaining consistency and quality.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/prompt-optimization-for-cost-and-quality",
    "title": "Prompt Optimization for Cost and Quality | AI World Hub",
    "desc": "Learn how prompt optimization improves both AI output quality and cost efficiency with practical techniques and validation steps.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/business-automation-with-ai-prompts",
    "title": "Business Automation with AI Prompts | AI World Hub",
    "desc": "Explore how AI prompts and workflow templates can automate business tasks like reporting, customer outreach, and data insights.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/deploy-llm-workflows-for-team-collaboration",
    "title": "Deploy LLM Workflows for Team Collaboration | AI World Hub",
    "desc": "Learn how to deploy LLM workflows that help teams collaborate on prompts, validation, and AI delivery at scale.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/prompts-for-ai-reliability-and-governance",
    "title": "Prompts for AI Reliability and Governance | AI World Hub",
    "desc": "Discover how reliable prompts and governance practices help teams mitigate risk, improve consistency, and maintain AI quality.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/trusted-prompt-templates-for-team-use",
    "title": "Trusted Prompt Templates for Teams | AI World Hub",
    "desc": "Learn how to build trusted prompt templates for collaborative AI use, including template review, testing, and version control.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/ai-workflow-automation-for-operations",
    "title": "AI Workflow Automation for Operations | AI World Hub",
    "desc": "Discover how to automate operations and support workflows with AI prompts, templates, and validation best practices.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/llm-workflow-best-practices-for-innovation",
    "title": "LLM Workflow Best Practices | AI World Hub",
    "desc": "Explore best practices for LLM workflows that balance innovation with reliability, including prompt design, validation, and collaboration.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
{
    "path": "/blog/ai-prompt-template-governance-for-growth",
    "title": "AI Prompt Template Governance for Growth | AI World Hub",
    "desc": "Learn how prompt template governance helps teams scale AI safely, maintain consistency, and manage prompt quality over time.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/ai-agent-prompts-guide",
    "title": "AI Agent Prompts Complete Guide | AI World Hub",
    "desc": "Master AI agent prompts with structured frameworks, context, and execution patterns for reliable multi-step AI workflows.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/ai-art-styles-complete-guide",
    "title": "AI Art Styles Complete Guide | AI World Hub",
    "desc": "Explore the best AI art styles and image generation techniques for 2026 — from photorealistic to artistic creative styles.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/ai-ethics-and-responsible-use-guide",
    "title": "AI Ethics and Responsible Use Guide | AI World Hub",
    "desc": "Guidelines for responsible AI development and usage — bias mitigation, transparency, and ethical frameworks for AI practitioners.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/ai-for-beginners-complete-guide",
    "title": "AI for Beginners Complete Guide | AI World Hub",
    "desc": "Step-by-step introduction to AI fundamentals, tools, and techniques for newcomers to artificial intelligence.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/ai-marketing-complete-guide",
    "title": "AI Marketing Complete Guide | AI World Hub",
    "desc": "Comprehensive guide to AI marketing tools, strategies, and automation for 2026 — grow your business with AI.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/ai-prompt-templates-library",
    "title": "AI Prompt Templates Library | AI World Hub",
    "desc": "Browse and use reusable AI prompt templates for common writing, coding, and business tasks.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/ai-tools-for-small-business-free",
    "title": "AI Tools for Small Business Free | AI World Hub",
    "desc": "Free AI tools that help small businesses with content, design, marketing, and productivity — no budget required.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/ai-tools-for-students-free-guide",
    "title": "AI Tools for Students Free Guide | AI World Hub",
    "desc": "Free AI tools for students — writing, research, study aids, and productivity without subscription required.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/ai-trends-2026-complete-guide",
    "title": "AI Trends 2026 Complete Guide | AI World Hub",
    "desc": "The definitive guide to AI trends shaping 2026 — what's new, what's changing, and what to watch.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/best-ai-coding-tools-2026",
    "title": "Best AI Coding Tools 2026 | AI World Hub",
    "desc": "The top AI code generators, assistants, and development tools ranked by effectiveness and free tier availability.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/best-ai-image-generators-2026",
    "title": "Best AI Image Generators 2026 | AI World Hub",
    "desc": "Ranked comparison of the best AI image generators — Midjourney, DALL-E 3, Stable Diffusion, and more.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/best-ai-productivity-tools-2026",
    "title": "Best AI Productivity Tools 2026 | AI World Hub",
    "desc": "AI tools that boost productivity for work and personal projects — writing, coding, design, and automation.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/best-ai-video-tools-2026",
    "title": "Best AI Video Tools 2026 | AI World Hub",
    "desc": "The best AI video generation and editing tools for 2026 — Runway, Pika, Synthesia, and more.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/best-ai-writing-tools-2026",
    "title": "Best AI Writing Tools 2026 | AI World Hub",
    "desc": "Ranked review of the best AI writing assistants and content generators for 2026.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/best-chatgpt-alternatives-2026",
    "title": "Best ChatGPT Alternatives 2026 | AI World Hub",
    "desc": "Compare the top ChatGPT alternatives — Claude, Gemini, Llama, and other leading AI models.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/best-midjourney-prompts-2026",
    "title": "Best Midjourney Prompts 2026 | AI World Hub",
    "desc": "Discover the most effective Midjourney prompt strategies for generating stunning visuals in 2026.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/build-ai-chatbot-guide",
    "title": "Build AI Chatbot Guide | AI World Hub",
    "desc": "Step-by-step guide to building your own AI chatbot — from setup to deployment with in-browser tools.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/chain-of-thought-prompting-guide",
    "title": "Chain-of-Thought Prompting Guide | AI World Hub",
    "desc": "Master chain-of-thought prompting to get the AI to reason through problems step by step for better results.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/chatgpt-tips-and-tricks-2026",
    "title": "ChatGPT Tips and Tricks 2026 | AI World Hub",
    "desc": "Powerful ChatGPT tips and tricks to get better results — from prompt structure to advanced features.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/chatgpt-vs-claude-vs-gemini-comparison",
    "title": "ChatGPT vs Claude vs Gemini Comparison | AI World Hub",
    "desc": "Side-by-side comparison of the top three AI models — strengths, weaknesses, and best use cases.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/claude-vs-chatgpt-for-coding",
    "title": "Claude vs ChatGPT for Coding | AI World Hub",
    "desc": "Which AI is better for coding tasks — Claude or ChatGPT? Comparison of capabilities and use cases.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/cursor-ai-complete-guide",
    "title": "Cursor AI Complete Guide | AI World Hub",
    "desc": "The complete guide to using Cursor AI for code generation, editing, and AI-powered development workflows.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/few-shot-prompting-guide",
    "title": "Few-Shot Prompting Guide | AI World Hub",
    "desc": "How to use few-shot prompting to improve AI accuracy by showing examples within your prompts.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/free-ai-prompt-generator-guide",
    "title": "Free AI Prompt Generator Guide | AI World Hub",
    "desc": "How to generate effective AI prompts for free using built-in tools and prompt engineering techniques.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/gemini-prompts-best-practices",
    "title": "Gemini Prompts Best Practices | AI World Hub",
    "desc": "Optimize your Gemini prompts with best practices for getting the best results from Google's AI model.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/gpt-models-comparison-guide",
    "title": "GPT Models Comparison Guide | AI World Hub",
    "desc": "Complete comparison of GPT-4, GPT-4o, GPT-4o mini, and other GPT models available in 2026.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/how-to-write-natural-ai-content",
    "title": "How to Write Natural AI Content | AI World Hub",
    "desc": "Techniques and best practices for writing content that reads naturally and avoids AI detection patterns.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/prompt-engineering-jobs-and-salary-guide",
    "title": "Prompt Engineering Jobs and Salary Guide | AI World Hub",
    "desc": "Market analysis of prompt engineering roles, salaries, and career opportunities in 2026.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/rag-prompt-engineering-guide",
    "title": "RAG Prompt Engineering Guide | AI World Hub",
    "desc": "How to build and optimize Retrieval-Augmented Generation prompts for accurate, grounded AI responses.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/system-prompts-complete-guide",
    "title": "System Prompts Complete Guide | AI World Hub",
    "desc": "Master system prompts for AI assistants — define personality, capabilities, and behavior patterns for consistent performance.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/best-free-ai-prompt-tools-2026",
    "title": "Best Free AI Prompt Tools in 2026 — Complete Guide | AI World Hub",
    "desc": "Find the best free AI prompt tools in 2026 — prompt optimizers, JSON validators, token estimators and more. 100% free, no signup, in-browser.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/chatgpt-prompts-for-students",
    "title": "ChatGPT Prompts for Students — Study Smarter in 2026 | AI World Hub",
    "desc": "25+ ready-to-use ChatGPT prompts for students — study guides, essay writing, exam prep, summaries and more. Copy, paste, and study smarter.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/protect-your-data-ai-prompts",
    "title": "How to Protect Your Data When Using AI Prompts | AI World Hub",
    "desc": "Learn how to keep sensitive data safe when using AI — prompt injection risks, PII leaks, and free tools that scan prompts before you send them.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/how-to-make-money-with-chatgpt-in-india",
    "title": "Make Money with ChatGPT in India — 15 Proven Ways | AI World Hub",
    "desc": "15 proven ways to make money with ChatGPT in India — freelancing, content, coding, teaching. Real income potential, zero investment, start today.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/ai-prompts-for-business-growth",
    "title": "AI Prompts for Business Growth — 20 Templates | AI World Hub",
    "desc": "20 ready-to-use AI prompts for business — marketing, sales, customer support, operations and strategy. Copy-paste templates that save hours weekly.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/how-to-use-chatgpt-for-freelancing",
    "title": "How to Use ChatGPT for Freelancing — Client Guide | AI World Hub",
    "desc": "Use ChatGPT to win and deliver freelance projects faster — proposals, communication, delivery, and upselling. Templates that impress clients.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/ai-tools-for-small-business-india",
    "title": "Free AI Tools for Small Business in India 2026 | AI World Hub",
    "desc": "10 free AI tools every Indian small business should use — content, customer service, pricing, and more. Zero cost, zero coding, results.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/best-ai-prompt-engineering-tools",
    "title": "Best AI Prompt Engineering Tools 2026 — Beginner Guide | AI World Hub",
    "desc": "Start with the best AI prompt engineering tools for beginners — format, optimize, validate, debug prompts free in-browser. No signup, no code.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/free-ai-tools-for-youtube-creators",
    "title": "Free AI Tools for YouTube Creators 2026 | AI World Hub",
    "desc": "10 free AI tools for YouTube creators — scripts, titles, descriptions, thumbnails, channel growth. Publish faster, grow without spending.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/chatgpt-prompts-for-content-writers",
    "title": "ChatGPT Prompts for Content Writers — 30 Templates | AI World Hub",
    "desc": "30 ChatGPT prompts for content writers — blogs, SEO, social, email newsletters. Copy-paste templates that cut writing time in half.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/blog/what-is-prompt-engineering-guide",
    "title": "What is Prompt Engineering? Complete Guide 2026 | AI World Hub",
    "desc": "Learn what prompt engineering is, why it matters, and how to write better prompts — role, task, context, format, constraints. Free tools.",
    "type": "blog",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/best-ai-writing-tools",
    "title": "Best AI Writing Tools 2026 | AI World Hub",
    "desc": "Ranked review of the best AI writing assistants and content generators for 2026 — find the right tool for your writing projects.",
    "type": "page",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/best-ai-coding-tools",
    "title": "Best AI Coding Tools 2026 | AI World Hub",
    "desc": "The top AI code generators, assistants, and development tools ranked by effectiveness and free tier availability.",
    "type": "page",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/best-ai-image-generators",
    "title": "Best AI Image Generators 2026 | AI World Hub",
    "desc": "Ranked comparison of the best AI image generators — Midjourney, DALL-E 3, Stable Diffusion, and more.",
    "type": "page",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/best-ai-video-tools",
    "title": "Best AI Video Tools 2026 | AI World Hub",
    "desc": "The best AI video generation and editing tools for 2026 — Runway, Pika, Synthesia, and more.",
    "type": "page",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/ai-tools-for-students",
    "title": "AI Tools for Students Free Guide | AI World Hub",
    "desc": "Free AI tools for students — writing, research, study aids, and productivity without subscription required.",
    "type": "page",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/ai-tools-for-small-business",
    "title": "AI Tools for Small Business Free | AI World Hub",
    "desc": "Free AI tools that help small businesses with content, design, marketing, and productivity — no budget required.",
    "type": "page",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/ai-prompt-templates-business",
    "title": "AI Prompt Templates for Business | AI World Hub",
    "desc": "Browse and use reusable AI prompt templates for common business tasks — marketing, sales, customer support, operations.",
    "type": "page",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/ai-prompt-templates-marketing",
    "title": "AI Prompt Templates for Marketing | AI World Hub",
    "desc": "30 ChatGPT prompts for content writers — blogs, SEO, social, email newsletters. Copy-paste templates that cut writing time in half.",
    "type": "page",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/ai-prompt-templates-developers",
    "title": "AI Prompt Templates for Developers | AI World Hub",
    "desc": "Code generation, debugging, and documentation prompts for developers. Free prompt templates to accelerate development workflows.",
    "type": "page",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/ai-models-comparison",
    "title": "ChatGPT vs Claude vs Gemini Comparison | AI World Hub",
    "desc": "Side-by-side comparison of the top three AI models — strengths, weaknesses, and best use cases for 2026.",
    "type": "page",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/ai-trends-2026-guide",
    "title": "AI Trends 2026 Complete Guide | AI World Hub",
    "desc": "The definitive guide to AI trends shaping 2026 — what's new, what's changing, and what to watch.",
    "type": "page",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/ai-for-productivity",
    "title": "Boost AI Productivity 2026 | AI World Hub",
    "desc": "AI tools that boost productivity for work and personal projects — writing, coding, design, and automation.",
    "type": "page",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/ai-for-content-creation",
    "title": "AI for Content Creation 2026 | AI World Hub",
    "desc": "Free AI tools that help content creators with writing, ideas, and production — no budget required.",
    "type": "page",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/ai-for-research",
    "title": "AI for Research and Analysis | AI World Hub",
    "desc": "How to use AI for research — literature review, data collection, survey design, and analysis prompts.",
    "type": "page",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/free-ai-tools-content-creators",
    "title": "Free AI Tools for Content Creators | AI World Hub",
    "desc": "10 free AI tools for YouTube creators — scripts, titles, descriptions, thumbnails, channel growth. Publish faster, grow without spending.",
    "type": "page",
    "priority": 0.7,
    "changefreq": "weekly"
  },
  {
    "path": "/best-ai-tools-for-writing",
    "title": "Best AI Tools for Writing & Content Creation 2026 | AI World Hub",
    "desc": "Discover the best AI tools for writing and content creation in 2026. Compare top tools for articles, blogs, marketing copy, and more.",
    "type": "page",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/best-ai-tools-for-coding",
    "title": "Best AI Tools for Coding & Development 2026 | AI World Hub",
    "desc": "Discover the best AI tools for coding and development in 2026. Compare top tools for code generation, debugging, and development workflows.",
    "type": "page",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/best-ai-tools-for-image-generation",
    "title": "Best AI Tools for Image Generation 2026 | AI World Hub",
    "desc": "Discover the best AI tools for image generation in 2026. Compare top tools for AI art, illustrations, and design.",
    "type": "page",
    "priority": 0.8,
    "changefreq": "weekly"
  },
  {
    "path": "/ai-tool-comparisons",
    "title": "AI Tool Comparisons 2026 | AI World Hub",
    "desc": "Compare the top AI tools side-by-side for 2026. Writing, coding, image generation, and more.",
    "type": "page",
    "priority": 0.8,
    "changefreq": "weekly"
  }
];
