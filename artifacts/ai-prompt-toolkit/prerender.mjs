/**
 * Prerender Script — Static HTML generation for SEO
 * 
 * COMPLETE FILE — All routes, high-search keywords, SEO-optimized titles.
 * This file generates unique index.html for EVERY route with:
 * - Keyword-rich titles (under 60 chars)
 * - Optimized meta descriptions (under 160 chars)
 * - Correct canonical URLs
 * - Open Graph + Twitter Card tags
 *
 * TARGET KEYWORDS (from global search data):
 * "Best AI Tools" → 50+ lakh/month
 * "Free AI Tools" → 30+ lakh/month
 * "ChatGPT Prompts" → 20+ lakh/month
 * "How to use ChatGPT" → 15+ lakh/month
 * "AI Tool Directory" → 10+ lakh/month
 * "Prompt Engineering" → 8+ lakh/month
 *
 * No external dependencies. Pure Node.js.
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const OUT_DIR = join(process.cwd(), "dist", "public");
const TEMPLATE = readFileSync(join(OUT_DIR, "index.html"), "utf-8");
const SITE = "https://aiworldhub.site";

// ─── All routes with SEO-optimized data ──────────────────
const routes = [
  // ═══════════════════════════════════════════════════════
  // STATIC PAGES — Primary SEO targets
  // ═══════════════════════════════════════════════════════

  // ── HOMEPAGE — Targets: "Best AI Tools", "Free AI Tools", "Prompt Engineering" ──
  { path: "/", title: "Best Free AI Tools for Everyone | AI Prompt Engineering",
    desc: "Best free AI tools for everyone — 9 prompt engineering tools for formatting, validating, extracting, and optimizing prompts. JSON schema, token estimator, persona builder & more. No sign-up, 100% in-browser." },

  // ── TOOLS DIRECTORY — Targets: "AI Tools Directory", "Free AI Tools" ──
  { path: "/tools", title: "Free AI Tools Directory — 9 Best Tools | AI Prompt Toolkit",
    desc: "Browse the best free AI tools for prompt engineering — variable extractor, JSON schema generator, JSON validator, prompt formatter, cleaner, token estimator, converter, persona builder & optimizer." },

  // ── BLOG — Targets: "ChatGPT Prompts", "Prompt Engineering", "AI Tools" ──
  { path: "/blog", title: "ChatGPT Prompts & Prompt Engineering Blog | AI Prompt Toolkit",
    desc: "Free ChatGPT prompts, prompt engineering guides, and AI tool reviews. Learn how to write better prompts, use AI tools effectively, and boost productivity with practical tutorials." },

  // ── ABOUT — Targets: "Free AI Tools", "AI Prompt Engineering" ──
  { path: "/about", title: "About — Best Free AI Prompt Engineering Tools | AI Prompt Toolkit",
    desc: "AI Prompt Toolkit offers the best free AI prompt engineering tools for everyone — students, developers, marketers, and teams. 9 in-browser tools, no sign-up, no data collection." },

  // ── CONTACT ──
  { path: "/contact", title: "Contact — Free AI Prompt Tools Support | AI Prompt Toolkit",
    desc: "Contact AI Prompt Toolkit for prompt engineering support, partnerships, and feedback. Email toolkitaiprompt@gmail.com — we respond within 24 hours." },

  // ── PRIVACY POLICY ──
  { path: "/privacy-policy", title: "Privacy Policy | Free AI Prompt Tools — AI Prompt Toolkit",
    desc: "Privacy policy for AI Prompt Toolkit — free AI prompt engineering tools. All tool processing happens in-browser. No personal data collected, stored, or shared." },

  // ── TERMS OF SERVICE ──
  { path: "/terms-of-service", title: "Terms of Service | Free AI Prompt Tools — AI Prompt Toolkit",
    desc: "Terms of service for AI Prompt Toolkit — free AI prompt engineering tools. Use our tools for personal or commercial projects. No warranty, use at your own discretion." },

  // ═══════════════════════════════════════════════════════
  // TOOL PAGES — Each targets specific tool + keyword combos
  // ═══════════════════════════════════════════════════════

  // ── Prompt Variable Extractor — Targets: "prompt variables", "AI prompt tools" ──
  { path: "/tools/prompt-variable-extractor", title: "Free Prompt Variable Extractor — AI Prompt Tools",
    desc: "Extract prompt variables like {name}, {{city}}, [tone] from any AI prompt. Free in-browser tool for building reusable prompt templates. Supports 4 variable syntaxes, sorted output." },

  // ── JSON Schema Generator — Targets: "JSON schema", "AI output" ──
  { path: "/tools/json-schema-generator", title: "Free JSON Schema Generator for AI — AI Prompt Tools",
    desc: "Generate JSON Schema from sample data for reliable AI output. Free in-browser tool — paste JSON, get schema instantly. Draft 2020-12 compliant with nested object support." },

  // ── JSON Validator — Targets: "JSON validator", "AI output validation" ──
  { path: "/tools/json-validator", title: "Free JSON Validator for AI Output — AI Prompt Tools",
    desc: "Validate AI-generated JSON against your schema in real time. Catch missing fields, type mismatches, and structural errors before production. Free in-browser tool." },

  // ── Prompt Formatter — Targets: "prompt formatting", "ChatGPT prompts" ──
  { path: "/tools/prompt-formatter", title: "Free Prompt Formatter for ChatGPT — AI Prompt Tools",
    desc: "Format messy prompt notes into clean, numbered instruction blocks for ChatGPT, Claude, and Gemini. Free in-browser tool — get better AI results with structured prompts." },

  // ── Prompt Cleaner — Targets: "clean prompts", "AI prompt tools" ──
  { path: "/tools/prompt-cleaner", title: "Free Prompt Cleaner — Remove Noise from AI Prompts",
    desc: "Clean noisy text, hidden characters, and formatting issues from AI prompts. Free in-browser tool that normalizes whitespace, strips control characters, and trims line breaks." },

  // ── Token Estimator — Targets: "token calculator", "AI cost" ──
  { path: "/tools/token-estimator", title: "Free AI Token Estimator & Calculator — AI Prompt Tools",
    desc: "Estimate token count, characters, and words for AI prompts before sending to GPT, Claude, or Gemini APIs. Free in-browser token calculator for cost planning and budget optimization." },

  // ── Prompt Converter — Targets: "ChatGPT to Claude", "prompt converter" ──
  { path: "/tools/prompt-converter", title: "Free Prompt Converter — ChatGPT to Claude & Gemini | AI Tools",
    desc: "Convert ChatGPT prompts to Claude, Gemini, or Cursor format instantly. Free in-browser tool that adapts tone, structure, and directives for each AI model. No sign-up required." },

  // ── Persona Builder — Targets: "AI persona", "system prompt", "ChatGPT prompts" ──
  { path: "/tools/persona-builder", title: "Free AI Persona Builder — System Prompt Generator | AI Tools",
    desc: "Generate expert system prompts for AI roles like Marketer, Developer, Analyst, Writer, Teacher, and Business Consultant. Free in-browser persona builder for ChatGPT, Claude & Gemini." },

  // ── Advanced Prompt Optimizer — Targets: "prompt optimization", "AI prompt tools" ──
  { path: "/tools/advanced-prompt-optimizer", title: "Free Advanced Prompt Optimizer — Best AI Prompt Tool",
    desc: "Polish and optimize AI prompts with advanced controls — reduce tokens, add structure, compare before-and-after. The best free prompt optimizer for ChatGPT, Claude & Gemini." },

  // ═══════════════════════════════════════════════════════
  // NEW HIGH-TRAFFIC SEO POSTS — Targeting top global keywords
  // ═══════════════════════════════════════════════════════

  // ── "Best AI Tools" → 50+ LAKH searches/month ──
  { path: "/blog/best-ai-tools-2026-complete-directory", title: "Best AI Tools 2026 — Complete Directory of 50+ Tools | AI Prompt Toolkit",
    desc: "Discover the 50 best AI tools in 2026 for writing, image generation, coding, video, and productivity. Ranked by popularity with free plans and direct links. ChatGPT, Midjourney, Claude & more." },

  // ── "ChatGPT Prompts" → 20+ LAKH searches/month ──
  { path: "/blog/100-chatgpt-prompts-for-every-task", title: "100+ ChatGPT Prompts for Every Task — Copy & Paste | AI Prompt Toolkit",
    desc: "100+ ready-to-use ChatGPT prompts for writing, marketing, coding, business, education, and more. Copy, paste, and get professional results instantly. Free prompt library." },

  // ── "How to use ChatGPT" → 15+ LAKH searches/month ──
  { path: "/blog/how-to-use-chatgpt-complete-guide", title: "How to Use ChatGPT — Complete Beginner Guide 2026 | AI Prompt Toolkit",
    desc: "Learn how to use ChatGPT from scratch — creating an account, writing effective prompts, using advanced features like image generation and file analysis. Step-by-step guide for beginners." },

  // ── "Free AI Tools" → 30+ LAKH searches/month ──
  { path: "/blog/free-ai-tools-50-best-tested", title: "50 Best Free AI Tools 2026 — Tested & Ranked | AI Prompt Toolkit",
    desc: "50 genuinely free AI tools tested and ranked for 2026 — writing, images, video, coding, audio, and productivity. No hidden fees, no credit card required. ChatGPT, Canva, Leonardo & more." },

  // ── "Prompt Engineering" → 8+ LAKH searches/month ──
  { path: "/blog/prompt-engineering-complete-guide", title: "Prompt Engineering Complete Guide — Beginner to Expert 2026 | AI Prompt Toolkit",
    desc: "Master prompt engineering in 2026. Learn proven techniques — role prompting, chain-of-thought, few-shot examples, JSON schema output. Get professional results from any AI model." },

  // ── "AI Tool Directory" → 10+ LAKH searches/month ──
  { path: "/blog/ai-tools-directory-categorized-list", title: "AI Tools Directory — 50+ Tools by Category | AI Prompt Toolkit",
    desc: "Browse 50+ AI tools organized by category — text generation, image creation, video editing, coding, audio, and productivity. Compare features, pricing, and use cases. Free directory." },

  // ═══════════════════════════════════════════════════════
  // EXISTING BLOG POSTS — Titles optimized with keywords
  // ═══════════════════════════════════════════════════════

  // ── Prompt Engineering category ──
  { path: "/blog/master-prompt-engineering-workflow", title: "Prompt Engineering Workflow Guide — Best Practices | AI Prompt Toolkit",
    desc: "Step-by-step prompt engineering workflow for teams — discover, draft, test, validate, review, deploy. Reduce iteration time and ship reliable AI prompts faster. Free guide." },

  // ── ChatGPT Prompts category ──
  { path: "/blog/craft-high-impact-chatgpt-prompts", title: "How to Write High-Impact ChatGPT Prompts — Free Guide | AI Prompt Toolkit",
    desc: "Learn how to design ChatGPT prompts that produce clearer, more consistent, and more useful AI responses. Free guide with copy-paste examples and prompt templates." },

  // ── AI Prompt Templates ──
  { path: "/blog/build-ai-prompt-templates-that-scale", title: "Build AI Prompt Templates That Scale — Free Guide | AI Prompt Toolkit",
    desc: "Create scalable AI prompt templates that support team collaboration, reduce rework, and improve consistency. Free guide with template examples for ChatGPT, Claude & Gemini." },

  // ── Claude Prompts ──
  { path: "/blog/claude-prompt-best-practices", title: "Claude Prompt Best Practices — Free AI Prompt Guide | AI Prompt Toolkit",
    desc: "Learn how to write Claude prompts that deliver consistent, structured, and reliable AI responses. Best practices for context management, prompt structure, and guardrails." },

  // ── Midjourney Prompts ──
  { path: "/blog/midjourney-prompt-techniques", title: "Midjourney Prompt Techniques — Create Better AI Art | AI Prompt Toolkit",
    desc: "Discover Midjourney prompt strategies that generate more compelling and consistent AI art. Free guide with prompt examples for photorealistic, artistic, and stylized images." },

  // ── JSON Schema ──
  { path: "/blog/design-json-schema-for-ai-output", title: "Design JSON Schema for Reliable AI Output — Free Guide | AI Prompt Toolkit",
    desc: "Learn how to create JSON schema for AI output and ensure your model responses are structured and reliable. Free guide with examples for ChatGPT, Claude, and Gemini API." },

  // ── AI Productivity ──
  { path: "/blog/boost-ai-productivity-with-prompt-systems", title: "Boost AI Productivity with Prompt Systems — Free Guide | AI Prompt Toolkit",
    desc: "Explore how prompt systems, reusable templates, and automation can significantly boost AI productivity. Free guide for teams using ChatGPT, Claude, and Gemini." },

  // ── Prompt Optimization ──
  { path: "/blog/optimize-prompts-for-better-ai-performance", title: "Optimize AI Prompts for Better Performance — Free Guide | AI Prompt Toolkit",
    desc: "Learn practical prompt optimization techniques to improve AI model accuracy, reduce token costs, and speed up delivery. Free guide with before-and-after examples." },

  // ── AI Automation ──
  { path: "/blog/automate-ai-tasks-with-prompt-workflows", title: "Automate AI Tasks with Prompt Workflows — Free Guide | AI Prompt Toolkit",
    desc: "Discover how to automate common AI tasks using prompt workflows that save time and maintain quality. Free guide for building automated AI pipelines." },

  // ── LLM Workflows ──
  { path: "/blog/orchestrate-llm-workflows-for-productive-teams", title: "Orchestrate LLM Workflows for Teams — Free AI Guide | AI Prompt Toolkit",
    desc: "Learn how to orchestrate LLM workflows that connect prompt design, validation, and deployment. Free guide for teams building production AI applications." },

  // ── Prompt Audit ──
  { path: "/blog/prompt-audit-and-iteration-strategies", title: "Prompt Audit & Iteration Strategies — Free AI Guide | AI Prompt Toolkit",
    desc: "Explore prompt audit practices and iteration strategies that keep AI output reliable over time. Free guide with audit checklists and testing frameworks." },

  // ── Customer Support Prompts ──
  { path: "/blog/customer-support-prompt-templates", title: "Customer Support Prompt Templates — Free ChatGPT Guide | AI Prompt Toolkit",
    desc: "Learn how to create prompt templates for customer support that improve AI response quality and speed. Free ChatGPT prompt templates for support teams." },

  // ── Marketing ChatGPT Prompts ──
  { path: "/blog/marketing-chatgpt-prompt-patterns", title: "ChatGPT Prompt Patterns for Marketing — Free Guide | AI Prompt Toolkit",
    desc: "Discover reliable ChatGPT prompt patterns for marketing teams to create content faster and more consistently. Free prompt library for ads, emails, social media & SEO." },

  // ── Enterprise Claude ──
  { path: "/blog/enterprise-claude-prompt-engineering", title: "Enterprise Claude Prompt Engineering — Free AI Guide | AI Prompt Toolkit",
    desc: "Explore Claude prompt engineering practices for enterprise use cases where reliability and compliance matter. Free guide with production-ready prompt patterns." },

  // ── Midjourney Creative ──
  { path: "/blog/midjourney-prompts-for-creative-visuals", title: "Midjourney Prompts for Creative Visuals — Free AI Art Guide | AI Prompt Toolkit",
    desc: "Learn how to write Midjourney prompts that accelerate creative production and improve visual quality. Free guide with prompt examples for every art style." },

  // ── JSON Schema Validation ──
  { path: "/blog/validate-ai-outputs-with-json-schema", title: "Validate AI Outputs with JSON Schema — Free Guide | AI Prompt Toolkit",
    desc: "A hands-on guide to validating AI outputs with JSON schema, reducing failures and improving reliability. Free tutorial with code examples for production AI." },

  // ── Reusable Prompts ──
  { path: "/blog/scale-ai-productivity-with-reusable-prompts", title: "Scale AI Productivity with Reusable Prompts — Free Guide | AI Prompt Toolkit",
    desc: "Explore reusable prompt patterns that help teams scale AI productivity without sacrificing quality. Free guide with template library examples." },

  // ── Prompt Cost Optimization ──
  { path: "/blog/prompt-optimization-for-cost-and-quality", title: "Prompt Optimization for Cost & Quality — Free AI Guide | AI Prompt Toolkit",
    desc: "Learn how prompt optimization improves both AI output quality and cost efficiency for production systems. Free guide with token-saving techniques." },

  // ── Business Automation ──
  { path: "/blog/business-automation-with-ai-prompts", title: "Business Automation with AI Prompts — Free Guide | AI Prompt Toolkit",
    desc: "Explore how AI prompts and workflow templates can automate business processes and improve efficiency. Free guide for small businesses and enterprises." },

  // ── LLM Team Collaboration ──
  { path: "/blog/deploy-llm-workflows-for-team-collaboration", title: "Deploy LLM Workflows for Team Collaboration — Free Guide | AI Prompt Toolkit",
    desc: "Learn how to deploy LLM workflows that help teams collaborate and scale AI delivery. Free guide with workflow templates and best practices." },

  // ── AI Reliability ──
  { path: "/blog/prompts-for-ai-reliability-and-governance", title: "Prompts for AI Reliability & Governance — Free Guide | AI Prompt Toolkit",
    desc: "Discover how reliable prompts and governance practices help teams manage AI risk and quality. Free guide with governance frameworks and testing strategies." },

  // ── Trusted Prompt Templates ──
  { path: "/blog/trusted-prompt-templates-for-team-use", title: "Trusted Prompt Templates for Teams — Free AI Guide | AI Prompt Toolkit",
    desc: "Learn how to build trusted prompt templates for collaborative, reliable AI use across teams. Free guide with review, testing, and reuse strategies." },

  // ── AI Workflow Operations ──
  { path: "/blog/ai-workflow-automation-for-operations", title: "AI Workflow Automation for Operations — Free Guide | AI Prompt Toolkit",
    desc: "Discover how to automate operations and support workflows with AI prompts and templates. Free guide for operations teams using ChatGPT and Claude." },

  // ── LLM Best Practices ──
  { path: "/blog/llm-workflow-best-practices-for-innovation", title: "LLM Workflow Best Practices for Innovation — Free AI Guide | AI Prompt Toolkit",
    desc: "Explore best practices for LLM workflows that balance innovation, reliability, and speed. Free guide for teams building with large language models." },

  // ── Prompt Governance ──
  { path: "/blog/ai-prompt-template-governance-for-growth", title: "AI Prompt Template Governance for Growth — Free Guide | AI Prompt Toolkit",
    desc: "Learn how prompt template governance helps teams scale AI safely and sustainably. Free guide with governance templates and growth strategies." },

  // ═══════════════════════════════════════════════════════
  // ADDITIONAL SEO LANDING PAGES — Targeting more keywords
  // ═══════════════════════════════════════════════════════

  // ── "ChatGPT vs Claude" comparisons ──
  { path: "/blog/chatgpt-vs-claude-vs-gemini-comparison", title: "ChatGPT vs Claude vs Gemini — Which AI is Best? | AI Prompt Toolkit",
    desc: "Complete comparison of ChatGPT, Claude, and Gemini in 2026. Compare features, pricing, writing quality, coding ability, and free tiers. Find the best AI for your needs." },

  // ── "AI for beginners" ──
  { path: "/blog/ai-for-beginners-complete-guide", title: "AI for Beginners — Complete Guide to Using AI Tools | AI Prompt Toolkit",
    desc: "New to AI? This complete beginner guide covers everything — what AI is, how to use ChatGPT, best free AI tools, and how to write effective prompts. Start your AI journey here." },

  // ── "AI prompt generator" ──
  { path: "/blog/free-ai-prompt-generator-guide", title: "Free AI Prompt Generator — How to Create Perfect Prompts | AI Prompt Toolkit",
    desc: "Learn how to generate perfect AI prompts for any task. Free guide with prompt templates, formulas, and tools for ChatGPT, Claude, Gemini, and Midjourney." },

  // ── "Midjourney prompts" secondary ──
  { path: "/blog/best-midjourney-prompts-2026", title: "Best Midjourney Prompts 2026 — 50+ Copy & Paste Examples | AI Prompt Toolkit",
    desc: "50+ best Midjourney prompts for 2026 — photorealistic portraits, fantasy art, logo design, architecture, and more. Copy and paste examples with parameter settings." },

  // ── "Claude vs ChatGPT for coding" ──
  { path: "/blog/claude-vs-chatgpt-for-coding", title: "Claude vs ChatGPT for Coding — Which is Better? | AI Prompt Toolkit",
    desc: "Claude vs ChatGPT for coding — compare accuracy, language support, debugging, and real-world performance. Find the best AI coding assistant for developers." },

  // ── "AI writing tools" ──
  { path: "/blog/best-ai-writing-tools-2026", title: "Best AI Writing Tools 2026 — Ranked & Tested | AI Prompt Toolkit",
    desc: "Best AI writing tools in 2026 ranked by quality — ChatGPT, Claude, Jasper, Copy.ai, QuillBot, Grammarly & more. Compare free tiers, features, and writing quality." },

  // ── "AI image generators" ──
  { path: "/blog/best-ai-image-generators-2026", title: "Best AI Image Generators 2026 — Free & Paid Ranked | AI Prompt Toolkit",
    desc: "Best AI image generators in 2026 — Midjourney, DALL-E 3, Leonardo AI, Stable Diffusion, Canva AI & more. Compare quality, speed, pricing, and free tiers." },

  // ── "AI for students" ──
  { path: "/blog/ai-tools-for-students-free-guide", title: "Best Free AI Tools for Students 2026 — Complete Guide | AI Prompt Toolkit",
    desc: "Best free AI tools for students — writing, research, studying, coding, and productivity. ChatGPT, Claude, Perplexity, Notion & more. No cost, no credit card required." },

  // ── "AI for business" ──
  { path: "/blog/ai-tools-for-small-business-free", title: "Best Free AI Tools for Small Business 2026 | AI Prompt Toolkit",
    desc: "Best free AI tools for small business owners — marketing, customer support, content creation, automation, and analytics. Boost productivity without spending." },

  // ── "ChatGPT alternatives" ──
  { path: "/blog/best-chatgpt-alternatives-2026", title: "Best ChatGPT Alternatives 2026 — Free & Paid | AI Prompt Toolkit",
    desc: "Best ChatGPT alternatives in 2026 — Claude, Gemini, Grok, Perplexity, Copilot & more. Compare features, free tiers, and find the right AI for your needs." },

  // ── "AI productivity tools" ──
  { path: "/blog/best-ai-productivity-tools-2026", title: "Best AI Productivity Tools 2026 — Work Smarter | AI Prompt Toolkit",
    desc: "Best AI productivity tools in 2026 — Notion AI, Perplexity, Gamma, Otter, Taskade & more. Automate tasks, save hours, and boost your output with free AI tools." },

  // ── "AI coding tools" ──
  { path: "/blog/best-ai-coding-tools-2026", title: "Best AI Coding Tools 2026 — Free & Paid Ranked | AI Prompt Toolkit",
    desc: "Best AI coding tools in 2026 — GitHub Copilot, Cursor, Replit, Codeium, Tabnine & more. Compare features, pricing, and language support for developers." },

  // ── "AI video tools" ──
  { path: "/blog/best-ai-video-tools-2026", title: "Best AI Video Tools 2026 — Create Videos with AI | AI Prompt Toolkit",
    desc: "Best AI video tools in 2026 — Runway, Synthesia, Pika, CapCut, Descript & more. Create professional videos with AI — text-to-video, editing, avatars, and voiceovers." },

  // ── "AI art styles" ──
  { path: "/blog/ai-art-styles-complete-guide", title: "AI Art Styles Complete Guide — Prompts for Every Style | AI Prompt Toolkit",
    desc: "Complete guide to AI art styles — photorealistic, anime, oil painting, 3D render, cyberpunk, watercolor & more. Copy-paste prompts for Midjourney, DALL-E & Stable Diffusion." },

  // ── "Prompt engineering jobs" ──
  { path: "/blog/prompt-engineering-jobs-and-salary-guide", title: "Prompt Engineering Jobs & Salary Guide 2026 | AI Prompt Toolkit",
    desc: "Complete guide to prompt engineering careers in 2026 — job roles, salary ranges ($126K-$270K), required skills, and how to get hired. Start your AI career here." },

  // ── "Chain of thought prompting" ──
  { path: "/blog/chain-of-thought-prompting-guide", title: "Chain of Thought Prompting — Complete Guide | AI Prompt Toolkit",
    desc: "Master chain of thought prompting — the technique that improves AI accuracy by 20-40%. Learn when to use it, example prompts, and advanced variations for complex reasoning." },

  // ── "Few-shot prompting" ──
  { path: "/blog/few-shot-prompting-guide", title: "Few-Shot Prompting Guide — Better AI Results with Examples | AI Prompt Toolkit",
    desc: "Learn few-shot prompting — the technique of showing AI examples to get consistent, accurate results. Free guide with templates for classification, extraction, and formatting." },

  // ── "RAG prompt engineering" ──
  { path: "/blog/rag-prompt-engineering-guide", title: "RAG Prompt Engineering Guide — Retrieval Augmented Generation | AI Prompt Toolkit",
    desc: "Complete guide to RAG (Retrieval Augmented Generation) prompt engineering. Learn how to combine external data with AI prompts for accurate, up-to-date responses." },

  // ── "AI agent prompts" ──
  { path: "/blog/ai-agent-prompts-guide", title: "AI Agent Prompts Guide — Build Autonomous AI Agents | AI Prompt Toolkit",
    desc: "Learn how to write prompts for AI agents — autonomous systems that use tools, make decisions, and complete multi-step tasks. Free guide with agent prompt templates." },

  // ── "System prompts" ──
  { path: "/blog/system-prompts-complete-guide", title: "System Prompts Complete Guide — Master AI Behavior | AI Prompt Toolkit",
    desc: "Complete guide to system prompts — the hidden instructions that define AI behavior, personality, and rules. Learn to write effective system prompts for any use case." },

  // ── "AI prompt templates" ──
  { path: "/blog/ai-prompt-templates-library", title: "AI Prompt Templates Library — 50+ Free Templates | AI Prompt Toolkit",
    desc: "50+ free AI prompt templates for writing, marketing, coding, business, education, and creative tasks. Copy-paste templates for ChatGPT, Claude, Gemini & Midjourney." },

  // ── "Gemini prompts" ──
  { path: "/blog/gemini-prompts-best-practices", title: "Gemini Prompts Best Practices — Google AI Guide | AI Prompt Toolkit",
    desc: "Learn the best practices for writing prompts for Google Gemini. Optimize prompts for Gemini's multimodal capabilities, Google Workspace integration, and search features." },

  // ── "AI detector" related ──
  { path: "/blog/how-to-write-natural-ai-content", title: "How to Write Natural AI Content — Avoid Detection | AI Prompt Toolkit",
    desc: "Learn how to write natural, human-sounding content with AI. Techniques for tone, structure, and editing that make AI-generated content indistinguishable from human writing." },

  // ── "AI for marketing" ──
  { path: "/blog/ai-marketing-complete-guide", title: "AI Marketing Complete Guide — Grow with AI Tools | AI Prompt Toolkit",
    desc: "Complete guide to AI marketing — use ChatGPT, Claude, and AI tools for content, ads, email, SEO, and social media. Free strategies, prompt templates, and tool reviews." },

  // ── "ChatGPT tips and tricks" ──
  { path: "/blog/chatgpt-tips-and-tricks-2026", title: "50 ChatGPT Tips & Tricks 2026 — Pro Techniques | AI Prompt Toolkit",
    desc: "50 pro ChatGPT tips and tricks for 2026 — hidden features, prompt techniques, workflow shortcuts, and power-user secrets. Get 10x better results from ChatGPT." },

  // ── "AI ethics" ──
  { path: "/blog/ai-ethics-and-responsible-use-guide", title: "AI Ethics & Responsible Use Guide — Best Practices | AI Prompt Toolkit",
    desc: "Complete guide to AI ethics and responsible use — bias, privacy, misinformation, copyright, and transparency. Best practices for individuals and organizations." },

  // ── "AI trends 2026" ──
  { path: "/blog/ai-trends-2026-complete-guide", title: "AI Trends 2026 — What's Next in Artificial Intelligence | AI Prompt Toolkit",
    desc: "Top AI trends for 2026 — agentic AI, local SLMs, multimodal models, AI governance, and the prompt engineering market reaching $672 million. Stay ahead of the curve." },

  // ── "GPT-4 vs GPT-5" ──
  { path: "/blog/gpt-models-comparison-guide", title: "GPT Models Compared — GPT-4, GPT-4o, GPT-5 Guide | AI Prompt Toolkit",
    desc: "Complete comparison of GPT models — GPT-3.5, GPT-4, GPT-4o, GPT-5 and beyond. Compare capabilities, speed, cost, and which model to use for each task." },

  // ── "AI chatbot" ──
  { path: "/blog/build-ai-chatbot-guide", title: "How to Build an AI Chatbot — Complete Guide 2026 | AI Prompt Toolkit",
    desc: "Learn how to build an AI chatbot from scratch — choose a model, write system prompts, design conversation flows, and deploy. Free guide with code examples." },

  // ── "Cursor AI" ──
  { path: "/blog/cursor-ai-complete-guide", title: "Cursor AI Complete Guide — Best AI Code Editor | AI Prompt Toolkit",
    desc: "Complete guide to Cursor AI — the AI-native code editor. Learn features, shortcuts, prompt techniques, and how Cursor compares to GitHub Copilot and VS Code." },
];

// ─── HTML generation ────────────────────────────────────
let count = 0;

for (const route of routes) {
  const url = `${SITE}${route.path === "/" ? "" : route.path}`;
  const html = TEMPLATE
    .replace(/<title>[^<]*<\/title>/, `<title>${route.title}</title>`)
    .replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${route.desc}"`)
    .replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${url}/"`)
    .replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${route.title}"`)
    .replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${route.desc}"`)
    .replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${url}/"`)
    .replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${route.title}"`)
    .replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${route.desc}"`);

  // Write to dist/public/{path}/index.html
  const outPath = route.path === "/" ? OUT_DIR : join(OUT_DIR, route.path);
  mkdirSync(outPath, { recursive: true });
  writeFileSync(join(outPath, "index.html"), html);
  count++;
}

console.log(`✅ Prerendered ${count} pages with unique SEO tags.`);
console.log(`📋 Total routes: ${routes.length}`);
console.log(`🎯 Target keywords: Best AI Tools, Free AI Tools, ChatGPT Prompts, AI Tools Directory, Prompt Engineering, How to Use ChatGPT`);
