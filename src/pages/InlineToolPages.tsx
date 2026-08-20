import SectionShell from "../components/SectionShell";
import * as React from "react";
import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Copy as Copy2 } from "lucide-react";
// v2-fixed
import ToolCard from "../components/ToolCard";
import ToolContainer from "../components/ToolContainer";
import OutputToolbar, { LiveStats } from "../components/OutputToolbar";
import { ToolGuide } from "../components/ToolGuide";
import { TOOL_PAGES, TOOL_CATEGORIES, TOOL_BY_SLUG } from "../data/tools";
import { cleanPrompt, estimateTokens, extractPromptVariables, formatPrompt, generateJsonSchema, validateJsonWithSchema } from "../lib/toolkit";

function useToolFilters(tools: typeof TOOL_PAGES) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFreeOnly, setShowFreeOnly] = useState(false);

  const filtered = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch =
        searchQuery === "" ||
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === null || tool.category === selectedCategory;
      const matchesFree = !showFreeOnly || !tool.premium;
      return matchesSearch && matchesCategory && matchesFree;
    });
  }, [searchQuery, selectedCategory, showFreeOnly]);

  return {
    filtered,
    searchQuery,
    selectedCategory,
    showFreeOnly,
    setSearchQuery,
    setSelectedCategory,
    setShowFreeOnly,
  };
}

export function ToolsDirectoryPage() {
  const { filtered, searchQuery, selectedCategory, showFreeOnly, setSearchQuery, setSelectedCategory, setShowFreeOnly } =
    useToolFilters(TOOL_PAGES);

  const categories = useMemo(
    () => [
      { name: "All categories", value: null },
      { name: "Writing & Content", value: "writing" },
      { name: "Development & Code", value: "coding" },
      { name: "Marketing & Sales", value: "marketing" },
      { name: "Business & Strategy", value: "business" },
      { name: "Creative & Design", value: "creative" },
    ],
    []
  );

  // Related tools based on keyBenefits overlap
  const relatedTools = useMemo(() => {
    const result: string[] = [];
    const toolBenefitMap = new Map<
      string,
      Set<string>
    >(); // toolPath -> set of benefits

    // Build benefit map
    for (const tool of TOOL_PAGES) {
      if (!tool.keyBenefits) continue;
      if (!toolBenefitMap.has(tool.path)) {
        toolBenefitMap.set(tool.path, new Set());
      }
      toolBenefitMap.get(tool.path)!.forEach((b) => {
        // noop - we'll build cross-tool map below
      });
      toolBenefitMap.get(tool.path)!.add(...tool.keyBenefits);
    }

    // Find tools with overlapping benefits
    for (let i = 0; i < TOOL_PAGES.length; i++) {
      for (let j = i + 1; j < TOOL_PAGES.length; j++) {
        const benefitsI = TOOL_PAGES[i].keyBenefits ?? [];
        const benefitsJ = TOOL_PAGES[j].keyBenefits ?? [];
        const overlap = benefitsI.filter((b) => benefitsJ.includes(b));
        if (overlap.length > 0) {
          result.push(TOOL_PAGES[i].path, TOOL_PAGES[j].path);
        }
      }
    }

    // Deduplicate and limit
    return [...new Set(result)].slice(0, 8);
  }, []);

  return (
    <SectionShell
      title="Free AI Tools Directory — 19 Best Tools | AI World Hub"
      description="Choose from 19 free AI prompt engineering tools — build, format, debug, optimize, secure, and translate prompts in your browser. No sign-up required."
      keywords="Best AI Tools, Free AI Tools, AI Tools Directory, Prompt Engineering Tools, AI Prompt Builder, ChatGPT Prompt Tools"
    >
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-400/80">
          Professional Toolkit
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">AI World Hub</h1>
        <p className="max-w-3xl text-base sm:text-lg text-slate-400">
          Choose from 19 precision tools for prompt engineering teams. Build, format, validate, debug, optimize, secure, and translate — all in the browser.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="mt-6 mb-8 flex flex-col sm:flex-row gap-4 sm:gap-2">
        <div className="flex-1 sm:w-auto">
          <div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools..."
              className="w-full pl-4 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white outline-none focus:border-amber-400/50 transition"
              aria-label="Search tools"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat.value
                  ? "bg-amber-500/15 text-amber-300 border border-amber-400/30"
                  : "bg-slate-900/50 text-slate-400 border border-slate-700/50 hover:border-slate-600"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFreeOnly(!showFreeOnly)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              showFreeOnly
                ? "bg-amber-500/15 text-amber-300 border border-amber-400/30"
                : "bg-slate-900/50 text-slate-400 border border-slate-700/50 hover:border-slate-600"
            }`}
          >
            {showFreeOnly ? "Show all" : "Free only"}
          </button>
        </div>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((tool) => (
          <React.Fragment key={tool.path}>
            <ToolCard tool={tool} />
          </React.Fragment>
        ))}
      </div>

      {/* Related Tools Section */}
      {relatedTools.length > 0 && (
        <section className="mt-12 pt-8 border-t border-white/10">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-400/80">
                Related tools
              </p>
              <h2 className="mt-1 text-xl font-bold text-white">You might also like</h2>
            </div>
            <Link
              to="/tools"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-400 hover:text-amber-300 transition"
            >
              View all
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedTools.map((path) => {
              const tool = TOOL_PAGES.find((t) => t.path === path);
              if (!tool) return null;
              return (
                <Link
                  key={path}
                  to={path}
                  className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/40 p-4 transition hover:border-amber-400/30 hover:bg-slate-900/70"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tool.accent} border border-white/10`}
                  >
                    <tool.icon className="h-5 w-5 text-white" aria-hidden="true" />
                  </div>
                  <span className="flex-1 text-sm font-medium text-slate-200 group-hover:text-white">
                    {tool.title}
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-500 transition group-hover:text-amber-400" />
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Internal links to prompts and blogs */}
      <section className="mt-12 pt-8 border-t border-white/10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-400/80">
              Resources
            </p>
            <h2 className="mt-1 text-xl font-bold text-white">Learn with AI prompts</h2>
          </div>
          <Link
            to="/prompts"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-400 hover:text-amber-300 transition"
          >
            Browse 225+ prompts
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <a
            href="/blog/best-ai-tools-2026-complete-directory"
            className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/40 p-4 transition hover:border-amber-400/30 hover:bg-slate-900/70"
          >
            <svg
              className="w-5 h-5 text-amber-400"
              viewBox="0 0 64 64"
              fill="none"
            >
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="1" />
              <path d="M20 30 L44 30 M30 20 L30 44" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span>
              <span className="font-medium text-white">Best AI Tools 2026 Directory</span>
              <span className="text-sm text-slate-500">/ blog</span>
            </span>
          </a>
          <a
            href="/prompts/content-writer"
            className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/40 p-4 transition hover:border-amber-400/30 hover:bg-slate-900/70"
          >
            <svg
              className="w-5 h-5 text-amber-400"
              viewBox="0 0 64 64"
              fill="none"
            >
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="1" />
              <path d="M20 30 L44 30 M30 20 L30 44" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span>
              <span className="font-medium text-white">Content Writer Prompts</span>
              <span className="text-sm text-slate-500">/ prompts</span>
            </span>
          </a>
        </div>
      </section>
    </SectionShell>
  );
}

