/**
 * contentHub — internal linking graph.
 *
 * Maps tools ⇄ prompt roles ⇄ blog categories so every page naturally
 * recommends the next most useful page (more pageviews per session + SEO
 * link equity flow). Data-only module: no React, no side effects.
 */
import { BLOG_POSTS, type BlogPost } from "../data/blogPosts";
import { TOOL_PAGES, type ToolMeta } from "../data/tools";

export type PromptRoleRef = { slug: string; title: string; path: string };

/** The 15 prompt-library role pages (mirrors PROMPT_ROLES in PromptsPages). */
export const PROMPT_ROLE_META: Record<string, PromptRoleRef> = {
  chatgpt: { slug: "chatgpt", title: "ChatGPT Prompts", path: "/prompts/chatgpt" },
  "content-writer": { slug: "content-writer", title: "Content Writer Prompts", path: "/prompts/content-writer" },
  developer: { slug: "developer", title: "Developer Prompts", path: "/prompts/developer" },
  marketer: { slug: "marketer", title: "Marketer Prompts", path: "/prompts/marketer" },
  "seo-specialist": { slug: "seo-specialist", title: "SEO Specialist Prompts", path: "/prompts/seo-specialist" },
  "data-analyst": { slug: "data-analyst", title: "Data Analyst Prompts", path: "/prompts/data-analyst" },
  "business-analyst": { slug: "business-analyst", title: "Business Analyst Prompts", path: "/prompts/business-analyst" },
  "graphic-designer": { slug: "graphic-designer", title: "Graphic Designer Prompts", path: "/prompts/graphic-designer" },
  sales: { slug: "sales", title: "Sales Prompts", path: "/prompts/sales" },
  "customer-support": { slug: "customer-support", title: "Customer Support Prompts", path: "/prompts/customer-support" },
  "product-manager": { slug: "product-manager", title: "Product Manager Prompts", path: "/prompts/product-manager" },
  researcher: { slug: "researcher", title: "Researcher Prompts", path: "/prompts/researcher" },
  student: { slug: "student", title: "Student Prompts", path: "/prompts/student" },
  entrepreneur: { slug: "entrepreneur", title: "Entrepreneur Prompts", path: "/prompts/entrepreneur" },
  consultant: { slug: "consultant", title: "Consultant Prompts", path: "/prompts/consultant" },
};

/** Which prompt-library roles each tool naturally serves. */
export const TOOL_PROMPT_ROLES: Record<string, string[]> = {
  "/tools/prompt-variable-extractor": ["developer", "data-analyst", "business-analyst"],
  "/tools/json-schema-generator": ["developer", "data-analyst", "product-manager"],
  "/tools/json-validator": ["developer", "data-analyst"],
  "/tools/prompt-formatter": ["content-writer", "marketer", "chatgpt"],
  "/tools/prompt-cleaner": ["content-writer", "chatgpt", "student", "researcher"],
  "/tools/token-estimator": ["developer", "data-analyst", "seo-specialist", "consultant"],
  "/tools/prompt-converter": ["developer", "content-writer", "seo-specialist"],
  "/tools/persona-builder": ["marketer", "sales", "customer-support", "entrepreneur"],
  "/tools/advanced-prompt-optimizer": ["chatgpt", "content-writer", "seo-specialist", "marketer"],
  "/tools/prompt-comparison": ["researcher", "data-analyst", "seo-specialist"],
  "/tools/mega-prompt-builder": ["chatgpt", "content-writer", "researcher", "consultant"],
  "/tools/prompt-debugger": ["developer", "data-analyst", "seo-specialist", "content-writer"],
  "/tools/security-scanner": ["developer", "customer-support", "researcher", "student"],
  "/tools/prompt-chain-builder": ["developer", "product-manager", "marketer", "business-analyst"],
  "/tools/prompt-translator": ["content-writer", "marketer", "student", "researcher"],
  "/tools/api-request-builder": ["developer", "data-analyst", "product-manager"],
  "/tools/image-prompt-generator": ["graphic-designer", "marketer", "content-writer"],
  "/tools/content-summarizer": ["researcher", "student", "content-writer", "business-analyst"],
  "/tools/regex-generator": ["developer", "data-analyst"],
};

/** Which prompt-library roles each blog category naturally serves. */
export const BLOG_CATEGORY_ROLES: Record<string, string[]> = {
  "Prompt Engineering": ["chatgpt", "content-writer", "developer"],
  "ChatGPT Prompts": ["chatgpt", "content-writer", "student"],
  "AI Prompt Templates": ["chatgpt", "content-writer", "marketer"],
  "Claude Prompts": ["chatgpt", "developer", "content-writer"],
  "Midjourney Prompts": ["graphic-designer", "marketer", "content-writer"],
  "JSON Schema": ["developer", "data-analyst"],
  "AI Productivity": ["chatgpt", "student", "entrepreneur"],
  "Prompt Optimization": ["chatgpt", "seo-specialist", "content-writer"],
  "AI Automation": ["developer", "product-manager", "marketer"],
  "LLM Workflows": ["developer", "product-manager", "business-analyst"],
  "AI Tools": ["chatgpt", "developer", "marketer"],
  "Make Money Online": ["entrepreneur", "marketer", "sales"],
  Freelancing: ["entrepreneur", "content-writer", "marketer"],
  "Content Creation": ["content-writer", "graphic-designer", "marketer"],
  "Business AI": ["entrepreneur", "business-analyst", "product-manager"],
  "AI Security": ["developer", "seo-specialist", "customer-support"],
};

