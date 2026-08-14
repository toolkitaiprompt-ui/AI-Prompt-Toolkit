/**
 * generate-rss.mjs — writes public/rss.xml (RSS 2.0) covering the latest blog
 * posts and programmatic prompt pages. New SEO pages are published to the feed
 * automatically on every build, giving readers and aggregators instant access.
 */
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { ALL_ROUTES, toCanonical, SITE } from "./seo-routes.mjs";
import { getBlogPosts } from "./blog-data.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MAX_ITEMS = 40;

const escapeXml = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const toRfc2822 = (dateStr) => {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return new Date().toUTCString();
  return d.toUTCString();
};

const bySlug = new Map(getBlogPosts().map((p) => [p.slug, p]));

const items = [];

for (const [idx, route] of ALL_ROUTES.entries()) {
  if (route.type === "blog") {
    const post = bySlug.get(route.path.replace(/^\/blog\//, ""));
    items.push({
      title: post?.title || route.title,
      link: toCanonical(route.path),
      guid: toCanonical(route.path),
      description: post?.metaDescription || route.desc,
      pubDate: toRfc2822(post?.date || new Date().toISOString().slice(0, 10)),
      sort: Date.parse(post?.date) || 0,
      tiebreak: idx,
    });
  } else if (route.type === "programmatic") {
    items.push({
      title: route.title,
      link: toCanonical(route.path),
      guid: toCanonical(route.path),
      description: route.desc,
      pubDate: new Date().toUTCString(),
      sort: 0,
      tiebreak: idx,
    });
  }
}

items.sort((a, b) => b.sort - a.sort || a.tiebreak - b.tiebreak);
const selected = items.slice(0, MAX_ITEMS);

const lines = ['<?xml version="1.0" encoding="UTF-8"?>'];
lines.push('<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">');
lines.push("  <channel>");
lines.push("    <title>AI World Hub — Prompts, Blog & AI Tools</title>");
lines.push(`    <link>${SITE}/</link>`);
lines.push("    <description>Free ChatGPT prompts, prompt engineering guides, and programmatic prompt templates for every role and task.</description>");
lines.push("    <language>en</language>");
lines.push(`    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`);
lines.push(`    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />`);
for (const item of selected) {
  lines.push("    <item>");
  lines.push(`      <title>${escapeXml(item.title)}</title>`);
  lines.push(`      <link>${escapeXml(item.link)}</link>`);
  lines.push(`      <guid isPermaLink="true">${escapeXml(item.guid)}</guid>`);
  lines.push(`      <pubDate>${item.pubDate}</pubDate>`);
  lines.push(`      <description>${escapeXml(item.description)}</description>`);
  lines.push("    </item>");
}
lines.push("  </channel>");
lines.push("</rss>");

const out = join(ROOT, "public", "rss.xml");
writeFileSync(out, lines.join("\n") + "\n");
console.log(`✅ Regenerated ${out} — ${selected.length} items`);
