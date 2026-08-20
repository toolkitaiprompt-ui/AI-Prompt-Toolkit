import { useMemo, useState } from "react";
import OutputToolbar, { LiveStats } from "./OutputToolbar";
import { ToolGuide } from "./ToolGuide";

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

export default function PersonaBuilder() {
  const [selectedRole, setSelectedRole] = useState<keyof typeof PERSONA_TEMPLATES>("Marketer");
  const [task, setTask] = useState("Help me launch a new SaaS product.");

  const output = useMemo(() => generatePersona(selectedRole, task), [selectedRole, task]);

  return (
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
        <LiveStats text={task} />
      </label>

      <div className="relative">
        <p className="mb-2 text-sm font-medium text-slate-300">Generated System Prompt</p>
        <OutputToolbar text={output} fileName="persona-prompt.txt" className="mb-2" />
        <pre className="overflow-auto rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300 whitespace-pre-wrap break-words">{output}</pre>
      </div>

      <ToolGuide
        intro="The Persona Builder creates a complete system prompt for any role — marketer, developer, writer, support agent, and more — with expertise, voice, and working rules built in. It is made for anyone who uses ChatGPT, Claude, or Gemini repeatedly for the same kind of work and wants consistent, professional output without rewriting instructions every time."
        steps={[
          "Pick a persona from the templates — Marketer, Developer, Writer, Support, or your own custom role.",
          "Fill in the name, role, and expertise fields. The more specific the expertise, the sharper the answers.",
          "Choose a voice for the persona, such as friendly, formal, or data-driven.",
          "Add working rules — for example \"always include a CTA\" or \"never invent statistics\" — then generate the system prompt.",
          "Copy the generated prompt, paste it into the system prompt or custom instructions box of your AI chatbot, and save.",
        ]}
        example={{
          title: "A reusable support-agent persona from four quick fields.",
          before:
            "You are a customer support agent.\nAnswer user questions politely.",
          after:
            "You are Ava, a Customer Support Specialist at a SaaS company.\nExpertise: troubleshooting, onboarding, and de-escalating frustrated users.\nVoice: warm, clear, and solution-first.\nRules: 1) Always acknowledge the user's problem first. 2) Keep answers under 150 words. 3) If you cannot solve it, escalate with a summary. 4) Never share internal notes.",
          note: "The persona version gives the AI a consistent identity and rules, so every reply matches your brand — no need to re-explain your style in each message. Pair it with the Prompt Optimizer to refine the task instructions inside each conversation.",
        }}
      />
    </div>
  );
}
