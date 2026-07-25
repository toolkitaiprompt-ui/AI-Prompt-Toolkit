import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Copy, Check, ChevronDown, ChevronUp, User, Bot, MessageSquare, Code, Sparkles, Pencil } from "lucide-react";
import { PREBUILT_PERSONAS} from "../data/personas";
import { savePrompt } from "../lib/promptHistory";

const PERSONA_TEMPLATES: Record<string, { role: string; expertise: string; voice: string; rules: string[] }> = {
  Marketer: {
    role: "Digital Marketing Strategist",
    expertise: "Growth hacking, content marketing, SEO, and conversion optimization",
    voice: "persuasive, data-driven, and creative",
    rules: [
      "Always include a clear Call-to-Action (CTA)",
      "Reference target audience pain points",
      "Suggest metrics to track success (KPIs)",
      "Keep brand voice consistent",
    ],
  },
  Developer: {
    role: "Senior Software Engineer",
    expertise: "System design, clean code practices, debugging, and scalable architecture",
    voice: "technical, precise, and pragmatic",
    rules: [
      "Follow SOLID principles and design patterns",
      "Write modular, reusable, and well-commented code",
      "Consider edge cases and error handling",
      "Optimize for performance and maintainability",
    ],
  },
  Writer: {
    role: "Professional Copywriter",
    expertise: "Storytelling, brand messaging, and engaging content creation",
    voice: "captivating, empathetic, and clear",
    rules: [
      "Use active voice and strong verbs",
      "Maintain a consistent narrative flow",
      "Adapt tone to the target platform (blog, social, email)",
      "Ensure emotional resonance with the reader",
    ],
  },
  Analyst: {
    role: "Data Analyst",
    expertise: "Data interpretation, statistical analysis, and business intelligence",
    voice: "objective, logical, and structured",
    rules: [
      "Base all conclusions on provided data",
      "Highlight trends, anomalies, and correlations",
      "Present findings in clear tables or bullet points",
      "Suggest actionable business recommendations",
    ],
  },
  Teacher: {
    role: "Expert Educator",
    expertise: "Curriculum design, simplifying complex concepts, and interactive learning",
    voice: "encouraging, patient, and structured",
    rules: [
      "Break down complex topics into simple, digestible steps",
      "Use analogies and real-world examples",
      "Ask guiding questions to check understanding",
      "Provide constructive and positive feedback",
    ],
  },
  Business: {
    role: "Business Consultant",
    expertise: "Strategic planning, market analysis, and operational efficiency",
    voice: "professional, authoritative, and strategic",
    rules: [
      "Focus on ROI and resource allocation",
      "Identify potential risks and mitigations",
      "Provide short-term and long-term strategies",
      "Structure responses with executive summaries",
    ],
  },
};

function generatePersona(role: string, task: string): string {
  const template = PERSONA_TEMPLATES[role];
  if (!template) return "Select a persona to generate a prompt.";

  return `You are a ${template.role} with deep expertise in ${template.expertise}.

Your communication style should be ${template.voice}.

**Your Objective:**
${task || "Assist the user with their specific request within your area of expertise."}

**Rules to Follow:**
${template.rules.map((r, i) => `${i + 1}. ${r}`).join("\n")}

**Output Format:**
Always structure your response clearly using headings, bullet points, and professional formatting. Think step-by-step before providing the final solution.`;
}

function formatChatGPT(persona: typeof PREBUILT_PERSONAS[0], task: string): string {
  return `You are a ${persona.role} with deep expertise in ${persona.expertise}.

Your communication style should be ${persona.voice}.

Your Objective:
${task || persona.description}

Rules to Follow:
${persona.rules.map((r, i) => `${i + 1}. ${r}`).join("\n")}

Output Format:
Structure your response clearly using headings, bullet points, and professional formatting.`;
}

function formatClaudeXML(persona: typeof PREBUILT_PERSONAS[0], task: string): string {
  return `<role>${persona.role}</role>
<expertise>${persona.expertise}</expertise>
<voice>${persona.voice}</voice>
<objective>${task || persona.description}</objective>
<rules>
${persona.rules.map((r) => `  <rule>${r}</rule>`).join("\n")}
</rules>
<output>Structured response with headings and bullet points.</output>`;
}

