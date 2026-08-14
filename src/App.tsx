import React, { type FormEvent, type ReactElement, type ReactNode, lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Braces,
  FileJson2,
  Mail,
  SendHorizontal,
  ShieldCheck,
  Sigma,
  Sparkles,
  WandSparkles,
  type LucideIcon,
  CheckCircle2,
  Zap,
  ArrowLeftRight,
  UserCircle,
  Search,
  Menu,
  X,
  Hammer,
  Bug,
  ShieldAlert,
  Link2,
  Languages,
  Code2,
  Github,
  History,
  Play,
  Image,
  FileText,
  Terminal,
} from "lucide-react";
import { BrowserRouter, Link, NavLink, Route, Routes, useParams, useLocation } from "react-router-dom";
import {
  cleanPrompt,
  estimateTokens,
  extractPromptVariables,
  formatPrompt,
  generateJsonSchema,
  validateJsonWithSchema,
  debugPrompt,
  translatePrompt,
  copyToClipboard,
} from "./lib/toolkit";
import OutputToolbar, { LiveStats } from "./components/OutputToolbar";
import { BLOG_POSTS, type BlogPost, getBlogPostBySlug } from "./data/blogPosts";
import { TEMPLATES } from "./data/templates";
import useSeo from "./hooks/useSeo";
import ToolCard from "./components/ToolCard";
import BlogCard from "./components/BlogCard";
import SearchModal from "./components/SearchModal";
import AdBanner from "./components/AdBanner";
import SectionShell from "./components/SectionShell";
import ErrorBoundary from "./components/ErrorBoundary";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
  softwareAppJsonLd,
  toolFaq,
  toolNameFromTitle,
  useJsonLd,
  webPageJsonLd,
} from "./lib/structuredData";

const HomePage = lazy(() => import("./components/HomePage"));

const TemplatesPage = lazy(() => import("./pages/TemplatesPage"));
const CategoriesPage = lazy(() => import("./pages/CategoriesPage"));
const ImageGeneratorPage = lazy(() => import("./pages/ImageGeneratorPage"));
const PromptsDirectoryPage = lazy(() => import("./pages/PromptsPages").then((m) => ({ default: m.PromptsDirectoryPage })));
const PromptsRolePage = lazy(() => import("./pages/PromptsPages").then((m) => ({ default: m.PromptsRolePage })));
const PromptTaskPage = lazy(() => import("./pages/PromptsPages").then((m) => ({ default: m.PromptTaskPage })));

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
    title: "Prompt Converter",
    path: "/tools/prompt-converter",
    description: "Convert ChatGPT prompts to Claude, Gemini, or Cursor format instantly. Adapt tone, structure, and directives.",
    icon: ArrowLeftRight,
    accent: "from-amber-500/30 to-yellow-400/10",
    keyBenefits: ["ChatGPT to Claude", "ChatGPT to Gemini", "ChatGPT to Cursor"],
  },
  {
    title: "AI Persona Builder",
    path: "/tools/persona-builder",
    description: "Generate expert system prompts for different roles like Marketer, Developer, or Analyst instantly.",
    icon: UserCircle,
    accent: "from-rose-500/30 to-amber-400/10",
    keyBenefits: ["Expert role prompting", "Task-specific context", "Behavioral rules"],
  },
  {
    title: "Advanced Prompt Optimizer",
    path: "/tools/advanced-prompt-optimizer",
    description: "Polish and amplify prompts with advanced structuring — role, format, tone, and constraint patterns applied automatically.",
    icon: Sparkles,
    accent: "from-indigo-500/35 to-cyan-400/10",
    keyBenefits: ["Side-by-side compare", "Unlimited free use", "Prompt structure analysis"],
  },
  {
    title: "Prompt Comparison Tool",
    path: "/tools/prompt-comparison",
    description: "Compare two prompts side by side. See token count, word count, readability, structure score, clarity score, and visual diff highlighting.",
    icon: ArrowLeftRight,
    accent: "from-cyan-500/30 to-blue-400/10",
    keyBenefits: ["Token & word count", "Readability & structure scores", "Visual diff highlighting"],
  },
  {
    title: "Mega Prompt Builder",
    path: "/tools/mega-prompt-builder",
    description: "Build production-grade AI prompts with an 8-step guided wizard — role, task, context, audience, format, tone, constraints, and examples.",
    icon: Hammer,
    accent: "from-amber-500/35 to-rose-500/10",
    keyBenefits: ["8-step guided wizard", "Role + context + constraints", "Export as Markdown"],
  },
  {
    title: "Prompt Debugger",
    path: "/tools/prompt-debugger",
    description: "Diagnose your AI prompts with a health score (0-100) and 12+ issue detectors. Get instant auto-fix suggestions for better results.",
    icon: Bug,
    accent: "from-red-500/30 to-amber-400/10",
    keyBenefits: ["Health score 0-100", "12+ issue detectors", "Auto-fix suggestions"],
  },
  {
    title: "Security Scanner",
    path: "/tools/security-scanner",
    description: "Scan prompts for injection attacks, jailbreak attempts, and PII leaks before sending to AI APIs. Protect your data and prevent manipulation.",
    icon: ShieldAlert,
    accent: "from-red-500/35 to-violet-500/10",
    keyBenefits: ["Injection detection", "Jailbreak scanning", "PII & data leak alerts"],
  },
  {
    title: "Prompt Chain Builder",
    path: "/tools/prompt-chain-builder",
    description: "Build multi-step prompt chains with up to 5 sequential steps. Each step supports custom output formats — Text, JSON, Markdown, Code, Table, and more.",
    icon: Link2,
    accent: "from-indigo-500/35 to-cyan-400/10",
    keyBenefits: ["Up to 5 chained steps", "7 output format options", "Export as Markdown"],
  },
  {
    title: "Prompt Translator",
    path: "/tools/prompt-translator",
    description: "Translate AI prompts into 8 languages — Hindi, Spanish, French, German, Japanese, Chinese, Portuguese, and Arabic — while preserving variables.",
    icon: Languages,
    accent: "from-cyan-500/35 to-blue-500/10",
    keyBenefits: ["8 languages supported", "Preserves {variables}", "Multi-locale prompting"],
  },
  {
    title: "API Request Builder",
    path: "/tools/api-request-builder",
    description: "Build API request bodies and cURL commands for OpenAI, Anthropic, and Gemini. Configure model, temperature, and max tokens. Copy ready-to-use code.",
    icon: Code2,
    accent: "from-emerald-500/35 to-green-400/10",
    keyBenefits: ["OpenAI, Anthropic & Gemini", "Temperature & max tokens", "Copy cURL commands"],
  },
  {
    title: "AI Image Prompt Generator",
    path: "/tools/image-prompt-generator",
    description: "Generate production-ready image prompts for DALL-E, Midjourney, and Stable Diffusion. Choose art style, mood, and camera angle.",
    icon: Image,
    accent: "from-pink-500/35 to-rose-400/10",
    keyBenefits: ["8 art styles", "DALL-E & Midjourney ready", "Instant copy-paste"],
  },
  {
    title: "AI Content Summarizer",
    path: "/tools/content-summarizer",
    description: "Summarize long articles, reports, and documents into TL;DR, bullet points, paragraphs, or academic abstracts with word reduction stats.",
    icon: FileText,
    accent: "from-teal-500/35 to-emerald-400/10",
    keyBenefits: ["4 summary modes", "Word reduction %", "Copy-ready output"],
  },
  {
    title: "AI Regex Generator",
    path: "/tools/regex-generator",
    description: "Generate regex patterns from plain English descriptions. Test instantly against sample strings with built-in cheatsheet.",
    icon: Terminal,
    accent: "from-violet-500/35 to-purple-400/10",
    keyBenefits: ["6 quick presets", "Live regex tester", "Syntax cheatsheet"],
  },
];

