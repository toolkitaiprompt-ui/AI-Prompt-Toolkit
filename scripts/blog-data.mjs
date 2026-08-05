/**
 * Blog data for build-time tooling.
 *
 * blogPosts.ts is TypeScript (can't be imported directly by Node), so this
 * module extracts just the fields the SEO pipeline needs — slug, title,
 * metaDescription, date, and the FAQ arrays used for FAQPage rich snippets —
 * with a string-aware brace scanner that is safe against brackets and quotes
 * inside article body copy.
 */
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

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

function arrayRegion(src, constName) {
  const marker = `export const ${constName}`;
  const start = src.indexOf(marker);
  if (start < 0) throw new Error(`${constName} not found`);
  const eq = src.indexOf(" = ", start);
  let openIdx = eq + 3;
  while (/\s/.test(src[openIdx])) openIdx++;
  return extractBalanced(src, openIdx, "[", "]");
}

function parsePosts(source, constName = "BLOG_POSTS") {
  const region = arrayRegion(source, constName);
  const slugIdxs = [...region.matchAll(/\n\s*slug:\s*"([^"]+)"/g)].map((m) => ({
    slug: m[1],
    start: m.index,
  }));
  const posts = [];
  slugIdxs.forEach((s, i) => {
    const block = region.slice(s.start, i + 1 < slugIdxs.length ? slugIdxs[i + 1].start : region.length);
    const grab = (key) => {
      const m = block.match(new RegExp(`${key}:\\s*"((?:[^"\\\\]|\\\\.)*)"`));
      return m ? m[1] : "";
    };
    const faqStart = block.indexOf("faq:");
    let faq = [];
    if (faqStart >= 0) {
      const bracket = block.indexOf("[", faqStart);
      if (bracket >= 0) {
        try {
          faq = Function(`"use strict"; return (${extractBalanced(block, bracket, "[", "]")});`)();
        } catch {
          faq = [];
        }
      }
    }
    posts.push({
      slug: s.slug,
      title: grab("title"),
      seoTitle: grab("seoTitle"),
      metaDescription: grab("metaDescription"),
      date: grab("date"),
      faq,
    });
  });
  return posts;
}

let cached = null;

export function getBlogPosts() {
  if (cached) return cached;
  const base = readFileSync(join(ROOT, "src", "data", "blogPosts.ts"), "utf8");
  const extra = readFileSync(join(ROOT, "src", "data", "newBlogPosts.ts"), "utf8");
  const main = parsePosts(base, "BLOG_POSTS");
  const seoPosts = parsePosts(extra, "NEW_SEO_POSTS");
  cached = [...main, ...seoPosts];
  return cached;
}

export const getBlogFaqMap = () => {
  const map = new Map();
  for (const post of getBlogPosts()) {
    if (post.faq.length) map.set(post.slug, post.faq);
  }
  return map;
};
