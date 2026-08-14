import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, X, Braces, FileJson2, ShieldCheck, WandSparkles, Sparkles, Sigma, ArrowLeftRight, UserCircle, FileText, Layout } from "lucide-react";

interface SearchResult {
  title: string;
  description: string;
  url: string;
  type: "tool" | "blog" | "template";
  icon: any;
}

interface ToolMeta {
  title: string;
  path: string;
  description: string;
  icon: any;
}

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
}

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
}

const iconMap: Record<string, any> = {
  Braces, FileJson2, ShieldCheck, WandSparkles,
  Sparkles, Sigma, ArrowLeftRight, UserCircle,
};

function getIcon(iconName: string): any {
  return iconMap[iconName] || FileText;
}

export default function SearchModal({
  isOpen,
  onClose,
  tools,
  blogPosts,
  templates,
}: {
  isOpen: boolean;
  onClose: () => void;
  tools: ToolMeta[];
  blogPosts: BlogPost[];
  templates: Template[];
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const trigger = document.activeElement as HTMLElement | null;
    setTimeout(() => inputRef.current?.focus(), 100);
    setQuery("");
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
      trigger?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Basic focus trap: keep Tab cycling within the dialog while open
  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusables = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !dialog.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !dialog.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();

    const toolResults: SearchResult[] = tools
      .filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
      .map(t => ({
        title: t.title,
        description: t.description,
        url: t.path,
        type: "tool" as const,
        icon: t.icon,
      }));

    const blogResults: SearchResult[] = blogPosts
      .filter(p => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
      .map(p => ({
        title: p.title,
        description: p.excerpt,
        url: `/blog/${p.slug}`,
        type: "blog" as const,
        icon: FileText,
      }));

    const templateResults: SearchResult[] = templates
      .filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q))
      .map(t => ({
        title: t.title,
        description: t.description,
        url: `/templates?q=${encodeURIComponent(t.title)}`,
        type: "template" as const,
        icon: Layout,
      }));

    return [...toolResults, ...blogResults, ...templateResults].slice(0, 12);
  }, [query, tools, blogPosts, templates]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search tools, templates, and blog posts"
        className="relative w-full max-w-2xl mx-4 bg-slate-900/95 border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-700/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tools, templates, blog posts..."
            aria-label="Search tools, templates, and blog posts"
            className="flex-1 bg-transparent text-white text-base outline-none placeholder-slate-500"
          />
          <kbd className="hidden sm:inline-flex px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-xs font-mono">ESC</kbd>
          <button onClick={onClose} aria-label="Close search" className="p-2 rounded-lg hover:bg-slate-700/50 transition">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.length === 0 && query.trim() && (
            <div className="text-center py-10 text-slate-500 text-sm">No results found for "{query}"</div>
          )}
          {results.length === 0 && !query.trim() && (
            <div className="text-center py-10 text-slate-500 text-sm">Type to search across tools, templates & blog</div>
          )}
          {results.map((result, idx) => (
            <Link
              key={`${result.url}-${idx}`}
              to={result.url}
              onClick={onClose}
              className="flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-slate-800/50 transition group"
            >
              <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                <result.icon className="w-4 h-4 text-slate-300" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white truncate">{result.title}</span>
                  <span className={`text-[10px] font-medium uppercase px-1.5 py-0.5 rounded shrink-0 ${
                    result.type === "tool" ? "text-emerald-400 bg-emerald-400/10" :
                    result.type === "blog" ? "text-cyan-400 bg-cyan-400/10" :
                    "text-amber-400 bg-amber-400/10"
                  }`}>
                    {result.type}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{result.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {results.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-700/50 text-xs text-slate-500 text-center">
            {results.length} result{results.length !== 1 ? "s" : ""} found
          </div>
        )}
      </div>
    </div>
  );
}