export function PromptVariableExtractorPage() {
  const [input, setInput] = useState("You are a {{role}} expert in {{domain}}. Write a {{tone}} {{content_type}} for {{product_name}} targeting {audience} in :language. Focus on [key_benefit] and CTA for [region]. Max {{word_count}} words.");
  const variables = useMemo(() => extractPromptVariables(input), [input]);
  const tool = TOOL_BY_SLUG.get("prompt-variable-extractor")!;

  return (
    <ToolContainer
      title="Prompt Variable Extractor"
      toolSlug="prompt-variable-extractor"
      description="Extract prompt placeholders to standardize Prompt Engineering templates for fast and reliable AI automation."
      tool={tool}
    >
      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-300">Prompt Input</span>
        <textarea
          className="h-44 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Prompt text"
        />
        <LiveStats text={input} />
      </label>
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="text-base font-semibold text-white">Detected Variables ({variables.length})</h2>
        <OutputToolbar text={variables.join("\n")} copyLabel="Copy Vars" fileName="prompt-variables.txt" showStats={false} className="mt-2" />
        <p className="mt-2 break-words text-sm text-slate-300">
          {variables.length ? variables.join(", ") : "No variables found."}
        </p>
      </div>
      <ToolGuide
        intro="The Prompt Variable Extractor finds every placeholder in your prompt — {name}, {{city}}, [tone] — and lists them in one click. It is made for teams that build reusable prompt templates, writers who personalise the same email for many clients, and anyone who wants consistent placeholders across a prompt library."
        steps={[
          "Paste a prompt that contains placeholders like {name}, {{product}}, or [topic].",
          "The tool lists every detected variable instantly, in order of appearance.",
          "Check the list to make sure every placeholder you use has a consistent name.",
          "Copy the variable list to use as a fill-in checklist, or rename variables in your prompt and re-scan.",
          "Use the same variable names across all your templates so one fill-in sheet works everywhere.",
        ]}
        example={{
          title: "One template, all variables in plain sight.",
          before:
            "Hi {name}, we loved your interest in {{product}}. Could you share [preferred_time] for a quick call? Our team at {company} will join.",
          after:
            "Detected Variables (4): name, product, preferred_time, company\n\nFill-in checklist: name = ___  |  product = ___  |  preferred_time = ___  |  company = ___",
          note: "Spotting variables before sending is the fastest way to avoid an email that says \"Hi {name}\". Pair the extracted list with the Prompt Formatter to keep your template tidy.",
        }}
      />
    </ToolContainer>
  );
}

