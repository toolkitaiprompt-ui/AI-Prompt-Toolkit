/**
 * Prerender Script — Static HTML generation for SEO
 *
 * Generates a unique index.html for EVERY route (static + programmatic) with:
 * - Keyword-rich titles (under 60 chars)
 * - Optimized meta descriptions (under 160 chars)
 * - Correct canonical URLs
 * - Open Graph + Twitter Card tags
 * - hreflang tags (en, en-US, en-GB, en-IN, x-default)
 * - Per-route JSON-LD: SoftwareApplication+FAQPage for tools,
 *   WebPage+FAQPage+BreadcrumbList for programmatic prompt pages,
 *   Article+FAQPage for blog posts
 *
 * Route list and schema builders come from scripts/seo-routes.mjs (the single
 * source of truth shared with the sitemap + RSS generators), so the static
 * prerender, sitemap.xml, and rss.xml can never drift apart.
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { ALL_ROUTES, SITE, toCanonical, jsonLdForRoute, faqJsonLd } from "./scripts/seo-routes.mjs";
import { getBlogFaqMap } from "./scripts/blog-data.mjs";

const OUT_DIR = join(process.cwd(), "dist", "public");
const TEMPLATE = readFileSync(join(OUT_DIR, "index.html"), "utf-8");
const blogFaq = getBlogFaqMap();

// ─── HTML generation with hreflang & SEO ────────────────────────────────────
let count = 0;

for (const route of ALL_ROUTES) {
  const canonicalUrl = toCanonical(route.path);

  // Per-route structured data (tools, programmatic pages, blog posts)
  const jsonLdBlocks = jsonLdForRoute(route) ?? [];
  if (route.type === "blog") {
    const faqs = blogFaq.get(route.path.replace(/^\/blog\//, ""));
    if (faqs && faqs.length) jsonLdBlocks.push(faqJsonLd(faqs));
  }

  // Hreflang tags for international SEO (#10 fix)
  const hreflangTags = [
    `<link rel="alternate" hreflang="en" href="${canonicalUrl}" />`,
    `<link rel="alternate" hreflang="en-US" href="${canonicalUrl}" />`,
    `<link rel="alternate" hreflang="en-GB" href="${canonicalUrl}" />`,
    `<link rel="alternate" hreflang="en-IN" href="${canonicalUrl}" />`,
    `<link rel="alternate" hreflang="x-default" href="${canonicalUrl}" />`,
  ].join("\n    ");

  let html = TEMPLATE
    .replace(/<title>[^<]*<\/title>/, `<title>${route.title}</title>`)
    .replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${route.desc}"`)
    .replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${canonicalUrl}"`)
    .replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${route.title}"`)
    .replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${route.desc}"`)
    .replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${canonicalUrl}"`)
    .replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${route.title}"`)
    .replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${route.desc}"`);

  // Blog pages advertise og:type=article for richer social sharing
  if (route.type === "blog") {
    html = html.replace(
      '<meta property="og:type" content="website"',
      '<meta property="og:type" content="article"',
    );
  }

  // Inject hreflang + per-route JSON-LD before </head>
  const jsonLdHtml = jsonLdBlocks.length
    ? `${jsonLdBlocks
        .map(
          (block) =>
            `    <script type="application/ld+json" data-route-jsonld="true">\n${JSON.stringify(block, null, 4)}\n    </script>`,
        )
        .join("\n")}\n`
    : "";
  if (html.includes('hreflang=')) {
    html = html.replace(/<link rel="alternate" hreflang="[^"]*" href="[^"]*" \/>/g, "");
  }
  if (html.includes("</head>")) {
    html = html.replace("</head>", `    ${hreflangTags}\n${jsonLdHtml}  </head>`);
  } else {
    html = html.replace('<link rel="sitemap"', `${hreflangTags}\n    <link rel="sitemap"`);
  }

  // Write to dist/public/{path}/index.html
  const outPath = route.path === "/" ? OUT_DIR : join(OUT_DIR, route.path);
  mkdirSync(outPath, { recursive: true });
  writeFileSync(join(outPath, "index.html"), html);
  count++;
}

console.log(`✅ Prerendered ${count} pages with unique SEO tags + hreflang + JSON-LD.`);
console.log(`📋 Total routes: ${ALL_ROUTES.length}`);
console.log(`🌐 Hreflang: en, en-US, en-GB, en-IN, x-default added to all pages`);
