/**
 * Prompt History — localStorage-based prompt saving
 * No backend, no server, fully client-side.
 */

export interface PromptHistoryEntry {
  id: string;
  text: string;        // full text stored (capped at 300 chars for storage sanity)
  toolName: string;    // human-readable tool name
  toolPath: string;    // URL path to navigate to
  timestamp: number;
}

const STORAGE_KEY = 'aiwh_prompt_history';
const LOAD_KEY = 'aiwh_prompt_to_load';
const MAX_ITEMS = 50;
const MAX_TEXT_LENGTH = 300;

/** Get all saved prompt history entries (newest first). */
export function getPromptHistory(): PromptHistoryEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed: PromptHistoryEntry[] = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Save a prompt to history. */
export function savePrompt(text: string, toolName: string, toolPath: string): void {
  const trimmed = text.trim();
  if (!trimmed) return;

  const history = getPromptHistory();

  // Don't save if the same exact prompt was just saved (dedupe)
  if (history.length > 0 && history[0].text === trimmed.slice(0, MAX_TEXT_LENGTH) && history[0].toolPath === toolPath) {
    return;
  }

  const wasEmpty = history.length === 0;

  const entry: PromptHistoryEntry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    text: trimmed.slice(0, MAX_TEXT_LENGTH),
    toolName,
    toolPath,
    timestamp: Date.now(),
  };

  history.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, MAX_ITEMS)));

  // Dispatch event for toast notification
  if (wasEmpty) {
    window.dispatchEvent(new CustomEvent('aiwh-first-save'));
  }
}

/** Get the tool path for a given tool name (used by inline tools). */
export function getToolPath(toolName: string): string {
  const slug = toolName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return `/tools/${slug}`;
}

/** Delete a single history entry by id. */
export function deletePromptEntry(id: string): void {
  const history = getPromptHistory();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.filter((e) => e.id !== id)));
}

/** Clear all prompt history. */
export function clearPromptHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/** Store a prompt to be loaded when user navigates to a tool page. */
export function setPendingPrompt(text: string, toolPath: string): void {
  localStorage.setItem(LOAD_KEY, JSON.stringify({ text, toolPath }));
}

/** Check if there is a pending prompt for the given tool path, and remove it. */
export function consumePendingPrompt(toolPath: string): string | null {
  try {
    const data = localStorage.getItem(LOAD_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data);
    if (parsed && parsed.toolPath === toolPath && parsed.text) {
      localStorage.removeItem(LOAD_KEY);
      return parsed.text;
    }
    return null;
  } catch {
    return null;
  }
}

/** Human-readable "time ago" string. */
export function getTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

/** Check if this is the user's first-ever save. */
export function isFirstSave(): boolean {
  const history = getPromptHistory();
  return history.length === 0;
}
