import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter, Link, NavLink, Route, Routes, useParams } from 'react-router-dom';
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
  CheckCircle2,
  Zap,
  ArrowLeftRight,
  UserCircle,
  Menu,
  X,
  Search,
  Grid,
  List,
  Calendar,
  Clock,
  Tag,
  ArrowLeft,
  Star,
  Users,
  TrendingUp,
  Award,
  Play,
  Share2,
  Bookmark,
  ThumbsUp,
  Target,
  Heart,
  MessageSquare,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  Github,
  Twitter,
  Linkedin,
  type LucideIcon,
} from 'lucide-react';
import {
  cleanPrompt,
  estimateTokens,
  extractPromptVariables,
  formatPrompt,
  generateJsonSchema,
  validateJsonWithSchema,
} from './lib/toolkit';
import { BLOG_POSTS, type BlogPost, getBlogPostBySlug } from './data/blogPosts';
import { getSeoForPath } from './seoConfig';

// Import existing components
import HomePage from './components/HomePage';
import PromptOptimizer from './components/PromptOptimizer';
import PromptConverter from './components/PromptConverter';
import PersonaBuilder from './components/PersonaBuilder';
import PromptComparison from './components/PromptComparison';
import ToolCard from './components/ToolCard';
import BlogCard from './components/BlogCard';
import AdsterraPopup from './components/AdsterraPopup';
import AdsterraNative from './components/AdsterraNative';
import AdsterraSlot from './components/AdsterraSlot';

// ============ TYPES ============
type ThemeMode = 'light' | 'dark';

type ToolMeta = {
  title: string;
  path: string;
  description: string;
  icon: any;
  accent: string;
  premium?: boolean;
  keyBenefits?: string[];
};

// ============ TOOL PAGES DATA ============
const TOOL_PAGES: ToolMeta[] = [
  {
    title: 'Prompt Variable Extractor',
    path: '/tools/prompt-variable-extractor',
    description: 'Extract variables like {name}, {{city}}, [tone], and :language from any prompt.',
    icon: Braces,
    accent: 'from-blue-500/30 to-cyan-400/10',
    keyBenefits: ['Supports 4 variable syntaxes', 'Alphabetically sorted results', 'Zero server calls'],
  },
  {
    title: 'JSON Schema Generator',
    path: '/tools/json-schema-generator',
    description: 'Generate JSON Schema from a sample JSON object for consistent AI output structures.',
    icon: FileJson2,
    accent: 'from-indigo-500/35 to-blue-500/10',
    keyBenefits: ['Draft 2020-12 compliant', 'Nested object support', 'Instant generation'],
  },
  {
    title: 'JSON Validator',
    path: '/tools/json-validator',
    description: 'Validate model responses against your schema using key type and required field checks.',
    icon: ShieldCheck,
    accent: 'from-violet-500/35 to-indigo-400/10',
    keyBenefits: ['Type checking', 'Required field validation', 'Path-level error reporting'],
  },
  {
    title: 'Prompt Formatter',
    path: '/tools/prompt-formatter',
    description: 'Format long prompts into clean and numbered instruction blocks.',
    icon: WandSparkles,
    accent: 'from-fuchsia-500/35 to-indigo-500/10',
    keyBenefits: ['Numbered sections', 'Removes noise', 'Copy-ready output'],
  },
  {
    title: 'Prompt Cleaner',
    path: '/tools/prompt-cleaner',
    description: 'Remove noise characters, extra spacing, and malformed line breaks from prompts.',
    icon: Sparkles,
    accent: 'from-sky-500/35 to-indigo-500/10',
    keyBenefits: ['Strips control characters', 'Normalizes whitespace', 'Trims line breaks'],
  },
  {
    title: 'Token Estimator',
    path: '/tools/token-estimator',
    description: 'Estimate characters, words, and token usage before sending prompts to LLM APIs.',
    icon: Sigma,
    accent: 'from-blue-600/35 to-violet-500/10',
    keyBenefits: ['~4 chars per token model', 'Real-time counting', 'Cost planning'],
  },
  {
    title: 'Prompt Converter',
    path: '/tools/prompt-converter',
    description: 'Convert ChatGPT prompts to Claude, Gemini, or Cursor format instantly.',
    icon: ArrowLeftRight,
    accent: 'from-amber-500/30 to-yellow-400/10',
    keyBenefits: ['ChatGPT to Claude', 'ChatGPT to Gemini', 'ChatGPT to Cursor'],
  },
  {
    title: 'AI Persona Builder',
    path: '/tools/persona-builder',
    description: 'Generate expert system prompts for different roles like Marketer, Developer, or Analyst.',
    icon: UserCircle,
    accent: 'from-rose-500/30 to-amber-400/10',
    keyBenefits: ['Expert role prompting', 'Task-specific context', 'Behavioral rules'],
  },
  {
    title: 'Advanced Prompt Optimizer',
    path: '/tools/advanced-prompt-optimizer',
    description: 'Polish and amplify prompts with premium optimization controls.',
    icon: Sparkles,
    accent: 'from-indigo-500/35 to-cyan-400/10',
    premium: true,
    keyBenefits: ['Side-by-side compare', '12 optimization credits', 'Premium AI signal'],
  },
  {
    title: 'Prompt Comparison Tool',
    path: '/tools/prompt-comparison',
    description: 'Compare two prompts side by side with detailed metrics.',
    icon: ArrowLeftRight,
    accent: 'from-cyan-500/30 to-blue-400/10',
    keyBenefits: ['Token & word count', 'Readability & structure scores', 'Visual diff highlighting'],
  },
];

