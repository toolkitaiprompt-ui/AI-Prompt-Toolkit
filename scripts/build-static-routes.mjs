/**
 * Builds scripts/static-routes.mjs — the canonical, single-source route list
 * for every non-programmatic page (home, tools, blog, roles, static pages).
 *
 * Provenance tool: merges the hand-maintained SEO routes in prerender.mjs with
 * the priority/changefreq values encoded in public/sitemap.xml and emits a
 * generated module that prerender.mjs, generate-sitemap.mjs, and
 * generate-rss.mjs all import. Regenerate whenever prerender routes or the
 * sitemap priorities change:
 *
 *   node scripts/build-static-routes.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { XMLParser } from "fast-xml-parser";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const PRERENDER = readFileSync(join(ROOT, "prerender.mjs"), "utf8");
const SITEMAP_XML = readFileSync(join(ROOT, "public", "sitemap.xml"), "utf8");

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

const marker = "const routes = [";
const start = PRERENDER.indexOf(marker);
if (start < 0) throw new Error("routes array not found in prerender.mjs");
const routesBlock = extractBalanced(PRERENDER, PRERENDER.indexOf("[", start), "[", "]");
const routes = Function(`"use strict"; return (${routesBlock});`)();

const parser = new XMLParser({ ignoreAttributes: false });
const doc = parser.parse(SITEMAP_XML);
const sitemap = new Map();
for (const entry of doc.urlset.url ?? []) {
  sitemap.set(String(entry.loc).trim(), entry);
}

const toLoc = (path) => (path === "/" ? "https://aiworldhub.site/" : `https://aiworldhub.site${path}/`);
const classify = (path) => {
  if (path === "/") return "home";
  if (path.startsWith("/tools/")) return "tool";
  if (path.startsWith("/blog/")) return "blog";
  if (path.startsWith("/prompts/")) return "role";
  return "page";
};

const missing = [];
const enriched = routes.map((r) => {
  const loc = toLoc(r.path);
  const entry = sitemap.get(loc);
  if (!entry) missing.push(r.path);
  return {
    path: r.path,
    title: r.title,
    desc: r.desc,
    type: classify(r.path),
    priority: entry?.priority ?? "0.7",
    changefreq: entry?.changefreq ?? "weekly",
  };
});

if (missing.length) {
  console.error(`⚠️ Routes missing from sitemap (add them before regenerating):\n  ${missing.join("\n  ")}`);
  process.exit(1);
}

const header = `/**
 * GENERATED FILE — do not hand-edit.
 * Source of truth: prerender.mjs route list + public/sitemap.xml priorities.
 * Regenerate with: node scripts/build-static-routes.mjs
 */
export const STATIC_ROUTES = `;
const body = JSON.stringify(enriched, null, 2) + ";\n";
writeFileSync(join(ROOT, "scripts", "static-routes.mjs"), header + body);
console.log(`✅ Wrote scripts/static-routes.mjs (${enriched.length} routes, parity with sitemap confirmed)`);
