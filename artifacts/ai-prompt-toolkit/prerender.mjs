/**
 * Prerender Script — Static HTML generation for SEO
 * Runs after `vite build`. Generates unique index.html for each route
 * with correct title, description, canonical, and og/twitter tags.
 *
 * No external dependencies. Pure Node.js.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";

const OUT_DIR = join(process.cwd(), "dist", "public");
const TEMPLATE = readFileSync(join(OUT_DIR, "index.html"), "utf-8");
const SITE = "https://ai-prompt-toolkit-31l.pages.dev";

// ─── All routes with SEO data ───────────────────────────
const routes = [
  // ── Static pages ──
  { path: "/", title: "Free AI Prompt Tools for Prompt Engineering | AI Prompt Toolkit",
    desc: "AI Prompt Toolkit offers Free AI Prompt Tools including Token Estimator, JSON Validator, and prompt engineering workflows for global teams." },
  { path: "/tools", title: "AI Tools Directory - Free AI Prompt Tools | AI Prompt Toolkit",
    desc: "Browse Free AI Prompt Tools for prompt engineering, including Token Estimator, Variable Extractor, JSON Schema Generator, and JSON Validator." },
  { path: "/blog", title: "Prompt Engineering Blog - Free AI Prompt Tools | AI Prompt Toolkit",
    desc: "Prompt Engineering blog with practical guides on Token Estimator usage, schema validation, and Free AI Prompt Tools workflows." },
  { path: "/contact", title: "Contact - Prompt Engineering Toolkit | AI Prompt Toolkit",
    desc: "Contact AI Prompt Toolkit for Prompt Engineering partnerships, support, and Free AI Prompt Tools collaboration." },
  { path: "/privacy-policy", title: "Privacy Policy | AI Prompt Toolkit",
    desc: "Privacy policy outlining data handling, cookie usage, and user rights for AI Prompt Toolkit." },
  { path: "/terms-of-service", title: "Terms of Service | AI Prompt Toolkit",
    desc: "Terms and usage conditions for the AI Prompt Toolkit." },

  // ── Tool pages ──
  { path: "/tools/prompt-variable-extractor", title: "Prompt Variable Extractor | AI Prompt Toolkit",
    desc: "Extract prompt placeholders to standardize Prompt Engineering templates for fast and reliable AI automation." },
  { path: "/tools/json-schema-generator", title: "JSON Schema Generator | AI Prompt Toolkit",
    desc: "Generate JSON Schema from sample data to enforce reliable Prompt Engineering output structure." },
  { path: "/tools/json-validator", title: "JSON Validator | AI Prompt Toolkit",
    desc: "Validate JSON against schema rules to keep Prompt Engineering pipelines accurate and production-ready." },
  { path: "/tools/prompt-formatter", title: "Prompt Formatter | AI Prompt Toolkit",
    desc: "Format messy prompt notes into a clear structure for stronger Prompt Engineering consistency." },
  { path: "/tools/prompt-cleaner", title: "Prompt Cleaner | AI Prompt Toolkit",
    desc: "Clean noisy text and hidden characters to improve Prompt Engineering quality and response stability." },
  { path: "/tools/token-estimator", title: "Token Estimator | AI Prompt Toolkit",
    desc: "Token Estimator for Prompt Engineering teams to project token usage, budget impact, and context size." },
  { path: "/tools/advanced-prompt-optimizer", title: "Advanced Prompt Optimizer | AI Prompt Toolkit",
    desc: "Polish prompts with premium AI optimization, copy-ready results, and a high-end command center experience." },

  // ── Blog posts (25) ──
  { path: "/blog/master-prompt-engineering-workflow", title: "Master Prompt Engineering Workflows | AI Prompt Toolkit",
    desc: "Discover a step-by-step prompt engineering workflow that helps teams reduce iteration time and ship reliable AI prompts faster." },
  { path: "/blog/craft-high-impact-chatgpt-prompts", title: "Craft High-Impact ChatGPT Prompts | AI Prompt Toolkit",
    desc: "Learn how to design ChatGPT prompts that produce clearer, more consistent, and more useful AI responses." },
  { path: "/blog/build-ai-prompt-templates-that-scale", title: "Build AI Prompt Templates That Scale | AI Prompt Toolkit",
    desc: "Explore how to create scalable AI prompt templates that support team collaboration and reduce rework." },
  { path: "/blog/claude-prompt-best-practices", title: "Claude Prompt Best Practices | AI Prompt Toolkit",
    desc: "Learn how to write Claude prompts that deliver consistent, structured, and reliable AI responses." },
  { path: "/blog/midjourney-prompt-techniques", title: "Midjourney Prompt Techniques | AI Prompt Toolkit",
    desc: "Discover Midjourney prompt strategies that generate more compelling and consistent creative visuals." },
  { path: "/blog/design-json-schema-for-ai-output", title: "Design JSON Schema for Reliable AI Output | AI Prompt Toolkit",
    desc: "Learn how to create JSON schema for AI output and ensure your model responses are structured and reliable." },
  { path: "/blog/boost-ai-productivity-with-prompt-systems", title: "Boost AI Productivity with Prompt Systems | AI Prompt Toolkit",
    desc: "Explore how prompt systems, reusable templates, and automation can significantly boost AI productivity." },
  { path: "/blog/optimize-prompts-for-better-ai-performance", title: "Optimize Prompts for Better AI Performance | AI Prompt Toolkit",
    desc: "Learn practical prompt optimization techniques to improve model accuracy, reduce costs, and speed up delivery." },
  { path: "/blog/automate-ai-tasks-with-prompt-workflows", title: "Automate AI Tasks with Prompt Workflows | AI Prompt Toolkit",
    desc: "Discover how to automate common AI tasks using prompt workflows that save time and maintain quality." },
  { path: "/blog/orchestrate-llm-workflows-for-productive-teams", title: "Orchestrate LLM Workflows for Productive Teams | AI Prompt Toolkit",
    desc: "Learn how to orchestrate LLM workflows that connect prompt design, validation, and deployment." },
  { path: "/blog/prompt-audit-and-iteration-strategies", title: "Prompt Audit and Iteration Strategies | AI Prompt Toolkit",
    desc: "Explore prompt audit practices and iteration strategies that keep AI output reliable over time." },
  { path: "/blog/customer-support-prompt-templates", title: "Design Prompt Templates for Customer Support | AI Prompt Toolkit",
    desc: "Learn how to create prompt templates for customer support that improve response quality and speed." },
  { path: "/blog/marketing-chatgpt-prompt-patterns", title: "ChatGPT Prompt Patterns for Marketing | AI Prompt Toolkit",
    desc: "Discover reliable ChatGPT prompt patterns for marketing teams to create content faster and more consistently." },
  { path: "/blog/enterprise-claude-prompt-engineering", title: "Enterprise Claude Prompt Engineering | AI Prompt Toolkit",
    desc: "Explore Claude prompt engineering practices for enterprise use cases where reliability and compliance matter." },
  { path: "/blog/midjourney-prompts-for-creative-visuals", title: "Midjourney Prompts for Creative Visuals | AI Prompt Toolkit",
    desc: "Learn how to write Midjourney prompts that accelerate creative production and improve visual quality." },
  { path: "/blog/validate-ai-outputs-with-json-schema", title: "Validate AI Outputs with JSON Schema | AI Prompt Toolkit",
    desc: "A hands-on guide to validating AI outputs with JSON schema, reducing failures and improving reliability." },
  { path: "/blog/scale-ai-productivity-with-reusable-prompts", title: "Scale AI Productivity with Reusable Prompts | AI Prompt Toolkit",
    desc: "Explore reusable prompt patterns that help teams scale AI productivity without sacrificing quality." },
  { path: "/blog/prompt-optimization-for-cost-and-quality", title: "Prompt Optimization for Cost and Quality | AI Prompt Toolkit",
    desc: "Learn how prompt optimization improves both AI output quality and cost efficiency for production systems." },
  { path: "/blog/business-automation-with-ai-prompts", title: "Business Automation with AI Prompts | AI Prompt Toolkit",
    desc: "Explore how AI prompts and workflow templates can automate business processes and improve efficiency." },
  { path: "/blog/deploy-llm-workflows-for-team-collaboration", title: "Deploy LLM Workflows for Team Collaboration | AI Prompt Toolkit",
    desc: "Learn how to deploy LLM workflows that help teams collaborate and scale AI delivery." },
  { path: "/blog/prompts-for-ai-reliability-and-governance", title: "Prompts for AI Reliability and Governance | AI Prompt Toolkit",
    desc: "Discover how reliable prompts and governance practices help teams manage AI risk and quality." },
  { path: "/blog/trusted-prompt-templates-for-team-use", title: "Trusted Prompt Templates for Teams | AI Prompt Toolkit",
    desc: "Learn how to build trusted prompt templates for collaborative, reliable AI use across teams." },
  { path: "/blog/ai-workflow-automation-for-operations", title: "AI Workflow Automation for Operations | AI Prompt Toolkit",
    desc: "Discover how to automate operations and support workflows with AI prompts and templates." },
  { path: "/blog/llm-workflow-best-practices-for-innovation", title: "LLM Workflow Best Practices | AI Prompt Toolkit",
    desc: "Explore best practices for LLM workflows that balance innovation, reliability, and speed." },
  { path: "/blog/ai-prompt-template-governance-for-growth", title: "AI Prompt Template Governance for Growth | AI Prompt Toolkit",
    desc: "Learn how prompt template governance helps teams scale AI safely and sustainably." },
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
