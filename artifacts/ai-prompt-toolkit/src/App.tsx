import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Braces,
  CalendarDays,
  FileJson2,
  Mail,
  RefreshCcw,
  SendHorizontal,
  ShieldCheck,
  Sigma,
  Sparkles,
  WandSparkles,
  type LucideIcon,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { BrowserRouter, Link, NavLink, Route, Routes, useParams } from "react-router-dom";
import {
  cleanPrompt,
  estimateTokens,
  extractPromptVariables,
  formatPrompt,
  generateJsonSchema,
  validateJsonWithSchema,
} from "./lib/toolkit";
import { BLOG_POSTS, type BlogPost, getBlogPostBySlug } from "./data/blogPosts";
import HeroSection from "./components/HeroSection";
import PromptOptimizer from "./components/PromptOptimizer";
import ToolCard from "./components/ToolCard";
import BlogCard from "./components/BlogCard";
import AdsterraAd from "./components/AdsterraAd";
import AdsterraSlot from "./components/AdsterraSlot";

type ThemeMode = "light" | "dark";

type ToolMeta = {
  title: string;
  path: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  premium?: boolean;
  keyBenefits?: string[];
};

const TOOL_PAGES: ToolMeta[] = [
  {
    title: "Prompt Variable Extractor",
    path: "/tools/prompt-variable-extractor",
    description: "Extract variables like {name}, {{city}}, [tone], and :language from any prompt.",
    icon: Braces,
    accent: "from-blue-500/30 to-cyan-400/10",
    keyBenefits: ["Supports 4 variable syntaxes", "Alphabetically sorted results", "Zero server calls"],
  },
  {
    title: "JSON Schema Generator",
    path: "/tools/json-schema-generator",
    description: "Generate JSON Schema from a sample JSON object for consistent AI output structures.",
    icon: FileJson2,
    accent: "from-indigo-500/35 to-blue-500/10",
    keyBenefits: ["Draft 2020-12 compliant", "Nested object support", "Instant generation"],
  },
  {
    title: "JSON Validator",
    path: "/tools/json-validator",
    description: "Validate model responses against your schema using key type and required field checks.",
    icon: ShieldCheck,
    accent: "from-violet-500/35 to-indigo-400/10",
    keyBenefits: ["Type checking", "Required field validation", "Path-level error reporting"],
  },
  {
    title: "Prompt Formatter",
    path: "/tools/prompt-formatter",
    description: "Format long prompts into clean and numbered instruction blocks.",
    icon: WandSparkles,
    accent: "from-fuchsia-500/35 to-indigo-500/10",
    keyBenefits: ["Numbered sections", "Removes noise", "Copy-ready output"],
  },
  {
    title: "Prompt Cleaner",
    path: "/tools/prompt-cleaner",
    description: "Remove noise characters, extra spacing, and malformed line breaks from prompts.",
    icon: Sparkles,
    accent: "from-sky-500/35 to-indigo-500/10",
    keyBenefits: ["Strips control characters", "Normalizes whitespace", "Trims line breaks"],
  },
  {
    title: "Token Estimator",
    path: "/tools/token-estimator",
    description: "Estimate characters, words, and token usage before sending prompts to LLM APIs.",
    icon: Sigma,
    accent: "from-blue-600/35 to-violet-500/10",
    keyBenefits: ["~4 chars per token model", "Real-time counting", "Cost planning"],
  },
  {
    title: "Advanced Prompt Optimizer",
    path: "/tools/advanced-prompt-optimizer",
    description: "Polish and amplify prompts with premium optimization controls, copyflow, and high-fidelity results.",
    icon: Sparkles,
    accent: "from-indigo-500/35 to-cyan-400/10",
    premium: true,
    keyBenefits: ["Side-by-side compare", "12 optimization credits", "Premium AI signal"],
  },
];

const TOOL_BY_SLUG = new Map(TOOL_PAGES.map((tool) => [tool.path.split("/").pop()!, tool]));

function getBlogPostsForTool(toolSlug: string) {
  return BLOG_POSTS.filter((post) => post.relatedToolSlugs.includes(toolSlug));
}


