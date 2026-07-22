import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter, Link, NavLink, Route, Routes, useParams } from 'react-router-dom';
import {
  ArrowRight, ArrowLeft, Sparkles, Menu, X, Search, Grid, List,
  Calendar, Clock, Tag, Star, Users, TrendingUp, Award,
  Heart, Github, Twitter, Linkedin, Mail, Braces, FileJson2,
  ShieldCheck, WandSparkles, Sigma, ArrowLeftRight, UserCircle,
  type LucideIcon
} from 'lucide-react';
import {
  cleanPrompt, estimateTokens, extractPromptVariables, formatPrompt,
  generateJsonSchema, validateJsonWithSchema
} from './lib/toolkit';
import { BLOG_POSTS, getBlogPostBySlug } from './data/blogPosts';
import { getSeoForPath } from './seoConfig';

// Types
type ThemeMode = 'light' | 'dark';

type ToolMeta = {
  title: string;
  path: string;
  description: string;
  icon: any;
  accent: string;
  premium?: boolean;
  keyBenefits?: string[];
  category: string;
};

// Constants
const TOOL_PAGES: ToolMeta[] = [
  {
    title: 'Prompt Variable Extractor',
    path: '/tools/prompt-variable-extractor',
    description: 'Extract variables like {name}, {{city}}, [tone], and :language from any prompt.',
    icon: Braces,
    accent: 'from-blue-500/30 to-cyan-400/10',
    category: 'Extraction',
    keyBenefits: ['Supports 4 variable syntaxes', 'Alphabetically sorted', 'Zero server calls']
  },
  {
    title: 'JSON Schema Generator',
    path: '/tools/json-schema-generator',
    description: 'Generate JSON Schema from a sample JSON object for consistent AI output structures.',
    icon: FileJson2,
    accent: 'from-indigo-500/35 to-blue-500/10',
    category: 'Validation',
    keyBenefits: ['Draft 2020-12 compliant', 'Nested object support', 'Instant generation']
  },
  {
    title: 'JSON Validator',
    path: '/tools/json-validator',
    description: 'Validate model responses against your schema using key type and required field checks.',
    icon: ShieldCheck,
    accent: 'from-violet-500/35 to-indigo-400/10',
    category: 'Validation',
    keyBenefits: ['Type checking', 'Required field validation', 'Path-level error reporting']
  },
  {
    title: 'Prompt Formatter',
    path: '/tools/prompt-formatter',
    description: 'Format long prompts into clean and numbered instruction blocks.',
    icon: WandSparkles,
    accent: 'from-fuchsia-500/35 to-indigo-500/10',
    category: 'Formatting',
    keyBenefits: ['Numbered sections', 'Removes noise', 'Copy-ready output']
  },
  {
    title: 'Prompt Cleaner',
    path: '/tools/prompt-cleaner',
    description: 'Remove noise characters, extra spacing, and malformed line breaks from prompts.',
    icon: Sparkles,
    accent: 'from-sky-500/35 to-indigo-500/10',
    category: 'Cleaning',
    keyBenefits: ['Strips control characters', 'Normalizes whitespace', 'Trims line breaks']
  },
  {
    title: 'Token Estimator',
    path: '/tools/token-estimator',
    description: 'Estimate characters, words, and token usage before sending prompts to LLM APIs.',
    icon: Sigma,
    accent: 'from-blue-600/35 to-violet-500/10',
    category: 'Analytics',
    keyBenefits: ['~4 chars per token', 'Real-time counting', 'Cost planning']
  },
  {
    title: 'Prompt Converter',
    path: '/tools/prompt-converter',
    description: 'Convert ChatGPT prompts to Claude, Gemini, or Cursor format instantly.',
    icon: ArrowLeftRight,
    accent: 'from-amber-500/30 to-yellow-400/10',
    category: 'Conversion',
    keyBenefits: ['ChatGPT to Claude', 'ChatGPT to Gemini', 'ChatGPT to Cursor']
  },
  {
    title: 'AI Persona Builder',
    path: '/tools/persona-builder',
    description: 'Generate expert system prompts for different roles like Marketer, Developer, or Analyst.',
    icon: UserCircle,
    accent: 'from-rose-500/30 to-amber-400/10',
    category: 'Generation',
    keyBenefits: ['Expert role prompting', 'Task-specific context', 'Behavioral rules']
  },
  {
    title: 'Advanced Prompt Optimizer',
    path: '/tools/advanced-prompt-optimizer',
    description: 'Polish and amplify prompts with premium optimization controls.',
    icon: Sparkles,
    accent: 'from-indigo-500/35 to-cyan-400/10',
    premium: true,
    category: 'Optimization',
    keyBenefits: ['Side-by-side compare', '12 optimization credits', 'Premium AI signal']
  },
  {
    title: 'Prompt Comparison Tool',
    path: '/tools/prompt-comparison',
    description: 'Compare two prompts side by side with detailed metrics.',
    icon: ArrowLeftRight,
    accent: 'from-cyan-500/30 to-blue-400/10',
    category: 'Analytics',
    keyBenefits: ['Token & word count', 'Readability scores', 'Visual diff highlighting']
  }
];