const TOOL_BY_SLUG = new Map(TOOL_PAGES.map((tool) => [tool.path.split("/").pop()!, tool]));

function getBlogPostsForTool(toolSlug: string) {
  return BLOG_POSTS.filter((post) => post.relatedToolSlugs.includes(toolSlug));
}


function MonetagSPA() {
  const location = useLocation();

  useEffect(() => {
    // Reinitialize Monetag MultiTag on route changes (SPA navigation).
    // NOTE: only safe refresh calls — never remove/re-insert the script tag,
    // that caused double-init and black-screen overlays on live.
    try {
      const w = window as any;
      if (w.monetag && typeof w.monetag.refresh === "function") {
        w.monetag.refresh();
      } else if (w.propellerads && typeof w.propellerads.push === "function") {
        w.propellerads.push({ zone: 264272 });
      }
    } catch {
      // silently ignore
    }
  }, [location.pathname]);

  return null;
}

function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        hamburgerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [mobileMenuOpen]);
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `glass-nav-link ${isActive ? "active" : ""}`;
  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
        : "text-slate-300 hover:bg-white/5 hover:text-white border border-transparent"
    }`;
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e2e8f0] w-full">
      <header className="sticky top-0 z-50 w-full py-2 md:py-3">
        <div className="site-container">
          <div className="glass-nav">
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <svg className="h-7 w-7 sm:h-8 sm:w-8" viewBox="0 0 64 64" fill="none">
              <defs>
                <linearGradient id="hdrGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F4D47C" />
                  <stop offset="50%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#B8860B" />
                </linearGradient>
              </defs>
              <rect width="64" height="64" rx="14" fill="#0A0A0A" />
              <rect x="4" y="4" width="56" height="56" rx="12" stroke="url(#hdrGold)" strokeWidth="1" opacity="0.3" />
              <path d="M18 20 L28 32 L18 44" stroke="url(#hdrGold)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="32" y1="44" x2="46" y2="44" stroke="url(#hdrGold)" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M46 24 L48 28 L52 30 L48 32 L46 36 L44 32 L40 30 L44 28 Z" fill="#FFD700" />
            </svg>
            <span className="text-sm sm:text-base font-bold tracking-tight text-white">
              AI World Hub
            </span>
          </Link>
          {/* Desktop nav inside glass */}
          <nav className="hidden md:flex items-center gap-x-0.5 xl:gap-x-1 flex-wrap justify-center">
            <NavLink to="/" end className={navLinkClass}>Home</NavLink>
            <NavLink to="/playground" className={navLinkClass}>Playground</NavLink>
            <NavLink to="/tools" className={navLinkClass}>Tools</NavLink>
            <NavLink to="/prompts" className={navLinkClass}>Prompts</NavLink>
            <NavLink to="/blog" className={navLinkClass}>Blog</NavLink>
            <NavLink to="/about" className={navLinkClass}>About</NavLink>
          </nav>
          <div className="flex items-center gap-1.5 shrink-0">
            <button type="button" onClick={() => setSearchOpen(true)} className="w-10 h-10 md:w-10 md:h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition text-slate-400 hover:text-white" aria-label="Search">
              <Search className="w-4 h-4" />
            </button>

          </div>
          {/* Mobile hamburger */}
          <button
            ref={hamburgerRef}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/5 transition-colors"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-slate-200" />
            ) : (
              <Menu className="w-5 h-5 text-slate-200" />
            )}
          </button>
          </div>
        </div>
        {/* Mobile menu - glass dropdown */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden mx-4 mt-2 rounded-2xl border border-white/[0.08] bg-slate-900/90 backdrop-blur-xl px-3 py-3 shadow-xl">
            <nav className="space-y-1" aria-label="Mobile">
              <NavLink to="/" end onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>Home</NavLink>
              <NavLink to="/playground" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>Playground</NavLink>
              <NavLink to="/tools" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>Tools</NavLink>
              <NavLink to="/prompts" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>Prompts</NavLink>
              <NavLink to="/blog" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>Blog</NavLink>
              <NavLink to="/about" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>About</NavLink>
            </nav>

          </div>
        )}
      </header>
      
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        tools={TOOL_PAGES}
        blogPosts={BLOG_POSTS}
        templates={TEMPLATES}
      />

      <main className="w-full">
        <ErrorBoundary>
        <Suspense fallback={
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500/30 border-t-amber-400" />
              <p className="text-sm text-slate-500">Loading…</p>
            </div>
          </div>
        }>
        <Routes>
          <Route path="/" element={<Suspense fallback={<ToolSkeleton />}><HomePage toolPages={TOOL_PAGES} /></Suspense>} />
          <Route path="/tools" element={<ToolsDirectoryPage />} />
          <Route path="/tools/prompt-variable-extractor" element={<PromptVariableExtractorPage />} />
          <Route path="/tools/json-schema-generator" element={<JsonSchemaGeneratorPage />} />
          <Route path="/tools/json-validator" element={<JsonValidatorPage />} />
          <Route path="/tools/prompt-formatter" element={<PromptFormatterPage />} />
          <Route
            path="/tools/advanced-prompt-optimizer"
            element={
              <LazyPromptOptimizer
                title="Advanced Prompt Optimizer"
                description="Polish prompts with advanced structuring — role, format, tone, and constraint patterns applied in your browser."
                toolSlug="advanced-prompt-optimizer"
                tool={TOOL_BY_SLUG.get("advanced-prompt-optimizer")!}
              />
            }
          />
          <Route path="/tools/prompt-cleaner" element={<PromptCleanerPage />} />
          <Route path="/tools/prompt-converter" element={<LazyPromptConverter title="Prompt Converter" toolSlug="prompt-converter" description="Convert ChatGPT prompts to Claude, Gemini, or Cursor format." tool={TOOL_BY_SLUG.get("prompt-converter")!} />} />
          <Route path="/tools/persona-builder" element={<LazyPersonaBuilder title="AI Persona Builder" toolSlug="persona-builder" description="Generate expert system prompts for different roles like Marketer, Developer, or Analyst." tool={TOOL_BY_SLUG.get("persona-builder")!} />} />
          <Route path="/tools/prompt-comparison" element={<LazyPromptComparison title="Prompt Comparison Tool" toolSlug="prompt-comparison" description="Compare two prompts side by side. See token count, word count, readability, structure score, clarity score, and visual diff highlighting." tool={TOOL_BY_SLUG.get("prompt-comparison")!} />} />
          <Route path="/tools/mega-prompt-builder" element={<LazyMegaPromptBuilder title="Mega Prompt Builder" toolSlug="mega-prompt-builder" description="Build structured mega prompts with an 8-step wizard — role, task, context, audience, format, tone, constraints, and examples." tool={TOOL_BY_SLUG.get("mega-prompt-builder")!} />} />
          <Route path="/tools/prompt-debugger" element={<LazyPromptDebugger title="Prompt Debugger" toolSlug="prompt-debugger" description="Diagnose AI prompts with a health score (0-100), 12+ issue detectors, and instant auto-fix suggestions." tool={TOOL_BY_SLUG.get("prompt-debugger")!} />} />
          <Route path="/tools/security-scanner" element={<LazySecurityScanner title="Prompt Security Scanner" toolSlug="security-scanner" description="Scan prompts for injection attacks, jailbreaks, PII leaks, and security threats. Risk level scoring with actionable remediation." tool={TOOL_BY_SLUG.get("security-scanner")!} />} />
          <Route path="/tools/prompt-chain-builder" element={<LazyPromptChainBuilder title="Prompt Chain Builder" toolSlug="prompt-chain-builder" description="Chain up to 5 sequential prompt steps with different output formats. Copy all steps or export as Markdown." tool={TOOL_BY_SLUG.get("prompt-chain-builder")!} />} />
          <Route path="/tools/prompt-translator" element={<LazyPromptTranslator title="Prompt Translator" toolSlug="prompt-translator" description="Translate prompts into 8 languages — Hindi, Spanish, French, German, Japanese, Chinese, Portuguese, Arabic — while preserving variables." tool={TOOL_BY_SLUG.get("prompt-translator")!} />} />
          <Route path="/tools/api-request-builder" element={<LazyApiRequestBuilder title="API Request Builder" toolSlug="api-request-builder" description="Build API requests for OpenAI, Anthropic, and Gemini with model selection, temperature, max tokens, and cURL export." tool={TOOL_BY_SLUG.get("api-request-builder")!} />} />
          <Route path="/tools/image-prompt-generator" element={<LazyImagePromptGenerator title="AI Image Prompt Generator" toolSlug="image-prompt-generator" description="Generate production-ready image prompts for DALL-E, Midjourney, and Stable Diffusion with style, mood, and camera controls." tool={TOOL_BY_SLUG.get("image-prompt-generator")!} />} />
          <Route path="/tools/content-summarizer" element={<LazyContentSummarizer title="AI Content Summarizer" toolSlug="content-summarizer" description="Summarize articles, reports, and long text into TL;DR, bullets, paragraphs, or academic abstracts with reduction stats." tool={TOOL_BY_SLUG.get("content-summarizer")!} />} />
          <Route path="/tools/regex-generator" element={<LazyRegexGenerator title="AI Regex Generator" toolSlug="regex-generator" description="Generate regex patterns from plain English. Test against strings and learn syntax with built-in cheatsheet." tool={TOOL_BY_SLUG.get("regex-generator")!} />} />
          <Route path="/tools/token-estimator" element={<TokenEstimatorPage />} />
          <Route path="/playground" element={<PlaygroundPage />} />
          <Route path="/prompts" element={<PromptsDirectoryPage />} />
          <Route path="/prompts/:role" element={<PromptsRolePage />} />
          <Route path="/prompts/:role/:task" element={<PromptTaskPage />} />
          <Route path="/changelog" element={<ChangelogPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/templates" element={<Suspense fallback={<ToolSkeleton />}><TemplatesPage /></Suspense>} />
          <Route path="/categories" element={<Suspense fallback={<ToolSkeleton />}><CategoriesPage /></Suspense>} />
          <Route path="/image-generator" element={<Suspense fallback={<ToolSkeleton />}><ImageGeneratorPage /></Suspense>} />
          <Route path="/privacy-policy" element={<PrivacyPage />} />
          <Route path="/terms-of-service" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </Suspense>
        </ErrorBoundary>
      </main>

      <footer className="border-t border-white/10 bg-[#070707] w-full">
        <div className="site-container section-lg">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 md:gap-3">
                <svg className="h-8 w-8" viewBox="0 0 64 64" fill="none">
                  <defs>
                    <linearGradient id="ftrGold" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F4D47C" />
                      <stop offset="50%" stopColor="#D4AF37" />
                      <stop offset="100%" stopColor="#B8860B" />
                    </linearGradient>
                  </defs>
                  <rect width="64" height="64" rx="14" fill="#0A0A0A" />
                  <rect x="4" y="4" width="56" height="56" rx="12" stroke="url(#ftrGold)" strokeWidth="1" opacity="0.3" />
                  <path d="M18 20 L28 32 L18 44" stroke="url(#ftrGold)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="32" y1="44" x2="46" y2="44" stroke="url(#ftrGold)" strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M46 24 L48 28 L52 30 L48 32 L46 36 L44 32 L40 30 L44 28 Z" fill="#FFD700" />
                </svg>
                <span className="text-base font-bold tracking-tight text-white">AI World Hub</span>
              </div>
              <p className="text-sm leading-6 text-slate-400">Professional in-browser tools for prompt engineering teams. No sign-up, no servers, no data collection.</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Tools</h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li><Link to="/tools/mega-prompt-builder" className="text-slate-400 transition hover:text-amber-400">Mega Prompt Builder</Link></li>
                <li><Link to="/tools/prompt-debugger" className="text-slate-400 transition hover:text-amber-400">Prompt Debugger</Link></li>
                <li><Link to="/tools/security-scanner" className="text-slate-400 transition hover:text-amber-400">Security Scanner</Link></li>
                <li><Link to="/tools/prompt-chain-builder" className="text-slate-400 transition hover:text-amber-400">Prompt Chain Builder</Link></li>
                <li><Link to="/tools/prompt-translator" className="text-slate-400 transition hover:text-amber-400">Prompt Translator</Link></li>
                <li><Link to="/tools/api-request-builder" className="text-slate-400 transition hover:text-amber-400">API Request Builder</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Resources</h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li><Link to="/playground" className="text-slate-400 transition hover:text-amber-400">Playground</Link></li>
                <li><Link to="/prompts" className="text-slate-400 transition hover:text-amber-400">Prompts Library</Link></li>
                <li><Link to="/blog" className="text-slate-400 transition hover:text-amber-400">Blog</Link></li>
                <li><Link to="/changelog" className="text-slate-400 transition hover:text-amber-400">Changelog</Link></li>
                <li><a href="https://github.com/toolkitaiprompt-ui/AI-Prompt-Toolkit" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-slate-400 transition hover:text-amber-400"><Github className="h-3.5 w-3.5" /> Star on GitHub</a></li>
                <li><Link to="/about" className="text-slate-400 transition hover:text-amber-400">About Us</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Legal</h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li><Link to="/privacy-policy" className="text-slate-400 transition hover:text-amber-400">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="text-slate-400 transition hover:text-amber-400">Terms of Service</Link></li>
                <li><a href="mailto:toolkitaiprompt@gmail.com" className="text-slate-400 transition hover:text-amber-400">toolkitaiprompt@gmail.com</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-16 flex flex-col-reverse items-center justify-between gap-6 border-t border-white/10 pt-10 sm:flex-row">
            <p className="text-xs text-slate-500">© 2026 AI World Hub. All rights reserved.</p>
            <p className="text-xs text-slate-600">Built for global AI teams.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ToolsDirectoryPage() {
  return (
    <SectionShell
      title="Free AI Tools Directory — 19 Best Tools"
      description="Choose from 19 free AI prompt engineering tools — build, format, debug, optimize, secure, and translate prompts in your browser. No sign-up required."
      keywords="Best AI Tools, Free AI Tools, AI Tools Directory, Prompt Engineering Tools, AI Prompt Builder, ChatGPT Prompt Tools"
    >
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-400/80">
          Professional Toolkit
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">AI World Hub</h1>
        <p className="max-w-3xl text-base sm:text-lg text-slate-400">
          Choose from 19 precision tools for prompt engineering teams. Build, format, validate, debug, optimize, secure, and translate — all in the browser.
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {TOOL_PAGES.map((tool) => (
          <React.Fragment key={tool.path}>
            <ToolCard tool={tool} />
          </React.Fragment>
        ))}
      </div>
    </SectionShell>
  );
}

function ToolSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-24 rounded-xl bg-slate-800/60" />
      <div className="h-64 rounded-xl bg-slate-800/40" />
      <div className="h-32 rounded-xl bg-slate-800/40" />
    </div>
  );
}

function lazyTool(loader: () => Promise<{ default: React.ComponentType }>) {
  const Component = lazy(loader);
  return function LazyTool(props: {
    title: string;
    description: string;
    toolSlug: string;
    tool: ToolMeta;
  }) {
    return (
      <ToolContainer {...props}>
        <Suspense fallback={<ToolSkeleton />}>
          <Component />
        </Suspense>
      </ToolContainer>
    );
  };
}

const LazyPromptOptimizer = lazyTool(() => import("./components/PromptOptimizer"));
const LazyPromptConverter = lazyTool(() => import("./components/PromptConverter"));
const LazyPersonaBuilder = lazyTool(() => import("./components/PersonaBuilder"));
const LazyPromptComparison = lazyTool(() => import("./components/PromptComparison"));
const LazyMegaPromptBuilder = lazyTool(() => import("./components/MegaPromptBuilder"));
const LazyPromptDebugger = lazyTool(() => import("./components/PromptDebugger"));
const LazySecurityScanner = lazyTool(() => import("./components/SecurityScanner"));
const LazyPromptChainBuilder = lazyTool(() => import("./components/PromptChainBuilder"));
const LazyPromptTranslator = lazyTool(() => import("./components/PromptTranslator"));
const LazyApiRequestBuilder = lazyTool(() => import("./components/ApiRequestBuilder"));
const LazyImagePromptGenerator = lazyTool(() => import("./components/demo/ImagePromptGenerator"));
const LazyContentSummarizer = lazyTool(() => import("./components/demo/ContentSummarizer"));
const LazyRegexGenerator = lazyTool(() => import("./components/demo/RegexGenerator"));

function ToolContainer({
  title, description, toolSlug, tool, children,
}: {
  title: string; description: string; toolSlug?: string; tool?: ToolMeta; children: ReactNode;
}) {
  const keywords = `${title}, Best AI Tools, Free AI Tools, Prompt Engineering, ChatGPT Prompts`;
  const relatedBlogs = toolSlug ? getBlogPostsForTool(toolSlug) : [];

  useSeo(title, description, keywords);

  const toolName = toolNameFromTitle(title);
  useJsonLd(
    tool
      ? [
          softwareAppJsonLd(toolName, description, window.location.pathname),
          faqPageJsonLd(toolFaq(toolName, description)),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: toolName, path: window.location.pathname },
          ]),
        ]
      : null,
    [title, description, toolSlug],
  );

  return (
    <section className="site-container section-lg space-y-16">
      <div className="rounded-[20px] sm:rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-950/60 to-slate-950/80 p-5 sm:p-8 shadow-2xl shadow-indigo-500/10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          {tool && (
            <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br ${tool.accent} border border-white/10`}>
              <tool.icon className="h-8 w-8 text-white" aria-hidden="true" />
            </div>
          )}
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-400/80">
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



      <AdBanner />

      <div className="rounded-[24px] border border-white/10 bg-slate-950/80 p-6 shadow-xl">
        <div className="space-y-4">{children}</div>
      </div>

      {relatedBlogs.length > 0 && (
        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-400">Related reading</p>
              <h2 className="mt-1 text-2xl font-bold text-white">Deep-dive guides for this tool</h2>
            </div>
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-400 hover:text-amber-300 transition"
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

      <AdBanner />
    </section>
  );
}

