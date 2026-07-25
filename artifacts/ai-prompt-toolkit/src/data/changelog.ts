export interface ChangelogEntry {
  id: string;
  date: string;       // Relative display text like "Today", "2 days ago"
  type: "new" | "improved" | "fixed" | "content";
  title: string;
  description?: string;
}

const typeConfig = {
  new: { label: "New", dot: "🟢", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  improved: { label: "Improved", dot: "🔵", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  fixed: { label: "Fixed", dot: "🟡", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  content: { label: "Content", dot: "🟣", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
};

export function getTypeConfig(type: ChangelogEntry["type"]) {
  return typeConfig[type];
}

export const CHANGELOG_ENTRIES: ChangelogEntry[] = [
  {
    id: "playground-launch",
    date: "Today",
    type: "new",
    title: "Prompt Playground launched",
    description: "Real-time prompt analysis with 4 tabs — Tokens, Structure, Debug, Optimize. 500ms debounce, quick-start suggestions, and pro tips.",
  },
  {
    id: "security-scanner",
    date: "2 days ago",
    type: "new",
    title: "Security Scanner added",
    description: "Scan your prompts for injection attacks, jailbreak attempts, data leak risks, PII exposure, and unsafe content — all in your browser.",
  },
  {
    id: "chain-builder",
    date: "4 days ago",
    type: "new",
    title: "Chain Builder added",
    description: "Build multi-step AI prompt chains with up to 5 sequential steps. Each step has its own prompt and output format. Export as Markdown.",
  },
  {
    id: "token-estimator-upgrade",
    date: "1 week ago",
    type: "improved",
    title: "Token Estimator upgraded — exact costs",
    description: "Now shows exact per-model costs for GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro, DeepSeek V3 & Llama 3. Includes daily/monthly cost projections with a calls-per-day slider.",
  },
  {
    id: "category-404",
    date: "1 week ago",
    type: "fixed",
    title: "Category pages 404 fixed",
    description: "Category detail pages now show templates and 'Coming Soon' placeholders instead of returning a 404 error.",
  },
  {
    id: "new-templates",
    date: "2 weeks ago",
    type: "content",
    title: "100+ new templates added",
    description: "Expanded the template library with 100+ new prompt templates across all categories — writing, marketing, coding, business, design, and more.",
  },
  {
    id: "crawlers-unblocked",
    date: "2 weeks ago",
    type: "fixed",
    title: "AI crawlers unblocked",
    description: "Updated robots.txt to allow GPTBot, ClaudeBot, Google-Extended and Applebot-Extended while blocking only CCBot and Bytespider.",
  },
];