const TOOL_BY_SLUG = new Map(TOOL_PAGES.map((tool) => [tool.path.split('/').pop()!, tool]));

function getBlogPostsForTool(toolSlug: string) {
  return BLOG_POSTS.filter((post) => post.relatedToolSlugs.includes(toolSlug));
}

// ============ SEO HOOK ============
function useSeo(title?: string, description?: string, keywords?: string) {
  const configSeo = getSeoForPath(window.location.pathname);
  const finalTitle = configSeo.title || title || 'AI Prompt Toolkit';
  const finalDesc = configSeo.description || description || '';
  const finalKeywords = configSeo.keywords || keywords || '';

  useEffect(() => {
    document.title = finalTitle;
    const ensureMeta = (name: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      return tag;
    };
    ensureMeta('description').setAttribute('content', finalDesc);
    ensureMeta('keywords').setAttribute('content', finalKeywords);
    ensureMeta('robots').setAttribute('content', 'index, follow');
  }, [finalTitle, finalDesc, finalKeywords]);
}

// ============ UI COMPONENTS (INLINE) ============
function Button({
  variant = 'primary',
  size = 'md',
  children,
  icon: Icon,
  className = '',
  ...props
}: any) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900';
  const variants = {
    primary: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 hover:scale-105',
    secondary: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/60 hover:scale-105',
    outline: 'border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40',
    ghost: 'text-slate-300 hover:bg-white/5 hover:text-white',
  };
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseStyles} ${variants[variant as keyof typeof variants]} ${sizes[size as keyof typeof sizes]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </motion.button>
  );
}

function Card({ children, className = '', hover = true, glow = false, gradient = false }: any) {
  return (
    <motion.div
      whileHover={hover ? { y: -8, scale: 1.02 } : {}}
      transition={{ duration: 0.3 }}
      className={`
        relative
        ${gradient ? 'bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80' : 'bg-slate-900/50'}
        backdrop-blur-sm
        border border-white/10
        rounded-2xl
        p-6
        ${hover ? 'hover:border-purple-500/50' : ''}
        transition-all duration-300
        ${glow ? 'shadow-lg shadow-purple-500/20' : ''}
        ${className}
      `}
    >
      {glow && <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl blur-xl -z-10" />}
      {children}
    </motion.div>
  );
}

function Input({ label, error, icon: Icon, className = '', ...props }: any) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>}
      <div className="relative">
        {Icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Icon className="w-5 h-5" /></div>}
        <input
          className={`w-full px-4 py-3 ${Icon ? 'pl-10' : ''} bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all ${error ? 'border-red-500/50' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-1 text-sm text-red-400">{error}</motion.p>}
    </div>
  );
}

function AdBanner({ variant = 'horizontal', className = '' }: any) {
  const sizes = {
    horizontal: 'h-24 sm:h-28',
    vertical: 'h-64 sm:h-80',
    square: 'h-64',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`relative ${sizes[variant as keyof typeof sizes]} bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-white/5 rounded-xl overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Advertisement</div>
          <div className="text-sm text-slate-400">Ad Space ({variant})</div>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-50" />
    </motion.div>
  );
}