/** High-traffic core tools — always available as fallback suggestions. */
const CORE_TOOL_PATHS = [
  "/tools/advanced-prompt-optimizer",
  "/tools/prompt-chain-builder",
  "/tools/prompt-debugger",
  "/tools/token-estimator",
  "/tools/mega-prompt-builder",
];

// Reverse map: role slug -> tool paths (built once at module init).
const ROLE_TOOLS: Record<string, string[]> = {};
for (const [toolPath, roles] of Object.entries(TOOL_PROMPT_ROLES)) {
  for (const role of roles) {
    (ROLE_TOOLS[role] ??= []).push(toolPath);
  }
}

// Reverse map: role slug -> blog categories.
const ROLE_BLOG_CATEGORIES: Record<string, string[]> = {};
for (const [category, roles] of Object.entries(BLOG_CATEGORY_ROLES)) {
  for (const role of roles) {
    (ROLE_BLOG_CATEGORIES[role] ??= []).push(category);
  }
}

const TOOL_BY_PATH = new Map(TOOL_PAGES.map((t) => [t.path, t]));

/** Prompt-library role pages that fit a tool (max `limit`). */
export function getRolesForTool(toolPath: string, limit = 4): PromptRoleRef[] {
  const slugs = TOOL_PROMPT_ROLES[toolPath] ?? [];
  return slugs
    .map((s) => PROMPT_ROLE_META[s])
    .filter(Boolean)
    .slice(0, limit);
}

/** Tools that fit a prompt-library role page (curated first, core fallback). */
export function getToolsForRole(roleSlug: string, limit = 4): ToolMeta[] {
  const curated = (ROLE_TOOLS[roleSlug] ?? []).map((p) => TOOL_BY_PATH.get(p)).filter(Boolean) as ToolMeta[];
  const seen = new Set(curated.map((t) => t.path));
  const fill = CORE_TOOL_PATHS.map((p) => TOOL_BY_PATH.get(p)).filter(
    (t): t is ToolMeta => Boolean(t) && !seen.has(t!.path),
  );
  const all = [...curated, ...fill];
  const out: ToolMeta[] = [];
  const outSeen = new Set<string>();
  for (const t of all) {
    if (outSeen.has(t.path)) continue;
    outSeen.add(t.path);
    out.push(t);
    if (out.length >= limit) break;
  }
  return out;
}

/** Prompt-library role pages that fit a blog category (max `limit`). */
export function getRolesForBlogCategory(category: string, limit = 3): PromptRoleRef[] {
  return (BLOG_CATEGORY_ROLES[category] ?? [])
    .map((s) => PROMPT_ROLE_META[s])
    .filter(Boolean)
    .slice(0, limit);
}

/** Blog posts that fit a prompt-library role page (category match first, then tool overlap). */
export function getBlogPostsForRole(roleSlug: string, limit = 3): BlogPost[] {
  const categories = ROLE_BLOG_CATEGORIES[roleSlug] ?? [];
  const roleTools = new Set(ROLE_TOOLS[roleSlug] ?? []);
  const byCategory = BLOG_POSTS.filter((p) => categories.includes(p.category));
  const byTool = BLOG_POSTS.filter(
    (p) => !categories.includes(p.category) && p.relatedToolSlugs.some((s) => roleTools.has(`/tools/${s}`)),
  );
  const out: BlogPost[] = [];
  const seen = new Set<string>();
  for (const post of [...byCategory, ...byTool]) {
    if (seen.has(post.slug)) continue;
    seen.add(post.slug);
    out.push(post);
    if (out.length >= limit) break;
  }
  return out;
}

/**
 * Semantically related posts: same category first, then posts sharing the
 * same related tools, then the newest remaining posts.
 */
export function getRelatedBlogPosts(post: BlogPost, limit = 4): BlogPost[] {
  const sameCategory = BLOG_POSTS.filter((p) => p.slug !== post.slug && p.category === post.category);
  const toolOverlap = BLOG_POSTS.filter(
    (p) =>
      p.slug !== post.slug &&
      p.category !== post.category &&
      p.relatedToolSlugs.some((s) => post.relatedToolSlugs.includes(s)),
  );
  const rest = BLOG_POSTS.filter(
    (p) => p.slug !== post.slug && p.category !== post.category && !toolOverlap.includes(p),
  );
  const out: BlogPost[] = [];
  const seen = new Set<string>();
  for (const candidate of [...sameCategory, ...toolOverlap, ...rest]) {
    if (seen.has(candidate.slug)) continue;
    seen.add(candidate.slug);
    out.push(candidate);
    if (out.length >= limit) break;
  }
  return out;
}