function PromptVariableExtractorPage() {
  const [input, setInput] = useState("You are a {{role}} expert in {{domain}}. Write a {{tone}} {{content_type}} for {{product_name}} targeting {audience} in :language. Focus on [key_benefit] and CTA for [region]. Max {{word_count}} words.");
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
        <LiveStats text={input} />
      </label>
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="text-base font-semibold text-white">Detected Variables ({variables.length})</h2>
        <OutputToolbar text={variables.join("\n")} copyLabel="Copy Variables" fileName="prompt-variables.txt" showStats={false} className="mt-2" />
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
        <LiveStats text={input} />
      </label>
      <button
        type="button"
        onClick={handleGenerate}
        className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-400"
      >
        Generate Schema
      </button>
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      {result && <OutputToolbar text={result} fileName="schema.json" fileMime="application/json" className="mb-2" />}
      <pre className="overflow-auto rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300 whitespace-pre-wrap break-words">{result || "Schema output will appear here."}</pre>
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
          <LiveStats text={jsonInput} />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-300">Schema Input</span>
          <textarea
            className="h-64 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 font-mono text-sm text-slate-100 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
            value={schemaInput}
            onChange={(e) => setSchemaInput(e.target.value)}
            aria-label="Schema input"
          />
          <LiveStats text={schemaInput} />
        </label>
      </div>
      <button
        type="button"
        onClick={runValidation}
        className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-400"
      >
        Validate JSON
      </button>
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      {messages.length > 0 && <OutputToolbar text={messages.join("\n")} copyLabel="Copy Results" showStats={false} className="mb-2" />}
      <ul className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
        {messages.length ? messages.map((m, i) => <li key={i}>{m}</li>) : <li>Validation results appear here.</li>}
      </ul>
    </ToolContainer>
  );
}

