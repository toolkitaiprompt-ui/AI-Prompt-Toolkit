import { useEffect, useRef, useState } from "react";
import { Clock, Trash2, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getPromptHistory,
  deletePromptEntry,
  clearPromptHistory,
  setPendingPrompt,
  getTimeAgo,
  type PromptHistoryEntry,
} from "../lib/promptHistory";

export default function PromptHistory() {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<PromptHistoryEntry[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  // Load entries when opening
  useEffect(() => {
    if (open) {
      setEntries(getPromptHistory());
    }
  }, [open]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleEntryClick = (entry: PromptHistoryEntry) => {
    setPendingPrompt(entry.text, entry.toolPath);
    navigate(entry.toolPath);
    setOpen(false);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deletePromptEntry(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleClearAll = () => {
    clearPromptHistory();
    setEntries([]);
  };

  const truncate = (text: string, max = 80) => {
    if (text.length <= max) return text;
    return text.slice(0, max) + "...";
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(!open)}
        className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center hover:bg-white/5 transition text-slate-400 hover:text-amber-300 relative"
        aria-label="Prompt History"
      >
        <Clock className="w-4 h-4" />
      </button>

      {open && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-h-[70vh] overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-black/50 z-50"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-semibold text-white">Prompt History</span>
              {entries.length > 0 && (
                <span className="text-[10px] font-medium text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded-full">
                  {entries.length}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1 rounded hover:bg-white/5 transition text-slate-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(70vh-60px)]">
            {entries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <Clock className="w-10 h-10 text-slate-700 mb-3" />
                <p className="text-sm text-slate-400 font-medium">No prompts yet! 🌱</p>
                <p className="text-xs text-slate-600 mt-1">Try our tools and your prompts will auto-save here!</p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {entries.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => handleEntryClick(entry)}
                    className="w-full text-left px-4 py-3 hover:bg-white/[0.03] transition group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-slate-200 truncate">
                          {truncate(entry.text)}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] font-medium text-amber-400/70 bg-amber-500/10 px-1.5 py-0.5 rounded-full">
                            {entry.toolName}
                          </span>
                          <span className="text-[10px] text-slate-600">
                            {getTimeAgo(entry.timestamp)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="p-1 rounded hover:bg-white/5 transition text-slate-500 hover:text-white opacity-0 group-hover:opacity-100">
                          <ArrowRight className="w-3 h-3" />
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleDelete(e, entry.id)}
                          className="p-1 rounded hover:bg-rose-500/10 transition text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100"
                          aria-label="Delete entry"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Clear all footer */}
          {entries.length > 0 && (
            <div className="border-t border-white/[0.06] px-4 py-2.5">
              <button
                type="button"
                onClick={handleClearAll}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-white/[0.06] px-3 py-1.5 text-[11px] font-medium text-slate-400 hover:text-rose-300 hover:border-rose-500/20 hover:bg-rose-500/5 transition"
              >
                <Trash2 className="w-3 h-3" /> Clear All
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