export function JsonSchemaGeneratorPage() {
  const [input, setInput] = useState('{\n  "name": "Ava",\n  "age": 32,\n  "active": true\n}');
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const tool = TOOL_BY_SLUG.get("json-schema-generator")!;

  const handleGenerate = () => {
    try { setResult(generateJsonSchema(input)); setError(""); }
    catch { setResult(""); setError("Invalid JSON input. Please provide a valid JSON object or array."); }
  };

  return (
    <ToolContainer
      title="JSON Schema Generator"
      toolSlug="json-schema-generator"
      description="Generate JSON Schema from sample data to enforce reliable Prompt Engineering output structure."
      tool={tool}
    >
      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-300">Sample JSON</span>
        <textarea
          className="h-56 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 font-mono text-sm text-slate-100 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Sample JSON"
        />
        <LiveStats text={input} />
      </label>
      <button
        type="button"
        onClick={handleGenerate}
        className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-400"
      >
        Generate Schema
      </button>
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      {result && <OutputToolbar text={result} fileName="schema.json" fileMime="application/json" className="mb-2" />}
      <pre className="overflow-auto rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300 whitespace-pre-wrap break-words">{result || "Schema output will appear here."}</pre>
      <ToolGuide
        intro="The JSON Schema Generator builds a JSON Schema from a sample of your data — so AI models and APIs return output you can rely on. It is made for developers using structured AI output, data teams validating imports, and prompt engineers who want models to answer in a fixed format."
        steps={[
          "Paste a sample JSON object or array — the shape of the output you want the AI to return.",
          "Click Generate Schema and the tool creates a matching JSON Schema draft.",
          "Copy the schema into your API call, prompt, or validation library.",
          "Use the same schema in the JSON Validator to check AI output against it.",
          "Refine field types (string, number, boolean) in your sample and regenerate if the schema is too loose.",
        ]}
        example={{
          title: "From a tiny sample to a reusable schema.",
          before:
            '{ "name": "Ava", "age": 32, "active": true }',
          after:
            '{ "type": "object", "properties": { "name": { "type": "string" }, "age": { "type": "number" }, "active": { "type": "boolean" } }, "required": ["name", "age", "active"] }',
          note: "Once the schema exists, you can ask ChatGPT, Claude, or Gemini to return JSON matching it — then verify the output with the JSON Validator before it reaches your code.",
        }}
      />
    </ToolContainer>
  );
}

export function JsonValidatorPage() {
  const [jsonInput, setJsonInput] = useState('{\n  "name": "Ava",\n  "age": 32,\n  "active": true\n}');
  const [schemaInput, setSchemaInput] = useState(
    '{\n  "type": "object",\n  "required": ["name", "age", "active"],\n  "properties": {\n    "name": { "type": "string" },\n    "age": { "type": "integer" },\n    "active": { "type": "boolean" }\n  }\n}',
  );
  const [messages, setMessages] = useState<string[]>([]);
  const [error, setError] = useState("");
  const tool = TOOL_BY_SLUG.get("json-validator")!;

  const runValidation = () => {
    try {
      const issues = validateJsonWithSchema(jsonInput, schemaInput);
      setMessages(issues.length ? issues : ["Valid JSON for the provided schema subset."]);
      setError("");
    } catch { setMessages([]); setError("Invalid JSON or schema syntax. Please check both inputs."); }
  };

  return (
    <ToolContainer
      title="JSON Validator"
      toolSlug="json-validator"
      description="Validate JSON against schema rules to keep Prompt Engineering pipelines accurate and production-ready."
      tool={tool}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-300">JSON Input</span>
          <textarea
            className="h-64 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 font-mono text-sm text-slate-100 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            aria-label="JSON input"
          />
          <LiveStats text={jsonInput} />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-300">Schema Input</span>
          <textarea
            className="h-64 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 font-mono text-sm text-slate-100 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
            value={schemaInput}
            onChange={(e) => setSchemaInput(e.target.value)}
            aria-label="Schema input"
          />
          <LiveStats text={schemaInput} />
        </label>
      </div>
      <button
        type="button"
        onClick={runValidation}
        className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-400"
      >
        Validate JSON
      </button>
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      {messages.length > 0 && <OutputToolbar text={messages.join("\n")} copyLabel="Copy Results" showStats={false} className="mb-2" />}
      <ul className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
        {messages.length ? messages.map((m, i) => <li key={i}>{m}</li>) : <li>Validation results appear here.</li>}
      </ul>
      <ToolGuide
        intro="The JSON Validator checks any JSON against a schema and reports exactly which fields are missing, extra, or the wrong type. It is made for developers who receive AI-generated JSON, QA testers verifying API payloads, and anyone building pipelines where a wrong field type breaks the next step."
        steps={[
          "Paste the JSON you want to check into the first box.",
          "Paste a JSON Schema into the second box (generate one first with the JSON Schema Generator if needed).",
          "Click Validate and read the results — every issue is listed with the field path.",
          "Fix the JSON based on the messages and re-validate until it passes.",
          "Copy the results as a record, or reuse the same schema for every AI output you receive.",
        ]}
        example={{
          title: "AI output that breaks the pipeline — caught in seconds.",
          before:
            'JSON: { "name": "Ava", "age": "thirty-two", "active": 1 }\nSchema: { "type": "object", "properties": { "name": { "type": "string" }, "age": { "type": "number" }, "active": { "type": "boolean" } } }',
          after:
            "Issues found:\n- age: expected number, got string (\"thirty-two\")\n- active: expected boolean, got number (1)\n\nFix: send age as 32 and active as true, then re-validate → all fields pass.",
          note: "AI models often guess types when asked for JSON. A quick validation pass catches those mistakes before they reach your database. Use the JSON Schema Generator to create the schema from one good sample.",
        }}
      />
    </ToolContainer>
  );
}

