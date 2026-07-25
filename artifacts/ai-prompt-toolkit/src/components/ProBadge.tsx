import React from "react";
import { Sparkles } from "lucide-react";

interface ProBadgeProps {
  onClick?: () => void;
  className?: string;
}

export default function ProBadge({ onClick, className = "" }: ProBadgeProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400/20 to-rose-400/20 border border-amber-400/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 hover:from-amber-400/30 hover:to-rose-400/30 hover:scale-105 transition-all duration-200 cursor-pointer ${className}`}
      aria-label="Pro feature — coming soon"
    >
      <Sparkles className="w-3 h-3" />
      Pro
    </button>
  );
}
