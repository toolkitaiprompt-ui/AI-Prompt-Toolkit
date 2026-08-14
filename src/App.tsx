import React, { type FormEvent, type ReactElement, type ReactNode, lazy, Suspense, useEffect, useMemo, useState } from "react";
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
import ENGINE from "./data/prompt-engine.json";
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

type EngineTask = {
  title: string;
  slug: string;
  category: string;
  prompt: string;
  seoTitle: string;
  seoDescription: string;
  faq: { question: string; answer: string }[];
};

const PROMPT_TASKS_BY_ROLE = ENGINE.tasks as Record<string, EngineTask[]>;
const HomePage = lazy(() => import("./components/HomePage"));

const TemplatesPage = lazy(() => import("./pages/TemplatesPage"));
const CategoriesPage = lazy(() => import("./pages/CategoriesPage"));
const ImageGeneratorPage = lazy(() => import("./pages/ImageGeneratorPage"));

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
            <button type="button" onClick={() => setSearchOpen(true)} className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center hover:bg-white/5 transition text-slate-400 hover:text-white" aria-label="Search">
              <Search className="w-4 h-4" />
            </button>

          </div>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/5 transition-colors"
            aria-label="Menu"
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
          <div className="md:hidden mx-4 mt-2 rounded-2xl border border-white/[0.08] bg-slate-900/90 backdrop-blur-xl px-3 py-3 shadow-xl">
            <nav className="space-y-1">
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

function SectionShell({
  title, description, keywords, children,
}: {
  title: string; description: string; keywords?: string; children: ReactNode;
}) {
  useSeo(title, description, keywords);
  return (
    <section className="site-container section-lg">
      {children}
    </section>
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
      {error && <p className="text-sm text-red-400">{error}</p>}
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
      {error && <p className="text-sm text-red-400">{error}</p>}
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

function ContactPage() {
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem("contact_draft");
      if (saved) return JSON.parse(saved);
    } catch {}
    return { name: "", email: "", message: "" };
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "fallback">("idle");
  const [fallbackMailto, setFallbackMailto] = useState("");

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

    // Try web3forms primary
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "0a57b145-da61-4b05-b7c4-31c90d681d36",
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `New contact form submission from ${formData.name}`,
        }),
      });
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
            <button type="submit" disabled={status === "sending"}
              className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-400 disabled:opacity-60">
              {status === "sending" ? "Sending..." : "Send Message"} <SendHorizontal className="h-4 w-4" />
            </button>
            {status === "success" && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
                <p className="text-sm text-emerald-400">✓ Thank you! Your message has been sent successfully. We'll get back to you soon.</p>
              </div>
            )}
            {status === "fallback" && (
              <div className="space-y-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
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
                      try { await navigator.clipboard.writeText(formData.message); alert("Message copied!"); } catch {}
                    }}
                    className="rounded-full border border-slate-600 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800"
                  >
                    Copy Message
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
            <label className="text-sm font-semibold text-white">Your Prompt</label>
            <textarea
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

const PROMPT_ROLES: { slug: string; title: string; icon: LucideIcon; accent: string; count: number; description: string }[] = [
  { slug: "chatgpt", title: "ChatGPT Prompts", icon: Sparkles, accent: "from-emerald-500/30 to-green-400/10", count: 15, description: "Best ChatGPT prompts for writing, coding, brainstorming, and productivity." },
  { slug: "content-writer", title: "Content Writer Prompts", icon: WandSparkles, accent: "from-blue-500/30 to-cyan-400/10", count: 15, description: "Blog posts, SEO articles, social media, and email copywriting prompts." },
  { slug: "developer", title: "Developer Prompts", icon: Code2, accent: "from-indigo-500/30 to-blue-400/10", count: 15, description: "Code generation, debugging, code review, refactoring, and documentation prompts." },
  { slug: "marketer", title: "Marketer Prompts", icon: Zap, accent: "from-amber-500/30 to-yellow-400/10", count: 15, description: "Campaign strategy, ad copy, social media, and growth marketing prompts." },
  { slug: "seo-specialist", title: "SEO Specialist Prompts", icon: Search, accent: "from-rose-500/30 to-amber-400/10", count: 15, description: "Keyword research, on-page SEO, technical SEO, and content optimization prompts." },
  { slug: "data-analyst", title: "Data Analyst Prompts", icon: Sigma, accent: "from-cyan-500/30 to-blue-400/10", count: 15, description: "Data analysis, SQL queries, data visualization, and reporting prompts." },
  { slug: "business-analyst", title: "Business Analyst Prompts", icon: Braces, accent: "from-violet-500/30 to-indigo-400/10", count: 15, description: "Requirements gathering, process mapping, stakeholder communication prompts." },
  { slug: "graphic-designer", title: "Graphic Designer Prompts", icon: Sparkles, accent: "from-fuchsia-500/30 to-pink-400/10", count: 15, description: "Logo design, brand identity, UI/UX, and creative direction prompts." },
  { slug: "sales", title: "Sales Prompts", icon: ArrowUpRight, accent: "from-emerald-500/30 to-teal-400/10", count: 15, description: "Cold outreach, sales scripts, objection handling, and follow-up prompts." },
  { slug: "customer-support", title: "Customer Support Prompts", icon: ShieldCheck, accent: "from-blue-500/30 to-cyan-400/10", count: 15, description: "Support responses, ticket triage, FAQ generation, and escalation prompts." },
  { slug: "product-manager", title: "Product Manager Prompts", icon: Hammer, accent: "from-amber-500/30 to-orange-400/10", count: 15, description: "Product specs, user stories, roadmap planning, and feature prioritization prompts." },
  { slug: "researcher", title: "Researcher Prompts", icon: Search, accent: "from-indigo-500/30 to-purple-400/10", count: 15, description: "Literature review, data collection, survey design, and analysis prompts." },
  { slug: "student", title: "Student Prompts", icon: Sparkles, accent: "from-sky-500/30 to-blue-400/10", count: 15, description: "Study guides, essay writing, exam prep, and learning assistance prompts." },
  { slug: "entrepreneur", title: "Entrepreneur Prompts", icon: Zap, accent: "from-amber-500/30 to-red-400/10", count: 15, description: "Business planning, pitch decks, investor outreach, and strategy prompts." },
  { slug: "consultant", title: "Consultant Prompts", icon: Braces, accent: "from-teal-500/30 to-cyan-400/10", count: 15, description: "Client analysis, strategy development, recommendations, and reporting prompts." },
];