export function PromptFormatterPage() {
  const [input, setInput] = useState("you are expert analyst\n\nsummarize quarterly business risks for exec team\n-- need bullet points\n-- include impact High/Med/Low\n-- add mitigation steps\ntone professional\n\naudience = C-suite\nformat should be markdown table maybe?");
  const output = useMemo(() => formatPrompt(input), [input]);
  const tool = TOOL_BY_SLUG.get("prompt-formatter")!;

  return (
    <ToolContainer
      title="Prompt Formatter"
      toolSlug="prompt-formatter"
      description="Format messy prompt notes into a clear structure for stronger Prompt Engineering consistency."
      tool={tool}
    >
      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-300">Input</span>
        <textarea
          className="h-48 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Prompt formatter input"
        />
        <LiveStats text={input} />
      </label>
      <div>
        <p className="mb-2 text-sm font-medium text-slate-300">Formatted Output</p>
        <OutputToolbar text={output} fileName="formatted-prompt.txt" className="mb-2" />
        <pre className="overflow-auto rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300 whitespace-pre-wrap break-words">{output}</pre>
      </div>
      <ToolGuide
        intro="The Prompt Formatter turns messy prompt notes into a clean, structured prompt — with consistent spacing, clear sections, and tidy punctuation. It is made for writers who jot ideas in drafts, teams that share prompts over chat, and anyone who copies text from emails or documents where formatting gets lost."
        steps={[
          "Paste your rough prompt — extra spaces, mixed punctuation, and messy line breaks are fine.",
          "The formatted version appears instantly with normalised spacing and structure.",
          "Scan the output to make sure your instructions read clearly section by section.",
          "Copy the clean prompt into your AI chatbot or save it as a template.",
          "For an extra step up, run the formatted prompt through the Advanced Prompt Optimizer to add role, format, and constraints.",
        ]}
        example={{
          title: "Ragged notes become a readable prompt.",
          before:
            "act as  a chef    write   a 3-course   menu   for   a   vegan   restaurant !!!   include   price   range...",
          after:
            "Act as a chef. Write a 3-course menu for a vegan restaurant. Include a price range.",
          note: "Models read prompts exactly as written — stray spaces and stray punctuation can shift the result. Cleaning first makes every later step (optimizing, debugging, translating) work on a solid base.",
        }}
      />
    </ToolContainer>
  );
}

export function PromptCleanerPage() {
  const [input, setInput] = useState("  Act  as   expert   \u200Bcopywriter\u200B!   \n\n\nWrite  a  product \t\t launch \n email for  {{product}} —  include  3 benefits…  \n\n  Keep  tone  exciting!!!  \u00A0\u00A0 ");
  const output = useMemo(() => cleanPrompt(input), [input]);
  const tool = TOOL_BY_SLUG.get("prompt-cleaner")!;

  return (
    <ToolContainer
      title="Prompt Cleaner"
      toolSlug="prompt-cleaner"
      description="Clean noisy text and hidden characters to improve Prompt Engineering quality and response stability."
      tool={tool}
    >
      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-300">Input</span>
        <textarea
          className="h-48 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Prompt cleaner input"
        />
        <LiveStats text={input} />
      </label>
      <div>
        <p className="mb-2 text-sm font-medium text-slate-300">Cleaned Output</p>
        <OutputToolbar text={output} fileName="cleaned-prompt.txt" className="mb-2" />
        <pre className="overflow-auto rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300 whitespace-pre-wrap break-words">{output}</pre>
      </div>
      <ToolGuide
        intro="The Prompt Cleaner removes hidden characters, extra spaces, and invisible formatting from pasted prompts — so what the AI sees is exactly what you intended. It is made for anyone who copies prompts from documents, emails, or chat apps where invisible characters like zero-width spaces sneak in and quietly change the model's response."
        steps={[
          "Paste your prompt into the box — even if it looks fine, it may contain hidden characters.",
          "The cleaned output appears instantly with invisible characters removed and spacing normalised.",
          "Compare the word count before and after to see how much noise was stripped.",
          "Copy the cleaned version and use it in your AI chatbot, templates, or prompt library.",
          "Make cleaning a habit before every prompt you reuse — it keeps outputs consistent.",
        ]}
        example={{
          title: "Invisible characters removed in one click.",
          before:
            'Act  as   expert\u200Bcopywriter\u200B! \n\nWrite  a  product  launch \n email for  {{product}} \u2014  include  3 benefits…  \n\n Keep  tone  exciting!!!',
          after:
            "Act as expert copywriter! Write a product launch email for {{product}} — include 3 benefits. Keep tone exciting.",
          note: "Zero-width spaces and doubled spaces look identical to the eye but not to the model. Cleaning first stabilises results — and the Prompt Formatter can then structure the cleaned text into neat sections.",
        }}
      />
    </ToolContainer>
  );
}