function AdSidebar() {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="hidden lg:block w-64 flex-shrink-0 space-y-6"
    >
      <div className="sticky top-24 space-y-6">
        <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-white/5 rounded-xl p-4 h-96">
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Advertisement</div>
              <div className="text-sm text-slate-400">300x600</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/tools" className="text-sm text-slate-400 hover:text-white transition-colors">All Tools</Link></li>
            <li><Link to="/blog" className="text-sm text-slate-400 hover:text-white transition-colors">Blog</Link></li>
            <li><Link to="/about" className="text-sm text-slate-400 hover:text-white transition-colors">About</Link></li>
            <li><Link to="/contact" className="text-sm text-slate-400 hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>
      </div>
    </motion.aside>
  );
}

// ============ HEADER ============
function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Tools', path: '/tools' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }} className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">AI Prompt Toolkit</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink key={link.path} to={link.path} className={({ isActive }) => `relative text-sm font-medium transition-colors ${isActive ? 'text-purple-400' : 'text-slate-300 hover:text-white'}`}>
                {({ isActive }) => (
                  <>
                    {link.name}
                    {isActive && <motion.div layoutId="navbar-indicator" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500" />}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:block">
            <Link to="/tools" className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold text-white shadow-lg shadow-purple-500/50 hover:shadow-xl transition-shadow">
              Get Started
            </Link>
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-slate-300 hover:text-white">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-xl">
            <nav className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <NavLink key={link.path} to={link.path} onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `block px-4 py-3 rounded-lg text-base font-medium transition-colors ${isActive ? 'bg-purple-500/10 text-purple-400' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
                  {link.name}
                </NavLink>
              ))}
              <Link to="/tools" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold text-white text-center">
                Get Started
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ============ FOOTER ============
function Footer() {
  const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://github.com/ai-prompt-toolkit' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/aiprompttoolkit' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/ai-prompt-toolkit' },
    { name: 'Email', icon: Mail, href: 'mailto:hello@aiprompttoolkit.com' },
  ];

  return (
    <footer className="bg-slate-950 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">AI Prompt Toolkit</span>
            </Link>
            <p className="text-slate-400 mb-6 leading-relaxed">Professional AI prompt engineering tools for teams and individuals. Format, validate, optimize, and deploy prompts with confidence.</p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link to="/tools" className="text-slate-400 hover:text-white transition-colors text-sm">All Tools</Link></li>
              <li><Link to="/tools/token-estimator" className="text-slate-400 hover:text-white transition-colors text-sm">Token Estimator</Link></li>
              <li><Link to="/tools/json-validator" className="text-slate-400 hover:text-white transition-colors text-sm">JSON Validator</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link to="/blog" className="text-slate-400 hover:text-white transition-colors text-sm">Blog</Link></li>
              <li><Link to="/about" className="text-slate-400 hover:text-white transition-colors text-sm">About</Link></li>
              <li><Link to="/contact" className="text-slate-400 hover:text-white transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link to="/privacy-policy" className="text-slate-400 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-slate-400 hover:text-white transition-colors text-sm">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-slate-400 text-sm">© 2026 AI Prompt Toolkit. All rights reserved.</div>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> for AI professionals
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============ TOOLS PAGE ============
function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['All', 'Extraction', 'Validation', 'Formatting', 'Cleaning', 'Analytics', 'Conversion', 'Generation', 'Optimization'];

  const filteredTools = TOOL_PAGES.filter((tool) => {
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            10 Professional Tools<br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">For Perfect Prompts</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">Everything you need to create, validate, optimize, and deploy AI prompts at scale.</p>
        </motion.div>

        <AdBanner variant="horizontal" className="mb-8" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="mb-6">
              <Input placeholder="Search tools..." value={searchQuery} onChange={(e: any) => setSearchQuery(e.target.value)} icon={Search} />
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => (
                <button key={category} onClick={() => setSelectedCategory(category)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === category ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}>
                  {category}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-400">Showing <span className="text-white font-semibold">{filteredTools.length}</span> tools</p>
              <div className="flex gap-2">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-purple-500/20 text-purple-400' : 'text-slate-400 hover:text-white'}`}>
                  <Grid className="w-5 h-5" />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-purple-500/20 text-purple-400' : 'text-slate-400 hover:text-white'}`}>
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 gap-6' : 'space-y-4'}>
              {filteredTools.map((tool, idx) => (
                <motion.div key={tool.path} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: idx * 0.05 }}>
                  <Link to={tool.path}>
                    <Card hover glow>
                      <div className="text-4xl mb-4">{tool.icon === Braces ? '🔍' : tool.icon === FileJson2 ? '📋' : tool.icon === Sigma ? '💰' : tool.icon === WandSparkles ? '📝' : tool.icon === Sparkles ? '🧹' : '⚡'}</div>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-white">{tool.title}</h3>
                        {tool.premium && <span className="px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-xs font-bold text-white">PRO</span>}
                      </div>
                      <p className="text-slate-400 mb-4">{tool.description}</p>
                      {tool.keyBenefits && (
                        <div className="flex flex-wrap gap-2">
                          {tool.keyBenefits.slice(0, 2).map((benefit, i) => (
                            <span key={i} className="px-2 py-1 bg-white/5 rounded text-xs text-slate-400">{benefit}</span>
                          ))}
                        </div>
                      )}
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>

            <AdBanner variant="horizontal" className="my-8" />

            {filteredTools.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-white mb-2">No tools found</h3>
                <p className="text-slate-400">Try adjusting your search or filters</p>
              </div>
            )}
          </div>

          <AdSidebar />
        </div>

        <AdBanner variant="horizontal" className="mt-8" />
      </div>
    </div>
  );
}