function PromptFormatterPage() {
  const [input, setInput] = useState("you are expert analyst\n\nsummarize quarterly business risks for exec team\n-- need bullet points\n-- include impact High/Med/Low\n-- add mitigation steps\ntone professional\n\naudience = C-suite\nformat should be markdown table maybe?");
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
        <LiveStats text={input} />
      </label>
      <div>
        <p className="mb-2 text-sm font-medium text-slate-300">Formatted Output</p>
        <OutputToolbar text={output} fileName="formatted-prompt.txt" className="mb-2" />
        <pre className="overflow-auto rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300 whitespace-pre-wrap break-words">{output}</pre>
      </div>
    </ToolContainer>
  );
}

function PromptCleanerPage() {
  const [input, setInput] = useState("  Act  as   expert   \u200Bcopywriter\u200B!   \n\n\nWrite  a  product \t\t launch \n email for  {{product}} —  include  3 benefits…  \n\n  Keep  tone  exciting!!!  \u00A0\u00A0 ");
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
        <LiveStats text={input} />
      </label>
      <div>
        <p className="mb-2 text-sm font-medium text-slate-300">Cleaned Output</p>
        <OutputToolbar text={output} fileName="cleaned-prompt.txt" className="mb-2" />
        <pre className="overflow-auto rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300 whitespace-pre-wrap break-words">{output}</pre>
      </div>
    </ToolContainer>
  );
}

