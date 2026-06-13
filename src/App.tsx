import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Braces,
  CalendarDays,
  FileJson2,
  Mail,
  SendHorizontal,
  ShieldCheck,
  Sigma,
  Sparkles,
  WandSparkles,
  type LucideIcon,
} from "lucide-react";
import { BrowserRouter, Link, NavLink, Route, Routes } from "react-router-dom";
import {
  cleanPrompt,
  estimateTokens,
  extractPromptVariables,
  formatPrompt,
  generateJsonSchema,
  validateJsonWithSchema,
} from "./lib/toolkit";

type ThemeMode = "light" | "dark";

type ToolMeta = {
  title: string;
  path: string;
  description: string;
  icon: LucideIcon;
  accent: string;
};

const TOOL_PAGES: ToolMeta[] = [
  {
    title: "Prompt Variable Extractor",
    path: "/tools/prompt-variable-extractor",
    description: "Extract variables like {name}, {{city}}, [tone], and :language from any prompt.",
    icon: Braces,
    accent: "from-blue-500/30 to-cyan-400/10",
  },
  {
    title: "JSON Schema Generator",
    path: "/tools/json-schema-generator",
    description: "Generate JSON Schema from a sample JSON object for consistent AI output structures.",
    icon: FileJson2,
    accent: "from-indigo-500/35 to-blue-500/10",
  },
  {
    title: "JSON Validator",
    path: "/tools/json-validator",
    description: "Validate model responses against your schema using key type and required field checks.",
    icon: ShieldCheck,
    accent: "from-violet-500/35 to-indigo-400/10",
  },
  {
    title: "Prompt Formatter",
    path: "/tools/prompt-formatter",
    description: "Format long prompts into clean and numbered instruction blocks.",
    icon: WandSparkles,
    accent: "from-fuchsia-500/35 to-indigo-500/10",
  },
  {
    title: "Prompt Cleaner",
    path: "/tools/prompt-cleaner",
    description: "Remove noise characters, extra spacing, and malformed line breaks from prompts.",
    icon: Sparkles,
    accent: "from-sky-500/35 to-indigo-500/10",
  },
  {
    title: "Token Estimator",
    path: "/tools/token-estimator",
    description: "Estimate characters, words, and token usage before sending prompts to LLM APIs.",
    icon: Sigma,
    accent: "from-blue-600/35 to-violet-500/10",
  },
];

const BLOG_POSTS = [
  {
    title: "How Global Teams Standardize Prompt Templates Across Regions",
    excerpt:
      "A production framework for variable naming, locale-aware instructions, and reusable prompt skeletons across multilingual AI teams.",
    category: "Prompt Operations",
    date: "May 14, 2026",
    readTime: "7 min read",
  },
  {
    title: "Schema-First AI Output: Reducing Hallucinations with JSON Guardrails",
    excerpt:
      "Learn how schema generation and strict validation improve reliability, prevent malformed output, and simplify downstream automation.",
    category: "AI Reliability",
    date: "May 9, 2026",
    readTime: "6 min read",
  },
  {
    title: "Token Budgeting for Enterprise AI: Practical Cost Control Patterns",
    excerpt:
      "Use token estimation and prompt compression techniques to cut inference spend while preserving output quality at scale.",
    category: "Cost Engineering",
    date: "May 2, 2026",
    readTime: "5 min read",
  },
];

