import React from "react";

type MonetagAdProps = {
  format?: string;
  className?: string;
};

export default function MonetagAd({ format = "banner", className = "" }: MonetagAdProps) {
  // Keep markup simple: Monetag's global tag (loaded in index.html) looks for elements with class "monetag-zone".
  // Use a stable container ID so Monetag can target it if configured server-side.
  const zoneId = format === "banner" ? "264272" : "264272";

  return (
    <div className={`w-full flex flex-col items-center justify-center my-4 overflow-hidden rounded-xl border border-white/10 bg-slate-900/40 p-2 ${className}`}>
      <span className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Advertisement</span>
      <div id={`container-${zoneId}`} className="monetag-zone w-full flex justify-center min-h-[90px]" />
    </div>
  );
}

