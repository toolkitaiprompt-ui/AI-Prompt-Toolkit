/**
 * SEO ROUTES — single source of truth for prerender, sitemap, and RSS.
 *
 * ALL_ROUTES = hand-curated static routes (scripts/static-routes.mjs) +
 * programmatic prompt pages generated from src/data/prompt-engine.json
 * (/prompts/:role/:task → 225 long-tail landing pages).
 *
 * This module also owns the JSON-LD schema builders so prerender.mjs and the
 * generate-* scripts always agree on structured data.
 */
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { STATIC_ROUTES } from "./static-routes.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ENGINE = JSON.parse(
  readFileSync(join(ROOT, "src", "data", "prompt-engine.json"), "utf8"),
);

export const SITE = "https://aiworldhub.site";

export const toCanonical = (path) =>
  path === "/" ? `${SITE}/` : `${SITE}${path}/`;

// ─── Programmatic prompt pages (/prompts/:role/:task) ───────────────
export const PROGRAMMATIC_ROUTES = (() => {
  const out = [];
  for (const role of ENGINE.roles) {
    const tasks = ENGINE.tasks[role.slug] ?? [];
    for (const task of tasks) {
      out.push({
        path: `/prompts/${role.slug}/${task.slug}`,
        title: task.seoTitle,
        desc: task.seoDescription,
        type: "programmatic",
        priority: 0.6,
        changefreq: "weekly",
        roleSlug: role.slug,
        roleTitle: role.title,
        roleDescription: role.description,
        taskSlug: task.slug,
        taskTitle: task.title,
        category: task.category,
        prompt: task.prompt,
        faq: task.faq,
      });
    }
  }
  return out;
})();

export const ALL_ROUTES = [...STATIC_ROUTES, ...PROGRAMMATIC_ROUTES];

// ─── Tool name derivation for per-tool schemas ──────────────────────
export function toolNameFromTitle(title) {
  return title
    .replace(/\s*\|\s*AI World Hub\s*$/, "")
    .replace(/^Free\s+/, "")
    .split(" — ")[0]
    .split(" – ")[0]
    .trim();
}

export function toolFaq(name, description) {
  const lead = description.split(".")[0].replace(/\s+$/, "") + ".";
  return [
    {
      question: `What is ${name}?`,
      answer: `${name} ${lead} It runs entirely in your browser with no sign-up required.`,
    },
    {
      question: `Is ${name} free?`,
      answer: `Yes — ${name} is 100% free forever. There is no sign-up, no credit card, and no hidden limit.`,
    },
    {
      question: `Which AI models work with ${name}?`,
      answer: `${name} is model-agnostic and works with ChatGPT (GPT-4), Claude, Gemini, Llama, and most other large language models.`,
    },
    {
      question: `Does ${name} send my data to a server?`,
      answer: `No. All processing happens locally in your browser — your prompts and text never leave your device.`,
    },
  ];
}

// ─── JSON-LD builders (per route) ────────────────────────────────────
function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE}${it.path}`,
    })),
  };
}

export function faqJsonLd(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

function softwareApplicationJsonLd(name, description, canonicalUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web Browser",
    url: canonicalUrl,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description,
  };
}

function webPageJsonLd(name, description, canonicalUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: canonicalUrl,
    publisher: { "@type": "Organization", name: "AI World Hub", url: SITE },
  };
}

export function articleJsonLd(route) {
  const canonicalUrl = toCanonical(route.path);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: route.title,
    description: route.desc,
    mainEntityOfPage: canonicalUrl,
    url: canonicalUrl,
    publisher: { "@type": "Organization", name: "AI World Hub", url: SITE },
  };
}

/**
 * Returns an array of JSON-LD objects for a given route. Falls back to `null`
 * when the route needs no per-page structured data.
 */
export function jsonLdForRoute(route) {
  const canonicalUrl = toCanonical(route.path);
  switch (route.type) {
    case "tool": {
      const name = toolNameFromTitle(route.title);
      return [
        softwareApplicationJsonLd(name, route.desc, canonicalUrl),
        faqJsonLd(toolFaq(name, route.desc)),
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools" },
          { name: route.title.split(" — ")[0], path: route.path },
        ]),
      ];
    }
    case "programmatic": {
      const taskTitle = route.taskTitle ?? route.title;
      return [
        webPageJsonLd(route.title, route.desc, canonicalUrl),
        faqJsonLd(route.faq ?? []),
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Prompts", path: "/prompts" },
          { name: route.roleTitle, path: `/prompts/${route.roleSlug}` },
          { name: taskTitle, path: route.path },
        ]),
      ];
    }
    case "blog": {
      return [articleJsonLd(route)];
    }
    default:
      return null;
  }
}
