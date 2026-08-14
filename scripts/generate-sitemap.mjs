/**
 * generate-sitemap.mjs — regenerates public/sitemap.xml on every build from
 * the canonical route list (static + programmatic), so new optimized pages are
 * instantly reflected. Runs BEFORE the sitemap validator gate in `npm run build`.
 */
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { ALL_ROUTES, toCanonical } from "./seo-routes.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LAST_MOD = new Date().toISOString().slice(0, 10);

const escapeXml = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const lines = ['<?xml version="1.0" encoding="UTF-8"?>'];
lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
for (const route of ALL_ROUTES) {
  lines.push("  <url>");
  lines.push(`    <loc>${escapeXml(toCanonical(route.path))}</loc>`);
  lines.push(`    <lastmod>${LAST_MOD}</lastmod>`);
  lines.push(`    <changefreq>${route.changefreq ?? "weekly"}</changefreq>`);
  lines.push(`    <priority>${route.priority ?? 0.7}</priority>`);
  lines.push("  </url>");
}
lines.push("</urlset>");

const out = join(ROOT, "public", "sitemap.xml");
const distOut = join(ROOT, "dist", "public", "sitemap.xml");
writeFileSync(out, lines.join("\n") + "\n");
writeFileSync(distOut, lines.join("\n") + "\n");
console.log(`✅ Regenerated ${out} — ${ALL_ROUTES.length} URLs (${Buffer.byteLength(lines.join("\n"), "utf8")} bytes)`);
console.log(`✅ Synced ${distOut}`);
