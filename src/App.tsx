import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Github, Menu, Search, X } from "lucide-react";
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import AdBanner from "./components/AdBanner";
import { ToolSkeleton } from "./components/ToolSkeleton";
import { TOOL_BY_SLUG, TOOL_PAGES } from "./data/tools";

const HomePage = lazy(() => import("./components/HomePage"));
const SearchModal = lazy(() => import("./components/SearchModal"));

const TemplatesPage = lazy(() => import("./pages/TemplatesPage"));
const CategoriesPage = lazy(() => import("./pages/CategoriesPage"));
const ImageGeneratorPage = lazy(() => import("./pages/ImageGeneratorPage"));
const PromptsDirectoryPage = lazy(() => import("./pages/PromptsPages").then((m) => ({ default: m.PromptsDirectoryPage })));
const PromptsRolePage = lazy(() => import("./pages/PromptsPages").then((m) => ({ default: m.PromptsRolePage })));
const PromptTaskPage = lazy(() => import("./pages/PromptsPages").then((m) => ({ default: m.PromptTaskPage })));

const ToolsDirectoryPage = lazy(() => import("./pages/InlineToolPages").then((m) => ({ default: m.ToolsDirectoryPage })));
const PromptVariableExtractorPage = lazy(() => import("./pages/InlineToolPages").then((m) => ({ default: m.PromptVariableExtractorPage })));
const JsonSchemaGeneratorPage = lazy(() => import("./pages/InlineToolPages").then((m) => ({ default: m.JsonSchemaGeneratorPage })));
const JsonValidatorPage = lazy(() => import("./pages/InlineToolPages").then((m) => ({ default: m.JsonValidatorPage })));
const PromptFormatterPage = lazy(() => import("./pages/InlineToolPages").then((m) => ({ default: m.PromptFormatterPage })));
const PromptCleanerPage = lazy(() => import("./pages/InlineToolPages").then((m) => ({ default: m.PromptCleanerPage })));
const TokenEstimatorPage = lazy(() => import("./pages/InlineToolPages").then((m) => ({ default: m.TokenEstimatorPage })));

const BestAiToolsForWritingPage = lazy(() => import("./pages/BestAiToolsForWritingPage"));
const BestAiToolsForCodingPage = lazy(() => import("./pages/BestAiToolsForCodingPage"));
const BestAiToolsForImageGenerationPage = lazy(() => import("./pages/BestAiToolsForImageGenerationPage"));
const AiToolComparisonsPage = lazy(() => import("./pages/AiToolComparisonsPage"));

const LazyPromptOptimizer = lazy(() => import("./pages/toolPages").then((m) => ({ default: m.PromptOptimizerPage })));
const LazyPromptConverter = lazy(() => import("./pages/toolPages").then((m) => ({ default: m.PromptConverterPage })));
const LazyPersonaBuilder = lazy(() => import("./pages/toolPages").then((m) => ({ default: m.PersonaBuilderPage })));
const LazyPromptComparison = lazy(() => import("./pages/toolPages").then((m) => ({ default: m.PromptComparisonPage })));
const LazyMegaPromptBuilder = lazy(() => import("./pages/toolPages").then((m) => ({ default: m.MegaPromptBuilderPage })));
const LazyPromptDebugger = lazy(() => import("./pages/toolPages").then((m) => ({ default: m.PromptDebuggerPage })));
const LazySecurityScanner = lazy(() => import("./pages/toolPages").then((m) => ({ default: m.SecurityScannerPage })));
const LazyPromptChainBuilder = lazy(() => import("./pages/toolPages").then((m) => ({ default: m.PromptChainBuilderPage })));
const LazyPromptTranslator = lazy(() => import("./pages/toolPages").then((m) => ({ default: m.PromptTranslatorPage })));
const LazyApiRequestBuilder = lazy(() => import("./pages/toolPages").then((m) => ({ default: m.ApiRequestBuilderPage })));
const LazyImagePromptGenerator = lazy(() => import("./pages/toolPages").then((m) => ({ default: m.ImagePromptGeneratorPage })));
const LazyContentSummarizer = lazy(() => import("./pages/toolPages").then((m) => ({ default: m.ContentSummarizerPage })));
const LazyRegexGenerator = lazy(() => import("./pages/toolPages").then((m) => ({ default: m.RegexGeneratorPage })));

const BlogPage = lazy(() => import("./pages/BlogPages").then((m) => ({ default: m.BlogPage })));
const BlogPostPage = lazy(() => import("./pages/BlogPages").then((m) => ({ default: m.BlogPostPage })));
const AboutPage = lazy(() => import("./pages/StaticPages").then((m) => ({ default: m.AboutPage })));
const ChangelogPage = lazy(() => import("./pages/StaticPages").then((m) => ({ default: m.ChangelogPage })));
const PrivacyPage = lazy(() => import("./pages/StaticPages").then((m) => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import("./pages/StaticPages").then((m) => ({ default: m.TermsPage })));
const NotFoundPage = lazy(() => import("./pages/StaticPages").then((m) => ({ default: m.NotFoundPage })));
const PlaygroundPage = lazy(() => import("./pages/PlaygroundPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));

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
      }
    } catch {
      // silently ignore
    }
  }, [location.pathname]);

  return null;
}

function GlobalAdScripts() {
  useEffect(() => {}, []);
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
      
      <Suspense fallback={null}>
        <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </Suspense>

      <main className="w-full">
        {/* Above-fold slim banner — every page, near the fold */}
        <div className="hidden md:block">
          <AdBanner size="banner" />
        </div>
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
          <Route path="/best-ai-tools-for-writing" element={<BestAiToolsForWritingPage />} />
          <Route path="/best-ai-tools-for-coding" element={<BestAiToolsForCodingPage />} />
          <Route path="/best-ai-tools-for-image-generation" element={<BestAiToolsForImageGenerationPage />} />
          <Route path="/ai-tool-comparisons" element={<AiToolComparisonsPage />} />
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

      {/* Mobile sticky bottom ad bar (mobile only, dismissible) */}
      <MobileBottomAd />
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

function MobileBottomAd() {
  const [dismissed, setDismissed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);
  useEffect(() => {
    if (!dismissed && isMobile) {
      document.body.style.paddingBottom = "90px";
    } else {
      document.body.style.paddingBottom = "";
    }
    return () => { document.body.style.paddingBottom = ""; };
  }, [dismissed, isMobile]);
  if (dismissed || !isMobile) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] md:hidden" style={{ background: "rgba(10,10,15,0.96)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Close ad"
        className="absolute -top-5 right-2 rounded-full border border-white/15 bg-[#0a0a0f] px-2 py-0.5 text-xs text-slate-400"
      >
        ✕
      </button>
      <AdBanner size="banner" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL?.replace(/\/$/, "") || ""}>
      <MonetagSPA />
      <GlobalAdScripts />
      <Layout />
    </BrowserRouter>
  );
}
