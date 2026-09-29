/**
 * Prerender body — real, crawlable HTML for <div id="root"> on every route.
 *
 * The React app mounts with createRoot(), which replaces whatever is inside
 * #root, so this markup is purely a first-paint / crawler fallback: search
 * engines and reviewers that read raw HTML (or render slowly) see the same
 * headings and copy the visitor sees once the app loads. Nothing here is
 * hidden from users — it is visible until React takes over.
 */
import { toCanonical, toolNameFromTitle, toolFaq } from "./seo-routes.mjs";
import { getBlogPosts } from "./blog-data.mjs";

const esc = (v) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const WRAP_STYLE =
  "max-width:56rem;margin:0 auto;padding:6rem 1.25rem 4rem;color:#cbd5e1;" +
  "font:16px/1.7 system-ui,-apple-system,Segoe UI,Roboto,sans-serif";
const H_STYLE = "color:#fff;line-height:1.25";
const A_STYLE = "color:#22d3ee";

const NAV_LINKS = [
  ["/", "Home"],
  ["/tools", "AI Prompt Tools"],
  ["/prompts", "Prompt Library"],
  ["/blog", "Blog"],
  ["/about", "About"],
  ["/contact", "Contact"],
  ["/privacy-policy", "Privacy Policy"],
];

const link = (href, text) => `<a href="${esc(href)}" style="${A_STYLE}">${esc(text)}</a>`;

const footerNav = () =>
  `<nav aria-label="Site"><p>${NAV_LINKS.map(([h, t]) => link(h, t)).join(" · ")}</p></nav>`;

const faqHtml = (faqs) =>
  faqs && faqs.length
    ? `<section><h2 style="${H_STYLE}">Frequently asked questions</h2>` +
      faqs
        .map((f) => `<h3 style="${H_STYLE}">${esc(f.question)}</h3><p>${esc(f.answer)}</p>`)
        .join("") +
      `</section>`
    : "";

const wrap = (inner) =>
  `<div id="prerender-content" style="${WRAP_STYLE}"><main>${inner}</main>${footerNav()}</div>`;

let blogBySlug = null;

export function bodyForRoute(route, extras = {}) {
  const title = esc(route.title.replace(/\s*\|\s*AI World Hub\s*$/, ""));
  const desc = esc(route.desc);

  if (route.type === "programmatic") {
    const more = extras.programmaticExtra ? extras.programmaticExtra(route) : "";
    return wrap(
      `<p><small>${link("/prompts", "Prompt Library")} › ${link(`/prompts/${route.roleSlug}`, route.roleTitle)}</small></p>` +
        `<h1 style="${H_STYLE}">${esc(route.taskTitle)} Prompt for ${esc(route.roleTitle)}</h1>` +
        `<p>${desc}</p>` +
        `<h2 style="${H_STYLE}">The prompt template</h2>` +
        `<pre style="white-space:pre-wrap;background:#0f172a;border:1px solid #1e293b;border-radius:12px;padding:1rem">${esc(route.prompt)}</pre>` +
        more +
        faqHtml(route.faq),
    );
  }

  if (route.type === "blog") {
    blogBySlug ??= new Map(getBlogPosts().map((p) => [p.slug, p]));
    const post = blogBySlug.get(route.path.replace(/^\/blog\//, ""));
    if (post && post.sections.length) {
      return wrap(
        `<p><small>${link("/blog", "Blog")} › ${esc(post.category)} · ${esc(post.date)} · ${esc(post.readTime)}</small></p>` +
          `<article><h1 style="${H_STYLE}">${esc(post.title)}</h1>` +
          (post.excerpt ? `<p><em>${esc(post.excerpt)}</em></p>` : "") +
          post.sections
            .map(
              (s) =>
                `<h2 style="${H_STYLE}">${esc(s.heading)}</h2>` +
                (s.paragraphs || []).map((para) => `<p>${esc(para)}</p>`).join(""),
            )
            .join("") +
          `</article>` +
          faqHtml(post.faq),
      );
    }
  }

  if (route.type === "tool") {
    const name = toolNameFromTitle(route.title);
    return wrap(
      `<h1 style="${H_STYLE}">${esc(name)}</h1><p>${desc}</p>` +
        `<p>This tool runs entirely in your browser. Nothing you type is sent to a server.</p>` +
        faqHtml(toolFaq(name, route.desc)),
    );
  }

  return wrap(`<h1 style="${H_STYLE}">${title}</h1><p>${desc}</p>`);
}
