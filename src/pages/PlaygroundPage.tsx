import { useMemo, useState } from "react";
import { Code2, Play, SendHorizontal, Sparkles, type LucideIcon } from "lucide-react";
import SectionShell from "../components/SectionShell";
import { copyToClipboard, debugPrompt, estimateTokens } from "../lib/toolkit";

function PlaygroundPage() {
  const [activeTab, setActiveTab] = useState<"blog" | "code" | "email">("blog");
  const [promptText, setPromptText] = useState("");
  const [blogTopic, setBlogTopic] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("Python");
  const [emailType, setEmailType] = useState("Cold Email");
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const debugResult = useMemo(() => (promptText.trim() ? debugPrompt(promptText) : null), [promptText]);
  const tokenEst = useMemo(() => (promptText.trim() ? estimateTokens(promptText) : null), [promptText]);

  const generateTemplate = (tab: "blog" | "code" | "email") => {
    let template = "";
    if (tab === "blog") {
      template = `You are an expert SEO content writer specializing in ${blogTopic || "technology"}.

Write a comprehensive blog post of 1,500-2,000 words.

Target audience: ${blogTopic ? `${blogTopic} professionals` : "developers and marketers"}.

Structure:
- Catchy headline with primary keyword
- Engaging introduction (hook in first 2 sentences)
- H2 subheadings every 200-300 words
- Bullet points where appropriate
- Internal linking suggestions
- Meta description (max 155 characters)
- FAQ section with 5 questions

Tone: Professional yet conversational. Avoid jargon unless explained.

Keywords to include naturally: ${blogTopic || "AI tools, automation, productivity"}

Call to action at the end encouraging readers to explore our tools.`;
    } else if (tab === "code") {
      template = `You are a senior ${codeLanguage} developer and code reviewer.

Review the following code for:
1. Bugs and potential errors
2. Performance issues
3. Security vulnerabilities
4. Code style and best practices
5. Documentation completeness

For each issue found, provide:
- Severity (Critical / Warning / Info)
- Line number reference
- Clear explanation of the issue
- Suggested fix with corrected code

Output format:
| Severity | Line | Issue | Fix |
|----------|------|-------|-----|
| Critical | ...  | ...   | ... |

Be specific and actionable. Do not suggest changes without justification.`;
    } else {
      template = `You are an expert copywriter specializing in ${emailType.toLowerCase()} emails.

Write a ${emailType} that:

- Opens with a personalized hook (reference something specific about the prospect)
- States the value proposition in 1-2 sentences
- Includes 1-2 social proof elements (metrics, testimonials, case studies)
- Has a clear, single call-to-action
- Is 125-175 words total
- Uses a conversational, not salesy tone
- Avoids generic phrases like "I hope this finds you well"

Subject line: Under 50 characters, curiosity-driven, no clickbait.

Product: {{product_name}}
Prospect role: {{prospect_role}}
Key benefit: {{key_benefit}}`;
    }
    setPromptText(template);
  };

  const tabs: { id: "blog" | "code" | "email"; label: string; icon: LucideIcon }[] = [
    { id: "blog", label: "Blog Post", icon: Sparkles },
    { id: "code", label: "Code Review", icon: Code2 },
    { id: "email", label: "Cold Email", icon: SendHorizontal },
  ];

  return (
    <SectionShell
      title="AI Prompt Playground — Test & Debug Prompts Live"
      description="Free AI prompt playground. Generate blog post, code review, and cold email prompt templates, estimate tokens, and debug prompt health in real time — all in your browser."
      keywords="AI Prompt Playground, Prompt Testing, Prompt Debugging, Token Estimation, Prompt Templates, ChatGPT Playground, Prompt Engineering"
    >
      <div className="space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-400/80">Interactive Playground</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Prompt Playground</h1>
          <p className="max-w-2xl text-base sm:text-lg text-slate-400">
            Generate ready-to-use prompt templates for blog posts, code reviews, and cold emails. Test token counts, debug health scores, and optimize in real time — no sign-up, runs entirely in your browser.
          </p>
        </div>

        {/* Tab selector */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); generateTemplate(tab.id); }}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "border-amber-400/40 bg-amber-500/10 text-amber-300"
                    : "border-slate-700 bg-slate-900/50 text-slate-400 hover:text-white hover:border-slate-600"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Conditional inputs for each tab */}
        {activeTab === "blog" && (
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={blogTopic}
              onChange={(e) => setBlogTopic(e.target.value)}
              placeholder="Enter blog topic (e.g., AI automation, productivity tools)..."
              aria-label="Blog topic"
              className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20"
            />
            <button onClick={() => generateTemplate("blog")} className="rounded-xl bg-amber-500 hover:bg-amber-400 px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90">Generate</button>
          </div>
        )}
        {activeTab === "code" && (
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={codeLanguage}
              onChange={(e) => setCodeLanguage(e.target.value)}
              aria-label="Programming language"
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-amber-400/60"
            >
              <option>Python</option><option>JavaScript</option><option>TypeScript</option><option>Java</option><option>Go</option><option>Rust</option><option>C++</option><option>Ruby</option>
            </select>
            <button onClick={() => generateTemplate("code")} className="rounded-xl bg-amber-500 hover:bg-amber-400 px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90">Generate</button>
          </div>
        )}
        {activeTab === "email" && (
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={emailType}
              onChange={(e) => setEmailType(e.target.value)}
              aria-label="Email type"
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-amber-400/60"
            >
              <option>Cold Email</option><option>Follow-Up Email</option><option>Newsletter</option><option>Re-Engagement Email</option><option>Sales Outreach</option>
            </select>
            <button onClick={() => generateTemplate("email")} className="rounded-xl bg-amber-500 hover:bg-amber-400 px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90">Generate</button>
          </div>
        )}

        {/* Prompt textarea */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <label htmlFor="playground-prompt" className="text-sm font-semibold text-white">Your Prompt</label>
            <textarea
              id="playground-prompt"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Click a tab above to generate a template, or paste your own prompt here..."
              className="h-80 w-full rounded-xl border border-slate-700 bg-slate-900 p-4 text-sm leading-relaxed text-slate-100 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20 resize-y"
            />
            <div className="flex flex-wrap gap-3">
              <button onClick={async () => { if (await copyToClipboard(promptText)) { setCopiedPrompt(true); setTimeout(() => setCopiedPrompt(false), 2000); } }} className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/5 hover:text-white">{copiedPrompt ? "✓ Copied!" : "Copy"}</button>
              <button onClick={() => setPromptText("")} className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/5 hover:text-white">Clear</button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Token estimation */}
            {tokenEst && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
                <h3 className="text-sm font-semibold text-white">Token Estimation</h3>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-slate-900 p-3 text-center">
                    <p className="text-2xl font-bold text-amber-400">{tokenEst.estimatedTokens.toLocaleString()}</p>
                    <p className="mt-1 text-xs text-slate-500">Tokens</p>
                  </div>
                  <div className="rounded-lg bg-slate-900 p-3 text-center">
                    <p className="text-2xl font-bold text-white">{tokenEst.words.toLocaleString()}</p>
                    <p className="mt-1 text-xs text-slate-500">Words</p>
                  </div>
                  <div className="rounded-lg bg-slate-900 p-3 text-center">
                    <p className="text-2xl font-bold text-emerald-400">${((tokenEst.estimatedTokens / 1000) * 0.002).toFixed(4)}</p>
                    <p className="mt-1 text-xs text-slate-500">Est. Cost</p>
                  </div>
                </div>
              </div>
            )}

            {/* Debug health score */}
            {debugResult && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
                <h3 className="text-sm font-semibold text-white">Prompt Health Score</h3>
                <div className="mt-3 flex items-center gap-4">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold ${
                    debugResult.healthScore >= 75 ? "bg-emerald-500/15 text-emerald-400" :
                    debugResult.healthScore >= 50 ? "bg-amber-500/15 text-amber-400" :
                    "bg-red-500/15 text-red-400"
                  }`}>
                    {debugResult.healthScore}
                  </div>
                  <div className="flex-1">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                      <div className={`h-full rounded-full ${debugResult.healthScore >= 75 ? "bg-emerald-500" : debugResult.healthScore >= 50 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${debugResult.healthScore}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-slate-400">{debugResult.issues.length} issues detected · {debugResult.metrics.words} words · {debugResult.metrics.sentences} sentences</p>
                  </div>
                </div>
                {debugResult.issues.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {debugResult.issues.slice(0, 5).map((issue, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                        <span className={`mt-0.5 inline-block h-1.5 w-1.5 rounded-full ${issue.severity === "critical" ? "bg-red-500" : issue.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                        <span>{issue.message}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {!promptText.trim() && (
              <div className="flex h-full min-h-[200px] items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950/30 p-6 text-center">
                <div>
                  <Play className="mx-auto h-8 w-8 text-slate-600" />
                  <p className="mt-3 text-sm text-slate-500">Select a tab and generate a template to see token counts and health analysis.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

export default PlaygroundPage;