function useSeo(title: string, description: string, keywords?: string) {
  const fallbackKeywords = "Free AI Prompt Tools, Prompt Engineering, Token Estimator, JSON Validator, AI Prompt Toolkit";
  useEffect(() => {
    document.title = `${title} | AI Prompt Toolkit`;
    const ensureMeta = (name: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!tag) { tag = document.createElement("meta"); tag.setAttribute("name", name); document.head.appendChild(tag); }
      return tag;
    };
    const ensurePropertyMeta = (property: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (!tag) { tag = document.createElement("meta"); tag.setAttribute("property", property); document.head.appendChild(tag); }
      return tag;
    };
    const ensureLink = (rel: string) => {
      let tag = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!tag) { tag = document.createElement("link"); tag.setAttribute("rel", rel); document.head.appendChild(tag); }
      return tag;
    };
    ensureMeta("description").setAttribute("content", description);
    ensureMeta("keywords").setAttribute("content", keywords ?? fallbackKeywords);
    ensureMeta("robots").setAttribute("content", "index, follow");
    ensureMeta("twitter:card").setAttribute("content", "summary_large_image");
    ensureMeta("twitter:title").setAttribute("content", title);
    ensureMeta("twitter:description").setAttribute("content", description);
    ensurePropertyMeta("og:title").setAttribute("content", title);
    ensurePropertyMeta("og:description").setAttribute("content", description);
    ensurePropertyMeta("og:type").setAttribute("content", "website");
    ensureLink("canonical").setAttribute("href", window.location.href);
  }, [title, description, keywords, fallbackKeywords]);
}

function ThemeToggle({ mode, onToggle }: { mode: ThemeMode; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-200 transition hover:bg-slate-800"
      aria-label="Toggle dark mode"
    >
      {mode === "dark" ? "Light" : "Dark"} Mode
    </button>
  );
}