// ============ TOOL DETAIL PAGE ============
function ToolDetailPage() {
  const { toolId } = useParams<{ toolId: string }>();
  const tool = TOOL_PAGES.find(t => t.path === `/tools/${toolId}`);

  if (!tool) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-white mb-2">Tool Not Found</h1>
          <Link to="/tools" className="text-purple-400 hover:text-purple-300">← Back to Tools</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/tools" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Tools
        </Link>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
          <div className="flex items-start gap-6 mb-6">
            <div className="text-6xl">{tool.icon === Braces ? '🔍' : tool.icon === FileJson2 ? '📋' : tool.icon === Sigma ? '💰' : tool.icon === WandSparkles ? '📝' : tool.icon === Sparkles ? '🧹' : '⚡'}</div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">{tool.title}</h1>
              <p className="text-xl text-slate-400 mb-4">{tool.description}</p>
              {tool.keyBenefits && (
                <div className="flex flex-wrap gap-2">
                  {tool.keyBenefits.map((benefit, i) => (
                    <span key={i} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-semibold">{benefit}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <AdBanner variant="horizontal" className="mb-8" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-8">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
              <Card glow>
                <h2 className="text-2xl font-bold text-white mb-4">Try It Now</h2>
                <p className="text-slate-400">Interactive demo coming soon...</p>
              </Card>
            </motion.div>

            <AdBanner variant="horizontal" />
          </div>

          <AdSidebar />
        </div>
      </div>
    </div>
  );
}

// ============ BLOG PAGE ============
function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Prompt Engineering', 'ChatGPT', 'Claude', 'Templates', 'Midjourney', 'JSON Schema'];

  const filteredPosts = selectedCategory === 'All' ? BLOG_POSTS : BLOG_POSTS.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            AI Prompt Engineering<br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Blog & Guides</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">Expert insights, tutorials, and best practices for mastering AI prompts.</p>
        </motion.div>

        <AdBanner variant="horizontal" className="mb-8" />

        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <button key={category} onClick={() => setSelectedCategory(category)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === category ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}>
              {category}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="grid md:grid-cols-2 gap-6">
              {filteredPosts.map((post, idx) => (
                <motion.div key={post.slug} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: idx * 0.1 }}>
                  <Link to={`/blog/${post.slug}`}>
                    <Card hover className="overflow-hidden h-full">
                      <div className="flex items-center gap-2 mb-3">
                        <Tag className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-purple-400 font-medium">{post.category}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{post.title}</h3>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-3">{post.metaDescription}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>

            <AdBanner variant="horizontal" className="my-8" />

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-white mb-2">No posts found</h3>
                <p className="text-slate-400">Try selecting a different category</p>
              </div>
            )}
          </div>

          <AdSidebar />
        </div>

        <AdBanner variant="horizontal" className="mt-8" />
      </div>
    </div>
  );
}

// ============ BLOG POST PAGE ============
function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = getBlogPostBySlug(slug || '');

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h1 className="text-2xl font-bold text-white mb-2">Post Not Found</h1>
          <Link to="/blog" className="text-purple-400 hover:text-purple-300">← Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/blog" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          <article className="flex-1">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 font-medium">{post.category}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">{post.title}</h1>
              <div className="flex items-center gap-6 text-sm text-slate-400 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </motion.div>

            <AdBanner variant="horizontal" className="mb-8" />

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="prose prose-invert prose-lg max-w-none">
              {post.contentSections.map((section, idx) => (
                <div key={idx}>
                  <h2 className="text-2xl font-bold text-white mt-8 mb-4">{section.heading}</h2>
                  {section.paragraphs.map((para, pidx) => (
                    <p key={pidx} className="text-slate-300 leading-relaxed mb-4">{para}</p>
                  ))}
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-12 pt-8 border-t border-white/10">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  Like
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors">
                  <Bookmark className="w-4 h-4" />
                  Save
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </motion.div>

            <AdBanner variant="horizontal" className="mt-8" />
          </article>

          <AdSidebar />
        </div>
      </div>
    </div>
  );
}

// ============ ABOUT PAGE ============
function AboutPage() {
  const stats = [
    { icon: Users, value: '10,000+', label: 'Active Users' },
    { icon: Target, value: '1M+', label: 'Prompts Optimized' },
    { icon: ShieldCheck, value: '100%', label: 'Privacy First' },
    { icon: Award, value: '4.9/5', label: 'User Rating' },
  ];

  const values = [
    { icon: Heart, title: 'User-First Design', description: 'Every feature we build starts with understanding what our users truly need.' },
    { icon: ShieldCheck, title: 'Privacy & Security', description: 'All processing happens in your browser. Your data never leaves your device.' },
    { icon: Zap, title: 'Performance', description: 'Lightning-fast tools that work instantly without any loading or waiting.' },
  ];

  const team = [
    { name: 'Sarah Chen', role: 'Founder & CEO', avatar: 'SC', bio: 'Former AI engineer at Google with 10+ years in NLP and prompt engineering.' },
    { name: 'Marcus Rodriguez', role: 'CTO', avatar: 'MR', bio: 'Full-stack developer passionate about building tools that empower creators.' },
    { name: 'Emily Watson', role: 'Head of Product', avatar: 'EW', bio: 'Product leader with experience at Meta and OpenAI, focused on user experience.' },
    { name: 'David Kim', role: 'Lead Designer', avatar: 'DK', bio: 'Design expert specializing in creating intuitive interfaces for complex tools.' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            About AI Prompt Toolkit<br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Our Story</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to make AI prompt engineering accessible to everyone. Our tools help teams and individuals create, validate, and optimize prompts with confidence.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: idx * 0.1 }}>
              <Card className="text-center">
                <stat.icon className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-16">
          <Card gradient glow>
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-lg text-slate-300 leading-relaxed">
                We believe that great AI output starts with great prompts. Our mission is to democratize prompt engineering by providing professional-grade tools that are free, privacy-first, and accessible to everyone.
              </p>
            </div>
          </Card>
        </motion.div>

        <div className="mb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-xl text-slate-400">The principles that guide everything we do</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.1 }}>
                <Card hover className="h-full">
                  <value.icon className="w-12 h-12 text-purple-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Meet Our Team</h2>
            <p className="text-xl text-slate-400">The people behind AI Prompt Toolkit</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.1 }}>
                <Card hover className="text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">{member.avatar}</div>
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-purple-400 text-sm font-medium mb-3">{member.role}</p>
                  <p className="text-slate-400 text-sm leading-relaxed">{member.bio}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center">
          <Card gradient glow>
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-slate-300 mb-6 max-w-2xl mx-auto">Join thousands of AI professionals who trust AI Prompt Toolkit for their prompt engineering needs.</p>
            <Link to="/tools" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-white shadow-lg shadow-purple-500/50 hover:shadow-xl transition-shadow">
              Explore Our Tools
            </Link>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