const PROMPT_LIBRARY: Record<string, { title: string; prompt: string; category: string }[]> = {
  chatgpt: [
    { title: "Brainstorming Session", category: "Creative", prompt: "Act as a creative brainstorming partner. I want to explore ideas for {{topic}}. Generate 20 diverse, creative, and unexpected ideas. For each idea, provide a brief 1-sentence description and rate its feasibility (1-5). Prioritize novelty over practicality in the first 10, then balance both in the last 10." },
    { title: "Email Drafting", category: "Writing", prompt: "Write a professional email about {{topic}} to {{recipient}}. Tone: {{tone}}. Keep it under 150 words. Include a clear subject line, greeting, 2-3 body paragraphs, and a call to action. Avoid generic phrases." },
    { title: "Summarize Article", category: "Analysis", prompt: "Summarize the following article in 3 formats: 1) A 50-word executive summary, 2) 5 bullet points covering key takeaways, 3) A 2-sentence TL;DR. Preserve the main argument and key data points. Article: {{article_text}}" },
    { title: "Explain Complex Topic", category: "Learning", prompt: "Explain {{topic}} as if you were teaching a {{level}} student. Use analogies from everyday life. Break it into 3 sections: What it is, Why it matters, and How it works. Keep each section under 100 words." },
    { title: "Creative Story", category: "Creative", prompt: "Write a {{genre}} short story (800-1000 words) set in {{setting}}. The protagonist is {{character_description}}. Include a plot twist, vivid sensory descriptions, and dialogue. Theme: {{theme}}." },
    { title: "Productivity Plan", category: "Productivity", prompt: "Create a weekly productivity plan for a {{role}} who wants to achieve {{goal}}. Include daily tasks, time blocks, breaks, and a review session. Account for {{constraints}}." },
    { title: "Decision Matrix", category: "Analysis", prompt: "Help me decide between {{option_1}} and {{option_2}}. Create a decision matrix with 8 criteria (cost, time, risk, scalability, learning curve, maintenance, ROI, alignment with goals). Score each option 1-10 per criterion. Provide a final recommendation with reasoning." },
    { title: "Meeting Notes Summary", category: "Business", prompt: "Transform the following meeting transcript into structured notes: 1) Key decisions made, 2) Action items (with owner and deadline), 3) Open questions, 4) Next steps. Format as a clean table where possible. Transcript: {{transcript}}" },
    { title: "Social Media Caption", category: "Marketing", prompt: "Write 5 social media captions for {{platform}} about {{topic}}. Each caption should be under 220 characters, include relevant hashtags, have a distinct tone (professional, playful, inspirational, educational, controversial), and end with a call to action." },
    { title: "Recipe Generator", category: "Lifestyle", prompt: "Create a recipe using {{available_ingredients}}. Dietary restriction: {{diet}}. Cooking time: under {{time}} minutes. Provide: ingredients list with measurements, step-by-step instructions, nutritional estimate, and a plating suggestion." },
    { title: "Travel Itinerary", category: "Lifestyle", prompt: "Create a {{days}}-day travel itinerary for {{destination}}. Budget: {{budget_level}}. Interests: {{interests}}. For each day, include morning, afternoon, and evening activities, estimated costs, transportation tips, and one local food recommendation." },
    { title: "Language Practice", category: "Learning", prompt: "Act as a {{language}} language tutor. Create a dialogue about {{scenario}} at {{proficiency_level}} level. Include 10-15 exchanges, vocabulary notes for 5 key phrases, and 3 grammar tips. Then ask me 3 comprehension questions." },
    { title: "Investment Analysis", category: "Finance", prompt: "Analyze {{asset}} as a potential investment. Evaluate: 1) Current market position, 2) Key risks (3), 3) Growth catalysts (3), 4) Financial health indicators, 5) 5-year outlook. Provide a risk-reward rating (1-10) and a clear buy/hold/avoid recommendation with reasoning." },
    { title: "Workout Plan", category: "Lifestyle", prompt: "Create a {{weeks}}-week workout plan for {{fitness_goal}}. Current fitness level: {{level}}. Available equipment: {{equipment}}. Provide weekly schedule, exercises with sets/reps, progressive overload plan, and recovery recommendations." },
    { title: "Gift Ideas", category: "Lifestyle", prompt: "Suggest 10 gift ideas for a {{relationship}} who is {{age}} years old, interested in {{interests}}, with a budget of {{budget}}. For each gift, explain why it's a good fit and where to buy it. Include 2 DIY options." },
  ],
  "content-writer": [
    { title: "SEO Blog Post", category: "Blog", prompt: "Write a 1,500-word SEO-optimized blog post about {{topic}}. Target keyword: {{keyword}}. Include: catchy H1, meta description (155 chars), 5 H2 subheadings, internal linking suggestions, and a CTA. Tone: {{tone}}. Search intent: {{intent_type}}." },
    { title: "Listicle Article", category: "Blog", prompt: "Write a listicle titled '10 Best {{topic}} for {{audience}}'. Each item should have: a bold headline, 2-3 sentence description, pros/cons, and a rating (1-5). Include an introduction explaining selection criteria and a conclusion with a recommendation." },
    { title: "Product Description", category: "E-commerce", prompt: "Write a product description for {{product_name}}. Target audience: {{audience}}. Highlight 3 key benefits, include technical specs, add social proof language, and end with a urgency-driven CTA. Keep under 200 words. Tone: {{tone}}." },
    { title: "Social Media Content", category: "Social", prompt: "Create a 7-day social media content calendar for {{brand}} on {{platform}}. For each day, provide: post type (educational, entertaining, promotional, engagement), caption (220 chars), 3-5 hashtags, best posting time, and visual suggestion." },
    { title: "Newsletter Welcome", category: "Email", prompt: "Write a welcome newsletter for new subscribers to {{newsletter_name}}. Include: warm greeting, what to expect (3 bullet points), frequency, a quick-win tip related to {{topic}}, and a soft CTA to reply with their biggest challenge." },
    { title: "Press Release", category: "PR", prompt: "Write a press release for {{event_launch}}. Format: FOR IMMEDIATE RELEASE, headline, dateline, 2-3 body paragraphs covering who/what/when/where/why, a quote from {{spokesperson}}, boilerplate about {{company}}, and media contact info." },
    { title: "Case Study", category: "Marketing", prompt: "Write a case study about how {{product}} helped {{client_name}} achieve {{result}}. Structure: Challenge, Solution, Implementation, Results (with specific metrics), and Testimonial quote. Length: 800-1,000 words. Tone: professional and data-driven." },
    { title: "Landing Page Copy", category: "Marketing", prompt: "Write landing page copy for {{product}}. Sections: Hero headline + subheadline, 3 benefit blocks (headline + 2-sentence description), social proof section, feature comparison table, FAQ (5 questions), and a CTA section. Target: {{audience}}." },
    { title: "Video Script", category: "Video", prompt: "Write a {{duration}}-minute YouTube video script about {{topic}}. Include: hook (first 15 seconds), intro, 3-5 main points with B-roll suggestions, screen recording cues, and a CTA to subscribe. Tone: {{tone}}." },
    { title: "Whitepaper", category: "B2B", prompt: "Write an executive summary for a whitepaper about {{industry_topic}}. Cover: current state of {{industry}}, 3 key challenges, proposed solution framework, expected outcomes, and a call for a consultation. Length: 500-700 words." },
    { title: "Product Review", category: "Blog", prompt: "Write an honest review of {{product}}. Include: overview, first impressions, 5 key features tested, pros (3), cons (3), value for money rating (1-10), comparison to {{competitor}}, and a final verdict. Tone: balanced and objective." },
    { title: "Email Sequence", category: "Email", prompt: "Write a 5-email onboarding sequence for {{product}}. Email 1: Welcome + quick win. Email 2: Core feature tutorial. Email 3: Advanced tip. Email 4: Social proof + case study. Email 5: Upsell or referral ask. Each email 150-200 words with clear subject lines." },
    { title: "Infographic Content", category: "Visual", prompt: "Create content for an infographic about {{topic}}. Provide: a catchy title, 5-7 data points with statistics, 3 key takeaways, a 'Did You Know' section, and a source list. Suggest visual layout (icons, charts, color scheme)." },
    { title: "Webinar Description", category: "Marketing", prompt: "Write a webinar description for '{{webinar_title}}'. Include: compelling title, 2-sentence summary, 5 learning objectives, target audience description, speaker bio (3 sentences), date/time placeholder, and a CTA to register." },
    { title: "Podcast Show Notes", category: "Audio", prompt: "Write show notes for a podcast episode about {{topic}} with guest {{guest_name}}. Include: episode summary (100 words), 5 key takeaways, 3 timestamps with topic labels, guest bio, links mentioned, and a CTA to subscribe." },
  ],
  developer: [
    { title: "Code Generation", category: "Development", prompt: "Write a {{language}} function that {{functionality}}. Requirements: handle edge cases (empty input, null, invalid types), add input validation, include docstring/comments, follow {{language}} best practices, and provide 3 test cases (normal, edge, error)." },
    { title: "Bug Debugging", category: "Debugging", prompt: "Debug the following {{language}} code. Identify: 1) All bugs (with line numbers), 2) Root cause for each, 3) Severity (Critical/Warning/Info), 4) Fixed code. Explain each fix. Code: {{code_snippet}}" },
    { title: "Code Review", category: "Review", prompt: "Review this {{language}} code for: bugs, performance issues, security vulnerabilities, code style violations, and missing error handling. For each issue: severity (1-5), line number, explanation, and suggested fix with corrected code. Code: {{code}}" },
    { title: "Refactoring", category: "Development", prompt: "Refactor this {{language}} code to improve: readability, performance, maintainability, and adherence to SOLID principles. Explain each change. Provide the refactored code with comments. Original code: {{code}}" },
    { title: "API Design", category: "Architecture", prompt: "Design a REST API for {{feature}}. Provide: endpoint list (method, path, description, auth required), request/response schemas (JSON), error codes, rate limiting strategy, and 3 example requests with expected responses." },
    { title: "Unit Tests", category: "Testing", prompt: "Write comprehensive unit tests in {{test_framework}} for the following {{language}} function. Cover: normal cases (3), edge cases (3), error cases (2), and boundary conditions (2). Use mocking where needed. Include test descriptions. Function: {{function_code}}" },
    { title: "Documentation", category: "Docs", prompt: "Write documentation for {{code_or_api}}. Include: overview, installation/usage instructions, parameter/reference table, 3 code examples (basic, intermediate, advanced), common errors and solutions, and best practices. Format: Markdown." },
    { title: "SQL Query", category: "Database", prompt: "Write a SQL query to {{query_goal}}. Database schema: {{schema}}. Requirements: optimize for performance, add proper indexes suggestion, handle NULL values, and explain the query logic. Provide 2 alternative approaches if possible." },
    { title: "Regex Pattern", category: "Development", prompt: "Create a regex pattern to match {{pattern_description}}. Provide: the regex, explanation of each component, 5 test strings (3 should match, 2 should not), and the regex in 3 languages (JavaScript, Python, Java). Handle edge cases." },
    { title: "Architecture Design", category: "Architecture", prompt: "Design a system architecture for {{application_type}} handling {{scale}}. Include: component diagram description, technology stack recommendations, data flow explanation, scaling strategy, security considerations, and monitoring approach." },
    { title: "Git Commit Message", category: "Workflow", prompt: "Write 3 git commit message options for the following changes. Follow conventional commits format (type(scope): description). Each message should have: a concise subject line (under 50 chars), a detailed body explaining what and why, and a footer if applicable. Changes: {{changes}}" },
    { title: "CI/CD Pipeline", category: "DevOps", prompt: "Create a CI/CD pipeline configuration for {{project_type}} using {{ci_tool}}. Include: build stage, test stage (unit + integration), linting, security scan, deployment to {{environment}}, and rollback strategy. Provide the YAML/config file." },
    { title: "Technical Blog", category: "Writing", prompt: "Write a technical blog post (1,200 words) about {{technology_topic}}. Target audience: {{audience_level}} developers. Include: introduction, 3-4 code examples, diagrams (described), pros/cons, and practical use cases. Tone: informative and practical." },
    { title: "Performance Optimization", category: "Performance", prompt: "Analyze this {{language}} code for performance. Identify: 3 bottlenecks, time complexity (Big O), space complexity, and provide optimized alternatives for each bottleneck. Include before/after benchmarks estimate. Code: {{code}}" },
    { title: "Security Audit", category: "Security", prompt: "Perform a security audit of this {{language}} code. Check for: SQL injection, XSS, CSRF, authentication flaws, input validation, sensitive data exposure, and insecure dependencies. Rate each issue (Critical/High/Medium/Low) and provide fixes. Code: {{code}}" },
  ],
  marketer: [
    { title: "Campaign Strategy", category: "Strategy", prompt: "Create a marketing campaign strategy for {{product}} targeting {{audience}}. Include: campaign objectives, key messaging, channel mix (3-5 channels), budget allocation (%), timeline (4 weeks), KPIs, and success metrics. Budget: {{budget}}." },
    { title: "Ad Copy (Google Ads)", category: "Advertising", prompt: "Write 5 Google Ads variations for {{product}}. Each: headline (30 chars max), description 1 (90 chars), description 2 (90 chars), display URL, and 3 sitelink extensions. Target keyword: {{keyword}}. Include CTA and unique value prop in each." },
    { title: "Facebook Ad Copy", category: "Advertising", prompt: "Write 3 Facebook ad copy variations for {{product}}. Each: primary text (200 chars), headline (40 chars), link description (30 chars). Different angles: emotional, logical, social proof. Target: {{audience}}. Include CTA." },
    { title: "Growth Strategy", category: "Strategy", prompt: "Create a growth marketing strategy for {{startup}} in the {{industry}} space. Include: growth funnel analysis, 5 acquisition channels with priority ranking, 3 retention tactics, viral coefficient improvement ideas, and 90-day action plan." },
    { title: "Brand Positioning", category: "Branding", prompt: "Develop a brand positioning statement for {{brand}}. Include: target audience definition, category frame of reference, unique point of differentiation, reason to believe, and brand personality (5 traits). Compare to 3 competitors." },
    { title: "Email Marketing", category: "Email", prompt: "Create an email marketing campaign for {{product_launch}}. Include: 4-email sequence (teaser, launch, social proof, last chance), subject lines for each (A/B variants), send timing, segmentation strategy, and success metrics." },
    { title: "Social Media Strategy", category: "Social", prompt: "Create a social media strategy for {{brand}} on {{platforms}}. Include: content pillars (4), posting frequency, tone of voice, engagement strategy, influencer collaboration ideas, and 30-day content calendar outline." },
    { title: "Competitor Analysis", category: "Research", prompt: "Analyze {{competitor_name}} vs our brand {{our_brand}}. Include: product comparison (5 features), pricing analysis, marketing channel comparison, strengths/weaknesses (3 each), market share estimate, and 3 differentiation opportunities." },
    { title: "Marketing Funnel", category: "Strategy", prompt: "Map a marketing funnel for {{product}}. For each stage (Awareness, Interest, Consideration, Intent, Purchase, Retention, Advocacy): tactics, content types, channels, KPIs, and conversion benchmarks. Identify funnel leaks." },
    { title: "A/B Test Plan", category: "Optimization", prompt: "Design an A/B test for {{element}} on {{page}}. Include: hypothesis, control and variant descriptions, primary metric, secondary metrics, sample size calculation, test duration, statistical significance threshold, and decision criteria." },
    { title: "Landing Page Optimization", category: "Optimization", prompt: "Analyze this landing page copy for conversion optimization. Identify: 3 weaknesses, 5 specific improvements, headline alternatives (3), CTA alternatives (3), and trust signal additions. Current copy: {{copy}}" },
    { title: "Influencer Campaign", category: "Partnerships", prompt: "Design an influencer marketing campaign for {{product}}. Include: influencer criteria (follower range, niche, engagement rate), 5 outreach message templates, compensation model, content deliverables, tracking strategy, and ROI measurement." },
    { title: "Content Calendar", category: "Content", prompt: "Create a 30-day content marketing calendar for {{brand}}. For each day: content type (blog, social, video, email), topic, target keyword, platform, CTA, and goal. Balance awareness (40%), consideration (30%), conversion (20%), retention (10%)." },
    { title: "Customer Journey Map", category: "Strategy", prompt: "Map the customer journey for {{product}}. For each stage (Discovery, Research, Purchase, Onboarding, Usage, Advocacy): touchpoints, customer actions, emotions, pain points, and opportunities. Identify 3 moments of truth and 2 friction points." },
    { title: "Retargeting Strategy", category: "Advertising", prompt: "Create a retargeting strategy for {{product}}. Segment audiences: cart abandoners, page visitors, past customers, email subscribers. For each: ad creative angle, platform, bid strategy, frequency cap, and expected CTR/CVR. Budget: {{budget}}." },
  ],
  "seo-specialist": [
    { title: "Keyword Research", category: "Research", prompt: "Perform keyword research for {{topic}}. Provide: 20 primary keywords with search volume and difficulty, 10 long-tail keywords, 5 question-based keywords (People Also Ask), 3 competitor keywords to target, and a keyword clustering strategy. Intent: {{intent_type}}." },
    { title: "On-Page SEO Audit", category: "Audit", prompt: "Audit this page for on-page SEO: {{url_or_content}}. Check: title tag (length, keyword), meta description, H1-H6 structure, keyword density, internal links, image alt text, schema markup, page speed factors, and mobile-friendliness. Provide 10 prioritized fixes." },
    { title: "Technical SEO Audit", category: "Technical", prompt: "Perform a technical SEO audit checklist for {{website}}. Cover: crawlability, indexability, site architecture, URL structure, robots.txt, sitemap, canonical tags, hreflang, Core Web Vitals, JavaScript rendering, and 404 handling. Prioritize issues by impact." },
    { title: "Content Brief", category: "Content", prompt: "Create an SEO content brief for a blog post targeting keyword {{keyword}}. Include: search intent, target audience, word count recommendation, title (with keyword), outline (H1-H3), related keywords (LSI), internal/external link suggestions, and CTA." },
    { title: "Meta Tags Optimization", category: "On-Page", prompt: "Write optimized meta tags for {{page}} targeting {{keyword}}. Provide: 3 title tag options (under 60 chars), 3 meta description options (under 155 chars), 5 meta keywords, canonical URL, and Open Graph tags (og:title, og:description, og:image suggestion)." },
    { title: "Link Building Strategy", category: "Link Building", prompt: "Create a link building strategy for {{website}} in the {{industry}} niche. Include: 5 linkable asset ideas, 3 outreach templates (guest post, resource, broken link), target site criteria, anchor text distribution strategy, and monthly link velocity plan." },
    { title: "Competitor SEO Analysis", category: "Research", prompt: "Analyze the SEO strategy of {{competitor_url}}. Include: estimated organic traffic, top 10 ranking keywords, backlink profile overview, content gaps we can exploit, technical SEO strengths/weaknesses, and 5 actionable opportunities for us." },
    { title: "Local SEO", category: "Local", prompt: "Create a local SEO strategy for {{business_type}} in {{location}}. Include: Google Business Profile optimization, local keyword targeting (10), review strategy, local citation sources (10), NAP consistency checklist, and local content ideas (5)." },
    { title: "Schema Markup", category: "Technical", prompt: "Generate JSON-LD schema markup for {{page_type}}. Include: appropriate schema type (Article, Product, FAQPage, BreadcrumbList, etc.), all required and recommended properties, valid JSON-LD code, and explanation of each field. Page details: {{details}}" },
    { title: "SERP Analysis", category: "Research", prompt: "Analyze the SERP for keyword {{keyword}}. Include: content types ranking (listicle, guide, product page, video), common SERP features (featured snippet, PAA, image pack), word count of top 5 results, common headings, and content gaps to exploit." },
    { title: "Content Gap Analysis", category: "Content", prompt: "Perform a content gap analysis between our site and {{competitor}}. Identify: 15 keywords they rank for that we don't, 10 topics they cover that we miss, content quality comparison, and a prioritized list of 5 content pieces to create with target keywords." },
    { title: "Core Web Vitals", category: "Technical", prompt: "Create a Core Web Vitals optimization plan for {{website}}. Address: LCP (target < 2.5s), FID/INP (target < 100ms), CLS (target < 0.1). For each metric: current issues, specific fixes, implementation steps, and expected improvement. Include mobile-specific fixes." },
    { title: "Internal Linking Strategy", category: "On-Page", prompt: "Create an internal linking strategy for {{website}}. Include: hub/page structure, anchor text guidelines, link distribution rules, orphan page identification approach, breadcrumb strategy, and 5 specific internal linking improvements for existing pages." },
    { title: "SEO Reporting", category: "Analytics", prompt: "Create an SEO reporting template for {{client}}. Include: executive summary section, organic traffic metrics, keyword ranking changes (top 10/gains/losses), conversion metrics, technical health score, and 3 key recommendations. Format as a monthly report structure." },
    { title: "E-commerce SEO", category: "E-commerce", prompt: "Create an e-commerce SEO strategy for {{store}}. Include: product page optimization template, category page optimization, faceted navigation handling, product schema markup, review schema, pagination strategy, and 5 product page SEO wins." },
  ],
  "data-analyst": [
    { title: "Data Cleaning", category: "Data Prep", prompt: "Write a Python script to clean a dataset with the following issues: {{issues}}. Handle: missing values (imputation strategy), outliers (detection + treatment), data type conversion, duplicate removal, and inconsistent formatting. Include comments and validation checks." },
    { title: "SQL Data Analysis", category: "SQL", prompt: "Write SQL queries to analyze {{dataset_description}}. Answer these business questions: 1) {{question_1}}, 2) {{question_2}}, 3) {{question_3}}. Include: JOINs, aggregations, window functions, date filtering, and subqueries. Explain each query." },
    { title: "Data Visualization", category: "Visualization", prompt: "Create a data visualization plan for {{dataset}}. Recommend: 5 chart types with rationale, data encoding (x/y/color/size), dashboard layout, interactivity (filters, drill-downs), color palette (accessible), and key insights each chart should reveal." },
    { title: "Statistical Analysis", category: "Statistics", prompt: "Perform statistical analysis on {{dataset_description}}. Include: descriptive statistics (mean, median, mode, std dev), distribution analysis, correlation matrix methodology, hypothesis testing framework (H0, H1, test choice), and significance level justification." },
    { title: "Pandas DataFrame", category: "Python", prompt: "Write a Python script using Pandas to {{analysis_goal}} on a DataFrame with columns: {{columns}}. Include: data loading, preprocessing, the analysis logic, result formatting, and error handling. Add comments explaining each step." },
    { title: "Data Pipeline", category: "Engineering", prompt: "Design a data pipeline for {{data_source}} to {{destination}}. Include: extraction strategy, transformation steps, loading approach, scheduling, error handling, data quality checks, monitoring, and a Python implementation outline using {{framework}}." },
    { title: "Exploratory Data Analysis", category: "Analysis", prompt: "Create an EDA plan for {{dataset}} with {{features}} features and {{rows}} rows. Include: univariate analysis (categorical + numerical), bivariate analysis, missing data patterns, outlier detection, feature correlations, and 5 key questions to investigate." },
    { title: "A/B Test Analysis", category: "Statistics", prompt: "Analyze A/B test results for {{test_description}}. Given: control conversion {{control_rate}}, variant conversion {{variant_rate}}, sample size {{sample_size}}. Calculate: statistical significance, confidence interval, effect size, practical significance, and provide a recommendation with confidence level." },
    { title: "Dashboard Design", category: "Visualization", prompt: "Design a business intelligence dashboard for {{department}} tracking {{metrics}}. Include: KPI definitions, chart types (5), layout wireframe (described), filter/hierarchy design, color coding logic, refresh frequency, and 3 alert conditions." },
    { title: "Forecasting Model", category: "Modeling", prompt: "Create a forecasting model plan for {{metric}} with {{data_frequency}} data. Recommend: 3 models (simple, intermediate, advanced), feature engineering, train/test split strategy, evaluation metrics (MAE, RMSE, MAPE), and a Python implementation outline." },
    { title: "Data Report", category: "Reporting", prompt: "Write a data analysis report for {{analysis_topic}}. Structure: executive summary, methodology, key findings (5), data limitations, recommendations (3), and appendix with data dictionary. Target audience: {{audience}}. Tone: data-driven and objective." },
    { title: "Customer Segmentation", category: "Analysis", prompt: "Perform customer segmentation analysis for {{business}}. Using RFM (Recency, Frequency, Monetary) and behavioral data. Define: 4-6 segments, characteristics of each, size estimate, value potential, and tailored marketing strategy for each segment." },
    { title: "Anomaly Detection", category: "Analysis", prompt: "Create an anomaly detection approach for {{metric_or_dataset}}. Include: methods (statistical, ML-based, rule-based), threshold determination, false positive reduction, real-time vs batch analysis, and alerting strategy. Provide a Python implementation outline." },
    { title: "Cohort Analysis", category: "Analysis", prompt: "Design a cohort analysis for {{product}} to understand {{business_question}}. Define: cohort grouping (signup date, acquisition channel), metrics to track, time periods, retention visualization, and 3 insights to extract from the cohort table." },
    { title: "Data Dictionary", category: "Documentation", prompt: "Create a data dictionary for {{dataset}}. For each field: name, data type, description, allowed values/range, source, nullable, example value, and business definition. Format as a table. Include data quality rules and relationships between tables." },
  ],
  "business-analyst": [
    { title: "Requirements Gathering", category: "Requirements", prompt: "Create a requirements gathering plan for {{project}}. Include: stakeholder list (roles + interview questions), functional requirements (10), non-functional requirements (5), business constraints, assumptions, and a prioritized requirements backlog (MoSCoW method)." },
    { title: "Process Mapping", category: "Process", prompt: "Map the current state process for {{business_process}}. Include: process steps (numbered), actors/roles involved, inputs/outputs per step, decision points, bottlenecks (3), pain points, and a proposed future state with improvement recommendations." },
    { title: "Use Case Writing", category: "Requirements", prompt: "Write detailed use cases for {{system_feature}}. For each use case: ID, name, actor, preconditions, main flow (numbered steps), alternate flows, postconditions, and business rules. Create 3 primary use cases and 2 secondary use cases." },
    { title: "Gap Analysis", category: "Analysis", prompt: "Perform a gap analysis between current state and desired state for {{business_area}}. Include: current capabilities, desired capabilities, gaps (categorized), root causes, impact assessment, and a prioritized action plan with timeline and resource needs." },
    { title: "Stakeholder Analysis", category: "Strategy", prompt: "Create a stakeholder analysis for {{project}}. For each stakeholder: role, influence level (high/medium/low), interest level, communication preference, concerns, and engagement strategy. Create a power-interest grid and a communication plan." },
    { title: "Business Case", category: "Strategy", prompt: "Write a business case for {{initiative}}. Include: executive summary, problem statement, proposed solution, cost-benefit analysis (3-year ROI), alternatives considered, risks (5), success metrics, and implementation timeline. Target: {{decision_audience}}." },
    { title: "SWOT Analysis", category: "Analysis", prompt: "Create a comprehensive SWOT analysis for {{organization}}. Strengths (5), Weaknesses (5), Opportunities (5), Threats (5). For each item: description, evidence/data, and strategic implication. End with a TOWS matrix linking factors to strategic actions." },
    { title: "User Stories", category: "Requirements", prompt: "Write user stories for {{feature}}. Format: 'As a {{user_type}}, I want {{action}}, so that {{benefit}}.' Create 15 user stories across epic themes. Include acceptance criteria (3-5 per story), story points estimate, and priority (Must/Should/Could/Won't)." },
    { title: "Process Improvement", category: "Process", prompt: "Recommend process improvements for {{business_process}}. Analyze current state, identify 5 inefficiencies, propose solutions for each with expected impact, implementation effort (low/medium/high), and a 90-day improvement roadmap with quick wins." },
    { title: "Change Management", category: "Strategy", prompt: "Create a change management plan for {{change_initiative}}. Include: change impact assessment, stakeholder communication plan, training plan, resistance management strategy, change champions program, and success metrics. Timeline: {{timeline}}." },
    { title: "Cost-Benefit Analysis", category: "Financial", prompt: "Perform a cost-benefit analysis for {{project}}. Include: one-time costs, recurring costs (3 years), quantified benefits (revenue increase, cost savings, efficiency gains), NPV calculation, payback period, ROI, and risk-adjusted scenarios (best/expected/worst)." },
    { title: "Functional Spec", category: "Documentation", prompt: "Write a functional specification document for {{system}}. Include: purpose, scope, user roles, functional requirements (detailed), business rules, data requirements, interface requirements, non-functional requirements, and assumptions/constraints." },
    { title: "Risk Assessment", category: "Risk", prompt: "Create a risk assessment for {{project}}. Identify 15 risks across categories (strategic, operational, financial, technical, compliance). For each: description, likelihood (1-5), impact (1-5), risk score, mitigation strategy, owner, and monitoring trigger." },
    { title: "KPI Dashboard Design", category: "Performance", prompt: "Define KPIs for {{department}} aligned with {{business_goal}}. Include: 8 KPIs with definitions, formulas, data sources, targets, frequency, owners, and visualization type. Categorize as leading vs lagging indicators. Create a dashboard mockup description." },
    { title: "Vendor Evaluation", category: "Procurement", prompt: "Create a vendor evaluation framework for {{software_or_service}}. Include: evaluation criteria (8 with weights), scoring rubric, 3 vendor comparison matrix template, TCO (Total Cost of Ownership) calculation, and a recommendation framework. Shortlist criteria for RFP." },
  ],
  "graphic-designer": [
    { title: "Logo Design Brief", category: "Branding", prompt: "Create a logo design brief for {{brand_name}}. Include: brand personality (5 adjectives), target audience, color psychology recommendations, font style suggestions, logo type preference (wordmark, lettermark, pictorial, abstract), and 3 design direction concepts." },
    { title: "Brand Identity", category: "Branding", prompt: "Develop a brand identity guide for {{brand}}. Include: brand mission/vision, personality traits, color palette (5 colors with hex codes and psychology), typography (primary + secondary fonts), logo usage guidelines, and do's/don'ts (5 each)." },
    { title: "UI/UX Wireframe", category: "UI/UX", prompt: "Design a wireframe for {{app_page}}. Describe: layout structure, component placement, navigation hierarchy, content hierarchy, interactive elements, states (default, hover, active, error), and responsive breakpoints. Consider {{user_goal}}." },
    { title: "Poster Design", category: "Print", prompt: "Create a poster design concept for {{event}}. Include: visual hierarchy, focal point, color scheme (with hex codes), typography pairing, imagery style, composition layout, and print specifications (size, bleed, resolution, color mode)." },
    { title: "Social Media Graphic", category: "Digital", prompt: "Design a social media graphic concept for {{brand}} on {{platform}}. Include: dimensions, visual style, color scheme, typography, imagery direction, text overlay placement, brand element integration, and 3 design variations (minimal, bold, lifestyle)." },
    { title: "Color Palette", category: "Color Theory", prompt: "Create a color palette for {{project_type}} targeting {{audience}}. Provide: 5-color palette with hex codes, color psychology rationale, primary/secondary/accent roles, accessibility check (contrast ratios), dark/light mode variants, and usage guidelines." },
    { title: "Infographic Design", category: "Visual", prompt: "Design an infographic about {{topic}}. Include: visual metaphor concept, layout structure (vertical), data visualization types, color coding scheme, icon style, typography hierarchy, section transitions, and information flow. Target: {{audience}}." },
    { title: "Pitch Deck Design", category: "Presentation", prompt: "Design a pitch deck for {{startup}}. Include: 12-slide structure, visual theme, color palette, typography, layout templates per slide type, data visualization approach, imagery style, and transitions. Tone: {{tone}}. Audience: {{audience}}." },
    { title: "Packaging Design", category: "Product", prompt: "Create a packaging design concept for {{product}}. Include: packaging type, materials, color scheme, typography, visual elements, unboxing experience design, sustainability considerations, and regulatory label placement. Target: {{target_market}}." },
    { title: "Website Mockup", category: "Web Design", prompt: "Design a website mockup for {{brand}}. Include: page layout, hero section concept, navigation design, color scheme, typography, button styles, card components, hover states, footer design, and responsive considerations. Style: {{design_style}}." },
    { title: "Business Card", category: "Print", prompt: "Design a business card for {{person}} at {{company}}. Include: layout (front/back), typography, color scheme, information hierarchy, special finishes (embossing, foil, spot UV), bleed/safe zone, and file specifications (CMYK, 300dpi, PDF)." },
    { title: "Icon Set", category: "UI/UX", prompt: "Design an icon set for {{app_category}}. Include: 10 icon concepts, visual style (line, filled, duotone), grid system, stroke width, corner radius, color palette, size variants (16, 24, 32px), and naming convention. Ensure visual consistency." },
    { title: "Brochure Design", category: "Print", prompt: "Design a tri-fold brochure for {{business}}. Include: panel layout, content distribution, visual hierarchy, color scheme, typography, imagery direction, fold considerations, and call-to-action placement. Print specs: {{size}}, CMYK, 300dpi." },
    { title: "Brand Style Guide", category: "Branding", prompt: "Create a brand style guide for {{brand}}. Include: logo (variations, clear space, minimum size, misuses), color palette (primary, secondary, with hex/RGB), typography (headings, body, with sizes), imagery style, tone of voice, and do's/don'ts." },
    { title: "Motion Graphics", category: "Animation", prompt: "Create a motion graphics concept for {{brand}}. Include: animation style, duration, key frames description, transition effects, color treatment, typography animation, sound design suggestions, and platform specifications (social, web, presentation)." },
  ],
  sales: [
    { title: "Cold Email", category: "Outreach", prompt: "Write a cold email to {{prospect_role}} at {{company}}. Product: {{product}}. Include: personalized hook (reference something specific about them), value proposition (1-2 sentences), social proof (1 metric), soft CTA, and P.S. line. Under 125 words. No generic openers." },
    { title: "Sales Script", category: "Calls", prompt: "Write a sales call script for {{product}} targeting {{prospect_type}}. Include: opening (15 sec), discovery questions (5), problem agitation, solution presentation, objection handling (3 common objections), trial close, and next steps. Call duration: {{duration}} minutes." },
    { title: "Follow-Up Email", category: "Outreach", prompt: "Write 3 follow-up emails for a prospect who hasn't responded. Email 1: Value-add (share a resource). Email 2: Social proof (case study). Email 3: Breakup email. Each under 100 words, different tone, clear CTA. Product: {{product}}." },
    { title: "Objection Handling", category: "Calls", prompt: "Create objection handling responses for {{product}}. Cover 10 common objections (price, timing, competitor, need, authority, trust, complexity, risk, satisfaction, urgency). For each: acknowledge, empathize, reframe, and response with evidence." },
    { title: "Sales Pitch Deck", category: "Presentation", prompt: "Create a sales pitch deck for {{product}}. 10 slides: Problem, Solution, Market Size, Product Demo, Business Model, Traction, Competitive Advantage, Team, Pricing, Ask. Include talking points for each slide. Audience: {{audience}}." },
    { title: "Discovery Questions", category: "Discovery", prompt: "Create a discovery question framework for sales calls with {{prospect_type}}. Include: opening questions (3), situation questions (5), problem questions (5), implication questions (4), need-payoff questions (3), and qualification questions (BANT). Product: {{product}}." },
    { title: "Proposal Template", category: "Closing", prompt: "Write a sales proposal for {{product}} to {{client}}. Include: executive summary, problem statement, proposed solution, scope of work, timeline, pricing (3 tiers), terms and conditions, ROI projection, and next steps. Professional tone. Length: 2-3 pages." },
    { title: "Sales Page Copy", category: "Marketing", prompt: "Write a sales page for {{product}}. Structure: hero headline, subheadline, problem agitation, solution introduction, features (5) with benefits, social proof, pricing options (3), guarantee, FAQ (5), and CTA. Target: {{audience}}. Tone: persuasive but honest." },
    { title: "Demo Script", category: "Demo", prompt: "Create a product demo script for {{product}}. Include: pre-demo rapport building, agenda setting, discovery check, demo flow (5 key features mapped to pain points), value summary, and next steps. Duration: {{duration}} minutes. Personalize for {{prospect_role}}." },
    { title: "Negotiation Strategy", category: "Closing", prompt: "Create a negotiation strategy for {{deal}}. Include: BATNA (Best Alternative), ZOPA (Zone of Possible Agreement), concession strategy (what to give, what to get), common negotiation tactics and counters, walk-away point, and closing techniques (3)." },
    { title: "Account-Based Marketing", category: "ABM", prompt: "Create an ABM campaign for target account {{company}}. Include: account research checklist, stakeholder map (decision makers, influencers, champions), personalized messaging for each stakeholder, channel strategy, content assets, and success metrics." },
    { title: "Sales Enablement", category: "Enablement", prompt: "Create a sales enablement guide for {{product}}. Include: ideal customer profile, buyer personas (3), value propositions per persona, competitive battle cards (3 competitors), common objections and responses, and elevator pitch variants (30-sec, 60-sec)." },
    { title: "Pricing Strategy", category: "Strategy", prompt: "Develop a pricing strategy for {{product}}. Include: value-based pricing analysis, 3 pricing tiers (features, price, target segment), psychological pricing tactics, discount/promotion strategy, price testing plan, and competitive pricing comparison." },
    { title: "Referral Program", category: "Growth", prompt: "Create a referral program for {{product}}. Include: program structure (one-sided, two-sided), incentive design, referral mechanics, communication touchpoints, tracking and attribution, fraud prevention, and success metrics. Budget: {{budget}}." },
    { title: "Win-Back Campaign", category: "Retention", prompt: "Create a win-back campaign for churned customers of {{product}}. Segment churned users (3 segments), create tailored messaging for each, offer strategy, channel selection, timing sequence (3 touches), and success metrics. Tone: empathetic and value-focused." },
  ],
  "customer-support": [
    { title: "Support Response", category: "Response", prompt: "Write a customer support response for a {{issue_type}} complaint about {{product}}. Include: empathy acknowledgment, apology (if applicable), clear solution with steps, timeline expectation, prevention assurance, and follow-up offer. Tone: professional and caring. Under 200 words." },
    { title: "Ticket Triage", category: "Process", prompt: "Create a ticket triage system for {{product}} support. Include: priority levels (P1-P4) with definitions, SLA targets per priority, categorization scheme (bug, feature request, how-to, billing), routing rules, escalation criteria, and response templates for each category." },
    { title: "FAQ Generation", category: "Self-Service", prompt: "Generate 15 FAQs for {{product}} covering: setup, common issues, billing, features, integrations, security, data export, and troubleshooting. For each: question, clear answer (under 100 words), and related article link suggestion. Organize by category." },
    { title: "Knowledge Base Article", category: "Documentation", prompt: "Write a knowledge base article for {{feature}} in {{product}}. Include: overview, prerequisites, step-by-step instructions (numbered), screenshots placeholders, troubleshooting section (5 common errors), related articles, and last updated date. Tone: clear and user-friendly." },
    { title: "Escalation Matrix", category: "Process", prompt: "Create an escalation matrix for {{product}} support. Include: escalation levels (1-4), criteria for each level, response time SLAs, notification chain, decision authority, and communication templates. Define when to escalate to engineering, management, and executives." },
    { title: "Chatbot Script", category: "Automation", prompt: "Design a chatbot conversation flow for {{product}} support. Include: greeting, intent recognition branches (5: billing, technical, how-to, complaint, feedback), response templates, handoff to human agent criteria, escalation logic, and satisfaction survey." },
    { title: "Onboarding Email", category: "Onboarding", prompt: "Write a customer onboarding email sequence for {{product}}. 5 emails: Welcome + setup, First success guide, Advanced features, Tips and tricks, Check-in + support offer. Each: subject line, body (150 words), CTA, and timing. Tone: helpful and encouraging." },
    { title: "Complaint Handling", category: "Response", prompt: "Write a response to a {{severity}} customer complaint about {{issue}}. Include: acknowledgment, sincere apology, explanation (without making excuses), corrective action, compensation offer (if appropriate), and follow-up commitment. Tone: empathetic and professional." },
    { title: "Canned Responses", category: "Templates", prompt: "Create 10 canned response templates for common {{product}} support scenarios: password reset, payment failed, feature request, bug report, refund request, account deletion, integration help, performance issue, data export, and general inquiry. Each under 150 words with placeholders." },
    { title: "Satisfaction Survey", category: "Feedback", prompt: "Create a customer satisfaction survey for {{product}}. Include: CSAT question, NPS question, open-ended feedback, rating scales (1-5 or 1-10), branching logic for low scores (follow-up), and timing strategy (when to send). Keep under 5 questions for high completion rate." },
    { title: "Status Page", category: "Communication", prompt: "Create incident communication templates for {{product}}. Include: incident detection, investigation, identified, monitoring, resolved, and post-mortem. For each: template with placeholders for incident details, impact, timeline, and next steps. Tone: transparent and calm." },
    { title: "SLA Policy", category: "Policy", prompt: "Create an SLA (Service Level Agreement) policy for {{product}} support. Include: support tiers (3), response time SLAs per priority, resolution time targets, uptime guarantee, support hours, communication channels, escalation process, and credit policy for SLA breaches." },
    { title: "Training Material", category: "Enablement", prompt: "Create training material for new support agents on {{product}}. Include: product overview, common issues (10) with solutions, tool walkthrough, communication guidelines, escalation process, quiz questions (10), and certification criteria. Format as a training module." },
    { title: "Community Forum Guide", category: "Community", prompt: "Create a community forum moderation guide for {{product}}. Include: forum categories, posting guidelines, moderation rules, response SLAs for community managers, top contributor program, accepted solution marking, and escalation to support team." },
    { title: "Refund Policy", category: "Policy", prompt: "Write a customer-friendly refund policy for {{product}}. Include: eligibility criteria, refund window, process steps, processing time, exceptions, subscription cancellation, pro-rating logic, and FAQ section (5 questions). Tone: clear and fair." },
  ],
  "product-manager": [
    { title: "Product Spec", category: "Planning", prompt: "Write a product specification for {{feature}} in {{product}}. Include: problem statement, user stories (5), acceptance criteria, success metrics, design mockup description, technical requirements, dependencies, timeline, and risks. Audience: engineering + design teams." },
    { title: "User Story Mapping", category: "Agile", prompt: "Create a user story map for {{product}}. Include: user personas (3), epics (5), user stories under each epic (3-5 each), release plan (MVP, V1, V2), priority ranking, and dependencies. Format as a story map with backbone activities and detailed tasks." },
    { title: "Roadmap Planning", category: "Strategy", prompt: "Create a product roadmap for {{product}} over {{timeframe}}. Include: strategic themes (3), quarterly objectives, key initiatives per quarter, dependencies, resource allocation, milestones, success metrics, and risk mitigation. Distinguish between committed and exploratory items." },
    { title: "Feature Prioritization", category: "Strategy", prompt: "Prioritize features for {{product}} using RICE (Reach, Impact, Confidence, Effort). List 15 candidate features, score each, create a priority matrix, and provide a recommended sequence with rationale. Consider {{business_goal}} and {{resource_constraints}}." },
    { title: "Competitive Analysis", category: "Research", prompt: "Perform a competitive analysis for {{product}}. Compare 5 competitors on: features (10), pricing, target market, strengths, weaknesses, market positioning, and differentiation opportunities. Create a feature comparison matrix and strategic recommendations." },
    { title: "PRD (Product Requirements)", category: "Planning", prompt: "Write a PRD for {{feature}}. Include: background, objectives, target audience, user stories, functional requirements, non-functional requirements, design specifications, success metrics, timeline, open questions, and risks. Format: clear sections with tables where appropriate." },
    { title: "Go-to-Market", category: "Launch", prompt: "Create a go-to-market strategy for {{product}} launch. Include: target market, positioning, messaging, pricing strategy, channel mix, launch timeline (pre-launch, launch, post-launch), marketing assets, sales enablement, and success metrics." },
    { title: "User Research Plan", category: "Research", prompt: "Create a user research plan for {{product}}. Include: research objectives (5), methodology (interviews, surveys, usability testing), participant criteria, sample size, interview script outline, analysis approach, and timeline. Budget: {{budget}}." },
    { title: "Sprint Planning", category: "Agile", prompt: "Create a sprint plan for {{team_size}} team over {{sprint_length}} sprint. Include: sprint goal, user stories (8) with story points, capacity calculation, task breakdown, acceptance criteria, definition of done, risk log, and sprint backlog." },
    { title: "A/B Test Design", category: "Experiment", prompt: "Design an A/B test for {{feature}} on {{product}}. Include: hypothesis, control and variant, primary metric, secondary metrics, segmentation, sample size, duration, statistical method, decision criteria, and rollback plan. Target: {{user_segment}}." },
    { title: "Metrics Framework", category: "Analytics", prompt: "Define a metrics framework for {{product}}. Include: North Star metric, input metrics (5), guardrail metrics (3), leading indicators, lagging indicators, data sources, reporting cadence, and dashboards. Align with business objective: {{objective}}." },
    { title: "Churn Analysis", category: "Retention", prompt: "Create a churn analysis plan for {{product}}. Include: churn definition, data sources, cohort analysis approach, churn predictors (5), root cause categories, retention experiment ideas (5), and a churn intervention playbook. Current churn rate: {{rate}}." },
    { title: "Stakeholder Update", category: "Communication", prompt: "Write a stakeholder update for {{product}}. Include: progress summary, key wins (3), challenges (2), metrics update, next priorities, risks, and asks from stakeholders. Format: executive-friendly with clear visuals described. Audience: {{audience}}." },
    { title: "Release Notes", category: "Communication", prompt: "Write release notes for {{product}} version {{version}}. Include: summary, new features (with descriptions), improvements, bug fixes, known issues, migration notes (if applicable), and upgrade instructions. Tone: clear and customer-friendly." },
    { title: "Product Retrospective", category: "Agile", prompt: "Create a sprint retrospective for {{product}}. Include: what went well (5), what didn't go well (5), action items (with owners and deadlines), velocity analysis, process improvements, and team sentiment. Format: structured and actionable." },
  ],
  researcher: [
    { title: "Literature Review", category: "Research", prompt: "Create a literature review outline for {{topic}}. Include: search strategy (databases, keywords, inclusion/exclusion criteria), thematic sections (5), key papers per theme, synthesis approach, gaps identified, and citation format. Target: {{audience}}." },
    { title: "Research Proposal", category: "Academic", prompt: "Write a research proposal for {{research_topic}}. Include: background, research question, hypothesis, methodology (qualitative/quantitative/mixed), data collection plan, analysis approach, timeline, budget, and expected contributions. Format: academic style." },
    { title: "Survey Design", category: "Methodology", prompt: "Design a survey for {{research_objective}}. Include: survey type, target population, sampling method, 15 questions (mix of Likert, multiple choice, open-ended), skip logic, demographics section, and data analysis plan. Keep completion time under {{minutes}} minutes." },
    { title: "Interview Guide", category: "Qualitative", prompt: "Create a semi-structured interview guide for {{research_topic}}. Include: introduction script, warm-up questions (3), main questions (10) organized by theme, probing questions, closing questions, and ethical considerations. Target interviewee: {{participant_type}}." },
    { title: "Data Collection Plan", category: "Methodology", prompt: "Create a data collection plan for {{research}}. Include: data sources, collection methods, instruments, sample size justification, data quality controls, privacy/ethics considerations, timeline, and resource needs. Address potential biases." },
    { title: "Hypothesis Formulation", category: "Academic", prompt: "Formulate research hypotheses for {{topic}}. Include: research question, null hypothesis (H0), alternative hypothesis (H1), variables (independent, dependent, control), operational definitions, and statistical test recommendation. Justify based on existing literature." },
    { title: "Systematic Review", category: "Research", prompt: "Create a systematic review protocol for {{topic}}. Include: PRISMA guidelines, search strategy, databases, inclusion/exclusion criteria, quality assessment tool, data extraction template, synthesis method, and publication bias assessment." },
    { title: "Bibliography", category: "Literature", prompt: "Create an annotated bibliography for {{topic}}. Include 15 key sources. For each: citation (APA format), 2-3 sentence summary, methodology critique, relevance to research question, and key findings. Organize by theme." },
    { title: "Data Analysis Plan", category: "Analysis", prompt: "Create a data analysis plan for {{dataset}}. Include: research questions, variables, descriptive statistics, inferential statistics, statistical tests (with justification), software choice, data visualization plan, and sensitivity analysis approach." },
    { title: "Case Study Design", category: "Qualitative", prompt: "Design a case study for {{subject}}. Include: case selection rationale, research questions, data sources (documents, interviews, observations), data collection protocol, analysis framework, triangulation strategy, and limitations." },
    { title: "Experimental Design", category: "Methodology", prompt: "Design an experiment for {{research_question}}. Include: hypothesis, independent/dependent variables, control group, experimental conditions, randomization, sample size (power analysis), measurement instruments, and validity threats." },
    { title: "Conference Paper", category: "Academic", prompt: "Write a conference paper outline for {{topic}}. Include: abstract (250 words), introduction, related work, methodology, results, discussion, conclusion, and references. Target conference: {{conference}}. Page limit: {{pages}}." },
    { title: "Research Ethics", category: "Ethics", prompt: "Create a research ethics protocol for {{study}}. Include: IRB considerations, informed consent form, data privacy (GDPR/HIPAA), vulnerable populations, risk-benefit analysis, confidentiality measures, data retention policy, and conflict of interest disclosure." },
    { title: "Meta-Analysis", category: "Research", prompt: "Create a meta-analysis plan for {{topic}}. Include: research question, inclusion criteria, search strategy, effect size calculation, heterogeneity assessment, publication bias (funnel plot), random vs fixed effects model, and forest plot interpretation." },
    { title: "Grant Proposal", category: "Funding", prompt: "Write a grant proposal for {{research_project}}. Include: executive summary, significance, innovation, approach, preliminary data, timeline, budget, and broader impacts. Target: {{funding_agency}}. Length: {{length}}. Align with agency priorities." },
  ],
  student: [
    { title: "Study Guide", category: "Study", prompt: "Create a comprehensive study guide for {{subject}} covering {{topics}}. Include: key concepts (10), definitions, formulas (if applicable), example problems with step-by-step solutions, common mistakes to avoid, and practice questions (15) with an answer key." },
    { title: "Essay Writing", category: "Writing", prompt: "Write an essay outline for {{essay_topic}}. Include: thesis statement, introduction hook, 3 body paragraph topics with evidence points, counterargument, rebuttal, and conclusion. Format: academic. Citation style: {{citation_style}}. Target: {{grade_level}}." },
    { title: "Exam Preparation", category: "Study", prompt: "Create an exam preparation plan for {{subject}} final exam in {{weeks}} weeks. Include: study schedule (daily), key topics to review, practice problems, memory techniques, test-taking strategies, and self-assessment checkpoints. Format: weekly calendar." },
    { title: "Research Paper", category: "Academic", prompt: "Write a research paper outline for {{topic}}. Include: title, abstract, introduction, literature review, methodology, results, discussion, conclusion, and references. Target: {{audience}}. Citation style: {{citation_style}}. Length: {{word_count}} words." },
    { title: "Math Problem Solver", category: "STEM", prompt: "Solve this math problem step by step: {{problem}}. Show: given information, formula/approach, substitution, calculation (each step), final answer with units, and verification. Explain the reasoning at each step. Level: {{level}}." },
    { title: "Book Summary", category: "Reading", prompt: "Summarize the book {{book_title}} by {{author}}. Include: main thesis, 5 key arguments with evidence, chapter-by-chapter summary (1 sentence each), key quotes (3), practical takeaways, and critical analysis. Format: structured notes." },
    { title: "Presentation Outline", category: "Presentation", prompt: "Create a presentation outline for {{topic}}. Include: title slide, agenda, introduction, 5-7 content slides (key points + supporting details), visual suggestions, conclusion, Q&A preparation, and speaker notes per slide. Duration: {{minutes}} minutes." },
    { title: "Lab Report", category: "STEM", prompt: "Write a lab report for {{experiment}}. Include: title, objective, hypothesis, materials, procedure (step-by-step), data table template, results analysis, error analysis, and conclusion. Format: scientific. Include safety notes." },
    { title: "Flashcards", category: "Study", prompt: "Create 20 flashcards for {{subject}} on {{topic}}. Each flashcard: front (question/term), back (answer/definition with example). Include: key terms, formulas, concepts, and application scenarios. Format: easy to review." },
    { title: "Concept Explanation", category: "Learning", prompt: "Explain {{concept}} at three levels: 1) ELI5 (explain like I'm 5, simple analogy), 2) High school level (with basic technical terms), 3) University level (full technical explanation). Include real-world applications and common misconceptions." },
    { title: "Homework Help", category: "Study", prompt: "Help me understand and solve this {{subject}} homework problem: {{problem}}. Provide: concept explanation, step-by-step solution, alternative approach, and similar practice problems (3). Don't just give the answer — explain the process." },
    { title: "Note Taking", category: "Study", prompt: "Create a note-taking template for {{subject}} lectures. Include: Cornell notes format (cues, notes, summary), key terminology section, diagram placeholders, questions for review, and connections to previous topics. Optimize for {{learning_style}} learning." },
    { title: "Project Planning", category: "Project", prompt: "Create a project plan for a {{subject}} school project on {{topic}}. Include: project scope, research questions, timeline (milestones), resources needed, deliverables, evaluation criteria, and presentation plan. Team size: {{team_size}}." },
    { title: "Language Learning", category: "Language", prompt: "Create a {{language}} learning plan for {{level}} level. Include: daily practice routine, vocabulary list (20 words), grammar topics (5), reading materials, listening exercises, speaking practice prompts, and progress assessment for {{weeks}} weeks." },
    { title: "Time Management", category: "Productivity", prompt: "Create a time management plan for a {{grade_level}} student balancing: classes, homework, extracurricular {{activity}}, and {{hours}} hours of study. Include: weekly schedule template, study techniques, break strategy, and stress management tips." },
  ],
  entrepreneur: [
    { title: "Business Plan", category: "Planning", prompt: "Write a business plan for {{startup_name}} in the {{industry}} space. Include: executive summary, problem, solution, market analysis, business model, competitive analysis, marketing strategy, operations plan, financial projections (3-year), and team. Target: {{audience}}." },
    { title: "Pitch Deck", category: "Fundraising", prompt: "Create a pitch deck for {{startup}}. 10-12 slides: Title, Problem, Solution, Market Size, Product, Business Model, Traction, Competition, Team, Financials, The Ask. Include talking points and key metrics for each slide. Audience: {{investor_type}}." },
    { title: "Investor Outreach", category: "Fundraising", prompt: "Write a cold outreach email to a {{investor_type}} investor for {{startup}}. Include: hook (why this investor), problem you solve, traction (specific metrics), market size, team strength, and ask (meeting/amount). Under 150 words. Personalize for {{investor_name}}." },
    { title: "Business Model Canvas", category: "Strategy", prompt: "Create a Business Model Canvas for {{startup}}. Include: customer segments, value propositions, channels, customer relationships, revenue streams, key resources, key activities, key partnerships, and cost structure. One sentence per block with specifics." },
    { title: "Market Research", category: "Research", prompt: "Create a market research plan for {{product}} in {{industry}}. Include: TAM/SAM/SOM estimation, target customer segments (3), competitor analysis (5), market trends (5), regulatory considerations, and go-to-market implications. Data sources and methodology." },
    { title: "Financial Projections", category: "Finance", prompt: "Create 3-year financial projections for {{startup}}. Include: revenue model, pricing assumptions, customer growth rate, CAC, LTV, gross margin, operating expenses, break-even point, cash flow, and funding needs. Format: tables with monthly/annual breakdown." },
    { title: "Co-founder Agreement", category: "Legal", prompt: "Create an outline for a co-founder agreement for {{startup}}. Include: equity split rationale, roles and responsibilities, vesting schedule, cliff period, IP assignment, decision-making process, dispute resolution, exit clauses, and acceleration provisions." },
    { title: "Go-to-Market", category: "Strategy", prompt: "Create a go-to-market strategy for {{startup}} launching {{product}}. Include: target customer, positioning, pricing, channel strategy, customer acquisition plan, launch timeline, marketing budget allocation, and 90-day milestones. Budget: {{budget}}." },
    { title: "SWOT for Startup", category: "Strategy", prompt: "Perform a SWOT analysis for {{startup}}. Strengths (5), Weaknesses (5), Opportunities (5), Threats (5). For each: specific, evidence-based, and actionable. Conclude with strategic priorities (3) derived from the SWOT matrix." },
    { title: "Customer Interview", category: "Research", prompt: "Create a customer interview script for validating {{startup_idea}}. Include: introduction, demographics, problem discovery questions (8), current solution questions, willingness to pay questions, and feature prioritization questions. Avoid leading questions." },
    { title: "Lean Canvas", category: "Strategy", prompt: "Create a Lean Canvas for {{startup}}. Include: problem (3), customer segments, unique value proposition, solution, channels, revenue streams, cost structure, key metrics, and unfair advantage. One sentence per block, actionable and specific." },
    { title: "MVP Definition", category: "Product", prompt: "Define the MVP for {{startup}}. Include: core problem, must-have features (5), nice-to-have features (defer), success metrics, build vs buy decisions, timeline ({{weeks}} weeks), and validation criteria. Keep scope minimal." },
    { title: "Traction Plan", category: "Growth", prompt: "Create a traction plan for {{startup}}. Apply the 19 traction channels (Bullseye Framework), narrow to top 5 for {{industry}}, create experiments for each, define success metrics, and prioritize by expected impact vs effort. Timeline: {{months}} months." },
    { title: "Pivot Strategy", category: "Strategy", prompt: "Create a pivot analysis for {{startup}}. Current state: {{current_situation}}. Include: reasons to consider pivot, pivot types (zoom-in, zoom-out, customer segment, customer need, technology, business architecture), evaluation criteria, and a decision framework." },
    { title: "Exit Strategy", category: "Strategy", prompt: "Create an exit strategy for {{startup}}. Include: exit options (acquisition, IPO, management buyout, liquidation), timing considerations, valuation drivers, potential acquirers (5), preparation checklist, and timeline. Target valuation: {{valuation}}." },
  ],
  consultant: [
    { title: "Client Assessment", category: "Analysis", prompt: "Create a client assessment framework for {{client_type}} in {{industry}}. Include: current state analysis, pain points (5), goals (3), existing solutions evaluation, gaps, and recommended next steps. Format: structured questionnaire + analysis template." },
    { title: "Strategy Development", category: "Strategy", prompt: "Develop a strategic recommendation for {{client}} addressing {{business_challenge}}. Include: situation analysis, root cause identification, 3 strategic options with pros/cons, recommended approach, implementation roadmap, and expected outcomes with metrics." },
    { title: "Market Entry Strategy", category: "Strategy", prompt: "Create a market entry strategy for {{company}} entering {{market}}. Include: market attractiveness, entry modes (export, licensing, JV, direct investment), competitive landscape, regulatory considerations, go-to-market plan, and risk mitigation." },
    { title: "Process Optimization", category: "Operations", prompt: "Create a process optimization plan for {{business_process}} at {{client}}. Include: current state mapping, bottleneck analysis (5), proposed improvements, expected efficiency gains, implementation plan, change management, and ROI calculation." },
    { title: "Organizational Design", category: "Org", prompt: "Create an organizational design recommendation for {{company}}. Include: current structure analysis, proposed structure, reporting lines, role definitions, team sizing, governance model, and transition plan. Consider {{company_size}} and {{growth_goal}}." },
    { title: "Digital Transformation", category: "Technology", prompt: "Create a digital transformation roadmap for {{company}} in {{industry}}. Include: current digital maturity assessment, target state, 5 key initiatives, technology recommendations, change management plan, investment priorities, and success metrics. Timeline: {{timeline}}." },
    { title: "Cost Reduction", category: "Finance", prompt: "Create a cost reduction strategy for {{client}}. Analyze cost categories, identify 10 reduction opportunities, quantify savings, assess impact on operations, create implementation plan with quick wins and structural changes, and risk mitigation." },
    { title: "Due Diligence", category: "M&A", prompt: "Create a due diligence checklist for acquiring {{target_company}}. Include: financial, legal, operational, technology, HR, market, and cultural due diligence items. Key red flags, deal-breakers, valuation adjustments, and integration considerations. Format: comprehensive checklist." },
    { title: "Performance Improvement", category: "Operations", prompt: "Create a performance improvement plan for {{department}} at {{client}}. Include: current performance baseline, target metrics, gap analysis, 5 improvement initiatives, resource requirements, timeline, and monitoring framework. Expected ROI: {{roi_target}}." },
    { title: "Risk Management", category: "Risk", prompt: "Create an enterprise risk management framework for {{client}}. Include: risk categories (strategic, operational, financial, compliance, cyber), risk register template, risk assessment matrix, mitigation strategies, monitoring plan, and reporting structure." },
    { title: "Change Management", category: "Org", prompt: "Create a change management plan for {{initiative}} at {{client}}. Include: stakeholder analysis, communication plan, training plan, resistance management, change champions, reinforcement strategy, and success metrics. Methodology: ADKAR or Kotter." },
    { title: "Competitive Strategy", category: "Strategy", prompt: "Create a competitive strategy for {{client}} in {{industry}}. Include: industry analysis (Porter's 5 Forces), competitive positioning, differentiation strategy, defensive moves, offensive opportunities, and 3-year strategic plan with milestones." },
    { title: "Operational Audit", category: "Audit", prompt: "Create an operational audit plan for {{client}}. Include: audit scope, areas to review (processes, systems, controls, KPIs), data collection methods, benchmark comparisons, findings report structure, and prioritized recommendations with expected impact." },
    { title: "Consulting Proposal", category: "Engagement", prompt: "Write a consulting proposal for {{client}} addressing {{problem}}. Include: executive summary, situation analysis, proposed approach, scope of work, deliverables, timeline, team structure, pricing, and terms. Tone: professional and persuasive. Length: 3-4 pages." },
    { title: "Stakeholder Management", category: "Org", prompt: "Create a stakeholder management plan for {{project}} at {{client}}. Include: stakeholder map (influence/interest grid), communication plan per stakeholder, engagement strategy, conflict resolution approach, and feedback mechanisms. Format: matrix + action plan." },
  ],
};

