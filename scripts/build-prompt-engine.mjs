/**
 * Builds src/data/prompt-engine.json — the single source of truth for
 * programmatic SEO prompt pages (/prompts/:role/:task).
 *
 * One-time provenance tool: extracts PROMPT_ROLES + PROMPT_LIBRARY from the
 * legacy inline constants in src/App.tsx and emits a JSON file enriched with
 * per-task slugs, SEO titles, descriptions, and FAQ schema data. Edit the JSON
 * directly going forward; App.tsx, prerender.mjs, and the sitemap/RSS
 * generators all read from it.
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const APP_TSX = readFileSync(join(ROOT, "src", "App.tsx"), "utf8");

function extractBalanced(src, startIdx, open, close) {
  let depth = 0;
  let inStr = null;
  let esc = false;
  for (let i = startIdx; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      inStr = c;
      continue;
    }
    if (c === open) depth++;
    else if (c === close) {
      depth--;
      if (depth === 0) return src.slice(startIdx, i + 1);
    }
  }
  throw new Error(`unbalanced block starting at ${startIdx}`);
}

function extractConst(src, name) {
  const marker = `const ${name}`;
  const start = src.indexOf(marker);
  if (start < 0) throw new Error(`const ${name} not found in App.tsx`);
  // First " = " after the declaration is the real assignment (type annotations
  // never contain " = ").
  const eq = src.indexOf(" = ", start);
  let openIdx = eq + 3;
  while (/\s/.test(src[openIdx])) openIdx++;
  const openChar = src[openIdx];
  return extractBalanced(src, openIdx, openChar, openChar === "[" ? "]" : "}");
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleize(slug) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ─── Extract roles ───
// Role objects embed `icon: Sparkles` etc. (Lucide component identifiers that
// cannot be evaluated in Node) — strip the component reference but keep the
// name string so the app can remap it to a Lucide icon by slug.
const rolesBlockRaw = extractConst(APP_TSX, "PROMPT_ROLES");
const iconNames = [...rolesBlockRaw.matchAll(/icon:\s*(\w+)/g)].map((m) => m[1]);
const rolesBlock = rolesBlockRaw.replace(/icon:\s*\w+\s*,?/g, "");
const roles = Function(`"use strict"; return (${rolesBlock});`)();
const cleanRoles = roles.map((r, i) => ({
  slug: r.slug,
  title: r.title,
  icon: iconNames[i] ?? "Sparkles",
  accent: r.accent,
  count: r.count,
  description: r.description,
}));

// ─── Extract prompt library ───
const libraryBlock = extractConst(APP_TSX, "PROMPT_LIBRARY");
const library = Function(`"use strict"; return (${libraryBlock});`)();

const roleNoun = (slug) =>
  slug === "chatgpt" ? "ChatGPT" : cleanRoles.find((r) => r.slug === slug)?.title.replace(/ Prompts$/, "") ?? titleize(slug);

const buildSeoTitle = (roleSlug, taskTitle) => {
  const noun = roleNoun(roleSlug);
  if (roleSlug === "chatgpt") {
    return `${taskTitle} ChatGPT Prompt — Free Template | AI World Hub`;
  }
  return `${taskTitle} Prompt for ${noun} | AI World Hub`;
};

const buildSeoDescription = (roleSlug, taskTitle) => {
  const noun = roleNoun(roleSlug);
  if (roleSlug === "chatgpt") {
    return `Use this free ${taskTitle.toLowerCase()} ChatGPT prompt to get professional AI output instantly. Copy, customize {{variables}}, and paste into ChatGPT, Claude, or Gemini — no sign-up required.`;
  }
  return `Free ${noun.toLowerCase()} ${taskTitle.toLowerCase()} prompt for ChatGPT, Claude, and Gemini. Copy the ready-to-use template, customize its variables, and get professional AI output in seconds.`;
};

const buildFaq = (roleSlug, taskTitle) => {
  const noun = roleNoun(roleSlug);
  return [
    {
      question: `What is the ${taskTitle} ${roleSlug === "chatgpt" ? "ChatGPT" : noun.toLowerCase()} prompt?`,
      answer: `This ready-to-use ${taskTitle.toLowerCase()} prompt is a professionally structured template that tells the AI exactly what role to play, what to produce, and how to format the output — giving you consistent, high-quality results without writing prompts from scratch.`,
    },
    {
      question: `How do I use this ${roleSlug === "chatgpt" ? "ChatGPT" : noun.toLowerCase()} prompt template?`,
      answer: `Copy the prompt, replace the {{variables}} with your own details (topic, audience, tone, and other placeholders), then paste it into ChatGPT, Claude, Gemini, or any other AI assistant. Refine the output by adding your own examples or constraints.`,
    },
    {
      question: `Can I use this prompt with ChatGPT, Claude, or Gemini?`,
      answer: "Yes. Every prompt on AI World Hub is model-agnostic and works with ChatGPT, Claude, Gemini, Llama, and most other large language models without modification.",
    },
    {
      question: `Is the ${taskTitle} prompt on AI World Hub really free?`,
      answer: `Yes — the ${taskTitle.toLowerCase()} prompt and all 225+ prompts in the library are 100% free forever. Everything runs in your browser with no sign-up and no data collection.`,
    },
  ];
};

// ─── Assemble JSON ───
const tasks = {};
for (const [roleSlug, list] of Object.entries(library)) {
  tasks[roleSlug] = list.map((t) => ({
    title: t.title,
    category: t.category,
    prompt: t.prompt,
    slug: slugify(t.title),
    seoTitle: buildSeoTitle(roleSlug, t.title),
    seoDescription: buildSeoDescription(roleSlug, t.title),
    faq: buildFaq(roleSlug, t.title),
  }));
}

const output = {
  generatedAt: new Date().toISOString().slice(0, 10),
  roles: cleanRoles,
  tasks,
};

const outPath = join(ROOT, "src", "data", "prompt-engine.json");
writeFileSync(outPath, JSON.stringify(output, null, 2) + "\n");

const taskCount = Object.values(tasks).reduce((n, l) => n + l.length, 0);
console.log(`✅ Wrote ${outPath}`);
console.log(`   ${cleanRoles.length} roles, ${taskCount} programmatic pages`);
const dupes = [];
for (const [slug, list] of Object.entries(tasks)) {
  const seen = new Set();
  for (const t of list) {
    if (seen.has(t.slug)) dupes.push(`${slug}/${t.slug}`);
    seen.add(t.slug);
  }
}
if (dupes.length) {
  console.error(`⚠️ Duplicate task slugs (will collide in routes): ${dupes.join(", ")}`);
} else {
  console.log("   All task slugs unique per role ✓");
}