// ============ CONTACT PAGE ============
function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    { icon: Mail, title: 'Email Us', value: 'hello@aiprompttoolkit.com', description: 'We\'ll respond within 24 hours' },
    { icon: MessageSquare, title: 'Live Chat', value: 'Available 9am-6pm PST', description: 'Get instant help from our team' },
    { icon: Phone, title: 'Call Us', value: '+1 (555) 123-4567', description: 'Monday-Friday, 9am-6pm PST' },
    { icon: MapPin, title: 'Visit Us', value: 'San Francisco, CA', description: '123 AI Street, Suite 100' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            Get In Touch<br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">We'd Love to Hear From You</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">Have questions, feedback, or need support? Our team is here to help you succeed with AI prompts.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: idx * 0.1 }}>
              <Card hover className="text-center h-full">
                <info.icon className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">{info.title}</h3>
                <p className="text-purple-400 font-semibold mb-2">{info.value}</p>
                <p className="text-slate-400 text-sm">{info.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <Card glow>
              <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>
              {isSubmitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-slate-400">We'll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input label="Name" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" required />
                  <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required />
                  <Input label="Subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="What's this about?" required />
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} rows={6} className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none" placeholder="Tell us more..." required />
                  </div>
                  <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="inline-block w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <Card>
              <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {[
                  { q: 'How quickly will I get a response?', a: 'We typically respond within 24 hours during business days. For urgent issues, try our live chat.' },
                  { q: 'Do you offer enterprise support?', a: 'Yes! We have dedicated enterprise plans with priority support, SLAs, and custom features.' },
                  { q: 'Can I request a new feature?', a: 'Absolutely! We love hearing from our users. Submit your idea and we\'ll consider it for our roadmap.' },
                  { q: 'Is my data safe?', a: '100%. All processing happens in your browser. We never store or transmit your prompts to our servers.' },
                  { q: 'Do you offer refunds?', a: 'Yes, we offer a 30-day money-back guarantee on all paid plans, no questions asked.' },
                ].map((faq, idx) => (
                  <div key={idx} className="border-b border-white/10 pb-4 last:border-0">
                    <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ============ NOT FOUND PAGE ============
function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl mb-4">🔍</div>
        <h1 className="text-4xl font-bold text-white mb-4">404 - Page Not Found</h1>
        <p className="text-slate-400 mb-6">The page you're looking for doesn't exist.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-white shadow-lg shadow-purple-500/50 hover:shadow-xl transition-shadow">
          Go Home
        </Link>
      </div>
    </div>
  );
}

// ============ MAIN APP ============
export default function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', themeMode === 'dark');
  }, [themeMode]);

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL?.replace(/\/$/, '') || ''}>
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/tools/:toolId" element={<ToolDetailPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