function PromptsDirectoryPage() {
  return (
    <SectionShell
      title="AI Prompt Library — 225+ Prompts for 15 Roles"
      description="Free AI prompt library with 225+ ready-to-use prompts for 15 professional roles — ChatGPT, content writers, developers, marketers, SEO, data analysts, designers, sales, customer support, and more. Copy and customize instantly."
      keywords="AI Prompts, ChatGPT Prompts, Prompt Library, Prompt Templates, Best AI Prompts, Prompt Engineering, Role-Based Prompts, AI Prompt Collection"
    >
      <div className="space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-400/80">Prompt Library</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">AI Prompt Library</h1>
          <p className="max-w-2xl text-base sm:text-lg text-slate-400">
            Browse 225+ ready-to-use AI prompts across 15 professional roles. Each prompt is crafted by prompt engineering experts and ready to copy, customize, and use with any AI model — ChatGPT, Claude, Gemini, and more.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROMPT_ROLES.map((role) => {
            const Icon = role.icon;
            return (
              <Link
                key={role.slug}
                to={`/prompts/${role.slug}`}
                className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-950/50 p-6 transition-all hover:border-amber-400/30 hover:bg-slate-900/60"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${role.accent} border border-white/10`}>
                  <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-white group-hover:text-amber-300">{role.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{role.description}</p>
                <div className="mt-4 flex items-center gap-2 text-xs">
                  <span className="inline-flex items-center rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 font-medium text-amber-300">{role.count} prompts</span>
                  <span className="text-slate-500 transition group-hover:text-amber-400">→</span>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </SectionShell>
  );
}

function PromptsRolePage() {
  const { role } = useParams<{ role: string }>();
  const roleData = PROMPT_ROLES.find((r) => r.slug === role);
  const prompts = role ? PROMPT_LIBRARY[role] : undefined;
  const taskSlugs = role ? (PROMPT_TASKS_BY_ROLE[role] ?? []).map((t) => t.slug) : [];
  const [copiedPromptId, setCopiedPromptId] = useState<number | null>(null);

  if (!roleData || !prompts) {
    return (
      <SectionShell
        title="Prompts Not Found"
        description="The requested prompt collection was not found. Browse our full AI prompt library."
        keywords="AI Prompts, Prompt Library"
      >
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-white">Prompts Not Found</h1>
          <p className="mt-3 text-slate-400">We couldn't find prompts for this role.</p>
          <Link to="/prompts" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:opacity-90">
            ← Back to Prompt Library
          </Link>
        </div>
      </SectionShell>
    );
  }

  return (
    <SectionShell
      title={`${roleData.title} — ${roleData.count} AI Prompts`}
      description={roleData.description + " Copy and customize these prompts for ChatGPT, Claude, Gemini, and any AI model."}
      keywords={`${roleData.title}, AI Prompts, Prompt Templates, ChatGPT Prompts, Prompt Engineering, ${roleData.title.replace(" Prompts", "")} AI Prompts`}
    >
      <div className="space-y-8">
        <div>
          <Link to="/prompts" className="text-sm text-slate-400 transition hover:text-amber-400">← Back to Prompt Library</Link>
          <div className="mt-4 flex items-start gap-4">
            <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${roleData.accent} border border-white/10`}>
              <roleData.icon className="h-7 w-7 text-white" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{roleData.title}</h1>
              <p className="max-w-2xl text-slate-400">{roleData.description}</p>
              <span className="inline-flex items-center rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">{roleData.count} prompts</span>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {prompts.map((p, i) => {
            const taskSlug = taskSlugs[i];
            return (
              <React.Fragment key={i}>
                <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base font-semibold text-white">
                      {taskSlug ? (
                        <Link to={`/prompts/${role}/${taskSlug}`} className="transition hover:text-amber-300">
                          {p.title}
                        </Link>
                      ) : (
                        p.title
                      )}
                    </h3>
                    <span className="shrink-0 rounded-full border border-slate-700 bg-slate-900 px-2.5 py-0.5 text-xs text-slate-400">{p.category}</span>
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-300">{p.prompt}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <button
                      onClick={async () => { if (await copyToClipboard(p.prompt)) { setCopiedPromptId(i); setTimeout(() => setCopiedPromptId(null), 2000); } }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                    >
                      {copiedPromptId === i ? "✓ Copied!" : "Copy Prompt"}
                    </button>
                    {taskSlug && (
                      <Link
                        to={`/prompts/${role}/${taskSlug}`}
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-amber-400 transition hover:bg-amber-500/10 hover:text-amber-300"
                      >
                        Open page
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </div>

              </React.Fragment>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}

function PromptTaskPage() {
  const { role, task } = useParams<{ role: string; task: string }>();
  const roleData = ENGINE.roles.find((r) => r.slug === role);
  const roleTasks = role ? PROMPT_TASKS_BY_ROLE[role] : undefined;
  const taskData = roleTasks?.find((t) => t.slug === task);
  const [copied, setCopied] = useState(false);

  const variables = useMemo(() => {
    const vars = new Set<string>();
    const matches = taskData
      ? (taskData.prompt.match(/\{\{\s*[\w-]+\s*\}\}/g) ?? ([] as RegExpMatchArray[]))
      : ([] as RegExpMatchArray[]);
    matches.forEach((m) => {
      const clean = m[0].replace(/\{\{|\}\}/g, "").trim();
      if (clean) vars.add(clean);
    });
    return Array.from(vars);
  }, [taskData?.prompt]);

  useJsonLd(
    roleData && taskData
      ? [
          webPageJsonLd(taskData.seoTitle, taskData.seoDescription, `/prompts/${role}/${taskData.slug}`),
          faqPageJsonLd(taskData.faq),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Prompts", path: "/prompts" },
            { name: roleData.title, path: `/prompts/${roleData.slug}` },
            { name: taskData.title, path: `/prompts/${roleData.slug}/${taskData.slug}` },
          ]),
        ]
      : null,
    [role, task, taskData?.title],
  );

  if (!roleData || !taskData) {
    return (
      <SectionShell
        title="Prompt Not Found"
        description="The requested prompt template was not found. Browse our full AI prompt library."
        keywords="AI Prompts, Prompt Library, Prompt Templates"
      >
        <div className="py-20 text-center">
          <h1 className="text-2xl font-bold text-white">Prompt Not Found</h1>
          <p className="mt-3 text-slate-400">We couldn't find this prompt template.</p>
          <Link to="/prompts" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-400">
            ← Back to Prompt Library
          </Link>
        </div>
      </SectionShell>
    );
  }

  const RoleIcon = PROMPT_ROLES.find((r) => r.slug === roleData.slug)?.icon;
  const roleAccent = PROMPT_ROLES.find((r) => r.slug === roleData.slug)?.accent ?? "from-amber-500/30 to-yellow-400/10";
  const taskIndex = roleTasks?.findIndex((t) => t.slug === taskData.slug) ?? 0;
  const related = roleTasks?.filter((t) => t.slug !== taskData.slug) ?? [];

  return (
    <SectionShell
      title={taskData.seoTitle}
      description={taskData.seoDescription}
      keywords={`${taskData.title}, ${roleData.title}, AI Prompts, ChatGPT Prompts, Prompt Templates, Prompt Engineering`}
    >
      <div className="space-y-8">
        <nav className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
          <Link to="/" className="transition hover:text-amber-400">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to="/prompts" className="transition hover:text-amber-400">Prompts</Link>
          <span aria-hidden="true">/</span>
          <Link to={`/prompts/${roleData.slug}`} className="transition hover:text-amber-400">{roleData.title}</Link>
          <span aria-hidden="true">/</span>
          <span className="text-slate-300">{taskData.title}</span>
        </nav>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${roleAccent} border border-white/10`}>
            {RoleIcon ? <RoleIcon className="h-7 w-7 text-white" aria-hidden="true" /> : null}
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/80">
              {taskData.category} · {roleData.title}
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{taskData.title} Prompt</h1>
            <p className="max-w-2xl text-base leading-7 text-slate-400">{taskData.seoDescription}</p>
            <span className="inline-flex items-center rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
              {roleTasks?.length ?? 0} prompts in this role
            </span>
          </div>
        </div>

        <div className="rounded-[20px] border border-slate-800 bg-slate-950/60 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">Ready-to-use prompt template</h2>
            <button
              onClick={async () => { if (await copyToClipboard(taskData.prompt)) { setCopied(true); setTimeout(() => setCopied(false), 2000); } }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-400"
            >
              {copied ? "✓ Copied!" : "Copy Prompt"}
            </button>
          </div>
          <pre className="mt-4 max-h-[28rem] overflow-auto whitespace-pre-wrap rounded-xl border border-slate-800 bg-black/40 p-5 font-mono text-sm leading-relaxed text-slate-200">
            {taskData.prompt}
          </pre>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[20px] border border-slate-800 bg-slate-950/60 p-6">
            <h2 className="text-lg font-semibold text-white">How to use this prompt</h2>
            <ol className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
              <li className="flex gap-3"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-xs font-bold text-amber-300">1</span>Copy the template above.</li>
              <li className="flex gap-3"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-xs font-bold text-amber-300">2</span>Replace the {"{{variables}}"} with your own details — topic, audience, tone, and other placeholders.</li>
              <li className="flex gap-3"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-xs font-bold text-amber-300">3</span>Paste it into ChatGPT, Claude, Gemini, or any AI assistant.</li>
              <li className="flex gap-3"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-xs font-bold text-amber-300">4</span>Refine the output by adding your own examples or constraints.</li>
            </ol>
          </div>
          {variables.length > 0 && (
            <div className="rounded-[20px] border border-slate-800 bg-slate-950/60 p-6">
              <h2 className="text-lg font-semibold text-white">Customizable variables</h2>
              <p className="mt-2 text-sm text-slate-400">Fill these placeholders before using the prompt for the best results.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {variables.map((v) => (
                  <code key={v} className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-amber-300">{`{{${v}}}`}</code>
                ))}
              </div>
            </div>
          )}
        </div>

        {related.length > 0 && (
          <div className="rounded-[20px] border border-slate-800 bg-slate-950/60 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-white">More {roleData.title}</h2>
              <Link to={`/prompts/${roleData.slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-400 transition hover:text-amber-300">
                View all
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {related.slice(0, 6).map((t) => (
                <Link
                  key={t.slug}
                  to={`/prompts/${roleData.slug}/${t.slug}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-sm text-slate-300 transition hover:border-amber-400/30 hover:text-white"
                >
                  <span>{t.title}</span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-500" />
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-[20px] border border-slate-800 bg-slate-950/60 p-6">
          <h2 className="text-lg font-semibold text-white">Frequently asked questions</h2>
          <div className="mt-4 space-y-4">
            {taskData.faq.map((item) => (
              <div key={item.question} className="space-y-2">
                <p className="font-semibold text-white">{item.question}</p>
                <p className="text-sm leading-7 text-slate-300">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[20px] border border-slate-800 bg-slate-950/60 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white">Refine your output with AI tools</h2>
              <p className="mt-1 text-sm text-slate-400">Copy, debug, optimize, and validate your AI prompts with free in-browser tools.</p>
            </div>
            <Link to="/tools" className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-400 transition hover:text-amber-300">
              Browse tools
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <p className="text-xs text-slate-500">
          Prompt #{taskIndex + 1} of {roleTasks?.length ?? 0} in the {roleData.title} collection.
        </p>
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