function Layout({ mode, onToggle }: { mode: ThemeMode; onToggle: () => void }) {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center text-sm transition duration-300 hover:-translate-y-0.5 hover:text-blue-400 ${isActive ? "text-blue-400" : "text-slate-200"}`;

  return (
    <div className="min-h-screen bg-[#09090f] text-slate-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 lg:px-6">
          <Link to="/" className="text-lg font-bold tracking-tight text-white">
            AI Prompt Toolkit
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <NavLink to="/" end className={navLinkClass}>Home</NavLink>
            <NavLink to="/tools" className={navLinkClass}>Tools</NavLink>
            <NavLink to="/blog" className={navLinkClass}>Blog</NavLink>
            <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
            <ThemeToggle mode={mode} onToggle={onToggle} />
          </nav>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tools" element={<ToolsDirectoryPage />} />
          <Route path="/tools/prompt-variable-extractor" element={<PromptVariableExtractorPage />} />
          <Route path="/tools/json-schema-generator" element={<JsonSchemaGeneratorPage />} />
          <Route path="/tools/json-validator" element={<JsonValidatorPage />} />
          <Route path="/tools/prompt-formatter" element={<PromptFormatterPage />} />
          <Route
            path="/tools/advanced-prompt-optimizer"
            element={
              <ToolContainer
                title="Advanced Prompt Optimizer"
                description="Polish prompts with premium AI optimization, copy-ready results, and a high-end command center experience."
                toolSlug="advanced-prompt-optimizer"
                tool={TOOL_BY_SLUG.get("advanced-prompt-optimizer")!}
              >
                <PromptOptimizer />
              </ToolContainer>
            }
          />
          <Route path="/tools/prompt-cleaner" element={<PromptCleanerPage />} />
          <Route path="/tools/token-estimator" element={<TokenEstimatorPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPage />} />
          <Route path="/terms-of-service" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <footer className="border-t border-slate-800 py-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 text-sm text-slate-500 lg:px-6">
          <p>2026 AI Prompt Toolkit. Built for global AI teams.</p>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="hover:text-indigo-400">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-indigo-400">Terms</Link>
          </div>
        </div>
        <p className="mt-6 text-center text-xs uppercase tracking-[0.24em] text-slate-600">Built by Suraj</p>
      </footer>
    </div>
  );
}

function SectionShell({
  title, description, keywords, children,
}: {
  title: string; description: string; keywords?: string; children: ReactNode;
}) {
  useSeo(title, description, keywords);
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
      {children}
    </section>
  );
}

/* ─────────────────────────────────────────────
   STEP 2 — HOMEPAGE: Hero + Ad + single CTA
───────────────────────────────────────────── */
function HomePage() {
  useSeo(
    "Free AI Prompt Tools for Prompt Engineering",
    "AI Prompt Toolkit offers Free AI Prompt Tools including Token Estimator, JSON Validator, and prompt engineering workflows for global teams.",
    "Free AI Prompt Tools, Prompt Engineering, Token Estimator, JSON Schema Generator, JSON Validator",
  );

  return (
    <div className="bg-[#09090f] text-slate-200">
      <HeroSection />

      <AdsterraAd />

      {/* Single focused CTA section funnelling to /tools */}
      <section className="mx-auto max-w-6xl px-4 py-20 lg:px-6">
        <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-950/60 to-slate-950/80 p-12 text-center shadow-2xl shadow-indigo-500/10">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300/80">All tools in one place</p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Ready to engineer better AI prompts?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-400">
            7 free tools — variable extraction, JSON schema generation, validation, formatting, cleaning, token estimation, and advanced optimization. No sign-up required.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/tools"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/50"
            >
              Browse All Tools
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-4 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
            >
              Read Guides
            </Link>
          </div>

          {/* Trust points */}
          <div className="mt-10 flex flex-wrap justify-center gap-8 text-sm text-slate-400">
            {[
              "In-browser processing — your data stays private",
              "Instant results — no server round-trips",
              "25+ deep-dive blog guides",
            ].map((point) => (
              <div key={point} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STEP 3 — TOOLS DIRECTORY PAGE
   Tool grid + AdsterraSlot sidebar (no affiliate/sponsored blocks)
───────────────────────────────────────────── */
function ToolsDirectoryPage() {
  return (
    <SectionShell
      title="AI Tools Directory - Free AI Prompt Tools"
      description="Browse Free AI Prompt Tools for prompt engineering, including Token Estimator, Variable Extractor, JSON Schema Generator, and JSON Validator."
      keywords="Free AI Prompt Tools, Prompt Engineering, Token Estimator, Prompt Variable Extractor, JSON Validator"
    >
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300/80">
          Professional Toolkit
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-white">AI Prompt Toolkit</h1>
        <p className="max-w-3xl text-lg text-slate-400">
          Seven precision tools for prompt engineering teams. Format, validate, extract, and optimize — all in the browser.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_300px]">
        {/* Main: tool cards grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {TOOL_PAGES.map((tool) => (
            <ToolCard key={tool.path} tool={tool} />
          ))}
        </div>

        {/* Sidebar: real ad slots */}
        <aside className="flex flex-col gap-6">
          <AdsterraSlot variant="A" layout="desktop" />
          <AdsterraSlot variant="B" layout="desktop" />
        </aside>
      </div>
    </SectionShell>
  );
}

/* ─────────────────────────────────────────────
   STEPS 4, 5, 6 — TOOL CONTAINER
   Intro Card → Ad Banner → Tool Interface → Ad Section → Blog Grid
───────────────────────────────────────────── */
function ToolContainer({
  title, description, toolSlug, tool, children,
}: {
  title: string; description: string; toolSlug?: string; tool?: ToolMeta; children: ReactNode;
}) {
  const keywords = `${title}, Free AI Prompt Tools, Prompt Engineering, Token Estimator, JSON Validator`;
  const relatedBlogs = toolSlug ? getBlogPostsForTool(toolSlug) : [];

  useSeo(title, description, keywords);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 lg:px-6 space-y-10">

      {/* ── STEP 4: Tool Intro Card ── */}
      <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-950/60 to-slate-950/80 p-8 shadow-2xl shadow-indigo-500/10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {tool && (
            <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br ${tool.accent} border border-white/10`}>
              <tool.icon className="h-8 w-8 text-white" aria-hidden="true" />
            </div>
          )}
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/80">
                {tool?.premium ? "Premium Tool" : "Free Tool"}
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">{title}</h1>
            </div>
            <p className="max-w-2xl text-base leading-7 text-slate-400">{description}</p>
            {tool?.keyBenefits && (
              <div className="flex flex-wrap gap-3 pt-1">
                {tool.keyBenefits.map((benefit) => (
                  <span
                    key={benefit}
                    className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    {benefit}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── STEP 5: Ad Banner between intro and tool interface ── */}
      <AdsterraSlot variant="A" layout="auto" />

      {/* ── Tool Interface ── */}
      <div className="rounded-[24px] border border-white/10 bg-slate-950/80 p-6 shadow-xl">
        <div className="space-y-4">{children}</div>
      </div>

      {/* ── STEP 5: Ad Section below tool interface ── */}
      <AdsterraSlot variant="B" layout="auto" />

      {/* ── STEP 6: Related blog posts as BlogCard grid ── */}
      {relatedBlogs.length > 0 && (
        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-400">Related reading</p>
              <h2 className="mt-1 text-2xl font-bold text-white">Deep-dive guides for this tool</h2>
            </div>
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition"
            >
              View all guides
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {relatedBlogs.slice(0, 4).map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}
    </section>
  );
}

/* ─────────────────────────────────────────────
   INDIVIDUAL TOOL PAGES
───────────────────────────────────────────── */
function PromptVariableExtractorPage() {
  const [input, setInput] = useState("Create a {{tone}} summary for {audience} in :language and include [region].");
  const variables = useMemo(() => extractPromptVariables(input), [input]);
  const tool = TOOL_BY_SLUG.get("prompt-variable-extractor")!;

  return (
    <ToolContainer
      title="Prompt Variable Extractor"
      toolSlug="prompt-variable-extractor"
      description="Extract prompt placeholders to standardize Prompt Engineering templates for fast and reliable AI automation."
      tool={tool}
    >
      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-300">Prompt Input</span>
        <textarea
          className="h-44 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Prompt text"
        />
      </label>
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="text-base font-semibold text-white">Detected Variables ({variables.length})</h2>
        <p className="mt-2 break-words text-sm text-slate-300">
          {variables.length ? variables.join(", ") : "No variables found."}
        </p>
      </div>
    </ToolContainer>
  );
}

function JsonSchemaGeneratorPage() {
  const [input, setInput] = useState('{\n  "name": "Ava",\n  "age": 32,\n  "active": true\n}');
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const tool = TOOL_BY_SLUG.get("json-schema-generator")!;

  const handleGenerate = () => {
    try { setResult(generateJsonSchema(input)); setError(""); }
    catch { setResult(""); setError("Invalid JSON input. Please provide a valid JSON object or array."); }
  };

  return (
    <ToolContainer
      title="JSON Schema Generator"
      toolSlug="json-schema-generator"
      description="Generate JSON Schema from sample data to enforce reliable Prompt Engineering output structure."
      tool={tool}
    >
      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-300">Sample JSON</span>
        <textarea
          className="h-56 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 font-mono text-sm text-slate-100 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Sample JSON"
        />
      </label>
      <button
        type="button"
        onClick={handleGenerate}
        className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
      >
        Generate Schema
      </button>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <pre className="overflow-auto rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">{result || "Schema output will appear here."}</pre>
    </ToolContainer>
  );
}

function JsonValidatorPage() {
  const [jsonInput, setJsonInput] = useState('{\n  "name": "Ava",\n  "age": 32,\n  "active": true\n}');
  const [schemaInput, setSchemaInput] = useState(
    '{\n  "type": "object",\n  "required": ["name", "age", "active"],\n  "properties": {\n    "name": { "type": "string" },\n    "age": { "type": "integer" },\n    "active": { "type": "boolean" }\n  }\n}',
  );
  const [messages, setMessages] = useState<string[]>([]);
  const [error, setError] = useState("");
  const tool = TOOL_BY_SLUG.get("json-validator")!;

  const runValidation = () => {
    try {
      const issues = validateJsonWithSchema(jsonInput, schemaInput);
      setMessages(issues.length ? issues : ["Valid JSON for the provided schema subset."]);
      setError("");
    } catch { setMessages([]); setError("Invalid JSON or schema syntax. Please check both inputs."); }
  };

  return (
    <ToolContainer
      title="JSON Validator"
      toolSlug="json-validator"
      description="Validate JSON against schema rules to keep Prompt Engineering pipelines accurate and production-ready."
      tool={tool}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-300">JSON Input</span>
          <textarea
            className="h-64 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 font-mono text-sm text-slate-100 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            aria-label="JSON input"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-300">Schema Input</span>
          <textarea
            className="h-64 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 font-mono text-sm text-slate-100 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
            value={schemaInput}
            onChange={(e) => setSchemaInput(e.target.value)}
            aria-label="Schema input"
          />
        </label>
      </div>
      <button
        type="button"
        onClick={runValidation}
        className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
      >
        Validate JSON
      </button>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <ul className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
        {messages.length ? messages.map((m) => <li key={m}>{m}</li>) : <li>Validation results appear here.</li>}
      </ul>
    </ToolContainer>
  );
}

function PromptFormatterPage() {
  const [input, setInput] = useState("role: expert analyst\nobjective: summarize quarterly risks\noutput: bullet summary");
  const output = useMemo(() => formatPrompt(input), [input]);
  const tool = TOOL_BY_SLUG.get("prompt-formatter")!;

  return (
    <ToolContainer
      title="Prompt Formatter"
      toolSlug="prompt-formatter"
      description="Format messy prompt notes into a clear structure for stronger Prompt Engineering consistency."
      tool={tool}
    >
      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-300">Input</span>
        <textarea
          className="h-48 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Prompt formatter input"
        />
      </label>
      <div>
        <p className="mb-2 text-sm font-medium text-slate-300">Formatted Output</p>
        <pre className="overflow-auto rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">{output}</pre>
      </div>
    </ToolContainer>
  );
}

function PromptCleanerPage() {
  const [input, setInput] = useState("  Remove   extra   spaces\n\n\n and odd\tcharacters before sending.  ");
  const output = useMemo(() => cleanPrompt(input), [input]);
  const tool = TOOL_BY_SLUG.get("prompt-cleaner")!;

  return (
    <ToolContainer
      title="Prompt Cleaner"
      toolSlug="prompt-cleaner"
      description="Clean noisy text and hidden characters to improve Prompt Engineering quality and response stability."
      tool={tool}
    >
      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-300">Input</span>
        <textarea
          className="h-48 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Prompt cleaner input"
        />
      </label>
      <div>
        <p className="mb-2 text-sm font-medium text-slate-300">Cleaned Output</p>
        <pre className="overflow-auto rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">{output}</pre>
      </div>
    </ToolContainer>
  );
}

function TokenEstimatorPage() {
  const [input, setInput] = useState("Estimate prompt costs before production deployment.");
  const stats = useMemo(() => estimateTokens(input), [input]);
  const tool = TOOL_BY_SLUG.get("token-estimator")!;

  return (
    <ToolContainer
      title="Token Estimator"
      toolSlug="token-estimator"
      description="Token Estimator for Prompt Engineering teams to project token usage, budget impact, and context size."
      tool={tool}
    >
      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-300">Prompt Text</span>
        <textarea
          className="h-44 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Text for token estimation"
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Characters", value: stats.characters, color: "text-cyan-300" },
          { label: "Words", value: stats.words, color: "text-indigo-300" },
          { label: "Estimated Tokens", value: stats.estimatedTokens, color: "text-violet-300" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <h3 className="text-sm font-medium text-slate-400">{label}</h3>
            <p className={`mt-1 text-2xl font-bold ${color}`}>{value.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </ToolContainer>
  );
}

/* ─────────────────────────────────────────────
   BLOG PAGES
───────────────────────────────────────────── */
function BlogPage() {
  return (
    <SectionShell
      title="Prompt Engineering Blog - Free AI Prompt Tools"
      description="Prompt Engineering blog with practical guides on Token Estimator usage, schema validation, and Free AI Prompt Tools workflows."
      keywords="Prompt Engineering Blog, Free AI Prompt Tools, Token Estimator, AI Reliability, JSON Validator"
    >
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/80">Editorial</p>
        <h1 className="text-4xl font-bold tracking-tight text-white">Blog</h1>
        <p className="max-w-3xl text-base text-slate-400">
          Premium editorial insights on prompt systems, AI reliability engineering, and cost-efficient model deployment.
        </p>
      </div>
      <div className="mt-10 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
        {BLOG_POSTS.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </SectionShell>
  );
}

/* ─────────────────────────────────────────────
   STEP 7 — BLOG POST PAGE
   Desktop ad top, mobile ad mid-article,
   second ad after FAQ, related tools sidebar
───────────────────────────────────────────── */
function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPostBySlug(slug) : undefined;

  if (!post) return <NotFoundPage />;

  const relatedTools = post.relatedToolSlugs
    .map((s) => TOOL_BY_SLUG.get(s))
    .filter(Boolean) as ToolMeta[];

  const postIndex = BLOG_POSTS.findIndex((p) => p.slug === post.slug);
  const variant: "A" | "B" = postIndex % 2 === 0 ? "A" : "B";
  const insertAfterIndex = Math.floor(post.contentSections.length / 2);

  useSeo(post.seoTitle, post.metaDescription, `${post.category}, Prompt Engineering, AI Prompt Toolkit`);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">{post.category}</p>
          <h1 className="text-4xl font-bold tracking-tight text-white">{post.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
            <span>{post.date}</span>
            <span>{post.readTime}</span>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[2fr_360px]">
          <article className="space-y-8">
            {/* Ad at top of article — auto-picks desktop/mobile size */}
            <AdsterraSlot variant="A" layout="auto" />

            {/* Article sections with mid-article ad on mobile */}
            {(() => {
              const sections: JSX.Element[] = [];
              post.contentSections.forEach((section, idx) => {
                sections.push(
                  <section key={section.heading} className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">{section.heading}</h2>
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="text-base leading-8 text-slate-300">{paragraph}</p>
                    ))}
                  </section>,
                );
                if (idx === insertAfterIndex - 1) {
                  sections.push(
                    <AdsterraSlot key={`ad-mid-${idx}`} variant={variant} layout="auto" />,
                  );
                }
              });
              return sections;
            })()}

            {/* FAQ section */}
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

            {/* Second ad after FAQ — auto-picks size for mobile/desktop */}
            <AdsterraSlot variant={variant === "A" ? "B" : "A"} layout="auto" />
          </article>

          {/* Sidebar: related tools + back to blog */}
          <aside className="space-y-6 rounded-[20px] border border-slate-800 bg-slate-900/60 p-6 self-start sticky top-20">
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
                className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition"
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

/* ─────────────────────────────────────────────
   CONTACT / LEGAL / 404
───────────────────────────────────────────── */
function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const onChangeField = (field: "name" | "email" | "message", value: string) =>
    setFormData((c) => ({ ...c, [field]: value }));
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); setSubmitted(true); };

  return (
    <SectionShell
      title="Contact - Prompt Engineering Toolkit"
      description="Contact AI Prompt Toolkit for Prompt Engineering partnerships, support, and Free AI Prompt Tools collaboration."
    >
      <h1 className="text-3xl font-bold tracking-tight text-white">Contact</h1>
      <p className="mt-3 max-w-2xl text-slate-400">
        Connect with the AI Prompt Toolkit team for enterprise onboarding, partnerships, and technical collaboration.
      </p>
      <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="rounded-2xl border border-slate-800 bg-slate-900/70 p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">Direct Contact</p>
          <a href="mailto:nightfury2464@gmail.com" className="mt-4 inline-flex items-center gap-2 text-lg font-semibold text-white transition hover:text-blue-400">
            <Mail className="h-5 w-5" />
            nightfury2464@gmail.com
          </a>
          <p className="mt-4 text-sm text-slate-400">Support Window: Monday–Friday, UTC business hours.</p>
        </aside>
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-7">
          <div className="grid gap-5">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-300">Name</span>
              <input value={formData.name} onChange={(e) => onChangeField("name", e.target.value)} required
                className="w-full rounded-lg border border-slate-700 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-blue-500" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-300">Work Email</span>
              <input type="email" value={formData.email} onChange={(e) => onChangeField("email", e.target.value)} required
                className="w-full rounded-lg border border-slate-700 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-blue-500" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-300">Message</span>
              <textarea value={formData.message} onChange={(e) => onChangeField("message", e.target.value)} required rows={5}
                className="w-full rounded-lg border border-slate-700 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-blue-500" />
            </label>
            <button type="submit" className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500">
              Send Message <SendHorizontal className="h-4 w-4" />
            </button>
            {submitted && <p className="text-sm text-emerald-400">Thanks. Your message has been captured.</p>}
          </div>
        </form>
      </div>
    </SectionShell>
  );
}

function PrivacyPage() {
  return (
    <SectionShell title="Privacy Policy" description="Privacy policy for AI Prompt Toolkit.">
      <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
      <p className="mt-3 max-w-4xl text-slate-400">This demo policy states that input text is processed in-browser and should not include sensitive personal or regulated data.</p>
    </SectionShell>
  );
}

function TermsPage() {
  return (
    <SectionShell title="Terms of Service" description="Terms and usage conditions for the AI Prompt Toolkit.">
      <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
      <p className="mt-3 max-w-4xl text-slate-400">This toolkit is provided as-is for educational and operational prototyping. Teams should review generated output before production use.</p>
    </SectionShell>
  );
}

function NotFoundPage() {
  return (
    <SectionShell title="Page Not Found" description="The requested page could not be found.">
      <h1 className="text-3xl font-bold text-white">404 — Page Not Found</h1>
      <p className="mt-3 text-slate-400">Use the navigation to return to the AI Prompt Toolkit pages.</p>
    </SectionShell>
  );
}

/* ─────────────────────────────────────────────
   ROOT
───────────────────────────────────────────── */
export default function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem("theme-mode");
    return stored === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", themeMode === "dark");
    localStorage.setItem("theme-mode", themeMode);
  }, [themeMode]);

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL?.replace(/\/$/, "") || ""}>
      <Layout mode={themeMode} onToggle={() => setThemeMode((c) => (c === "dark" ? "light" : "dark"))} />
    </BrowserRouter>
  );
}