export function TokenEstimatorPage() {
  const [input, setInput] = useState("You are a senior product marketing manager.\nTask: Write a 500-word launch announcement for AI World Hub targeting developers and indie hackers.\nInclude 3 key benefits, 1 customer quote placeholder, and a CTA to https://aiworldhub.site/tools.\nTone: confident, friendly, no jargon.\nFormat: headline, subheadline, 3 bullet benefits, quote block, CTA.\nConstraint: keep under 500 words.");
  const stats = useMemo(() => estimateTokens(input), [input]);
  const tool = TOOL_BY_SLUG.get("token-estimator")!;

  return (
    <ToolContainer
      title="Token Estimator"
      toolSlug="token-estimator"
      description="Free token estimator for writers and developers: check characters, words, and tokens for any prompt. Stay inside ChatGPT, Claude & Gemini limits."
      tool={tool}
    >
      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-300">Prompt Text</span>
        <textarea
          className="h-44 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Text for token estimation"
        />
      </label>
      <OutputToolbar text={input} fileName="prompt.txt" showStats={false} />
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Characters", value: stats.characters, color: "text-cyan-300" },
          { label: "Words", value: stats.words, color: "text-indigo-300" },
          { label: "Estimated Tokens", value: stats.estimatedTokens, color: "text-violet-300" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <h3 className="text-sm font-medium text-slate-400">{label}</h3>
            <p className={`mt-1 text-2xl font-bold ${color}`}>{value.toLocaleString()}</p>
          </div>
        ))}
      </div>
      <ToolGuide
        intro="The Token Estimator counts the characters, words, and estimated tokens in any text — instantly, in your browser. It is made for writers, developers, and students who use ChatGPT, Claude, or Gemini and want to stay inside the model's context window, plan prompts that fit, or estimate API costs before sending anything."
        steps={[
          "Paste any text — a prompt, a document, or a whole conversation — into the box. Counts update live as you type.",
          "Read the three numbers: Characters, Words, and Estimated Tokens.",
          "Compare the token count with your model's context limit — for example 8k for ChatGPT free, 128k–200k for Claude or GPT-4-class models.",
          "If you are over budget, trim the text and watch the numbers drop until the prompt fits.",
          "Use the Copy button to keep the final text ready for your AI tool.",
        ]}
        example={{
          title: "A 500-word prompt is roughly 650–700 tokens — here is the rule of thumb.",
          before:
            "You are a senior product marketing manager.\nTask: Write a 500-word launch announcement for AI World Hub targeting developers and indie hackers.\nInclude 3 key benefits, 1 customer quote placeholder, and a CTA to https://aiworldhub.site/tools.\nTone: confident, friendly, no jargon.\nFormat: headline, subheadline, 3 bullet benefits, quote block, CTA.\nConstraint: keep under 500 words.",
          after:
            "Characters: 337\nWords: 55\nEstimated Tokens: 75\n\n(For the full 500-word version, expect roughly:\nCharacters ≈ 3,200 | Words ≈ 500 | Estimated Tokens ≈ 650–700)",
          note: "A common rule of thumb: 1 English word ≈ 1.3–1.5 tokens, and 1 token ≈ 4 characters. Knowing your prompt's token size helps you avoid truncation in long conversations and keep API bills predictable.",
        }}
      />
    </ToolContainer>
  );
}

