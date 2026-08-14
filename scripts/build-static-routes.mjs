/**
 * Builds scripts/static-routes.mjs — the canonical, single-source route list
 * for every non-programmatic page (home, tools, blog, roles, static pages).
 *
 * The static route list is hand-curated (titles/descriptions live here), while
 * scripts/seo-routes.mjs combines it with programmatic /prompts/:role/:task
 * pages. This tool verifies parity against public/sitemap.xml and re-applies
 * the priority/changefreq values encoded there, then rewrites the file
 * idempotently. Run whenever routes or sitemap priorities change:
 *
 *   node scripts/build-static-routes.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { XMLParser } from "fast-xml-parser";
import { STATIC_ROUTES } from "./static-routes.mjs";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const SITEMAP_XML = readFileSync(join(ROOT, "public", "sitemap.xml"), "utf8");

const parser = new XMLParser({ ignoreAttributes: false });
const doc = parser.parse(SITEMAP_XML);
const sitemap = new Map();
for (const entry of doc.urlset.url ?? []) {
  sitemap.set(String(entry.loc).trim(), entry);
}

const toLoc = (path) => (path === "/" ? "https://aiworldhub.site/" : `https://aiworldhub.site${path}/`);

const missing = [];
const enriched = STATIC_ROUTES.map((r) => {
  const entry = sitemap.get(toLoc(r.path));
  if (!entry) missing.push(r.path);
  return {
    path: r.path,
    title: r.title,
    desc: r.desc,
    type: r.type,
    priority: entry?.priority ?? r.priority ?? 0.7,
    changefreq: entry?.changefreq ?? r.changefreq ?? "weekly",
  };
});

if (missing.length) {
  console.error(`⚠️ Static routes missing from sitemap (add them before regenerating):\n  ${missing.join("\n  ")}`);
  process.exit(1);
}

const header = `/**
 * Static routes — hand-curated page list (titles/descriptions live here).
 * Combined with programmatic /prompts/:role/:task routes in scripts/seo-routes.mjs.
 * Priorities/changefreq mirrored from public/sitemap.xml.
 * Rebuild with: node scripts/build-static-routes.mjs
 */
export const STATIC_ROUTES = `;
const body = JSON.stringify(enriched, null, 2) + ";\n";
writeFileSync(join(ROOT, "scripts", "static-routes.mjs"), header + body);
console.log(`✅ Wrote scripts/static-routes.mjs (${enriched.length} routes, parity with sitemap confirmed)`);
