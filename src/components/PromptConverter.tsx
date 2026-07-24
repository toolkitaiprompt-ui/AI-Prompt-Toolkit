import { useMemo, useState } from "react";

function convertPromptToClaude(prompt: string): string {
  const trimmed = prompt.trim();
  if (!trimmed) return "Paste your ChatGPT prompt above to convert it to Claude format.";
  const lines = trimmed.split("\n").filter(Boolean);
  let role = "an AI assistant";
  let task = trimmed;
  const roleMatch = trimmed.match(/(?:act as|you are|pretend to be)\s+(?:a |an )?(.+?)(?:\.|,|\n|$)/i);
  if (roleMatch) { role = roleMatch[1].trim(); }
  const taskMatch = trimmed.match(/(?:write|create|generate|summarize|analyze|build|design|explain)\s+(.+?)(?:\.|\n|$)/i);
  if (taskMatch) { task = taskMatch[0].trim(); }
  return `<role>You are ${role}, known for producing clear, accurate, and well-structured output.</role>

<task>${task}</task>

<instructions>
${lines.filter(l => !l.toLowerCase().includes("act as") && !l.toLowerCase().includes("you are")).join("\n")}
</instructions>

<output_format>Please structure your response with clear headings, use bullet points where appropriate, and maintain a professional tone throughout.</output_format>`;
}

function convertPromptToGemini(prompt: string): string {
  const trimmed = prompt.trim();
  if (!trimmed) return "Paste your ChatGPT prompt above to convert it to Gemini format.";
  let role = "Expert Assistant";
  const roleMatch = trimmed.match(/(?:act as|you are|pretend to be)\s+(?:a |an )?(.+?)(?:\.|,|\n|$)/i);
  if (roleMatch) { role = roleMatch[1].trim(); }
  const cleaned = trimmed.replace(/(?:act as|you are|pretend to be)\s+(?:a |an )?.+?(?:\.|,|\n)/i, "").trim();
  return `**Role:** ${role}\n\n**Objective:** ${cleaned.split("\n")[0]}\n\n**Guidelines:**\n${cleaned.split("\n").slice(1).filter(Boolean).map(l => `- ${l}`).join("\n") || "- Be concise and accurate"}\n\n**Deliverable:** Provide a clear, well-organized response that directly addresses the objective. Use markdown formatting for readability.`;
}

function convertPromptToCursor(prompt: string): string {
  const trimmed = prompt.trim();
  if (!trimmed) return "Paste your ChatGPT prompt above to convert it to Cursor format.";
  let role = "a senior software engineer";
  const roleMatch = trimmed.match(/(?:act as|you are|pretend to be)\s+(?:a |an )?(.+?)(?:\.|,|\n|$)/i);
  if (roleMatch) { role = roleMatch[1].trim(); }
  return `// Role: ${role}\n// Context: This prompt is optimized for Cursor AI code assistant\n\n/*\n${trimmed}\n*/\n\n// Implementation Notes:\n// - Follow existing code conventions in the project\n// - Add inline comments for complex logic\n// - Ensure type safety and error handling\n// - Write clean, production-ready code\n\nTask: Based on the comment above, generate the appropriate code. Include necessary imports and ensure the output is complete and testable.`;
}

export default function PromptConverter() {
  const [input, setInput] = useState("Act as a senior copywriter. Write a product launch email for our new AI productivity app. Keep the tone exciting but professional. Include a compelling subject line, 3 key benefits, and a clear CTA.");
  const [target, setTarget] = useState<"claude" | "gemini" | "cursor">("claude");
  const [copied, setCopied] = useState(false);
  const output = useMemo(() => {
    if (target === "claude") return convertPromptToClaude(input);
    if (target === "gemini") return convertPromptToGemini(input);
    return convertPromptToCursor(input);
  }, [input, target]);

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  return (
    <div className="space-y-6">
      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-300">Your ChatGPT Prompt</span>
        <textarea
          className="h-44 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-slate-100 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="ChatGPT prompt input"
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setTarget("claude")} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${target === "claude" ? "bg-amber-500 text-black" : "border border-slate-700 text-slate-300 hover:bg-slate-800"}`}>→ Claude</button>
        <button type="button" onClick={() => setTarget("gemini")} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${target === "gemini" ? "bg-amber-500 text-black" : "border border-slate-700 text-slate-300 hover:bg-slate-800"}`}>→ Gemini</button>
        <button type="button" onClick={() => setTarget("cursor")} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${target === "cursor" ? "bg-amber-500 text-black" : "border border-slate-700 text-slate-300 hover:bg-slate-800"}`}>→ Cursor</button>
      </div>
      <div className="relative">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-300">Converted Prompt ({target})</p>
          <button type="button" onClick={handleCopy} className="rounded-full bg-amber-500/10 border border-amber-400/30 px-4 py-1.5 text-xs font-semibold text-amber-300 transition hover:bg-amber-500/20">{copied ? "✓ Copied!" : "Copy"}</button>
        </div>
        <pre className="overflow-auto rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300 whitespace-pre-wrap">{output}</pre>
      </div>
    </div>
  );
}