export function PromptGeneratorPage() {
  const [role, setRole] = useState("");
  const [task, setTask] = useState("");
  const [goal, setGoal] = useState("");
  const [tone, setTone] = useState("");
  const [audience, setAudience] = useState("");
  const [desiredOutput, setDesiredOutput] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [showGenerated, setShowGenerated] = useState(false);
  const tool = TOOL_BY_SLUG.get("prompt-generator")!;

  const roles = useMemo(() => {
    const roles: { slug: string; title: string; description: string }[] = [
      { slug: "writing", title: "Writing & Content", description: "Content creators, bloggers, journalists" },
      { slug: "marketing", title: "Marketing & Sales", description: "Marketers, business owners, copywriters" },
      { slug: "coding", title: "Development & Code", description: "Software developers, programmers, engineers" },
      { slug: "business", title: "Business & Strategy", description: "Entrepreneurs, consultants, analysts" },
      { slug: "education", title: "Education & Learning", description: "Teachers, students, instructional designers" },
      { slug: "creative", title: "Creative & Design", description: "Designers, artists, creative professionals" },
      { slug: "career", title: "Career & HR", description: "Job seekers, HR professionals, recruiters" },
      { slug: "support", title: "Customer Support", description: "Support agents, customer success teams" },
    ];
    return roles;
  }, []);

  const usePromptGeneration = useCallback(() => {
    let prompt = "";

    const roleInfo = roles.find((r) => r.slug === role);
    if (!roleInfo) return "";

    // Build role context
    const roleContext = roleInfo.description
      ? `You are a ${roleInfo.description}.`
      : `You are a ${role} expert.`;

    // Build task-specific context
    const taskInfo = task ? `Task: ${task}.` : "";
    const goalInfo = goal ? `Goal: ${goal}.` : "";
    const toneInfo = tone ? `Tone: ${tone}.` : "";
    const audienceInfo = audience ? `Audience: ${audience}.` : "";
    const outputInfo = desiredOutput ? `Desired output format: ${desiredOutput}.` : "";

    prompt = `${roleContext} ${taskInfo} ${goalInfo} ${toneInfo} ${audienceInfo} ${outputInfo}`.trim();

    // Clean up duplicate spaces and newlines
    prompt = prompt.replace(/\s+/g, " ").trim();

    return prompt;
  }, [role, task, goal, tone, audience, desiredOutput, roles]);

  const handleGenerate = () => {
    const prompt = usePromptGeneration();
    setGeneratedPrompt(prompt);
    setShowGenerated(true);
  };

  const handleCopy = async () => {
    if (!generatedPrompt) return;
    try {
      await navigator.clipboard.writeText(generatedPrompt);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = generatedPrompt;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
  };

  const relatedPromptPaths = useMemo(() => {
    if (!role || !task) return [];
    // Return related prompt programmatic pages based on role
    const parts = role.split("/");
    return [`/prompts/${role}`];
  }, [role]);

  const relatedTools = useMemo(() => {
    const result: string[] = [];
    for (const t of TOOL_PAGES) {
      if (t.category === "writing" && t.path !== "/tools/prompt-generator") {
        result.push(t.path);
      }
    }
    return result.slice(0, 4);
  }, []);

  return (
    <ToolContainer
      title="AI Prompt Generator"
      toolSlug="prompt-generator"
      description="Generate structured AI prompts by selecting role, task, goal, tone, audience, and desired output format. Free in-browser prompt creation."
      tool={tool}
    >
      <div className="space-y-4">
        {/* Role & Task Selection */}
        <div>
          <p className="text-sm font-medium text-slate-300">Role</p>
          <select
            value={role || ""}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white outline-none focus:border-amber-400/50 transition focus:ring-2 focus:ring-amber-400/20 mb-3"
            aria-label="Select a role"
          >
            <option value="">Select a role...</option>
            {roles.map((r) => (
              <option key={r.slug} value={r.slug}>
                {r.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-300">Task</p>
          <select
            value={task || ""}
            onChange={(e) => setTask(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white outline-none focus:border-amber-400/50 transition focus:ring-2 focus:ring-amber-400/20 mb-4"
            aria-label="Select a task"
          >
            <option value="">Select a task...</option>
            {roles.map((r) => {
              // Get tasks for this role from prompt-seo.json
              return null;
            })}
          </select>
        </div>

        {/* Customization fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-slate-300">Goal</p>
            <select
              value={goal || ""}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white outline-none focus:border-amber-400/50 transition focus:ring-2 focus:ring-amber-400/20"
              aria-label="Enter the goal of the prompt"
            >
              <option value="">Select or enter a goal...</option>
              <option value="Write a blog post about AI tools">Write a blog post about AI tools</option>
              <option value="Create marketing copy for a product launch">Create marketing copy for a product launch</option>
              <option value="Debug a code issue">Debug a code issue</option>
              <option value="Summarize a long article">Summarize a long article</option>
              <option value="Create a social media post">Create a social media post</option>
              <option value="Write an email campaign">Write an email campaign</option>
              <option value="Prepare a presentation">Prepare a presentation</option>
            </select>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-300">Tone</p>
            <select
              value={tone || ""}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white outline-none focus:border-amber-400/50 transition focus:ring-2 focus:ring-amber-400/20"
              aria-label="Enter the desired tone"
            >
              <option value="">Select or enter a tone...</option>
              <option value="Professional">Professional</option>
              <option value="Friendly">Friendly</option>
              <option value="Persuasive">Persuasive</option>
              <option value="Informative">Informative</option>
              <option value="Urgent">Urgent</option>
              <option value="Creative">Creative</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-slate-300">Audience</p>
            <select
              value={audience || ""}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white outline-none focus:border-amber-400/50 transition focus:ring-2 focus:ring-amber-400/20"
              aria-label="Enter the target audience"
            >
              <option value="">Select or enter an audience...</option>
              <option value="Executives">Executives</option>
              <option value="Developers">Developers</option>
              <option value="Customers">Customers</option>
              <option value="Students">Students</option>
              <option value="Peers">Peers</option>
              <option value="General public">General public</option>
            </select>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-300">Desired Output</p>
            <select
              value={desiredOutput || ""}
              onChange={(e) => setDesiredOutput(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white outline-none focus:border-amber-400/50 transition focus:ring-2 focus:ring-amber-400/20"
              aria-label="Enter the desired output format"
            >
              <option value="">Select or enter output format...</option>
              <option value="Blog post">Blog post</option>
              <option value="Email">Email</option>
              <option value="Code snippet">Code snippet</option>
              <option value="Summary">Summary</option>
              <option value="Social media post">Social media post</option>
              <option value="Marketing copy">Marketing copy</option>
              <option value="Presentation">Presentation</option>
            </select>
          </div>
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          className="w-full py-3 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition flex items-center justify-center gap-2"
          disabled={!role || !task}
        >
          <Copy2 className="h-4 w-4" />
          Generate Prompt
        </button>

        {/* Generated prompt display */}
        {showGenerated && generatedPrompt && (
          <div className="mt-6 p-5 rounded-xl border border-amber-500/25 bg-amber-500/10">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400/80 mb-3">Generated Prompt</h3>
            <textarea
              readonly
              className="w-full h-40 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-sm text-amber-200 font-mono outline-none focus:ring-2 focus:ring-amber-300 transition"
              value={generatedPrompt}
              aria-label="Generated prompt"
            />
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleCopy}
                className="flex-1 py-2 rounded-lg bg-slate-900 text-sm text-slate-300 hover:bg-slate-800 transition"
              >
                <Copy2 className="h-4 w-4 mr-2" /> Copy
              </button>
              <span className="text-sm text-slate-400">Copied to clipboard</span>
            </div>
          </div>
        )}

        {/* Related prompts section */}
        {relatedPromptPaths.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-medium text-slate-300 uppercase tracking-[0.18em] text-amber-400/80 mb-3">Related prompts</p>
            <div className="grid grid-cols-2 gap-4">
              {relatedPromptPaths.map((path) => {
                const tool = TOOL_PAGES.find((t) => t.path === path);
                if (!tool) return null;
                return (
                  <div key={path} className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/40 p-3 transition hover:border-amber-400/30 hover:bg-slate-900/70">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-900/80 border border-white/10">
                      <tool.icon className="h-4 w-4 text-white" aria-hidden="true" />
                    </div>
                    <span className="flex-1 text-sm font-medium text-slate-200 group-hover:text-white">
                      {tool.title}</span>
                    <ArrowUpRight className="h-3 w-3 shrink-0 text-slate-500 transition group-hover:text-amber-400" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Related AI tools section */}
        {relatedTools.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-medium text-slate-300 uppercase tracking-[0.18em] text-amber-400/80 mb-3">Related AI tools</p>
            <div className="grid grid-cols-2 gap-3">
              {relatedTools.map((path) => {
                const tool = TOOL_PAGES.find((t) => t.path === path);
                if (!tool) return null;
                return (
                  <Link
                    key={path}
                    to={path}
                    className="group flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/40 p-3 transition hover:border-amber-400/30 hover:bg-slate-900/70"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-900/80 border border-white/10">
                      <tool.icon className="h-4 w-4 text-white" aria-hidden="true" />
                    </div>
                    <span className="flex-1 text-sm font-medium text-slate-200 group-hover:text-white">
                      {tool.title}</span>
                    <ArrowUpRight className="h-3 w-3 shrink-0 text-slate-500 transition group-hover:text-amber-400" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* SEO landing pages section */}
        <div className="mt-6">
          <p className="text-sm font-medium text-slate-300 uppercase tracking-[0.18em] text-amber-400/80 mb-3">Recommended landing pages</p>
          <div className="grid grid-cols-2 gap-3">
            <a
              href="/best-ai-tools-for-writing"
              className="group flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/40 p-3 transition hover:border-amber-400/30 hover:bg-slate-900/70"
            >
              <svg className="w-4 h-4 text-amber-400" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="1" />
                <path d="M20 30 L44 30 M30 20 L30 44" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span className="flex-1 text-sm font-medium text-slate-200 group-hover:text-white">
                Best AI Tools for Writing</span>
              <ArrowUpRight className="h-3 w-3 shrink-0 text-slate-500 transition group-hover:text-amber-400" />
            </a>
            <a
              href="/best-ai-tools-for-coding"
              className="group flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/40 p-3 transition hover:border-amber-400/30 hover:bg-slate-900/70"
            >
              <svg className="w-4 h-4 text-amber-400" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="1" />
                <path d="M20 30 L44 30 M30 20 L30 44" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span className="flex-1 text-sm font-medium text-slate-200 group-hover:text-white">
                Best AI Tools for Coding</span>
              <ArrowUpRight className="h-3 w-3 shrink-0 text-slate-500 transition group-hover:text-amber-400" />
            </a>
          </div>
        </div>
      </div>

      <ToolGuide
        intro="The AI Prompt Generator builds a complete, structured prompt from six simple choices — role, task, goal, tone, audience, and desired output format. It is made for students writing essays, marketers drafting campaigns, developers explaining code, and anyone who wants a ready-to-use prompt for ChatGPT, Claude, or Gemini without knowing prompt-engineering theory."
        steps={[
          "Pick a role from the list — Writing & Content, Marketing, Development, Business, Education, and more.",
          "Describe your task in plain words, like “write a product launch email” or “explain recursion to beginners”.",
          "Set the goal, tone, and audience so the prompt matches exactly what you need.",
          "Choose the desired output format — paragraph, bullet points, table, or code block.",
          "Click Generate, review the prompt, and copy it straight into your favourite AI chatbot.",
        ]}
        example={{
          title: "From a vague idea to a ready-to-use prompt in five clicks.",
          before:
            "Role: Marketing & Sales\nTask: write something about our new product\nGoal: get people interested\nTone: friendly\nAudience: small business owners\nFormat: bullet points",
          after:
            "You are a marketing expert for small businesses.\nTask: Write a friendly product announcement for our new invoicing app.\nGoal: Get small business owners interested in trying it.\nTone: friendly and practical, no jargon.\nAudience: small business owners with no technical background.\nDesired output: bullet points with a short intro and a call to action.",
          note: "Each dropdown adds one instruction to the final prompt, so you get a complete brief the AI can follow without guessing — instead of a one-line request that produces a generic answer.",
        }}
      />
    </ToolContainer>
  );
}

export function ComparisonPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const tool = TOOL_BY_SLUG.get("prompt-generator")!;

  // Group tools by category for comparison
  const categoryTools = useMemo(() => {
    const groups: Record<string, ToolMeta[]> = {};
    for (const t of TOOL_PAGES) {
      if (!t.category) continue;
      if (!groups[t.category]) groups[t.category] = [];
      groups[t.category].push(t);
    }
    return groups;
  }, []);

  const categories = useMemo(() => {
    const cats: { value: string; name: string }[] = [
      { value: "writing", name: "Writing & Content" },
      { value: "coding", name: "Development & Code" },
      { value: "marketing", name: "Marketing & Sales" },
      { value: "business", name: "Business & Strategy" },
      { value: "creative", name: "Creative & Design" },
    ];
    return cats;
  }, []);

  const filteredTools = useMemo(() => {
    if (!selectedCategory) return [];
    const tools = categoryTools[selectedCategory] || [];
    return tools.filter((tool) => {
      const matchesFree = !showFreeOnly || !tool.premium;
      return matchesFree;
    });
  }, [selectedCategory, showFreeOnly]);

  const handleGenerateComparison = () => {
    // No-op - comparison is displayed immediately
  };

  return (
    <ToolContainer
      title="AI Tool Comparison"
      toolSlug="prompt-generator"
      description="Compare AI tools by category, features, free availability, use cases, and strengths. Use real data from the AI World Hub tool directory."
      tool={tool}
    >
      <div className="space-y-4">
        {/* Category Selection */}
        <div className="mb-6">
          <p className="text-sm font-medium text-slate-300 uppercase tracking-[0.18em] text-amber-400/80 mb-3">
            Select category to compare
          </p>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-xl border border-slate-700 bg-slate-900 text-sm font-medium transition-all ${
                  selectedCategory === cat.value
                    ? "bg-amber-500/15 text-amber-300 border border-amber-400/30"
                    : "bg-slate-900/50 text-slate-400 border border-slate-700/50 hover:border-slate-600"
                }`}
              >
                {cat.name}
                {filteredTools.length > 0 && (
                  <span className="text-amber-400 font-medium">{filteredTools.length} tools</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Comparison display */}
        {filteredTools.length > 0 && selectedCategory && (
          <div className="mt-8 p-6 rounded-2xl border border-white/10 bg-slate-900/50">
            <h2 className="text-2xl font-bold text-white mb-6">
              {selectedCategory} Tool Comparison
            </h2>
            <div className="grid gap-4">
              {filteredTools.map((tool, i) => (
                <div
                  key={tool.path}
                  className="group flex flex-col sm:flex-row rounded-2xl border border-white/10 bg-slate-900/40 p-4 transition hover:border-amber-400/30 hover:bg-slate-900/70"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900/80 border border-white/10 flex-sms-none">
                    <tool.icon className="h-5 w-5 text-white" aria-hidden="true" />
                  </div>
                  <div className="flex-1 sm:pl-6">
                    <h3 className="font-medium text-white truncate">{tool.title}</h3>
                    <p className="text-sm text-slate-400 truncate">{tool.description}</p>
                  </div>
                  <div className="flex-1 sm:flex sm:flex-col gap-2">
                    <p className="text-xxs font-semibold text-amber-400/80">Free</p>
                    {tool.premium ? (
                      <p className="text-xxs font-semibold text-red-400">Premium</p>
                    ) : (
                      <p className="text-xxs font-semibold text-emerald-400">Free</p>
                    )}
                    <p className="text-xxs text-slate-500">{tool.category?.replace(/&/g, "and")}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <h3 className="text-font-medium text-white mb-4">Feature Comparison</h3>
              <div className="grid grid-cols-2 gap-2">
                {filteredTools[0]?.keyBenefits && filteredTools[0].keyBenefits.map((benefit, i) => (
                  <div
                    key={i}
                    className="p-2 rounded border border-amber-500/25 bg-amber-500/10 text-xs text-amber-300"
                  >
                    <span className="font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
              {filteredTools[1]?.keyBenefits && filteredTools[1].keyBenefits.map((benefit, i) => (
                <div
                  key={i + filteredTools[0].keyBenefits!.length}
                  className="p-2 rounded border border-emerald-500/25 bg-emerald-500/10 text-xs text-emerald-300"
                >
                  <span className="font-medium">{benefit}</span>
                </div>
              ))}
              {filteredTools[2]?.keyBenefits && filteredTools[2].keyBenefits.map((benefit, i) => (
                <div
                  key={i + filteredTools[0].keyBenefits!.length + filteredTools[1].keyBenefits!.length}
                  className="p-2 rounded border border-violet-500/25 bg-violet-500/10 text-xs text-violet-300"
                >
                  <span className="font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No selection message */}
        {!(filteredTools.length > 0 && selectedCategory) && (
          <div className="mt-8 text-center">
            <p className="text-slate-400">Select a category above to compare tools</p>
          </div>
        )}

        {/* Internal links to tools directory */}
        <div className="mt-8">
          <p className="text-sm font-medium text-slate-300 uppercase tracking-[0.18em] text-amber-400/80 mb-3">
            Browse all tools
          </p>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => (
              <a
                key={cat.value}
                href={`/tools?category=${cat.value}`}
                className="group flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/40 p-3 transition hover:border-amber-400/30 hover:bg-slate-900/70"
              >
                <svg
                  className="w-4 h-4 text-amber-400"
                  viewBox="0 0 64 64"
                  fill="none"
                >
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="1" />
                  <path d="M20 30 L44 30 M30 20 L30 44" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span className="flex-1 text-sm font-medium text-slate-200 group-hover:text-white">
                  {cat.name}</span>
                <ArrowUpRight className="h-3 w-3 shrink-0 text-slate-500 transition group-hover:text-amber-400" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <ToolGuide
        intro="The AI Tool Comparison page puts free AI prompt tools side by side — category, features, benefits, and free availability — so you can choose the right tool in one glance. It is built for students, freelancers, and small teams who want to compare options before spending time learning a new tool, without reading ten separate pages."
        steps={[
          "Select a category from the grid — Writing & Content, Development & Code, Marketing, Business, or Creative.",
          "Review the tools in that category side by side, with their key benefits listed under each one.",
          "Compare features and use cases to find the tool that matches your task — for example a formatter for messy notes or an optimizer for weak prompts.",
          "Click any tool to open its full page and try it directly — every tool here is free and runs in your browser.",
          "Repeat for other categories whenever you need a different kind of tool.",
        ]}
        example={{
          title: "Choosing a writing tool in under a minute.",
          before:
            "Category: Writing & Content\nTools shown: Prompt Cleaner, Prompt Formatter, Prompt Optimizer, Prompt Debugger\nQuestion: which one should I use first?",
          after:
            "Answer: it depends on the problem —\n• Prompt Cleaner: paste messy copied text, remove noise and hidden characters.\n• Prompt Formatter: turn rough notes into a clear, structured prompt.\n• Prompt Optimizer: strengthen a prompt that gives weak or generic answers.\n• Prompt Debugger: find out exactly why a prompt scores low and what to fix.",
          note: "The side-by-side view makes the difference obvious: each tool solves a different stage of the same workflow, and you can open any of them instantly without signing up.",
        }}
      />
    </ToolContainer>
  );
}
