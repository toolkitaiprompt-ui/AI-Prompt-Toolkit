import { estimateTokens, type TokenEstimate, cleanPrompt, formatPrompt } from "./toolkit";

export interface PlaygroundStructure {
  hasRole: boolean;
  hasTask: boolean;
  hasFormat: boolean;
  hasConstraints: boolean;
  hasExamples: boolean;
  score: number;
}

export interface PlaygroundDebug {
  score: number;
  label: string;
  issues: { type: "error" | "warning" | "info"; title: string; suggestion: string }[];
}

export interface OptimizeResult {
  prompt: string;
  changes: string[];
}

export function analyzeStructure(text: string): PlaygroundStructure {
  const lower = text.toLowerCase();
  const hasRole = /(you are|act as|you're an?|behave as|your role)/i.test(text);
  const hasTask = /(write|create|generate|analyze|summarize|explain|list|describe|build|design|develop|help)/i.test(text);
  const hasFormat = /(format|bullet|table|json|markdown|paragraph|numbered|list|section|heading)/i.test(text);
  const hasConstraints = /(max|limit|within|minimum|maximum|keep under|no more than|must not|avoid|tone|style|word count)/i.test(text);
  const hasExamples = /(example|for instance|such as|e\.g\.|for example|like this|sample)/i.test(text);

  let score = 0;
  if (hasRole) score += 20;
  if (hasTask) score += 25;
  if (hasFormat) score += 20;
  if (hasConstraints) score += 20;
  if (hasExamples) score += 15;

  // Bonus for text length
  if (text.length > 100) score += 5;
  if (text.length > 300) score += 5;
  // Clarity bonus
  if (/audience|target|purpose|goal|objective/i.test(text)) score += 5;

  return { hasRole, hasTask, hasFormat, hasConstraints, hasExamples, score: Math.min(100, score) };
}

export function analyzeDebug(text: string): PlaygroundDebug {
  if (!text.trim()) return { score: 0, label: "No input", issues: [] };
  let score = 75;
  const issues: PlaygroundDebug["issues"] = [];

  // Structure checks
  const lower = text.toLowerCase();
  if (!/(you are|act as|you're an?|your role)/i.test(text)) {
    score -= 15;
    issues.push({ type: "warning", title: "No role assigned", suggestion: 'Add: "You are an expert [role]..."' });
  }
  if (!/(write|create|generate|analyze|summarize|explain|list|describe|build|design|develop)/i.test(text)) {
    score -= 15;
    issues.push({ type: "warning", title: "No clear task verb", suggestion: 'Start with an action verb like "Write", "Analyze", or "Create"' });
  }
  if (!/(format|bullet|table|json|markdown|paragraph|numbered|list)/i.test(text)) {
    score -= 10;
    issues.push({ type: "info", title: "Missing output format", suggestion: 'Specify format: "Respond in bullet points" or "Output as JSON"' });
  }
  if (!/(max|limit|within|minimum|maximum|keep under|no more than|must not|avoid|tone|style)/i.test(text)) {
    score -= 10;
    issues.push({ type: "info", title: "No constraints", suggestion: 'Add word/tone limits: "Max 300 words. Professional tone."' });
  }
  // Token check
  const tokens = Math.ceil(text.length / 4);
  if (tokens > 1500) {
    score -= 10;
    issues.push({ type: "warning", title: `Long prompt (${tokens} tokens)`, suggestion: "Consider trimming or splitting into shorter prompts." });
  }
  // Vague words
  const vague = (lower.match(/\b(good|nice|some|things|stuff|great|several|various|appropriate|proper)\b/g) || []).length;
  if (vague > 2) {
    score -= 10;
    issues.push({ type: "warning", title: `${vague} vague words detected`, suggestion: 'Replace vague words with specific details.' });
  }

  score = Math.max(0, Math.min(100, score));
  const label = score >= 80 ? "Great prompt!" : score >= 50 ? "Good start!" : "Needs work";
  return { score, label, issues };
}

export function analyzeAll(text: string) {
  const tokens = estimateTokens(text);
  const structure = analyzeStructure(text);
  const debug = analyzeDebug(text);
  return { tokens, structure, debug };
}

export function generateOptimizedPrompt(text: string): OptimizeResult {
  if (!text.trim()) return { prompt: "", changes: [] };
  let optimized = text;
  const changes: string[] = [];
  const lower = text.toLowerCase();

  if (!/(you are|act as|you're an?|your role)/i.test(text)) {
    optimized = "You are an expert in this domain.\n\n" + optimized;
    changes.push("Added role assignment");
  }
  if (!/(format|bullet|table|json|markdown|paragraph)/i.test(lower)) {
    optimized = optimized + "\n\nPlease format the response clearly with appropriate structure.";
    changes.push("Added output format instruction");
  }
  if (!/(max|limit|keep under|no more than)/i.test(lower)) {
    optimized = optimized + "\nKeep the response focused and concise.";
    changes.push("Added conciseness constraint");
  }
  if (changes.length === 0) {
    optimized = "[IMPROVED VERSION]\n\n" + optimized + "\n\n---\n[Original prompt was well-structured. Minor refinements applied for clarity.]";
    changes.push("Minor clarity refinements");
  }
  return { prompt: optimizeSpacing(optimized), changes };
}

function optimizeSpacing(text: string): string {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .join("\n\n");
}

export function getTokenColor(tokens: number): string {
  if (tokens < 200) return "text-emerald-400";
  if (tokens < 800) return "text-amber-400";
  return "text-rose-400";
}
