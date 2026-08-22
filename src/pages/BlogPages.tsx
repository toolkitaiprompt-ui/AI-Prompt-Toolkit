import * as React from "react";
import { useMemo, useState, type ReactElement } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowUpRight, Search } from "lucide-react";
import SectionShell from "../components/SectionShell";
import AdBanner from "../components/AdBanner";
import BlogCard from "../components/BlogCard";
import { BLOG_POSTS, getBlogPostBySlug } from "../data/blogPosts";
import { getRelatedBlogPosts, getRolesForBlogCategory } from "../lib/contentHub";
import useSeo from "../hooks/useSeo";
import { articleJsonLd, faqPageJsonLd, useJsonLd } from "../lib/structuredData";
import { TOOL_BY_SLUG, type ToolMeta } from "../data/tools";
import { NotFoundPage } from "./StaticPages";

// Renders paragraphs with lightweight inline links: [text](url)
function renderInlineLinks(text: string): React.ReactNode[] {
  const parts = text.split(/\[([^\]]+)\]\(([^)]+)\)/g);
  const nodes: React.ReactNode[] = [];
  for (let i = 0; i < parts.length; i++) {
    if (i % 3 === 0) {
      if (parts[i]) nodes.push(parts[i]);
    } else {
      nodes.push(
        <a
          key={i}
          href={parts[i + 1]}
          className="font-medium text-amber-400 underline decoration-amber-400/40 underline-offset-2 transition hover:text-amber-300"
        >
          {parts[i]}
        </a>,
      );
      i++; // skip the url part
    }
  }
  return nodes;
}

