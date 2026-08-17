import * as React from "react";
import { useMemo, useState, type ReactElement } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowUpRight, Search } from "lucide-react";
import SectionShell from "../components/SectionShell";
import AdBanner from "../components/AdBanner";
import BlogCard from "../components/BlogCard";
import { BLOG_POSTS, getBlogPostBySlug } from "../data/blogPosts";
import useSeo from "../hooks/useSeo";
import { articleJsonLd, faqPageJsonLd, useJsonLd } from "../lib/structuredData";
import { TOOL_BY_SLUG, type ToolMeta } from "../data/tools";
import { NotFoundPage } from "./StaticPages";

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
      title="ChatGPT Prompts & Prompt Engineering Blog"
      description="Free ChatGPT prompts, prompt engineering guides, and AI tool reviews. Learn how to write better prompts, use AI tools effectively, and boost productivity with practical tutorials."
      keywords="ChatGPT Prompts, Prompt Engineering, Best AI Tools, Free AI Tools, AI Tools Directory"
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
      <div className="space-y-5 sm:space-y-6">
        <div className="space-y-2 sm:space-y-3">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">{post.category}</p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span>{post.date}</span>
            <span aria-hidden="true">·</span>
            <span>{post.readTime}</span>
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
                      <p key={paragraph} className="text-base leading-8 text-slate-300">{paragraph}</p>
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
    </section>
  );
}