function ToolNavCard({ tool }: { tool: ToolMeta }) {
  const Icon = tool.icon;

  return (
    <motion.div whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 270, damping: 20 }}>
      <Link to={tool.path} className="group relative block overflow-hidden rounded-2xl p-[1px]">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/70 via-indigo-500/35 to-purple-500/70 opacity-0 blur-md transition duration-300 group-hover:opacity-100" />
        <div className="relative flex min-h-64 flex-col justify-between rounded-2xl border border-white/15 bg-gradient-to-br from-slate-950/95 via-slate-900/95 to-slate-950/95 p-7 backdrop-blur-xl">
          <div className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${tool.accent} opacity-70`} />
          <div className="space-y-4">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-blue-200">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-white">{tool.title}</h3>
            <p className="text-base leading-relaxed text-slate-300">{tool.description}</p>
          </div>

          <div className="mt-6 flex justify-end">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-300/35 bg-blue-500/10 px-3 py-1.5 text-sm font-semibold text-blue-100 transition group-hover:border-blue-200/60 group-hover:bg-blue-500/20">
              Try Tool
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function useSeo(title: string, description: string, keywords?: string) {
  const fallbackKeywords = "Free AI Prompt Tools, Prompt Engineering, Token Estimator, JSON Validator, AI Prompt Toolkit";

  useEffect(() => {
    document.title = `${title} | AI Prompt Toolkit`;

    const ensureMeta = (name: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      return tag;
    };

    const ensurePropertyMeta = (property: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      return tag;
    };

    const ensureLink = (rel: string) => {
      let tag = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!tag) {
        tag = document.createElement("link");
        tag.setAttribute("rel", rel);
        document.head.appendChild(tag);
      }
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

    // Site-wide default social preview images: @2x primary, 1x fallback, SVG fallback
    const primary2x = "https://ai-prompt-toolkit-31l.pages.dev/images/social-share@2x.png";
    const default1x = "https://ai-prompt-toolkit-31l.pages.dev/images/social-share.png";
    const fallbackSvg = "https://ai-prompt-toolkit-31l.pages.dev/images/social-share.svg";
    ensurePropertyMeta("og:image").setAttribute("content", primary2x);
    ensurePropertyMeta("og:image:width").setAttribute("content", "2400");
    ensurePropertyMeta("og:image:height").setAttribute("content", "1260");
    ensurePropertyMeta("og:image:alt").setAttribute("content", "AI Prompt Toolkit — Build reliable AI prompts, schemas, and validation workflows.");
    // Also provide a 1x PNG fallback
    const imgFallbackTag = document.createElement("meta");
    imgFallbackTag.setAttribute("property", "og:image");
    imgFallbackTag.setAttribute("content", default1x);
    document.head.appendChild(imgFallbackTag);
    // SVG secure URL fallback
    ensurePropertyMeta("og:image:secure_url").setAttribute("content", fallbackSvg);
    ensureMeta("twitter:image").setAttribute("content", primary2x);
    ensureMeta("twitter:image:alt").setAttribute("content", "AI Prompt Toolkit — Build reliable AI prompts, schemas, and validation workflows.");
  }, [title, description, keywords, fallbackKeywords]);
}

function ThemeToggle({ mode, onToggle }: { mode: ThemeMode; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
      aria-label="Toggle dark mode"
    >
      {mode === "dark" ? "Light" : "Dark"} Mode
    </button>
  );
}

function AdSlot({ label }: { label: string }) {
  return (
    <div className="w-full border border-dashed border-slate-400 px-4 py-3 text-center text-xs tracking-wide text-slate-500 dark:border-slate-600 dark:text-slate-400">
      {label} - Display Ad Slot
    </div>
  );
}

function Layout({ mode, onToggle }: { mode: ThemeMode; onToggle: () => void }) {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center text-sm transition duration-300 hover:-translate-y-0.5 hover:text-blue-400 ${isActive ? "text-blue-500" : "text-slate-700 dark:text-slate-200"}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[radial-gradient(circle_at_top,_#0f172a,_#020617_50%)] dark:text-slate-100">
      <header className="sticky top-0 z-50 border-b border-white/15 bg-white/75 backdrop-blur-xl dark:bg-slate-950/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 lg:px-6">
          <Link to="/" className="text-lg font-bold tracking-tight">
            AI Prompt Toolkit
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/tools" className={navLinkClass}>
              Tools
            </NavLink>
            <NavLink to="/blog" className={navLinkClass}>
              Blog
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
            <ThemeToggle mode={mode} onToggle={onToggle} />
          </nav>
        </div>
      </header>

      <AdSlot label="Header Banner" />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tools" element={<ToolsDirectoryPage />} />
          <Route path="/tools/prompt-variable-extractor" element={<PromptVariableExtractorPage />} />
          <Route path="/tools/json-schema-generator" element={<JsonSchemaGeneratorPage />} />
          <Route path="/tools/json-validator" element={<JsonValidatorPage />} />
          <Route path="/tools/prompt-formatter" element={<PromptFormatterPage />} />
          <Route path="/tools/prompt-cleaner" element={<PromptCleanerPage />} />
          <Route path="/tools/token-estimator" element={<TokenEstimatorPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPage />} />
          <Route path="/terms-of-service" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <footer className="border-t border-slate-200 py-10 dark:border-slate-800">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 text-sm text-slate-600 dark:text-slate-400 lg:px-6">
          <p>2026 AI Prompt Toolkit. Built for global AI teams.</p>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="hover:text-indigo-500">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-indigo-500">
              Terms
            </Link>
          </div>
        </div>
        <div className="mx-auto mt-4 max-w-6xl px-4 lg:px-6">
          <AdSlot label="Footer Banner" />
        </div>
        <p className="mt-6 text-center text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-500">Built by Suraj</p>
      </footer>
    </div>
  );
}

function SectionShell({
  title,
  description,
  keywords,
  children,
}: {
  title: string;
  description: string;
  keywords?: string;
  children: ReactNode;
}) {
  useSeo(title, description, keywords);
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
      {children}
    </section>
  );
}

function HomePage() {
  useSeo(
    "Free AI Prompt Tools for Prompt Engineering",
    "AI Prompt Toolkit offers Free AI Prompt Tools including Token Estimator, JSON Validator, and prompt engineering workflows for global teams.",
    "Free AI Prompt Tools, Prompt Engineering, Token Estimator, JSON Schema Generator, JSON Validator",
  );

  return (
    <div>
      <section className="relative isolate overflow-hidden">
        <img
          src="/images/prompt-toolkit-hero.jpg"
          alt="Global team collaborating on AI prompt and JSON workflows"
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-slate-950/70" />
        <div className="relative mx-auto flex min-h-[72vh] max-w-6xl items-center px-4 py-16 lg:px-6">
          <div className="max-w-3xl space-y-6 text-white">
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="text-xl font-semibold tracking-tight text-indigo-300"
            >
              AI Prompt Toolkit
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="text-4xl font-bold leading-tight sm:text-5xl"
            >
              Build reliable AI prompts, schemas, and validation workflows in one place.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="max-w-2xl text-base text-slate-200 sm:text-lg"
            >
              International-standard toolkit for teams shipping AI products across multilingual, multi-region, and regulated environments.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <Link
                to="/tools"
                className="rounded-md bg-indigo-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-400"
              >
                Explore Tools
              </Link>
              <Link
                to="/blog"
                className="rounded-md border border-white/50 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Read Blog
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 lg:px-6">
        <h2 className="text-2xl font-semibold">One toolkit. Six production tools.</h2>
        <p className="mt-2 max-w-3xl text-slate-600 dark:text-slate-300">
          Generate schemas, validate outputs, format prompts, and estimate token budget before deployment.
        </p>
        <div className="mt-10 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {TOOL_PAGES.map((tool) => (
            <ToolNavCard key={tool.path} tool={tool} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ToolsDirectoryPage() {
  return (
    <SectionShell
      title="AI Tools Directory - Free AI Prompt Tools"
      description="Browse Free AI Prompt Tools for prompt engineering, including Token Estimator, Variable Extractor, JSON Schema Generator, and JSON Validator."
      keywords="Free AI Prompt Tools, Prompt Engineering, Token Estimator, Prompt Variable Extractor, JSON Validator"
    >
      <h1 className="text-3xl font-bold">AI Prompt Toolkit Directory</h1>
      <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
        Centralized hub for all six MVP tools with ad inventory, affiliate blocks, and sponsored placements.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px]">
        <div className="space-y-8">
          <div className="grid gap-7 md:grid-cols-2">
            {TOOL_PAGES.map((tool) => (
              <ToolNavCard key={tool.path} tool={tool} />
            ))}
          </div>

          <section className="border border-slate-200 p-6 dark:border-slate-800">
            <h2 className="text-xl font-semibold">Affiliate Recommendations</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Promote API credits, prompt libraries, and AI observability services here.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>Affiliate Slot 1: Enterprise LLM Hosting Partner</li>
              <li>Affiliate Slot 2: Prompt Management Platform</li>
              <li>Affiliate Slot 3: AI Safety and Guardrail Toolkit</li>
            </ul>
          </section>

          <section className="border border-slate-200 p-6 dark:border-slate-800">
            <h2 className="text-xl font-semibold">Sponsored Listings</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Sponsored tools and integrations can be featured in this premium section.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>Sponsored Listing A: AI Dataset Platform</li>
              <li>Sponsored Listing B: Workflow Automation Suite</li>
            </ul>
          </section>
        </div>

        <aside className="space-y-4">
          <AdSlot label="Sidebar Slot 1" />
          <AdSlot label="Sidebar Slot 2" />
        </aside>
      </div>
    </SectionShell>
  );
}

function ToolContainer({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  const keywords = `${title}, Free AI Prompt Tools, Prompt Engineering, Token Estimator, JSON Validator`;

  return (
    <SectionShell title={title} description={description} keywords={keywords}>
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mt-2 max-w-3xl text-slate-600 dark:text-slate-400">{description}</p>
      <div className="mt-8 space-y-4">{children}</div>
    </SectionShell>
  );
}

function PromptVariableExtractorPage() {
  const [input, setInput] = useState("Create a {{tone}} summary for {audience} in :language and include [region].");
  const variables = useMemo(() => extractPromptVariables(input), [input]);

  return (
    <ToolContainer
      title="Prompt Variable Extractor"
      description="Extract prompt placeholders to standardize Prompt Engineering templates for fast and reliable AI automation."
    >
      <textarea
        className="h-44 w-full border border-slate-300 p-3 dark:border-slate-700 dark:bg-slate-900"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        aria-label="Prompt text"
      />
      <div className="border border-slate-200 p-4 dark:border-slate-800">
        <h2 className="text-lg font-semibold">Detected Variables ({variables.length})</h2>
        <p className="mt-2 break-words text-slate-700 dark:text-slate-300">
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

  const handleGenerate = () => {
    try {
      setResult(generateJsonSchema(input));
      setError("");
    } catch {
      setResult("");
      setError("Invalid JSON input. Please provide a valid JSON object or array.");
    }
  };

  return (
    <ToolContainer
      title="JSON Schema Generator"
      description="Generate JSON Schema from sample data to enforce reliable Prompt Engineering output structure."
    >
      <textarea
        className="h-56 w-full border border-slate-300 p-3 font-mono text-sm dark:border-slate-700 dark:bg-slate-900"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        aria-label="Sample JSON"
      />
      <button
        type="button"
        onClick={handleGenerate}
        className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400"
      >
        Generate Schema
      </button>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <pre className="overflow-auto border border-slate-200 p-4 text-sm dark:border-slate-800">{result || "Schema output will appear here."}</pre>
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

  const runValidation = () => {
    try {
      const issues = validateJsonWithSchema(jsonInput, schemaInput);
      setMessages(issues.length ? issues : ["Valid JSON for the provided schema subset."]);
      setError("");
    } catch {
      setMessages([]);
      setError("Invalid JSON or schema syntax. Please check both inputs.");
    }
  };

  return (
    <ToolContainer
      title="JSON Validator"
      description="Validate JSON against schema rules to keep Prompt Engineering pipelines accurate and production-ready."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea
          className="h-64 w-full border border-slate-300 p-3 font-mono text-sm dark:border-slate-700 dark:bg-slate-900"
          value={jsonInput}
          onChange={(event) => setJsonInput(event.target.value)}
          aria-label="JSON input"
        />
        <textarea
          className="h-64 w-full border border-slate-300 p-3 font-mono text-sm dark:border-slate-700 dark:bg-slate-900"
          value={schemaInput}
          onChange={(event) => setSchemaInput(event.target.value)}
          aria-label="Schema input"
        />
      </div>
      <button
        type="button"
        onClick={runValidation}
        className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400"
      >
        Validate JSON
      </button>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <ul className="space-y-2 border border-slate-200 p-4 text-sm dark:border-slate-800">
        {messages.length ? messages.map((message) => <li key={message}>{message}</li>) : <li>Validation results appear here.</li>}
      </ul>
    </ToolContainer>
  );
}

function PromptFormatterPage() {
  const [input, setInput] = useState("role: expert analyst\nobjective: summarize quarterly risks\noutput: bullet summary");
  const output = useMemo(() => formatPrompt(input), [input]);

  return (
    <ToolContainer
      title="Prompt Formatter"
      description="Format messy prompt notes into a clear structure for stronger Prompt Engineering consistency."
    >
      <textarea
        className="h-48 w-full border border-slate-300 p-3 dark:border-slate-700 dark:bg-slate-900"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        aria-label="Prompt formatter input"
      />
      <pre className="overflow-auto border border-slate-200 p-4 text-sm dark:border-slate-800">{output}</pre>
    </ToolContainer>
  );
}

function PromptCleanerPage() {
  const [input, setInput] = useState("  Remove   extra   spaces\n\n\n and odd\tcharacters before sending.  ");
  const output = useMemo(() => cleanPrompt(input), [input]);

  return (
    <ToolContainer
      title="Prompt Cleaner"
      description="Clean noisy text and hidden characters to improve Prompt Engineering quality and response stability."
    >
      <textarea
        className="h-48 w-full border border-slate-300 p-3 dark:border-slate-700 dark:bg-slate-900"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        aria-label="Prompt cleaner input"
      />
      <pre className="overflow-auto border border-slate-200 p-4 text-sm dark:border-slate-800">{output}</pre>
    </ToolContainer>
  );
}

function TokenEstimatorPage() {
  const [input, setInput] = useState("Estimate prompt costs before production deployment.");
  const stats = useMemo(() => estimateTokens(input), [input]);

  return (
    <ToolContainer
      title="Token Estimator"
      description="Token Estimator for Prompt Engineering teams to project token usage, budget impact, and context size."
    >
      <textarea
        className="h-44 w-full border border-slate-300 p-3 dark:border-slate-700 dark:bg-slate-900"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        aria-label="Text for token estimation"
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="border border-slate-200 p-4 dark:border-slate-800">
          <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">Characters</h2>
          <p className="mt-1 text-2xl font-semibold">{stats.characters}</p>
        </div>
        <div className="border border-slate-200 p-4 dark:border-slate-800">
          <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">Words</h2>
          <p className="mt-1 text-2xl font-semibold">{stats.words}</p>
        </div>
        <div className="border border-slate-200 p-4 dark:border-slate-800">
          <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">Estimated Tokens</h2>
          <p className="mt-1 text-2xl font-semibold">{stats.estimatedTokens}</p>
        </div>
      </div>
    </ToolContainer>
  );
}

function BlogPage() {
  return (
    <SectionShell
      title="Prompt Engineering Blog - Free AI Prompt Tools"
      description="Prompt Engineering blog with practical guides on Token Estimator usage, schema validation, and Free AI Prompt Tools workflows."
      keywords="Prompt Engineering Blog, Free AI Prompt Tools, Token Estimator, AI Reliability, JSON Validator"
    >
      <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
      <p className="mt-3 max-w-3xl text-base text-slate-600 dark:text-slate-400">
        Premium editorial insights on prompt systems, AI reliability engineering, and cost-efficient model deployment.
      </p>
      <div className="mt-10 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
        {BLOG_POSTS.map((post) => (
          <article
            key={post.title}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_40px_-22px_rgba(15,23,42,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_-20px_rgba(59,130,246,0.4)] dark:border-slate-800 dark:bg-slate-900/80"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-500">{post.category}</p>
            <h2 className="mt-3 text-xl font-semibold leading-snug">{post.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{post.excerpt}</p>
            <div className="mt-5 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                {post.date}
              </span>
              <span>{post.readTime}</span>
            </div>
            <button
              type="button"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-blue-500/40 px-4 py-2 text-sm font-medium text-blue-500 transition duration-300 hover:border-blue-400 hover:bg-blue-500 hover:text-white hover:shadow-[0_0_24px_rgba(59,130,246,0.45)]"
            >
              Read More
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const onChangeField = (field: "name" | "email" | "message", value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <SectionShell
      title="Contact - Prompt Engineering Toolkit"
      description="Contact AI Prompt Toolkit for Prompt Engineering partnerships, support, and Free AI Prompt Tools collaboration."
      keywords="Contact AI Prompt Toolkit, Free AI Prompt Tools, Prompt Engineering, Token Estimator"
    >
      <h1 className="text-3xl font-bold tracking-tight">Contact</h1>
      <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
        Connect with the AI Prompt Toolkit team for enterprise onboarding, partnerships, and technical collaboration.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_12px_40px_-25px_rgba(15,23,42,0.4)] dark:border-slate-800 dark:bg-slate-900/70">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">Direct Contact</p>
          <a
            href="mailto:nightfury2464@gmail.com"
            className="mt-4 inline-flex items-center gap-2 text-lg font-semibold text-slate-900 transition hover:text-blue-500 dark:text-white"
          >
            <Mail className="h-5 w-5" aria-hidden="true" />
            nightfury2464@gmail.com
          </a>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">Support Window: Monday-Friday, UTC business hours.</p>
        </aside>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_12px_40px_-25px_rgba(15,23,42,0.4)] dark:border-slate-800 dark:bg-slate-900/70"
        >
          <div className="grid gap-5">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Name</span>
              <input
                value={formData.name}
                onChange={(event) => onChangeField("name", event.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-2.5 outline-none transition focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.28)] dark:border-slate-700"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Work Email</span>
              <input
                type="email"
                value={formData.email}
                onChange={(event) => onChangeField("email", event.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-2.5 outline-none transition focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.28)] dark:border-slate-700"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Message</span>
              <textarea
                value={formData.message}
                onChange={(event) => onChangeField("message", event.target.value)}
                required
                rows={5}
                className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-2.5 outline-none transition focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.28)] dark:border-slate-700"
              />
            </label>
            <button
              type="submit"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-500/40 bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400 hover:shadow-[0_0_24px_rgba(59,130,246,0.45)]"
            >
              Send Message
              <SendHorizontal className="h-4 w-4" aria-hidden="true" />
            </button>
            {submitted ? <p className="text-sm text-emerald-500">Thanks. Your message has been captured for this demo workflow.</p> : null}
          </div>
        </form>
      </div>
    </SectionShell>
  );
}

function PrivacyPage() {
  return (
    <SectionShell
      title="Privacy Policy"
      description="Privacy policy outlining data handling, cookie usage, and user rights for AI Prompt Toolkit."
      keywords="Privacy Policy, Free AI Prompt Tools, Prompt Engineering"
    >
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-3 max-w-4xl text-slate-600 dark:text-slate-400">
        This demo policy states that input text is processed in-browser for tool previews and should not include sensitive personal or regulated data.
      </p>
    </SectionShell>
  );
}

function TermsPage() {
  return (
    <SectionShell
      title="Terms of Service"
      description="Terms and usage conditions for the AI Prompt Toolkit."
      keywords="Terms of Service, Free AI Prompt Tools, Prompt Engineering"
    >
      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <p className="mt-3 max-w-4xl text-slate-600 dark:text-slate-400">
        This toolkit is provided as-is for educational and operational prototyping. Teams should review generated output before production use.
      </p>
    </SectionShell>
  );
}

function NotFoundPage() {
  return (
    <SectionShell
      title="Page Not Found"
      description="The requested page could not be found."
      keywords="404, Free AI Prompt Tools, Prompt Engineering"
    >
      <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-400">Use the navigation to return to the AI Prompt Toolkit pages.</p>
    </SectionShell>
  );
}

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
    <BrowserRouter>
      <Layout mode={themeMode} onToggle={() => setThemeMode((current) => (current === "dark" ? "light" : "dark"))} />
    </BrowserRouter>
  );
}