export function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = useMemo(() => {
    const cats = new Set(BLOG_POSTS.map((p) => p.category));
    return ["All", ...Array.from(cats).sort()];
  }, []);

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesCategory = activeCategory === "All" || post.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;
      const matchesSearch =
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q) ||
        post.slug.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  return (
    <SectionShell
      title="ChatGPT Prompts & Prompt Engineering Blog | AI World Hub"
      description="Free ChatGPT prompts, prompt engineering guides, and AI tool reviews. Learn to write better prompts and boost productivity with practical tutorials."
      keywords="ChatGPT Prompts, Prompt Engineering, Best AI Tools, Free AI Tools, AI Tools Directory"
      hideTopAd
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-400/80">Editorial</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Blog</h1>
          <p className="max-w-3xl text-base text-slate-400">
            Premium editorial insights on prompt systems, AI reliability engineering, and cost-efficient model deployment. {BLOG_POSTS.length} guides and growing.
          </p>
        </div>

        {/* Search + Filter — #13 fix */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides — e.g. ChatGPT, JSON, token..."
              aria-label="Search blog guides"
              className="w-full rounded-full border border-slate-700/70 bg-slate-900/70 py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 outline-none transition focus:border-amber-400/40 focus:ring-2 focus:ring-amber-400/10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-800 px-2 py-0.5 text-[11px] text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-300">{filteredPosts.length}</span> of {BLOG_POSTS.length} posts
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                activeCategory === cat
                  ? "border-amber-400/40 bg-amber-500/10 text-amber-300"
                  : "border-slate-700/60 bg-slate-900/40 text-slate-400 hover:border-slate-600 hover:text-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredPosts.length > 0 ? (
        <div className="mt-10 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {filteredPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="mt-16 rounded-[20px] border border-dashed border-slate-700/60 bg-slate-900/30 p-12 text-center">
          <p className="text-lg font-semibold text-white">No guides found</p>
          <p className="mt-2 text-sm text-slate-400">
            No results for "<span className="text-slate-200">{searchQuery}</span>"{activeCategory !== "All" ? ` in ${activeCategory}` : ""}. Try a different keyword or category.
          </p>
          <button
            onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
            className="mt-5 rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-black hover:bg-amber-400"
          >
            Reset filters
          </button>
        </div>
      )}

    </SectionShell>
  );
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPostBySlug(slug) : undefined;

  useSeo(
    post?.seoTitle ?? "Page Not Found",
    post?.metaDescription ?? "The requested page could not be found.",
    `${post?.category ?? "404"}, Prompt Engineering, AI World Hub`,
  );

  useJsonLd(
    post
      ? [
          articleJsonLd(post.title, post.metaDescription, `/blog/${post.slug}`),
          faqPageJsonLd(post.faq),
        ]
      : null,
    [post?.slug],
  );

  if (!post) return <NotFoundPage />;

  const relatedTools = post.relatedToolSlugs
    .map((s) => {
      const tool = TOOL_BY_SLUG.get(s);
      if (!tool) console.warn(`Related tool not found: ${s}`);
      return tool;
    })
    .filter(Boolean) as ToolMeta[];

  return (
    <section className="site-container section-md">
      <div className="mb-8">
        <AdBanner network="custom" />
      </div>
      <div className="space-y-5 sm:space-y-6">
        <div className="space-y-2 sm:space-y-3">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">{post.category}</p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span>{post.date}</span>
            <span aria-hidden="true">·</span>
            <span>{post.readTime}</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-400/80">{post.category}</span>
          </div>

          {/* Social share — free traffic when readers share */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Share:</span>
            {[
              { label: "X", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent("https://aiworldhub.site/blog/" + post.slug)}` },
              { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://aiworldhub.site/blog/" + post.slug)}` },
              { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(post.title + " " + "https://aiworldhub.site/blog/" + post.slug)}` },
              { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://aiworldhub.site/blog/" + post.slug)}` },
            ].map((soc) => (
              <a
                key={soc.label}
                href={soc.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 transition hover:border-amber-400/40 hover:text-amber-300"
              >
                {soc.label}
              </a>
            ))}
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[2fr_360px]">
          <article className="space-y-8">


            {(() => {
              const sections: ReactElement[] = [];
              post.contentSections.forEach((section, idx) => {
                sections.push(
                  <section key={section.heading} className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">{section.heading}</h2>
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="text-base leading-8 text-slate-300">{renderInlineLinks(paragraph)}</p>
                    ))}
                  </section>,
                );

              });
              return sections;
            })()}

            {/* In-content ad (best CTR position) */}
            <div className="my-4">
              <AdBanner size="rectangle" />
            </div>

            <section className="rounded-[20px] border border-slate-800 bg-slate-950/50 p-6">
              <h2 className="text-2xl font-semibold text-white">Frequently asked questions</h2>
              <div className="mt-4 space-y-4">
                {post.faq.map((item) => (
                  <div key={item.question} className="space-y-2">
                    <p className="font-semibold text-white">{item.question}</p>
                    <p className="text-sm leading-7 text-slate-300">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA — internal links to core tools */}
            <section className="rounded-[20px] border border-amber-500/20 bg-slate-950/50 p-6">
              {post.cta ? (
                <>
                <Link
                  to={post.cta.link}
                  className="block text-base font-semibold leading-8 text-white transition hover:text-amber-300"
                >
                  {post.cta.text}
                </Link>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    to="/tools/prompt-chain-builder"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
                  >
                    Build multi-step workflows
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
                </>
              ) : (
                <>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-400/80">Free tools</p>
              <h2 className="mt-1 text-xl font-bold text-white">Put these prompts to work</h2>
              <p className="mt-2 text-sm leading-7 text-slate-400">
                Run your prompts through the free Advanced Prompt Optimizer to add role, tone, and format in one
                click — or break big tasks into steps with the Prompt Chain Builder.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to="/tools/advanced-prompt-optimizer"
                  className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-400"
                >
                  Try the free Prompt Optimizer
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/tools/prompt-chain-builder"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
                >
                  Build multi-step workflows
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
                </>
              )}
            </section>

            {/* Related posts — internal linking for SEO + session depth */}
            {(() => {
              const related = getRelatedBlogPosts(post, 4);
              return (
                <section className="rounded-[20px] border border-slate-800 bg-slate-950/50 p-6">
                  <h2 className="text-xl font-semibold text-white">More Guides You Might Like</h2>
                  <ul className="mt-4 space-y-3">
                    {related.map((rp) => (
                      <li key={rp.slug}>
                        <Link to={`/blog/${rp.slug}`} className="group flex items-start justify-between gap-3 text-sm text-slate-300 transition hover:text-amber-300">
                          <span>{rp.title}</span>
                          <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-500 group-hover:text-amber-400" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })()}

          </article>

          <aside className="space-y-6 rounded-[20px] border border-slate-800 bg-slate-900/60 p-6 self-start lg:sticky lg:top-20">
            <div>
              <h2 className="text-lg font-semibold text-white">Related tools</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {relatedTools.map((tool) => (
                  <li key={tool.path}>
                    <Link
                      to={tool.path}
                      className="flex items-center gap-2 font-medium text-blue-400 hover:text-blue-300 transition"
                    >
                      <tool.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {tool.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-slate-800 pt-4">
              <h2 className="text-base font-semibold text-white">Related prompt collections</h2>
              <ul className="mt-3 space-y-2.5 text-sm">
                {getRolesForBlogCategory(post.category, 3).map((role) => (
                  <li key={role.slug}>
                    <Link
                      to={role.path}
                      className="group flex items-center justify-between gap-3 text-slate-300 transition hover:text-amber-300"
                    >
                      <span>{role.title}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-slate-500 group-hover:text-amber-400" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-slate-800 pt-4">
              <h2 className="text-base font-semibold text-white">Back to blog</h2>
              <Link
                to="/blog"
                className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-amber-400 hover:text-amber-300 transition"
              >
                Browse all guides
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
      <div className="mt-10">
        <AdBanner network="custom" />
      </div>
    </section>
  );
}
