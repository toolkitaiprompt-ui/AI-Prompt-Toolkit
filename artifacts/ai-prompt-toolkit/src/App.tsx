import React, { type FormEvent, type ReactElement, type ReactNode, useEffect, useMemo, useState, useCallback } from "react";
import {
  ArrowUpRight,
  Braces,
  FileJson2,
  Mail,
  SendHorizontal,
  Shield,
  ShieldCheck,
  Sigma,
  Sparkles,
  WandSparkles,
  Globe,
  Terminal,
  type LucideIcon,
  CheckCircle2,
  Zap,
  ArrowLeftRight,
  UserCircle,
  Sun,
  Moon,
  Search,
  Menu,
  X,
  TrendingUp,
  DollarSign,
  Wand2,
  AlertTriangle,
  List,
  Clock,
} from "lucide-react";
import { BrowserRouter, Link, NavLink, Route, Routes, useParams } from "react-router-dom";
import {
  cleanPrompt,
  estimateTokens,
  extractPromptVariables,
  formatPrompt,
  generateJsonSchema,
  validateJsonWithSchema,
  type TokenEstimate,
  type ModelTokenEstimate,
} from "./lib/toolkit";
import { BLOG_POSTS, type BlogPost, getBlogPostBySlug } from "./data/blogPosts";
import { getSeoForPath } from "./seoConfig";
import HomePage from "./components/HomePage";
import {
  OrganizationSchema,
  BreadcrumbSchema,
  SoftwareApplicationSchema,
  ArticleSchema,
  FAQPageSchema,
} from "./components/SEO/SchemaMarkup";
import PromptOptimizer from "./components/PromptOptimizer";
import MegaPromptBuilder from "./components/MegaPromptBuilder";
import PromptDebugger from "./components/PromptDebugger";
import SecurityScanner from "./components/tools/SecurityScanner";
import PromptChainBuilder from "./components/tools/PromptChainBuilder";
import PromptTranslator from "./components/tools/PromptTranslator";
import ApiRequestBuilder from "./components/tools/ApiRequestBuilder";
import PromptConverter from "./components/PromptConverter";
import PersonaBuilder from "./components/PersonaBuilder";
import PromptComparison from "./components/PromptComparison";
import ToolCard from "./components/ToolCard";
import BlogCard from "./components/BlogCard";
import TemplatesPage from "./pages/TemplatesPage";
import SearchModal from "./components/SearchModal";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryDetailPage from "./pages/CategoryDetailPage";
import ImageGeneratorPage from "./pages/ImageGeneratorPage";
import PromptsIndexPage from "./pages/PromptsIndexPage";
import RolePromptsPage from "./pages/RolePromptsPage";
import CompareIndexPage from "./pages/CompareIndexPage";
import ComparisonPage from "./pages/ComparisonPage";
import HowToIndexPage from "./pages/HowToIndexPage";
import HowToPage from "./pages/HowToPage";
import PlaygroundPage from "./pages/PlaygroundPage";
import AdBanner from "./components/AdBanner";
import PromptHistory from "./components/PromptHistory";
import { savePrompt } from "./lib/promptHistory";

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
    title: "Mega Prompt Builder",
    path: "/tools/mega-prompt-builder",
    description: "Build perfect prompts step-by-step — choose role, task, context, audience, format, tone, constraints, and examples in one guided wizard.",
    icon: Wand2,
    accent: "from-amber-500/30 to-rose-400/10",
    keyBenefits: ["8-step guided wizard", "Copy-ready prompts", "Multiple formats & tones"],
  },
  {
    title: "Prompt Debugger",
    path: "/tools/prompt-debugger",
    description: "Paste any prompt to get a health score, detect vague words, missing role/format/constraints, ambiguous pronouns, conflicting instructions, and token length warnings.",
    icon: Zap,
    accent: "from-rose-500/30 to-amber-400/10",
    keyBenefits: ["Prompt Health Score (0-100)", "8+ issue detectors", "Auto-fix suggestions"],
  },
  {
    title: "Security Scanner",
    path: "/tools/security-scanner",
    description: "Scan your prompts for injection attacks, jailbreak attempts, data leak risks, PII exposure, and unsafe content — all in your browser.",
    icon: Shield,
    accent: "from-rose-500/30 to-amber-400/10",
    keyBenefits: ["Prompt injection detection", "Jailbreak pattern scanner", "PII & data leak protection"],
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
    title: "Prompt Chain Builder",
    path: "/tools/prompt-chain-builder",
    description: "Build multi-step AI prompt chains — add up to 5 sequential steps, each with its own prompt and output format. Export as Markdown.",
    icon: List,
    accent: "from-emerald-500/30 to-cyan-400/10",
    keyBenefits: ["Up to 5 steps", "Markdown export", "Sequential workflow"],
  },
  {
    title: "Prompt Translator",
    path: "/tools/prompt-translator",
    description: "Translate English prompts to 8 languages — Hindi, Spanish, French, German, Japanese, Chinese, Portuguese, Arabic. Preserves [variables] and prompt structure.",
    icon: Globe,
    accent: "from-blue-500/30 to-cyan-400/10",
    keyBenefits: ["8 languages", "Preserves [variables]", "Free & private"],
  },
  {
    title: "API Request Builder",
    path: "/tools/api-request-builder",
    description: "Build ready-to-use API request bodies for OpenAI, Anthropic & Gemini. Includes cURL commands, temperature & token control.",
    icon: Terminal,
    accent: "from-violet-500/30 to-indigo-400/10",
    keyBenefits: ["OpenAI / Anthropic / Gemini formats", "cURL command", "Temperature & token control"],
  },
];