const STATS = [
  { icon: Users, value: '10,000+', label: 'Active Users', color: 'from-blue-500 to-cyan-500' },
  { icon: Star, value: '4.9/5', label: 'User Rating', color: 'from-yellow-500 to-orange-500' },
  { icon: TrendingUp, value: '1M+', label: 'Prompts Optimized', color: 'from-purple-500 to-pink-500' },
  { icon: Award, value: '$500K+', label: 'API Costs Saved', color: 'from-green-500 to-emerald-500' }
];

const CATEGORIES = ['All', 'Extraction', 'Validation', 'Formatting', 'Cleaning', 'Analytics', 'Conversion', 'Generation', 'Optimization'];

// Utility Functions
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

// UI Components
function Button({ variant = 'primary', size = 'md', children, icon: Icon, className = '', ...props }: any) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300';
  const variants = {
    primary: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50 hover:shadow-xl hover:scale-105',
    secondary: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:scale-105',
    outline: 'border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40',
    ghost: 'text-slate-300 hover:bg-white/5 hover:text-white'
  };
  const sizes = { sm: 'px-4 py-2 text-sm', md: 'px-6 py-3 text-base', lg: 'px-8 py-4 text-lg' };

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

function Badge({ children, variant = 'default' }: any) {
  const variants = {
    default: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    success: 'bg-green-500/20 text-green-400 border-green-500/30',
    warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
  };
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${variants[variant as keyof typeof variants]}`}>
      {children}
    </span>
  );
}

function AdBanner({ variant = 'horizontal', className = '' }: any) {
  const sizes = { horizontal: 'h-24 sm:h-28', vertical: 'h-64 sm:h-80', square: 'h-64' };
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

// Layout Components
function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Tools', path: '/tools' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
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

function Footer() {
  const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://github.com/ai-prompt-toolkit' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/aiprompttoolkit' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/ai-prompt-toolkit' },
    { name: 'Email', icon: Mail, href: 'mailto:hello@aiprompttoolkit.com' }
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
            <p className="text-slate-400 mb-6 leading-relaxed">Professional AI prompt engineering tools for teams and individuals.</p>
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

// Page Components
function HomePage() {
  return (
    <div className="bg-slate-950">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} transition={{ duration: 20, repeat: Infinity }} className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl" />
          <motion.div animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }} transition={{ duration: 20, repeat: Infinity }} className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Badge variant="default"><Sparkles className="w-4 h-4" /> Trusted by 10,000+ AI teams</Badge>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight mt-6">
              Build <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">Perfect</span>
              <br />AI Prompts<br />
              <span className="text-4xl sm:text-5xl lg:text-6xl text-slate-400">in Seconds</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              10 professional tools to format, validate, optimize, and deploy AI prompts at scale.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Button variant="primary" size="lg" icon={ArrowRight}><Link to="/tools">Start Building Free</Link></Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.1 }} className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} mb-4`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTools = TOOL_PAGES.filter((tool) => {
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">10 Professional Tools</h1>
          <p className="text-xl text-slate-400">Everything you need to create, validate, optimize, and deploy AI prompts.</p>
        </motion.div>

        <div className="mb-6">
          <Input placeholder="Search tools..." value={searchQuery} onChange={(e: any) => setSearchQuery(e.target.value)} icon={Search} />
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((category) => (
            <button key={category} onClick={() => setSelectedCategory(category)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === category ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}>
              {category}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool, idx) => (
            <motion.div key={tool.path} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: idx * 0.05 }}>
              <Link to={tool.path}>
                <Card hover glow>
                  <h3 className="text-xl font-bold text-white mb-2">{tool.title}</h3>
                  <p className="text-slate-400 mb-4">{tool.description}</p>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ToolDetailPage() {
  const { toolId } = useParams<{ toolId: string }>();
  const tool = TOOL_PAGES.find(t => t.path === `/tools/${toolId}`);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  if (!tool) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Tool Not Found</h1>
          <Link to="/tools" className="text-purple-400">← Back to Tools</Link>
        </div>
      </div>
    );
  }

  const handleProcess = () => {
    switch (toolId) {
      case 'prompt-variable-extractor':
        const vars = extractPromptVariables(input);
        setOutput(vars.length ? vars.join(', ') : 'No variables found');
        break;
      case 'json-schema-generator':
        try {
          const schema = generateJsonSchema(input);
          setOutput(JSON.stringify(schema, null, 2));
        } catch (e) {
          setOutput('Error: Invalid JSON');
        }
        break;
      case 'prompt-formatter':
        setOutput(formatPrompt(input));
        break;
      case 'prompt-cleaner':
        setOutput(cleanPrompt(input));
        break;
      case 'token-estimator':
        const tokens = estimateTokens(input);
        setOutput(`Characters: ${input.length}\nWords: ${input.split(/\s+/).length}\nTokens: ${tokens}`);
        break;
      default:
        setOutput('Demo coming soon...');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/tools" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Tools
        </Link>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">{tool.title}</h1>
          <p className="text-xl text-slate-400">{tool.description}</p>
        </motion.div>

        <Card glow>
          <h2 className="text-2xl font-bold text-white mb-4">Try It Now</h2>
          <div className="space-y-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white"
              rows={6}
              placeholder="Enter your prompt or text here..."
            />
            <Button onClick={handleProcess} variant="primary" size="lg" className="w-full">
              Process
            </Button>
            {output && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">Output</label>
                <div className="px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <pre className="text-sm text-green-300 whitespace-pre-wrap">{output}</pre>
                </div>
              </motion.div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', ...Array.from(new Set(BLOG_POSTS.map(p => p.category)))];
  const filteredPosts = selectedCategory === 'All' ? BLOG_POSTS : BLOG_POSTS.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Blog & Guides</h1>
          <p className="text-xl text-slate-400">Expert insights and tutorials for mastering AI prompts.</p>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <button key={category} onClick={() => setSelectedCategory(category)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === category ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
              {category}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filteredPosts.map((post, idx) => (
            <motion.div key={post.slug} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: idx * 0.1 }}>
              <Link to={`/blog/${post.slug}`}>
                <Card hover>
                  <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">{post.metaDescription}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = getBlogPostBySlug(slug || '');

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Post Not Found</h1>
          <Link to="/blog" className="text-purple-400">← Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/blog" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl font-bold text-white mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-slate-400 mb-8">
            <span>{post.date}</span>
            <span>{post.readTime}</span>
          </div>

          <div className="prose prose-invert max-w-none">
            {post.contentSections.map((section, idx) => (
              <div key={idx}>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">{section.heading}</h2>
                {section.paragraphs.map((para, pidx) => (
                  <p key={pidx} className="text-slate-300 leading-relaxed mb-4">{para}</p>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl font-bold text-white mb-4">About Us</h1>
        <p className="text-xl text-slate-400">Making AI prompt engineering accessible to everyone.</p>
      </div>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl font-bold text-white mb-4">Contact Us</h1>
        <p className="text-xl text-slate-400">Get in touch with our team.</p>
      </div>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">404 - Page Not Found</h1>
        <Link to="/" className="text-purple-400">Go Home</Link>
      </div>
    </div>
  );
}

// Main App
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