export default function PersonaBuilder() {
  const [selectedRole, setSelectedRole] = useState<keyof typeof PERSONA_TEMPLATES>("Marketer");
  const [task, setTask] = useState("Help me launch a new SaaS product.");
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<"custom" | "browse">("custom");
  const [selectedPersona, setSelectedPersona] = useState<typeof PREBUILT_PERSONAS[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFullPrompt, setShowFullPrompt] = useState(false);
  const [customTask, setCustomTask] = useState("");
  const [editing, setEditing] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState("");

  const output = useMemo(() => generatePersona(selectedRole, task), [selectedRole, task]);

  const filteredPersonas = useMemo(() => {
    if (!searchQuery.trim()) return PREBUILT_PERSONAS;
    const q = searchQuery.toLowerCase();
    return PREBUILT_PERSONAS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    PREBUILT_PERSONAS.forEach((p) => p.tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, []);

  const [activeTag, setActiveTag] = useState<string>("All");

  const filteredByTag = useMemo(() => {
    if (activeTag === "All") return filteredPersonas;
    return filteredPersonas.filter((p) => p.tags.includes(activeTag));
  }, [filteredPersonas, activeTag]);

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch {}
    if (output.trim().length > 10) savePrompt(output, "AI Persona Builder", "/tools/persona-builder");
  };

  const handleCopyChatGPT = async () => {
    if (!selectedPersona) return;
    const text = formatChatGPT(selectedPersona, customTask || selectedPersona.description);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyClaude = async () => {
    if (!selectedPersona) return;
    const text = formatClaudeXML(selectedPersona, customTask || selectedPersona.description);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectPersona = (persona: typeof PREBUILT_PERSONAS[0]) => {
    setSelectedPersona(persona);
    setShowFullPrompt(true);
    setCustomTask("");
    setEditing(false);
    setEditedPrompt(persona.systemPrompt);
  };

  const getFullPrompt = () => {
    if (!selectedPersona) return "";
    if (editing) return editedPrompt;
    return selectedPersona.systemPrompt;
  };

  return (
    <div className="space-y-8">
      {/* View switcher */}
      <div className="flex items-center gap-2 bg-slate-900/60 rounded-full p-1 border border-white/[0.06] w-fit">
        <button
          onClick={() => setView("custom")}
          className={`px-5 py-2 rounded-full text-sm font-medium transition ${
            view === "custom" ? "bg-amber-500/15 text-amber-300" : "text-slate-400 hover:text-white"
          }`}
        >
          <User className="w-4 h-4 inline mr-1.5" /> Custom Persona
        </button>
        <button
          onClick={() => setView("browse")}
          className={`px-5 py-2 rounded-full text-sm font-medium transition ${
            view === "browse" ? "bg-amber-500/15 text-amber-300" : "text-slate-400 hover:text-white"
          }`}
        >
          <Bot className="w-4 h-4 inline mr-1.5" /> Browse Personas ({PREBUILT_PERSONAS.length})
        </button>
      </div>

      {/* Custom Persona Builder */}
      {view === "custom" && (
        <div className="space-y-6">
          <div>
            <span className="text-sm font-medium text-slate-300">1. Choose a Persona</span>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {Object.keys(PERSONA_TEMPLATES).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    selectedRole === role
                      ? "border-amber-400/50 bg-amber-500/10 text-amber-300"
                      : "border-slate-700 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-300">2. What do you want them to do? (Optional)</span>
            <textarea
              className="h-24 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-slate-100 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              aria-label="Persona task"
            />
          </label>

          <div className="relative">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-300">Generated System Prompt</p>
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-full bg-amber-500/10 border border-amber-400/30 px-4 py-1.5 text-xs font-semibold text-amber-300 transition hover:bg-amber-500/20"
              >
                {copied ? "✓ Copied!" : "Copy Prompt"}
              </button>
            </div>
            <pre className="overflow-auto rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300 whitespace-pre-wrap">{output}</pre>
          </div>
        </div>
      )}

      {/* Browse Personas */}
      {view === "browse" && (
        <div className="space-y-6">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search personas by name, description, or tags..."
              className="w-full rounded-full border border-slate-700/70 bg-slate-900/70 py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 outline-none transition focus:border-amber-400/40 focus:ring-2 focus:ring-amber-400/10"
            />
          </div>

          {/* Tag filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTag("All")}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                activeTag === "All"
                  ? "border-amber-400/40 bg-amber-500/10 text-amber-300"
                  : "border-slate-700/60 bg-slate-900/40 text-slate-400 hover:border-slate-600"
              }`}
            >
              All ({PREBUILT_PERSONAS.length})
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                  activeTag === tag
                    ? "border-amber-400/40 bg-amber-500/10 text-amber-300"
                    : "border-slate-700/60 bg-slate-900/40 text-slate-400 hover:border-slate-600"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Personas grid */}
          {!showFullPrompt && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredByTag.map((persona, idx) => (
                <motion.button
                  key={persona.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  onClick={() => handleSelectPersona(persona)}
                  className="text-left group relative rounded-[20px] border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-400 hover:border-white/[0.15] hover:bg-white/[0.04] hover:shadow-lg hover:shadow-amber-500/5"
                >
                  <div className="text-2xl mb-3">{persona.emoji}</div>
                  <h3 className="font-headline font-bold text-white text-sm mb-1">{persona.name}</h3>
                  <p className="text-xs text-slate-500 mb-3 line-clamp-2">{persona.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {persona.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">{tag}</span>
                    ))}
                  </div>
                </motion.button>
              ))}
            </div>
          )}

          {filteredByTag.length === 0 && (
            <div className="text-center py-10 border border-dashed border-slate-700/60 rounded-2xl bg-slate-900/30">
              <p className="text-slate-400 text-sm">No personas found matching your search</p>
            </div>
          )}

          {/* Full persona detail */}
          {selectedPersona && showFullPrompt && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <button
                onClick={() => { setShowFullPrompt(false); setSelectedPersona(null); setEditing(false); }}
                className="text-sm text-slate-400 hover:text-amber-300 transition"
              >
                ← Back to browse
              </button>

              {/* Persona header */}
              <div className="flex items-start gap-4">
                <div className="text-3xl">{selectedPersona.emoji}</div>
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedPersona.name}</h2>
                  <p className="text-sm text-slate-400 mt-1">{selectedPersona.description}</p>
                  <p className="text-xs text-slate-500 mt-1">{selectedPersona.role}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedPersona.tags.map((tag) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-400/20">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Task input */}
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Task / Objective (Optional)</label>
                <textarea
                  value={customTask}
                  onChange={(e) => setCustomTask(e.target.value)}
                  rows={2}
                  placeholder="What do you want this persona to help with?"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-amber-400/60 resize-none"
                />
              </div>

              {/* System prompt */}
              <div className="rounded-[20px] border border-white/10 bg-slate-950/80 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" /> System Prompt
                  </h3>
                  <button
                    onClick={() => { setEditing(!editing); if (!editing) setEditedPrompt(selectedPersona.systemPrompt); }}
                    className="text-xs text-slate-400 hover:text-amber-300 transition flex items-center gap-1"
                  >
                    <Pencil className="w-3 h-3" /> {editing ? "Done Editing" : "Customize"}
                  </button>
                </div>
                {editing ? (
                  <textarea
                    value={editedPrompt}
                    onChange={(e) => setEditedPrompt(e.target.value)}
                    rows={8}
                    className="w-full rounded-xl border border-amber-400/20 bg-slate-900 p-3 text-sm text-white outline-none transition focus:border-amber-400/60 resize-none font-mono"
                  />
                ) : (
                  <pre className="text-sm text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto">{getFullPrompt()}</pre>
                )}
              </div>

              {/* Copy buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleCopyChatGPT}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-sm font-semibold text-white shadow-lg shadow-amber-500/30 hover:shadow-xl transition"
                >
                  <MessageSquare className="w-4 h-4" /> {copied ? "Copied!" : "Copy as ChatGPT Format"}
                </button>
                <button
                  onClick={handleCopyClaude}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 hover:bg-white/10 transition"
                >
                  <Code className="w-4 h-4" /> Copy as Claude XML
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
