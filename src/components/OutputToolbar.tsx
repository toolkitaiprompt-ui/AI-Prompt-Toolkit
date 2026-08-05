import { useMemo, useState } from "react";
import { CheckCircle2, Copy, Download } from "lucide-react";
import { copyToClipboard, downloadTextFile, estimateTokens } from "../lib/toolkit";

export function LiveStats({ text }: { text: string }) {
  const stats = useMemo(() => estimateTokens(text), [text]);
  return (
    <p className="text-xs text-slate-500">
      {stats.words.toLocaleString()} words · {stats.estimatedTokens.toLocaleString()} tokens · {stats.characters.toLocaleString()} chars
    </p>
  );
}

type OutputToolbarProps = {
  text: string;
  copyLabel?: string;
  fileName?: string;
  fileMime?: string;
  showStats?: boolean;
  className?: string;
};

export default function OutputToolbar({
  text,
  copyLabel = "Copy",
  fileName,
  fileMime = "text/plain",
  showStats = true,
  className = "",
}: OutputToolbarProps) {
  const [copied, setCopied] = useState(false);
  const stats = useMemo(() => estimateTokens(text), [text]);

  const handleCopy = async () => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (fileName) downloadTextFile(text, fileName, fileMime);
  };

  return (
    <div className={`flex flex-wrap items-center justify-between gap-2 ${className}`}>
      {showStats ? (
        <p className="text-xs text-slate-500">
          {stats.words.toLocaleString()} words · {stats.estimatedTokens.toLocaleString()} tokens · {stats.characters.toLocaleString()} chars
        </p>
      ) : (
        <span />
      )}
      <div className="flex gap-2">
        {fileName && (
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-slate-800"
          >
            <Download className="h-3.5 w-3.5" /> Download
          </button>
        )}
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-slate-800"
        >
          {copied ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Copied!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> {copyLabel}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
