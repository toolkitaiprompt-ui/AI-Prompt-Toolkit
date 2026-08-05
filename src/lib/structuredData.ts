/**
 * Client-side JSON-LD builders + useJsonLd hook.
 *
 * Mirrors the node-side builders in scripts/seo-routes.mjs so prerendered
 * static HTML and the live SPA always emit identical structured data. Each
 * per-route block is tagged with data-route-jsonld so the hook can swap blocks
 * on navigation without touching the site-level schemas baked into index.html.
 */
import { useEffect } from "react";

const SITE = "https://aiworldhub.site";

export type FaqItem = { question: string; answer: string };
export type BreadcrumbItem = { name: string; path: string };

export const toCanonical = (path: string) => {
  const clean = path.replace(/\/+$/, "") || "/";
  return clean === "/" ? `${SITE}/` : `${SITE}${clean}/`;
};

// ─── Tool helpers ──────────────────────────────────────────────────────
export function toolNameFromTitle(title: string): string {
  return title
    .replace(/\s*\|\s*AI World Hub\s*$/, "")
    .replace(/^Free\s+/, "")
    .split(" — ")[0]
    .split(" – ")[0]
    .trim();
}

export function toolFaq(name: string, description: string): FaqItem[] {
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

// ─── JSON-LD builders ──────────────────────────────────────────────────
export function faqPageJsonLd(faqs: FaqItem[]) {
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

export function softwareAppJsonLd(name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web Browser",
    url: toCanonical(path),
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description,
  };
}

export function webPageJsonLd(name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: toCanonical(path),
    publisher: { "@type": "Organization", name: "AI World Hub", url: SITE },
  };
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: toCanonical(it.path),
    })),
  };
}

export function articleJsonLd(title: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    mainEntityOfPage: toCanonical(path),
    url: toCanonical(path),
    publisher: { "@type": "Organization", name: "AI World Hub", url: SITE },
  };
}

// ─── Hook ──────────────────────────────────────────────────────────────
export function useJsonLd(blocks: object[] | null, deps: readonly unknown[]) {
  useEffect(() => {
    document
      .querySelectorAll('script[data-route-jsonld="true"]')
      .forEach((el) => el.remove());
    if (!blocks) return;
    for (const block of blocks) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.routeJsonld = "true";
      script.textContent = JSON.stringify(block);
      document.head.appendChild(script);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