const TOOL_BY_SLUG = new Map(TOOL_PAGES.map((tool) => [tool.path.split("/").pop()!, tool]));

function getBlogPostsForTool(toolSlug: string) {
  return BLOG_POSTS.filter((post) => post.relatedToolSlugs.includes(toolSlug));
}

function useSeo(title?: string, description?: string, keywords?: string) {
  const configSeo = getSeoForPath(window.location.pathname);

  const finalTitle = configSeo.title || title || "AI World Hub";
  const finalDesc = configSeo.description || description || "";
  const finalKeywords = configSeo.keywords || keywords || "";

  useEffect(() => {
    document.title = finalTitle;

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

    ensureMeta("description").setAttribute("content", finalDesc);
    ensureMeta("keywords").setAttribute("content", finalKeywords);
    ensureMeta("robots").setAttribute("content", "index, follow");
    ensureMeta("twitter:card").setAttribute("content", "summary_large_image");
    ensureMeta("twitter:title").setAttribute("content", finalTitle);
    ensureMeta("twitter:description").setAttribute("content", finalDesc);
    ensurePropertyMeta("og:title").setAttribute("content", finalTitle);
    ensurePropertyMeta("og:description").setAttribute("content", finalDesc);
    ensurePropertyMeta("og:type").setAttribute("content", "website");
    ensureLink("canonical").setAttribute("href", window.location.href);

    // Hreflang injection for international SEO (#10)
    const hreflangs = ["en", "en-US", "en-GB", "en-IN", "x-default"];
    // Remove existing hreflang to avoid duplicates
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
    hreflangs.forEach((lang) => {
      const link = document.createElement("link");
      link.setAttribute("rel", "alternate");
      link.setAttribute("hreflang", lang);
      link.setAttribute("href", window.location.href.split('?')[0]);
      document.head.appendChild(link);
    });
  }, [finalTitle, finalDesc, finalKeywords]);
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // First-save toast
  useEffect(() => {
    const handler = () => {
      setToast("Saved! 📝");
      setTimeout(() => setToast(null), 3000);
    };
    window.addEventListener('aiwh-first-save', handler);
    return () => window.removeEventListener('aiwh-first-save', handler);
  }, []);
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
      <OrganizationSchema />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
      ]} />
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
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>Home</NavLink>
            <NavLink to="/playground" className={`${navLinkClass} text-amber-300 hover:text-amber-200`}>✨ Playground</NavLink>
            <NavLink to="/tools" className={navLinkClass}>Tools</NavLink>
            <NavLink to="/prompts" className={navLinkClass}>Prompts</NavLink>
            <NavLink to="/blog" className={navLinkClass}>Blog</NavLink>
            <NavLink to="/about" className={navLinkClass}>About</NavLink>
          </nav>
          <div className="flex items-center gap-1.5 shrink-0">
            <PromptHistory />
            <button type="button" onClick={() => setSearchOpen(true)} className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center hover:bg-white/5 transition text-slate-400 hover:text-white" aria-label="Search">
              <Search className="w-4 h-4" />
            </button>
            <button type="button" onClick={onToggle} className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center hover:bg-white/5 transition text-slate-400 hover:text-amber-300" aria-label="Toggle theme">
              {mode === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
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
              <NavLink to="/playground" onClick={() => setMobileMenuOpen(false)} className={`${mobileNavLinkClass} text-amber-300`}>✨ Playground</NavLink>
              <NavLink to="/tools" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>Tools</NavLink>
              <NavLink to="/prompts" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>Prompts</NavLink>
              <NavLink to="/blog" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>Blog</NavLink>
              <NavLink to="/about" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>About</NavLink>
            </nav>
            <div className="border-t border-white/[0.06] mt-3 pt-3 space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-4">More</p>
              <NavLink to="/templates" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-sm text-slate-400 hover:text-white transition rounded-lg hover:bg-white/5">Templates</NavLink>
              <NavLink to="/categories" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-sm text-slate-400 hover:text-white transition rounded-lg hover:bg-white/5">Categories</NavLink>
              <NavLink to="/image-generator" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-sm text-slate-400 hover:text-white transition rounded-lg hover:bg-white/5">AI Image</NavLink>
              <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-sm text-slate-400 hover:text-white transition rounded-lg hover:bg-white/5">Contact</NavLink>
            </div>
            <div className="border-t border-white/[0.06] mt-2 pt-2">
              <button onClick={() => { onToggle(); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-white/[0.06] px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                {mode === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {mode === "dark" ? "Light Mode" : "Dark Mode"}
              </button>
            </div>
          </div>
        )}
      </header>
      
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        tools={TOOL_PAGES}
        blogPosts={BLOG_POSTS}
        templates={[]}
      />

      <main className="w-full">
        <Routes>
          <Route path="/" element={<HomePage toolPages={TOOL_PAGES} />} />
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
                description="Polish prompts with advanced structuring — role, format, tone, and constraint patterns applied in your browser."
                toolSlug="advanced-prompt-optimizer"
                tool={TOOL_BY_SLUG.get("advanced-prompt-optimizer")!}
              >
                <PromptOptimizer />
              </ToolContainer>
            }
          />
          <Route path="/tools/prompt-cleaner" element={<PromptCleanerPage />} />
          <Route path="/tools/prompt-converter" element={<ToolContainer title="Prompt Converter" toolSlug="prompt-converter" description="Convert ChatGPT prompts to Claude, Gemini, or Cursor format." tool={TOOL_BY_SLUG.get("prompt-converter")!}><PromptConverter /></ToolContainer>} />
          <Route path="/tools/persona-builder" element={<ToolContainer title="AI Persona Builder" toolSlug="persona-builder" description="Generate expert system prompts for different roles like Marketer, Developer, or Analyst." tool={TOOL_BY_SLUG.get("persona-builder")!}><PersonaBuilder /></ToolContainer>} />
          <Route path="/tools/prompt-comparison" element={<ToolContainer title="Prompt Comparison Tool" toolSlug="prompt-comparison" description="Compare two prompts side by side. See token count, word count, readability, structure score, clarity score, and visual diff highlighting." tool={TOOL_BY_SLUG.get("prompt-comparison")!}><PromptComparison /></ToolContainer>} />
          <Route path="/tools/mega-prompt-builder" element={<ToolContainer title="Mega Prompt Builder" toolSlug="mega-prompt-builder" description="Build perfect prompts step-by-step with a guided wizard — choose role, task, context, audience, format, tone, constraints, and examples." tool={TOOL_BY_SLUG.get("mega-prompt-builder")!}><MegaPromptBuilder /></ToolContainer>} />
          <Route path="/tools/prompt-debugger" element={<ToolContainer title="Prompt Debugger" toolSlug="prompt-debugger" description="Analyze any prompt for issues — vague words, missing role/format, token warnings, conflicting instructions, and more. Get a health score and auto-fix suggestions." tool={TOOL_BY_SLUG.get("prompt-debugger")!}><PromptDebugger /></ToolContainer>} />
          <Route path="/tools/security-scanner" element={<ToolContainer title="Security Scanner" toolSlug="security-scanner" description="Scan your prompts for injection attacks, jailbreak attempts, data leak risks, PII exposure, and unsafe content — all in your browser." tool={TOOL_BY_SLUG.get("security-scanner")!}><SecurityScanner /></ToolContainer>} />
          <Route path="/tools/prompt-chain-builder" element={<ToolContainer title="Prompt Chain Builder" toolSlug="prompt-chain-builder" description="Build multi-step AI prompt chains — add up to 5 sequential steps, each with its own prompt and output format. Export as Markdown." tool={TOOL_BY_SLUG.get("prompt-chain-builder")!}><PromptChainBuilder /></ToolContainer>} />
          <Route path="/tools/prompt-translator" element={<ToolContainer title="Prompt Translator" toolSlug="prompt-translator" description="Translate English prompts to 8 languages — Hindi, Spanish, French, German, Japanese, Chinese, Portuguese, Arabic. Preserves variables and prompt structure." tool={TOOL_BY_SLUG.get("prompt-translator")!}><PromptTranslator /></ToolContainer>} />
          <Route path="/tools/api-request-builder" element={<ToolContainer title="API Request Builder" toolSlug="api-request-builder" description="Build ready-to-use API request bodies for OpenAI, Anthropic & Gemini. Includes cURL commands, temperature & token control." tool={TOOL_BY_SLUG.get("api-request-builder")!}><ApiRequestBuilder /></ToolContainer>} />
          <Route path="/tools/token-estimator" element={<TokenEstimatorPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/categories/:id" element={<CategoryDetailPage />} />
          <Route path="/image-generator" element={<ImageGeneratorPage />} />
          <Route path="/prompts" element={<PromptsIndexPage />} />
          <Route path="/prompts/:roleSlug" element={<RolePromptsPage />} />
          <Route path="/compare" element={<CompareIndexPage />} />
          <Route path="/compare/:slug" element={<ComparisonPage />} />
          <Route path="/how-to" element={<HowToIndexPage />} />
          <Route path="/how-to/:slug" element={<HowToPage />} />
          <Route path="/playground" element={<PlaygroundPage />} />
          <Route path="/privacy-policy" element={<PrivacyPage />} />
          <Route path="/terms-of-service" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
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
                <li><Link to="/tools/token-estimator" className="text-slate-400 transition hover:text-amber-400">Token Estimator</Link></li>
                <li><Link to="/tools/json-validator" className="text-slate-400 transition hover:text-amber-400">JSON Validator</Link></li>
                <li><Link to="/tools/json-schema-generator" className="text-slate-400 transition hover:text-amber-400">JSON Schema Generator</Link></li>
                <li><Link to="/tools/advanced-prompt-optimizer" className="text-slate-400 transition hover:text-amber-400">Prompt Optimizer</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Resources</h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li><Link to="/blog" className="text-slate-400 transition hover:text-amber-400">Blog</Link></li>
                <li><Link to="/about" className="text-slate-400 transition hover:text-amber-400">About Us</Link></li>
                <li><Link to="/contact" className="text-slate-400 transition hover:text-amber-400">Contact</Link></li>
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
            <div className="flex items-center gap-4">
              <p className="text-xs text-slate-600">Made with ❤️ for the AI community</p>
              <a href="https://buymeacoffee.com/aiworldhub" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/20 text-[11px] text-amber-300 hover:bg-amber-500/20 transition">
                ☕ Buy me a coffee
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] animate-bounce rounded-2xl border border-emerald-400/30 bg-slate-900/95 backdrop-blur-xl px-5 py-3 shadow-2xl shadow-emerald-500/20">
          <p className="text-sm font-semibold text-emerald-300">{toast}</p>
        </div>
      )}
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
      title="Free AI Tools Directory — 10 Best Tools"
      description="Browse the best free AI tools for prompt engineering — variable extractor, JSON schema generator, JSON validator, prompt formatter, cleaner, token estimator, converter, persona builder & optimizer."
      keywords="Best AI Tools, Free AI Tools, AI Tools Directory, Prompt Engineering Tools"
    >
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-400/80">
          ✦ Free Tools
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">All Tools</h1>
        <p className="max-w-3xl text-base sm:text-lg text-slate-400">
          Choose from 10 tools to fix, format, and optimize your AI prompts — all free, no sign-up needed.
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {TOOL_PAGES.map((tool, index) => (
          <React.Fragment key={tool.path}>
            <ToolCard tool={tool} />
            {index === 2 && (
              <div className="md:col-span-2 xl:col-span-3">
                <AdBanner format="horizontal" className="my-2" />
              </div>
            )}
            {index === 5 && (
              <div className="md:col-span-2 xl:col-span-3">
                <AdBanner format="horizontal" className="my-2" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </SectionShell>
  );
}

function ToolContainer({
  title, description, toolSlug, tool, children,
}: {
  title: string; description: string; toolSlug?: string; tool?: ToolMeta; children: ReactNode;
}) {
  const keywords = `${title}, Best AI Tools, Free AI Tools, Prompt Engineering, ChatGPT Prompts`;
  const relatedBlogs = toolSlug ? getBlogPostsForTool(toolSlug) : [];

  useSeo(title, description, keywords);
  const toolPath = tool?.path || `/tools/${toolSlug}`;

  return (
    <section className="site-container section-lg space-y-16">
      {tool && <SoftwareApplicationSchema name={title} description={description} url={toolPath} />}
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Tools", url: "/tools" },
        { name: title, url: toolPath },
      ]} />
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



      <div className="rounded-[24px] border border-white/10 bg-slate-950/80 p-6 shadow-xl">
        <div className="space-y-4">{children}</div>
      </div>

      {/* AdSense slot — #9 fix, shows after tool, only if client ID present or preview */}
      <AdBanner format="horizontal" />

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
    </section>
  );
}

function PromptVariableExtractorPage() {
  const [input, setInput] = useState("You are a {{role}} expert in {{domain}}. Write a {{tone}} {{content_type}} for {{product_name}} targeting {audience} in :language. Focus on [key_benefit] and CTA for [region]. Max {{word_count}} words.");
  const variables = useMemo(() => extractPromptVariables(input), [input]);
  const tool = TOOL_BY_SLUG.get("prompt-variable-extractor")!;

  // Save prompt to history on change
  const handleVarChange = useCallback((value: string) => {
    setInput(value);
    if (value.trim().length > 10) {
      savePrompt(value, "Prompt Variable Extractor", "/tools/prompt-variable-extractor");
    }
  }, []);

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
          onChange={(e) => handleVarChange(e.target.value)}
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
    try { setResult(generateJsonSchema(input)); setError(""); savePrompt(input, "JSON Schema Generator", "/tools/json-schema-generator"); }
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
        className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-400"
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
      savePrompt(jsonInput, "JSON Validator", "/tools/json-validator");
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
        className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-400"
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
  const [input, setInput] = useState("you are expert analyst\n\nsummarize quarterly business risks for exec team\n-- need bullet points\n-- include impact High/Med/Low\n-- add mitigation steps\ntone professional\n\naudience = C-suite\nformat should be markdown table maybe?");
  const output = useMemo(() => formatPrompt(input), [input]);
  const tool = TOOL_BY_SLUG.get("prompt-formatter")!;
  // Save prompt to history on user input
  const handleFormatterChange = useCallback((val: string) => {
    setInput(val);
    if (val.trim().length > 10) savePrompt(val, "Prompt Formatter", "/tools/prompt-formatter");
  }, []);

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
          onChange={(e) => handleFormatterChange(e.target.value)}
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
  const [input, setInput] = useState("  Act  as   expert   \u200Bcopywriter\u200B!   \n\n\nWrite  a  product \t\t launch \n email for  {{product}} —  include  3 benefits…  \n\n  Keep  tone  exciting!!!  \u00A0\u00A0 ");
  const output = useMemo(() => cleanPrompt(input), [input]);
  const tool = TOOL_BY_SLUG.get("prompt-cleaner")!;
  // Save prompt to history
  const handleCleanerChange = useCallback((val: string) => {
    setInput(val);
    if (val.trim().length > 10) savePrompt(val, "Prompt Cleaner", "/tools/prompt-cleaner");
  }, []);

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
          onChange={(e) => handleCleanerChange(e.target.value)}
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
  const [input, setInput] = useState("You are a senior product marketing manager.\nTask: Write a 500-word launch announcement for AI World Hub targeting developers and indie hackers.\nInclude 3 key benefits, 1 customer quote placeholder, and a CTA to https://aiworldhub.site/tools.\nTone: confident, friendly, no jargon.\nFormat: headline, subheadline, 3 bullet benefits, quote block, CTA.\nConstraint: keep under 500 words.");
  const [callsPerDay, setCallsPerDay] = useState(100);
  const stats = useMemo(() => estimateTokens(input), [input]);
  const tool = TOOL_BY_SLUG.get("token-estimator")!;

  const modelColors: Record<string, string> = {
    "GPT-4o": "text-emerald-300",
    "Claude 3.5 Sonnet": "text-violet-300",
    "Gemini 1.5 Pro": "text-blue-300",
    "DeepSeek V3": "text-rose-300",
    "Llama 3 (Together)": "text-cyan-300",
  };
  const modelBgColors: Record<string, string> = {
    "GPT-4o": "bg-emerald-500/10 border-emerald-400/20",
    "Claude 3.5 Sonnet": "bg-violet-500/10 border-violet-400/20",
    "Gemini 1.5 Pro": "bg-blue-500/10 border-blue-400/20",
    "DeepSeek V3": "bg-rose-500/10 border-rose-400/20",
    "Llama 3 (Together)": "bg-cyan-500/10 border-cyan-400/20",
  };

  return (
    <ToolContainer
      title="Token Estimator & Cost Calculator"
      toolSlug="token-estimator"
      description="Estimate tokens across multiple models, compare costs, and project monthly spending. Supports GPT-4o, Claude 3.5, Gemini 1.5 Pro, DeepSeek V3 & Llama 3."
      tool={tool}
    >
      {/* Input */}
      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-300">Prompt Text</span>
        <textarea
          className="h-36 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-slate-100 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20"
          value={input}
          onChange={(e) => { setInput(e.target.value); if (e.target.value.trim().length > 10) savePrompt(e.target.value, "Token Estimator", "/tools/token-estimator"); }}
          aria-label="Text for token estimation"
        />
      </label>

      {/* Overview stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Characters</p>
          <p className="mt-1 text-2xl font-bold text-white">{stats.characters.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Words</p>
          <p className="mt-1 text-2xl font-bold text-white">{stats.words.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Avg Tokens</p>
          <p className="mt-1 text-2xl font-bold text-amber-300">
            {Math.round(stats.modelEstimates.reduce((a, m) => a + m.tokens, 0) / stats.modelEstimates.length).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Model breakdown */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Sigma className="w-4 h-4 text-amber-400" />
          Token Count by Model
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {stats.modelEstimates.map((m: ModelTokenEstimate) => (
            <div
              key={m.model}
              className={`relative rounded-xl border p-4 ${modelBgColors[m.model] || "bg-slate-900/60 border-slate-800"} ${m.isCheapest ? "ring-1 ring-emerald-400/40" : ""}`}
            >
              {m.isCheapest && (
                <span className="absolute -top-2 -right-2 flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                  <TrendingUp className="w-3 h-3" /> Cheapest
                </span>
              )}
              <p className="text-xs font-medium text-slate-500">{m.model}</p>
              <p className={`mt-1 text-xl font-bold ${modelColors[m.model] || "text-white"}`}>
                {m.tokens.toLocaleString()}
                <span className="text-xs font-normal text-slate-500 ml-1">tokens</span>
              </p>
              <div className="mt-2 flex justify-between text-[11px] text-slate-500">
                <span>Input: <span className="text-slate-300 font-medium">${m.inputCost.toFixed(6)}</span></span>
                <span>Output: <span className="text-slate-300 font-medium">${m.outputCost.toFixed(6)}</span></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cost calculator */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-amber-400" />
          Cost Projection
        </h3>

        <div className="mb-5">
          <label className="flex items-center justify-between text-sm text-slate-400 mb-2">
            <span>Calls per day</span>
            <span className="text-white font-semibold text-lg">{callsPerDay.toLocaleString()}</span>
          </label>
          <input
            type="range"
            min={1}
            max={100000}
            step={1}
            value={callsPerDay}
            onChange={(e) => setCallsPerDay(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none bg-slate-700 accent-amber-500 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-slate-600 mt-1">
            <span>1</span>
            <span>100</span>
            <span>1K</span>
            <span>10K</span>
            <span>100K</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50 text-xs text-slate-500 uppercase tracking-wider">
                <th className="text-left py-2 pr-3">Model</th>
                <th className="text-right py-2 px-3">$/1M Input</th>
                <th className="text-right py-2 px-3">Daily Cost</th>
                <th className="text-right py-2 pl-3">Monthly Cost</th>
              </tr>
            </thead>
            <tbody>
              {stats.modelEstimates.map((m: ModelTokenEstimate) => {
                const dailyCost = m.inputCost * callsPerDay;
                const monthlyCost = dailyCost * 30;
                return (
                  <tr key={m.model} className={`border-b border-slate-800/50 ${m.isCheapest ? "bg-emerald-500/5" : ""}`}>
                    <td className="py-2.5 pr-3">
                      <span className="text-slate-300 font-medium">{m.model}</span>
                      {m.isCheapest && <span className="ml-2 text-[10px] text-emerald-400">★ Best value</span>}
                    </td>
                    <td className="text-right py-2.5 px-3 text-slate-400">${m.costPer1MInput}</td>
                    <td className="text-right py-2.5 px-3 text-slate-300">${dailyCost < 0.01 ? "<$0.01" : dailyCost.toFixed(2)}</td>
                    <td className="text-right py-2.5 pl-3 font-semibold" style={{ color: m.isCheapest ? "#34d399" : "#e2e8f0" }}>
                      ${monthlyCost < 0.01 ? "<$0.01" : monthlyCost.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-slate-600 mt-3">
          Based on input tokens only. Output tokens billed separately. Prices as of July 2026.
        </p>
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

  if (!post) return <NotFoundPage />;

  const postIndex = BLOG_POSTS.findIndex((p) => p.slug === post.slug);
  const variant: "A" | "B" = postIndex % 2 === 0 ? "A" : "B";
  const insertAfterIndex = Math.floor(post.contentSections.length / 2);
  const relatedTools = post.relatedToolSlugs
    .map((s) => TOOL_BY_SLUG.get(s))
    .filter(Boolean) as ToolMeta[];

  return (
    <section className="site-container section-md">
      <ArticleSchema
        headline={post.title}
        description={post.excerpt || post.metaDescription}
        datePublished={post.date}
        authorName="AI World Hub Editorial Team"
        imageUrl={post.thumbnailUrl || undefined}
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Blog", url: "/blog" },
        { name: post.title, url: `/blog/${post.slug}` },
      ]} />
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
                if (idx === insertAfterIndex - 1) {
                  sections.push(

                  );
                }
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
            <p className="text-3xl font-bold text-white">10</p>
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
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error" | "fallback">("idle");
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
              className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60">
              {status === "sending" ? "Sending..." : "Send Message"} <SendHorizontal className="h-4 w-4" />
            </button>
            {status === "success" && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
                <p className="text-sm text-emerald-400">✓ Thank you! Your message has been sent successfully. We'll get back to you soon.</p>
              </div>
            )}
            {status === "error" && (
              <p className="text-sm text-red-400">✗ Something went wrong. Please try again or email us directly.</p>
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
                <p className="text-[11px] text-slate-500">Direct email: <a href="mailto:toolkitaiprompt@gmail.com" className="text-amber-400 underline">toolkitaiprompt@gmail.com</a> • Draft auto-saved in browser</p>
              </div>
            )}
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
            <li><strong>Advertising cookies:</strong> Used by Google AdSense to display relevant ads.</li>
          </ul>
          <p>You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent through your browser settings.</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Google AdSense and Advertising</h2>
          <p>We use Google AdSense to display advertisements. Google, as a third-party vendor, uses cookies to serve ads based on your prior visits to this and other websites.</p>
          <ul className="ml-6 list-disc space-y-1">
            <li>Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our site and/or other sites on the Internet.</li>
            <li>You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-cyan-400 hover:underline">Google Ads Settings</a>.</li>
            <li>For more information about how Google uses data, visit <a href="https://policies.google.com/technologies/partner-sites" className="text-cyan-400 hover:underline">Google's Privacy & Terms</a>.</li>
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
          <p>Our website uses third-party services such as Google AdSense and Google Analytics. We are not responsible for the practices or content of these third-party services. Please review their respective terms and policies.</p>
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
  const [showTip, setShowTip] = useState(false);
  return (
    <SectionShell title="Page Not Found" description="The requested page could not be found.">
      <div className="text-center py-10">
        <p className="text-6xl mb-4">🌌</p>
        <h1 className="text-4xl font-bold text-white mb-3">Lost in the AI Void?</h1>
        <p className="text-slate-400 max-w-md mx-auto mb-2">This page doesn't exist — but don't worry, even the best AI hallucinates sometimes! 🤖</p>
        <p className="text-slate-500 text-sm mb-8">Let's get you back on track!</p>
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full font-semibold text-white shadow-lg shadow-amber-500/30 hover:shadow-xl transition">🏠 Go Home</Link>
          <Link to="/tools" className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-slate-300 hover:bg-white/10 transition">🛠️ Try Our Tools</Link>
          <Link to="/playground" className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-slate-300 hover:bg-white/10 transition">✨ Visit Playground</Link>
        </div>
        <button onClick={() => setShowTip(!showTip)} className="text-xs text-slate-500 hover:text-slate-300 transition underline decoration-dotted">
          {showTip ? "🙈 Hide debugging tip" : "💡 Show me a debugging tip"}
        </button>
        {showTip && (
          <div className="mt-4 max-w-md mx-auto p-4 rounded-xl bg-amber-500/10 border border-amber-400/20 text-xs text-slate-300">
            <p className="font-semibold text-amber-300 mb-1">🔍 Pro debugging tip:</p>
            <p>If you clicked a link from another site, the URL might be mistyped. Try searching for what you need on our <Link to="/blog" className="text-amber-400 underline">blog</Link> or use the <Link to="/tools/prompt-debugger" className="text-amber-400 underline">Prompt Debugger</Link> to check your own prompts!</p>
          </div>
        )}
      </div>
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
    <BrowserRouter basename={import.meta.env.BASE_URL?.replace(/\/$/, "") || ""}>
      <Layout mode={themeMode} onToggle={() => setThemeMode((c) => (c === "dark" ? "light" : "dark"))} />
    </BrowserRouter>
  );
}