function TokenEstimatorPage() {
  const [input, setInput] = useState("You are a senior product marketing manager.\nTask: Write a 500-word launch announcement for AI World Hub targeting developers and indie hackers.\nInclude 3 key benefits, 1 customer quote placeholder, and a CTA to https://aiworldhub.site/tools.\nTone: confident, friendly, no jargon.\nFormat: headline, subheadline, 3 bullet benefits, quote block, CTA.\nConstraint: keep under 500 words.");
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
      <OutputToolbar text={input} fileName="prompt.txt" showStats={false} />
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

function BlogPage() {
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

function BlogPostPage() {
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
    .map((s) => TOOL_BY_SLUG.get(s))
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

function AboutPage() {
  return (
    <SectionShell
      title="About AI World Hub"
      description="Learn about AI World Hub — free in-browser tools for prompt engineering teams worldwide."
      keywords="About AI World Hub, Best AI Tools, Free AI Tools, Prompt Engineering"
    >
      <div className="max-w-4xl space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">About Us</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Build Reliable AI Prompts, Faster & Smarter</h1>
          <p className="text-lg text-slate-400">
            AI World Hub is a free, browser-based platform offering professional prompt engineering tools for teams and individuals worldwide.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
            <p className="text-3xl font-bold text-white">19</p>
            <p className="mt-1 text-sm text-slate-400">Free Tools</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
            <p className="text-3xl font-bold text-white">25+</p>
            <p className="mt-1 text-sm text-slate-400">Blog Guides</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
            <p className="text-3xl font-bold text-white">100%</p>
            <p className="mt-1 text-sm text-slate-400">In-Browser</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Our Mission</h2>
          <p className="text-slate-300">
            We believe that great AI output starts with great prompts. Our mission is to make professional prompt engineering accessible to everyone — developers, marketers, support teams, and AI enthusiasts. No sign-ups, no server round-trips, no data collection. Every tool runs entirely in your browser.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">What We Offer</h2>
          <ul className="ml-6 list-disc space-y-2 text-slate-300">
            <li><strong className="text-white">Prompt Variable Extractor</strong> — Extract placeholders from any prompt template.</li>
            <li><strong className="text-white">JSON Schema Generator</strong> — Create structured schemas for reliable AI output.</li>
            <li><strong className="text-white">JSON Validator</strong> — Validate model responses against your schema.</li>
            <li><strong className="text-white">Prompt Formatter</strong> — Turn messy notes into clean, numbered instructions.</li>
            <li><strong className="text-white">Prompt Cleaner</strong> — Remove noise characters and fix formatting.</li>
            <li><strong className="text-white">Token Estimator</strong> — Project token usage and costs before API calls.</li>
            <li><strong className="text-white">Prompt Converter</strong> — Convert ChatGPT prompts to Claude, Gemini, or Cursor format.</li>
            <li><strong className="text-white">AI Persona Builder</strong> — Generate expert system prompts for any role.</li>
            <li><strong className="text-white">Advanced Prompt Optimizer</strong> — Polish prompts for clarity and effectiveness.</li>
            <li><strong className="text-white">Prompt Comparison Tool</strong> — Compare prompts side-by-side with detailed metrics.</li>
            <li><strong className="text-white">Mega Prompt Builder</strong> — Build structured mega prompts with an 8-step wizard.</li>
            <li><strong className="text-white">Prompt Debugger</strong> — Diagnose prompts with a health score and 12+ issue detectors.</li>
            <li><strong className="text-white">Prompt Security Scanner</strong> — Scan prompts for injection attacks and PII leaks.</li>
            <li><strong className="text-white">Prompt Chain Builder</strong> — Chain up to 5 sequential prompt steps with output formats.</li>
            <li><strong className="text-white">Prompt Translator</strong> — Translate prompts into 8 languages while preserving variables.</li>
            <li><strong className="text-white">API Request Builder</strong> — Build API requests for OpenAI, Anthropic, and Gemini with cURL export.</li>
            <li><strong className="text-white">AI Image Prompt Generator</strong> — Generate image prompts for DALL-E, Midjourney, and Stable Diffusion.</li>
            <li><strong className="text-white">AI Content Summarizer</strong> — Summarize long articles and reports into TL;DR, bullets, or abstracts.</li>
            <li><strong className="text-white">AI Regex Generator</strong> — Turn plain English descriptions into tested regex patterns.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Privacy First</h2>
          <p className="text-slate-300">
            Unlike many online tools, AI World Hub processes everything locally in your browser. Your prompts, data, and text never leave your device. We do not store, collect, or share your inputs with any server.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Who We Serve</h2>
          <p className="text-slate-300">
            Our tools are used by prompt engineering teams, AI developers, content creators, marketers, and enterprises across the globe. Whether you are building production AI workflows or experimenting with your first prompt, AI World Hub is designed to help you work faster and smarter.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
          <h2 className="text-xl font-semibold text-white">Contact Us</h2>
          <p className="mt-3 text-slate-400">
            Questions, feedback, or partnership inquiries? Email us at{" "}
            <a href="mailto:toolkitaiprompt@gmail.com" className="text-cyan-400 hover:underline">toolkitaiprompt@gmail.com</a>
          </p>
        </div>
      </div>
    </SectionShell>
  );
}

const EMPTY_CONTACT_DRAFT = { name: "", email: "", message: "" };

function parseContactDraft(raw: string | null) {
  if (!raw) return EMPTY_CONTACT_DRAFT;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      !Array.isArray(parsed) &&
      typeof (parsed as { name?: unknown }).name === "string" &&
      typeof (parsed as { email?: unknown }).email === "string" &&
      typeof (parsed as { message?: unknown }).message === "string"
    ) {
      return parsed as typeof EMPTY_CONTACT_DRAFT;
    }
  } catch {}
  return EMPTY_CONTACT_DRAFT;
}

function ContactPage() {
  const [formData, setFormData] = useState(() =>
    parseContactDraft(localStorage.getItem("contact_draft")),
  );
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "fallback">("idle");
  const [fallbackMailto, setFallbackMailto] = useState("");
  const [copiedFallback, setCopiedFallback] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("contact_draft", JSON.stringify(formData));
    } catch {}
  }, [formData]);

  const onChangeField = (field: "name" | "email" | "message", value: string) =>
    setFormData((c: any) => ({ ...c, [field]: value }));

  const buildMailto = () => {
    const subject = `Contact from ${formData.name || "AI World Hub Visitor"}`;
    const body = `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}\n\n---\nSent from aiworldhub.site contact form (fallback)`;
    return `mailto:toolkitaiprompt@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setFallbackMailto("");

    // Try web3forms primary (with 12s timeout so a hung request never leaves
    // the form stuck on "sending" — it falls through to the mailto fallback)
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12000);
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "0a57b145-da61-4b05-b7c4-31c90d681d36",
          botcheck: "",
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `New contact form submission from ${formData.name}`,
        }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        try { localStorage.removeItem("contact_draft"); } catch {}
        return;
      }
      throw new Error("web3forms returned failure");
    } catch {
      // Fallback: build mailto + copy to clipboard (#12 fix)
      const mailto = buildMailto();
      setFallbackMailto(mailto);
      try {
        await navigator.clipboard.writeText(`To: toolkitaiprompt@gmail.com\nFrom: ${formData.name} <${formData.email}>\n\n${formData.message}`);
      } catch {}
      setStatus("fallback");
    }
  };

  return (
    <SectionShell
      title="Contact - Prompt Engineering Toolkit"
      description="Contact AI World Hub for prompt engineering support, partnerships, and feedback. Email toolkitaiprompt@gmail.com."
    >
      <h1 className="text-3xl font-bold tracking-tight text-white">Contact</h1>
      <p className="mt-3 max-w-2xl text-slate-400">
        Connect with the AI World Hub team for enterprise onboarding, partnerships, and technical collaboration.
      </p>
      <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="rounded-2xl border border-slate-800 bg-slate-900/70 p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">Direct Contact</p>
          <a href="mailto:toolkitaiprompt@gmail.com" className="mt-4 inline-flex items-center gap-2 text-lg font-semibold text-white transition hover:text-blue-400">
            <Mail className="h-5 w-5" />
            toolkitaiprompt@gmail.com
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
            <input
              type="text"
              name="botcheck"
              value=""
              onChange={() => {}}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />
            <button type="submit" disabled={status === "sending"}
              className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-400 disabled:opacity-60">
              {status === "sending" ? "Sending..." : "Send Message"} <SendHorizontal className="h-4 w-4" />
            </button>
            {status === "success" && (
              <div role="status" className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
                <p className="text-sm text-emerald-400">✓ Thank you! Your message has been sent successfully. We'll get back to you soon.</p>
              </div>
            )}
            {status === "fallback" && (
              <div role="status" className="space-y-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                <p className="text-sm font-medium text-amber-300">⚠️ Web3Forms unreachable — fallback ready</p>
                <p className="text-xs leading-5 text-slate-400">
                  Your message is saved locally and copied to clipboard. Click below to send via your email app — no data lost even if third-party service is down (fixes #12).
                </p>
                <div className="flex flex-wrap gap-2">
                  {fallbackMailto && (
                    <a
                      href={fallbackMailto}
                      className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-xs font-semibold text-black hover:bg-amber-400"
                    >
                      📧 Open Mail App
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(formData.message);
                        setCopiedFallback(true);
                        setTimeout(() => setCopiedFallback(false), 2000);
                      } catch {}
                    }}
                    className="rounded-full border border-slate-600 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800"
                  >
                    {copiedFallback ? "✓ Copied!" : "Copy Message"}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">Direct email: <a href="mailto:toolkitaiprompt@gmail.com" className="text-amber-400 underline break-all">toolkitaiprompt@gmail.com</a></p>
                <p className="text-[11px] text-slate-500">Draft auto-saved in browser</p>
              </div>
            )}
          </div>
        </form>
      </div>
    </SectionShell>
  );
}

function PlaygroundPage() {
  const [activeTab, setActiveTab] = useState<"blog" | "code" | "email">("blog");
  const [promptText, setPromptText] = useState("");
  const [blogTopic, setBlogTopic] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("Python");
  const [emailType, setEmailType] = useState("Cold Email");
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const debugResult = useMemo(() => (promptText.trim() ? debugPrompt(promptText) : null), [promptText]);
  const tokenEst = useMemo(() => (promptText.trim() ? estimateTokens(promptText) : null), [promptText]);

  const generateTemplate = (tab: "blog" | "code" | "email") => {
    let template = "";
    if (tab === "blog") {
      template = `You are an expert SEO content writer specializing in ${blogTopic || "technology"}.

Write a comprehensive blog post of 1,500-2,000 words.

Target audience: ${blogTopic ? `${blogTopic} professionals` : "developers and marketers"}.

Structure:
- Catchy headline with primary keyword
- Engaging introduction (hook in first 2 sentences)
- H2 subheadings every 200-300 words
- Bullet points where appropriate
- Internal linking suggestions
- Meta description (max 155 characters)
- FAQ section with 5 questions

Tone: Professional yet conversational. Avoid jargon unless explained.

Keywords to include naturally: ${blogTopic || "AI tools, automation, productivity"}

Call to action at the end encouraging readers to explore our tools.`;
    } else if (tab === "code") {
      template = `You are a senior ${codeLanguage} developer and code reviewer.

Review the following code for:
1. Bugs and potential errors
2. Performance issues
3. Security vulnerabilities
4. Code style and best practices
5. Documentation completeness

For each issue found, provide:
- Severity (Critical / Warning / Info)
- Line number reference
- Clear explanation of the issue
- Suggested fix with corrected code

Output format:
| Severity | Line | Issue | Fix |
|----------|------|-------|-----|
| Critical | ...  | ...   | ... |

Be specific and actionable. Do not suggest changes without justification.`;
    } else {
      template = `You are an expert copywriter specializing in ${emailType.toLowerCase()} emails.

Write a ${emailType} that:

- Opens with a personalized hook (reference something specific about the prospect)
- States the value proposition in 1-2 sentences
- Includes 1-2 social proof elements (metrics, testimonials, case studies)
- Has a clear, single call-to-action
- Is 125-175 words total
- Uses a conversational, not salesy tone
- Avoids generic phrases like "I hope this finds you well"

Subject line: Under 50 characters, curiosity-driven, no clickbait.

Product: {{product_name}}
Prospect role: {{prospect_role}}
Key benefit: {{key_benefit}}`;
    }
    setPromptText(template);
  };

  const tabs: { id: "blog" | "code" | "email"; label: string; icon: LucideIcon }[] = [
    { id: "blog", label: "Blog Post", icon: Sparkles },
    { id: "code", label: "Code Review", icon: Code2 },
    { id: "email", label: "Cold Email", icon: SendHorizontal },
  ];

  return (
    <SectionShell
      title="AI Prompt Playground — Test & Debug Prompts Live"
      description="Free AI prompt playground. Generate blog post, code review, and cold email prompt templates, estimate tokens, and debug prompt health in real time — all in your browser."
      keywords="AI Prompt Playground, Prompt Testing, Prompt Debugging, Token Estimation, Prompt Templates, ChatGPT Playground, Prompt Engineering"
    >
      <div className="space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-400/80">Interactive Playground</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Prompt Playground</h1>
          <p className="max-w-2xl text-base sm:text-lg text-slate-400">
            Generate ready-to-use prompt templates for blog posts, code reviews, and cold emails. Test token counts, debug health scores, and optimize in real time — no sign-up, runs entirely in your browser.
          </p>
        </div>

        {/* Tab selector */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); generateTemplate(tab.id); }}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "border-amber-400/40 bg-amber-500/10 text-amber-300"
                    : "border-slate-700 bg-slate-900/50 text-slate-400 hover:text-white hover:border-slate-600"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Conditional inputs for each tab */}
        {activeTab === "blog" && (
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={blogTopic}
              onChange={(e) => setBlogTopic(e.target.value)}
              placeholder="Enter blog topic (e.g., AI automation, productivity tools)..."
              aria-label="Blog topic"
              className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20"
            />
            <button onClick={() => generateTemplate("blog")} className="rounded-xl bg-amber-500 hover:bg-amber-400 px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90">Generate</button>
          </div>
        )}
        {activeTab === "code" && (
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={codeLanguage}
              onChange={(e) => setCodeLanguage(e.target.value)}
              aria-label="Programming language"
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-amber-400/60"
            >
              <option>Python</option><option>JavaScript</option><option>TypeScript</option><option>Java</option><option>Go</option><option>Rust</option><option>C++</option><option>Ruby</option>
            </select>
            <button onClick={() => generateTemplate("code")} className="rounded-xl bg-amber-500 hover:bg-amber-400 px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90">Generate</button>
          </div>
        )}
        {activeTab === "email" && (
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={emailType}
              onChange={(e) => setEmailType(e.target.value)}
              aria-label="Email type"
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-amber-400/60"
            >
              <option>Cold Email</option><option>Follow-Up Email</option><option>Newsletter</option><option>Re-Engagement Email</option><option>Sales Outreach</option>
            </select>
            <button onClick={() => generateTemplate("email")} className="rounded-xl bg-amber-500 hover:bg-amber-400 px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90">Generate</button>
          </div>
        )}

        {/* Prompt textarea */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <label htmlFor="playground-prompt" className="text-sm font-semibold text-white">Your Prompt</label>
            <textarea
              id="playground-prompt"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Click a tab above to generate a template, or paste your own prompt here..."
              className="h-80 w-full rounded-xl border border-slate-700 bg-slate-900 p-4 text-sm leading-relaxed text-slate-100 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20 resize-y"
            />
            <div className="flex flex-wrap gap-3">
              <button onClick={async () => { if (await copyToClipboard(promptText)) { setCopiedPrompt(true); setTimeout(() => setCopiedPrompt(false), 2000); } }} className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/5 hover:text-white">{copiedPrompt ? "✓ Copied!" : "Copy"}</button>
              <button onClick={() => setPromptText("")} className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/5 hover:text-white">Clear</button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Token estimation */}
            {tokenEst && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
                <h3 className="text-sm font-semibold text-white">Token Estimation</h3>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-slate-900 p-3 text-center">
                    <p className="text-2xl font-bold text-amber-400">{tokenEst.estimatedTokens.toLocaleString()}</p>
                    <p className="mt-1 text-xs text-slate-500">Tokens</p>
                  </div>
                  <div className="rounded-lg bg-slate-900 p-3 text-center">
                    <p className="text-2xl font-bold text-white">{tokenEst.words.toLocaleString()}</p>
                    <p className="mt-1 text-xs text-slate-500">Words</p>
                  </div>
                  <div className="rounded-lg bg-slate-900 p-3 text-center">
                    <p className="text-2xl font-bold text-emerald-400">${((tokenEst.estimatedTokens / 1000) * 0.002).toFixed(4)}</p>
                    <p className="mt-1 text-xs text-slate-500">Est. Cost</p>
                  </div>
                </div>
              </div>
            )}

            {/* Debug health score */}
            {debugResult && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
                <h3 className="text-sm font-semibold text-white">Prompt Health Score</h3>
                <div className="mt-3 flex items-center gap-4">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold ${
                    debugResult.healthScore >= 75 ? "bg-emerald-500/15 text-emerald-400" :
                    debugResult.healthScore >= 50 ? "bg-amber-500/15 text-amber-400" :
                    "bg-red-500/15 text-red-400"
                  }`}>
                    {debugResult.healthScore}
                  </div>
                  <div className="flex-1">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                      <div className={`h-full rounded-full ${debugResult.healthScore >= 75 ? "bg-emerald-500" : debugResult.healthScore >= 50 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${debugResult.healthScore}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-slate-400">{debugResult.issues.length} issues detected · {debugResult.metrics.words} words · {debugResult.metrics.sentences} sentences</p>
                  </div>
                </div>
                {debugResult.issues.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {debugResult.issues.slice(0, 5).map((issue, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                        <span className={`mt-0.5 inline-block h-1.5 w-1.5 rounded-full ${issue.severity === "critical" ? "bg-red-500" : issue.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                        <span>{issue.message}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {!promptText.trim() && (
              <div className="flex h-full min-h-[200px] items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950/30 p-6 text-center">
                <div>
                  <Play className="mx-auto h-8 w-8 text-slate-600" />
                  <p className="mt-3 text-sm text-slate-500">Select a tab and generate a template to see token counts and health analysis.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

function ChangelogPage() {
  const changelog: { version: string; date: string; changes: { type: string; text: string }[] }[] = [
    {
      version: "3.1.0",
      date: "August 2026",
      changes: [
        { type: "New", text: "Added 3 new tools: AI Image Prompt Generator, AI Content Summarizer, and AI Regex Generator — bringing the total to 19 tools." },
        { type: "Improved", text: "Fixed broken structured data (ItemList, FAQ, SoftwareApplication) so search engines can index all 19 tools correctly." },
        { type: "Improved", text: "Updated tool counts across the site, JSON-LD, sitemap metadata, and llms.txt for consistent SEO." },
        { type: "Fixed", text: "Removed visible ad placeholder boxes until real ad zones are configured." },
        { type: "Fixed", text: "Homepage demo now shows honest per-tool output with real token statistics." },
        { type: "Fixed", text: "Search now covers the prompt templates library." },
      ],
    },
    {
      version: "3.0.0",
      date: "January 2026",
      changes: [
        { type: "New", text: "Added 6 new tools: Mega Prompt Builder, Prompt Debugger, Security Scanner, Prompt Chain Builder, Prompt Translator, and API Request Builder — bringing the total to 16 tools." },
        { type: "New", text: "Launched the AI Prompt Library with 225+ prompts across 15 professional roles." },
        { type: "New", text: "Added the interactive Prompt Playground for generating and testing blog, code, and email prompt templates with live token estimation and health scoring." },
        { type: "New", text: "Added Prompt Translator supporting 8 languages (Hindi, Spanish, French, German, Japanese, Chinese, Portuguese, Arabic)." },
        { type: "Improved", text: "Updated navigation to include Playground, Prompts, and Tools sections for easier access." },
        { type: "Improved", text: "Enhanced SEO with high-search AI prompting keywords and structured data for all 16 tools." },
        { type: "Improved", text: "Added llms.txt for AI agent discovery and structured data optimization." },
      ],
    },
    {
      version: "2.1.0",
      date: "December 2025",
      changes: [
        { type: "New", text: "Added Prompt Comparison Tool with side-by-side diff highlighting and readability scoring." },
        { type: "New", text: "Added AI Persona Builder for generating expert system prompts for different roles." },
        { type: "Improved", text: "Enhanced mobile responsiveness across all pages and tools." },
        { type: "Improved", text: "Optimized bundle size for faster load times on mobile devices." },
      ],
    },
    {
      version: "2.0.0",
      date: "November 2025",
      changes: [
        { type: "New", text: "Added Advanced Prompt Optimizer with role, format, tone, and constraint patterns." },
        { type: "New", text: "Added Prompt Converter for ChatGPT to Claude, Gemini, and Cursor format conversion." },
        { type: "Improved", text: "Redesigned the entire UI with a modern dark theme and gold accent design." },
        { type: "Improved", text: "Added comprehensive blog section with prompt engineering guides and tutorials." },
      ],
    },
    {
      version: "1.0.0",
      date: "October 2025",
      changes: [
        { type: "New", text: "Launched AI World Hub with 9 in-browser prompt engineering tools." },
        { type: "New", text: "Tools include: Variable Extractor, JSON Schema Generator, JSON Validator, Prompt Formatter, Prompt Cleaner, Token Estimator, and more." },
        { type: "Core", text: "Privacy-first architecture — all processing happens in the browser, no data collection." },
      ],
    },
  ];

  const typeColors: Record<string, string> = {
    New: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
    Improved: "border-blue-500/25 bg-blue-500/10 text-blue-300",
    Core: "border-amber-500/25 bg-amber-500/10 text-amber-300",
  };

  return (
    <SectionShell
      title="Changelog — AI Prompt Toolkit Updates"
      description="Track all updates and new features added to AI World Hub's AI prompt engineering toolkit. See version history, new tools, improvements, and bug fixes."
      keywords="AI Prompt Toolkit Changelog, Updates, New Features, Version History, AI Tools Updates"
    >
      <div className="space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-400/80">Version History</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Changelog</h1>
          <p className="max-w-2xl text-base sm:text-lg text-slate-400">
            Every update, new tool, and improvement to the AI World Hub toolkit — all in one place.
          </p>
        </div>

        <div className="space-y-8">
          {changelog.map((entry) => (
            <div key={entry.version} className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <h2 className="text-lg font-semibold text-white">v{entry.version}</h2>
                <span className="text-sm text-slate-500">{entry.date}</span>
              </div>
              <ul className="mt-4 space-y-3">
                {entry.changes.map((change, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className={`mt-0.5 shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${typeColors[change.type] || typeColors.New}`}>{change.type}</span>
                    <span className="text-sm leading-relaxed text-slate-300">{change.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

function PrivacyPage() {
  return (
    <SectionShell
      title="Privacy Policy"
      description="Privacy policy outlining data handling, cookie usage, advertising partners, and user rights for AI World Hub."
      keywords="Privacy Policy, Free AI Prompt Tools, Prompt Engineering"
    >
      <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: June 24, 2026</p>
      <div className="mt-6 max-w-4xl space-y-6 text-slate-300">
        <p>At AI World Hub, accessible from https://aiworldhub.site, the privacy of our visitors is one of our main priorities. This Privacy Policy document explains the types of information we collect and how we use, store, and protect it.</p>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Information We Collect</h2>
          <p>All tools on AI World Hub process data <strong>entirely within your browser</strong>. Text, prompts, and JSON data you enter into the tools are never sent to our servers, never stored, and never shared with third parties.</p>
          <p>We do collect anonymous usage data through third-party analytics services (described below) to understand how the website is used and to improve our tools.</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Log Files</h2>
          <p>Like most websites, our hosting provider (Cloudflare) and analytics services automatically log standard information such as IP address, browser type, referring pages, timestamps, and pages visited. This data is used solely for analytics and security purposes and is not linked to personally identifiable information.</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Cookies and Tracking Technologies</h2>
          <p>We use cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are small files that may include an anonymous unique identifier.</p>
          <p>Types of cookies we use:</p>
          <ul className="ml-6 list-disc space-y-1">
            <li><strong>Essential cookies:</strong> Required for the website to function correctly.</li>
            <li><strong>Analytics cookies:</strong> Used by Google Analytics to understand visitor behavior.</li>
            <li><strong>Advertising cookies:</strong> Used by Monetag to display relevant ads.</li>
          </ul>
          <p>You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent through your browser settings.</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Monetag Advertising</h2>
          <p>We use Monetag to display advertisements. Monetag, as a third-party vendor, may use cookies to serve ads based on your prior visits to this and other websites.</p>
          <ul className="ml-6 list-disc space-y-1">
            <li>Monetag may use advertising cookies to serve ads to you based on your visit to our site and/or other sites on the Internet.</li>
            <li>You may opt out of personalized advertising by visiting <a href="https://www.monetag.com/privacy-policy/" className="text-cyan-400 hover:underline">Monetag Privacy Policy</a>.</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Google Analytics</h2>
          <p>We use Google Analytics to collect and analyze visitor data. This service collects information such as how often users visit, what pages they view, and what other sites they used prior to coming to our website. This data is aggregated and anonymous.</p>
          <p>You can review Google's privacy policy at <a href="https://policies.google.com/privacy" className="text-cyan-400 hover:underline">https://policies.google.com/privacy</a>.</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Cloudflare Analytics</h2>
          <p>We use Cloudflare Web Analytics, which is a privacy-friendly analytics solution that does not use cross-site tracking or fingerprinting. Cloudflare does not track individual visitors.</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Third-Party Privacy Policies</h2>
          <p>Our Privacy Policy does not apply to other advertisers or websites. We advise you to consult the respective Privacy Policies of these third-party ad servers for more detailed information on their practices as well as for instructions about how to opt-out of certain options.</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Children's Information</h2>
          <p>Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity. AI World Hub does not knowingly collect any Personal Identifiable Information from children under the age of 13.</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Your Data Protection Rights</h2>
          <p>You have the right to:</p>
          <ul className="ml-6 list-disc space-y-1">
            <li>Request access to your personal data</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Withdraw consent to data processing</li>
            <li>Lodge a complaint with a supervisory authority</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Contact Us</h2>
          <p>If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at <a href="mailto:toolkitaiprompt@gmail.com" className="text-cyan-400 hover:underline">toolkitaiprompt@gmail.com</a>.</p>
        </div>
      </div>
    </SectionShell>
  );
}

function TermsPage() {
  return (
    <SectionShell
      title="Terms of Service"
      description="Terms and conditions for using AI World Hub tools and services."
      keywords="Terms of Service, Free AI Prompt Tools, Prompt Engineering"
    >
      <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: June 24, 2026</p>
      <div className="mt-6 max-w-4xl space-y-6 text-slate-300">
        <p>Welcome to AI World Hub. By accessing or using our website at https://aiworldhub.site, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our website.</p>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">1. Use of Our Services</h2>
          <p>AI World Hub provides free, browser-based tools for prompt engineering, including variable extraction, JSON schema generation, validation, formatting, cleaning, token estimation, and optimization. All tools are provided for personal and professional productivity purposes.</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">2. Intellectual Property</h2>
          <p>All content, tools, design, and code on this website are the property of AI World Hub unless otherwise stated. You may not reproduce, distribute, or create derivative works without explicit written permission.</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">3. No Warranty</h2>
          <p>The tools and content provided on this website are offered "as is" and "as available," without warranties of any kind, either express or implied. We do not guarantee that the tools will be error-free, accurate, or uninterrupted.</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">4. Limitation of Liability</h2>
          <p>Under no circumstances shall AI World Hub be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of, or inability to use, our tools and services.</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">5. User Responsibility</h2>
          <p>Users are solely responsible for the content they process through our tools and for verifying the accuracy of any output before using it in production or business environments.</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">6. Third-Party Services</h2>
          <p>Our website uses third-party services such as Google Analytics. We are not responsible for the practices or content of these third-party services. Please review their respective terms and policies.</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">7. Changes to Terms</h2>
          <p>We reserve the right to update or modify these Terms of Service at any time without prior notice. Continued use of the website after changes constitutes acceptance of the new terms.</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">8. Governing Law</h2>
          <p>These terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">9. Contact</h2>
          <p>If you have any questions about these Terms of Service, please contact us at <a href="mailto:toolkitaiprompt@gmail.com" className="text-cyan-400 hover:underline">toolkitaiprompt@gmail.com</a>.</p>
        </div>
      </div>
    </SectionShell>
  );
}

function NotFoundPage() {
  return (
    <SectionShell title="Page Not Found" description="The requested page could not be found.">
      <h1 className="text-3xl font-bold text-white">404 — Page Not Found</h1>
      <p className="mt-3 text-slate-400">Use the navigation to return to the AI World Hub pages.</p>
    </SectionShell>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL?.replace(/\/$/, "") || ""}>
      <MonetagSPA />
      <Layout />
    </BrowserRouter>
  );
}
