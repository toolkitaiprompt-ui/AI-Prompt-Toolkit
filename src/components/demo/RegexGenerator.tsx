import { useState } from "react";
import { Regex, Copy, Check, Sparkles, BookOpen, Lightbulb } from "lucide-react";

const PRESETS = [
  { label: "Email Address", desc: "Match valid email formats", pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", example: "user@example.com" },
  { label: "Phone Number (US)", desc: "Match US phone numbers", pattern: "^(\\+1[-\\s]?)?\\(?[0-9]{3}\\)?[-\\s]?[0-9]{3}[-\\s]?[0-9]{4}$", example: "(555) 123-4567" },
  { label: "URL", desc: "Match HTTP/HTTPS URLs", pattern: "^https?://(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$", example: "https://aiworldhub.site" },
  { label: "Strong Password", desc: "8+ chars, upper, lower, number, special", pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$", example: "MyP@ssw0rd!" },
  { label: "Hex Color Code", desc: "Match #RGB or #RRGGBB", pattern: "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$", example: "#FF5733" },
  { label: "Credit Card", desc: "Match major credit card numbers", pattern: "^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12})$", example: "4111111111111111" },
];

const EXPLANATIONS: Record<string, string> = {
  "^": "Start of string",
  "$": "End of string",
  "[a-zA-Z0-9]": "Alphanumeric character",
  "+": "One or more of preceding",
  "*": "Zero or more of preceding",
  "?": "Zero or one of preceding",
  "{2,}": "At least 2 occurrences",
  "{3}": "Exactly 3 occurrences",
  "\\.": "Literal dot",
  "\\d": "Any digit (0-9)",
  "\\w": "Any word character",
  "\\s": "Any whitespace",
  "(?=.*)": "Positive lookahead",
  "|": "OR operator",
  "(?:)": "Non-capturing group",
  "()": "Capturing group",
};

export default function RegexGenerator() {
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<{ pattern: string; explanation: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [testString, setTestString] = useState("");
  const [testResult, setTestResult] = useState<boolean | null>(null);
  const [showCheatsheet, setShowCheatsheet] = useState(false);

  const generate = () => {
    const desc = description.toLowerCase();
    let pattern = "";
    let explanation = "";

    if (desc.includes("email")) {
      pattern = PRESETS[0].pattern;
      explanation = "Matches standard email format: username@domain.tld with valid characters.";
    } else if (desc.includes("phone") || desc.includes("mobile")) {
      pattern = PRESETS[1].pattern;
      explanation = "Matches US phone numbers with optional country code and various separators.";
    } else if (desc.includes("url") || desc.includes("website") || desc.includes("link")) {
      pattern = PRESETS[2].pattern;
      explanation = "Matches HTTP/HTTPS URLs including optional www subdomain and query parameters.";
    } else if (desc.includes("password") || desc.includes("strong")) {
      pattern = PRESETS[3].pattern;
      explanation = "Enforces 8+ characters with at least one uppercase, lowercase, digit, and special character.";
    } else if (desc.includes("color") || desc.includes("hex")) {
      pattern = PRESETS[4].pattern;
      explanation = "Matches 3 or 6 digit hexadecimal color codes starting with #.";
    } else if (desc.includes("credit") || desc.includes("card")) {
      pattern = PRESETS[5].pattern;
      explanation = "Matches Visa, MasterCard, Amex, Diners Club, and Discover card numbers.";
    } else if (desc.includes("date")) {
      pattern = "^(0[1-9]|1[0-2])[/-](0[1-9]|[12][0-9]|3[01])[/-](19|20)\\d\\d$";
      explanation = "Matches MM/DD/YYYY or MM-DD-YYYY date formats from 1900-2099.";
    } else if (desc.includes("ip")) {
      pattern = "^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$";
      explanation = "Matches IPv4 addresses with valid octet ranges (0-255).";
    } else {
      pattern = "^" + description.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+") + "$";
      explanation = "Basic pattern generated from your description. Refine your query for more specific patterns.";
    }

    setResult({ pattern, explanation });
    setTestResult(null);
  };

  const testRegex = () => {
    if (!result || !testString) return;
    try {
      const regex = new RegExp(result.pattern);
      setTestResult(regex.test(testString));
    } catch {
      setTestResult(false);
    }
  };

  const copy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.pattern);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable (permissions/insecure context) — ignore
    }
  };

  const loadPreset = (preset: typeof PRESETS[0]) => {
    setDescription(preset.label);
    setResult({ pattern: preset.pattern, explanation: preset.desc });
    setTestString(preset.example);
    setTestResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Quick Presets</h3>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => loadPreset(p)}
              className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-amber-500/40 hover:text-amber-400"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
        <div className="space-y-2">
          <label htmlFor="rg-description" className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <Regex className="h-4 w-4 text-violet-400" />
            Describe what you want to match
          </label>
          <input
            id="rg-description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generate()}
            placeholder="e.g. email address, phone number, strong password..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-100 outline-none transition focus:border-violet-400/60 focus:ring-2 focus:ring-violet-400/20"
          />
        </div>
        <button
          onClick={generate}
          disabled={!description.trim()}
          className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Sparkles className="h-4 w-4" />
          Generate Regex
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">Generated Pattern</span>
            <button
              onClick={copy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-300 transition hover:bg-violet-500/20"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied!" : "Copy Pattern"}
            </button>
          </div>

          <code className="block rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm font-mono text-amber-300 break-all">
            {result.pattern}
          </code>

          <div className="flex items-start gap-2 rounded-lg bg-slate-900/60 p-3">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
            <p className="text-sm text-slate-400">{result.explanation}</p>
          </div>

          {/* Test Area */}
          <div className="space-y-2 pt-2">
            <label htmlFor="rg-test-string" className="text-xs font-medium text-slate-500">Test your regex</label>
            <div className="flex gap-2">
              <input
                id="rg-test-string"
                type="text"
                value={testString}
                onChange={(e) => { setTestString(e.target.value); setTestResult(null); }}
                placeholder="Enter test string..."
                className="flex-1 rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-sm text-slate-100 outline-none transition focus:border-violet-400/60"
              />
              <button
                onClick={testRegex}
                disabled={!testString}
                className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 transition hover:text-white disabled:opacity-40"
              >
                Test
              </button>
            </div>
            {testResult !== null && (
              <p role="status" className={`text-sm font-medium ${testResult ? "text-emerald-400" : "text-red-400"}`}>
                {testResult ? "✓ Match found!" : "✗ No match — pattern does not fit this string."}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Cheatsheet Toggle */}
      <button
        onClick={() => setShowCheatsheet(!showCheatsheet)}
        className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 transition hover:text-slate-300"
      >
        <BookOpen className="h-3.5 w-3.5" />
        {showCheatsheet ? "Hide Regex Cheatsheet" : "Show Regex Cheatsheet"}
      </button>

      {showCheatsheet && (
        <div className="grid gap-2 sm:grid-cols-2">
          {Object.entries(EXPLANATIONS).map(([symbol, meaning]) => (
            <div key={symbol} className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/40 p-2.5">
              <code className="rounded bg-slate-800 px-2 py-0.5 text-xs font-mono text-amber-300">{symbol}</code>
              <span className="text-xs text-slate-400">{meaning}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
