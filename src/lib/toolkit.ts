export type JsonSchema = {
  type?: string;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  items?: JsonSchema;
};

const VARIABLE_PATTERNS = [
  /\{\{\s*([a-zA-Z_][a-zA-Z0-9_\-]*)\s*\}\}/g,
  /\{\s*([a-zA-Z_][a-zA-Z0-9_\-]*)\s*\}/g,
  /\[\s*([a-zA-Z_][a-zA-Z0-9_\-]*)\s*\]/g,
  /:(\b[a-zA-Z_][a-zA-Z0-9_\-]*\b)/g,
];

export function extractPromptVariables(input: string): string[] {
  const found = new Set<string>();

  for (const pattern of VARIABLE_PATTERNS) {
    const matches = input.matchAll(pattern);
    for (const match of matches) {
      if (match[1]) {
        found.add(match[1]);
      }
    }
  }

  return [...found].sort((a, b) => a.localeCompare(b));
}

export function cleanPrompt(input: string): string {
  return input
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim();
}

export function formatPrompt(input: string): string {
  const cleaned = cleanPrompt(input);
  const sections = cleaned
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => `${index + 1}. ${line}`);

  return sections.join("\n");
}

function inferType(value: unknown): JsonSchema {
  if (Array.isArray(value)) {
    const first = value[0];
    return {
      type: "array",
      items: first === undefined ? { type: "string" } : inferType(first),
    };
  }

  if (value === null) {
    return { type: "null" };
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    const properties: Record<string, JsonSchema> = {};
    const required: string[] = [];

    for (const [key, propertyValue] of entries) {
      properties[key] = inferType(propertyValue);
      required.push(key);
    }

    return { type: "object", properties, required };
  }

  if (typeof value === "number") {
    return Number.isInteger(value) ? { type: "integer" } : { type: "number" };
  }

  return { type: typeof value };
}

export function generateJsonSchema(jsonInput: string): string {
  const parsed = JSON.parse(jsonInput) as unknown;
  const schema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    ...inferType(parsed),
  };

  return JSON.stringify(schema, null, 2);
}

type ValidationIssue = {
  path: string;
  message: string;
};

function validateBySchema(value: unknown, schema: JsonSchema, path: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (schema.type) {
    const actualType = Array.isArray(value)
      ? "array"
      : value === null
        ? "null"
        : Number.isInteger(value)
          ? "integer"
          : typeof value;

    if (schema.type === "number" && actualType === "integer") {
      return issues;
    }

    if (actualType !== schema.type) {
      issues.push({
        path,
        message: `Expected type ${schema.type} but got ${actualType}.`,
      });
      return issues;
    }
  }

  if (schema.type === "object" && schema.properties && typeof value === "object" && value !== null) {
    const record = value as Record<string, unknown>;
    const required = schema.required ?? [];

    for (const key of required) {
      if (!(key in record)) {
        issues.push({ path, message: `Missing required key: ${key}.` });
      }
    }

    for (const [key, childSchema] of Object.entries(schema.properties)) {
      if (key in record) {
        const childPath = path === "$" ? `$.${key}` : `${path}.${key}`;
        issues.push(...validateBySchema(record[key], childSchema, childPath));
      }
    }
  }

  if (schema.type === "array" && schema.items && Array.isArray(value)) {
    value.forEach((item, index) => {
      issues.push(...validateBySchema(item, schema.items as JsonSchema, `${path}[${index}]`));
    });
  }

  return issues;
}

export function validateJsonWithSchema(jsonInput: string, schemaInput: string): string[] {
  const value = JSON.parse(jsonInput) as unknown;
  const parsedSchema = JSON.parse(schemaInput) as JsonSchema;
  const issues = validateBySchema(value, parsedSchema, "$");

  return issues.map((issue) => `${issue.path}: ${issue.message}`);
}

export function estimateTokens(input: string): { characters: number; words: number; estimatedTokens: number } {
  const characters = input.length;
  const words = input.trim() ? input.trim().split(/\s+/).length : 0;

  // Approximation used by many GPT-style models: ~4 chars per token.
  const estimatedTokens = Math.ceil(characters / 4);

  return { characters, words, estimatedTokens };
}

// ─── Mega Prompt Builder ───────────────────────────────────────────────

export type MegaPromptStep = {
  key: string;
  label: string;
  value: string;
};

export function buildMegaPrompt(steps: MegaPromptStep[]): string {
  const filled = steps.filter((s) => s.value.trim().length > 0);
  const sections: string[] = [];

  const sectionMap: Record<string, string> = {
    role: "ROLE",
    task: "TASK",
    context: "CONTEXT",
    audience: "TARGET AUDIENCE",
    format: "OUTPUT FORMAT",
    tone: "TONE",
    constraints: "CONSTRAINTS",
    examples: "EXAMPLES",
  };

  for (const step of filled) {
    const heading = sectionMap[step.key] || step.label.toUpperCase();
    sections.push(`### ${heading}\n${step.value.trim()}`);
  }

  return sections.join("\n\n");
}

// ─── Prompt Debugger ───────────────────────────────────────────────────

export type PromptIssue = {
  id: string;
  severity: "critical" | "warning" | "info";
  category: string;
  message: string;
  suggestion: string;
};

export function debugPrompt(input: string): {
  healthScore: number;
  issues: PromptIssue[];
  metrics: { words: number; characters: number; sentences: number };
} {
  const issues: PromptIssue[] = [];
  const text = input.trim();

  if (text.length === 0) {
    return {
      healthScore: 0,
      issues: [{ id: "empty", severity: "critical", category: "Content", message: "Prompt is empty.", suggestion: "Add your prompt text to begin debugging." }],
      metrics: { words: 0, characters: 0, sentences: 0 },
    };
  }

  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const characters = text.length;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;

  // Detector 1: Too short
  if (wordCount < 10) {
    issues.push({
      id: "too-short",
      severity: "warning",
      category: "Length",
      message: "Prompt is very short — likely to produce vague or generic responses.",
      suggestion: "Add more context, specific instructions, and expected output details.",
    });
  }

  // Detector 2: Too long (may exceed context budget)
  if (wordCount > 800) {
    issues.push({
      id: "too-long",
      severity: "info",
      category: "Length",
      message: "Prompt is very long — may consume excessive tokens.",
      suggestion: "Consider breaking this into smaller, focused prompts or trimming unnecessary detail.",
    });
  }

  // Detector 3: No role assignment
  const hasRole = /\b(you are|act as|behave as|role:|persona:)\b/i.test(text);
  if (!hasRole) {
    issues.push({
      id: "no-role",
      severity: "warning",
      category: "Role",
      message: "No role or persona defined — the model may lack direction.",
      suggestion: "Start with 'You are a [role] expert in [domain].' to guide the model.",
    });
  }

  // Detector 4: No clear task
  const hasTask = /\b(write|create|generate|analyze|summarize|review|convert|build|design|translate|explain|draft|produce)\b/i.test(text);
  if (!hasTask) {
    issues.push({
      id: "no-task",
      severity: "critical",
      category: "Task",
      message: "No clear action verb detected — the model won't know what to do.",
      suggestion: "Include a specific action verb like 'Write', 'Generate', or 'Analyze' followed by the deliverable.",
    });
  }

  // Detector 5: No format specification
  const hasFormat = /\b(format|output|markdown|json|bullet|list|table|paragraph|section|heading)\b/i.test(text);
  if (!hasFormat) {
    issues.push({
      id: "no-format",
      severity: "warning",
      category: "Format",
      message: "No output format specified — results may be inconsistent.",
      suggestion: "Specify the desired format: 'Output as markdown with bullet points' or 'Return JSON with these fields'.",
    });
  }

  // Detector 6: No constraints
  const hasConstraints = /\b(constraint|limit|max|minimum|must|should|don't|avoid|exclude|keep under|word count)\b/i.test(text);
  if (!hasConstraints) {
    issues.push({
      id: "no-constraints",
      severity: "warning",
      category: "Constraints",
      message: "No constraints defined — the model may hallucinate or exceed bounds.",
      suggestion: "Add constraints like 'Keep under 500 words', 'Don't use jargon', or 'Exclude personal data'.",
    });
  }

  // Detector 7: Ambiguous language
  const ambiguousWords = (text.match(/\b(maybe|perhaps|stuff|things|something|etc\.?|various|some|a lot|good|nice|etc)\b/gi) || []).length;
  if (ambiguousWords >= 2) {
    issues.push({
      id: "ambiguous",
      severity: "warning",
      category: "Clarity",
      message: `Found ${ambiguousWords} vague terms — ambiguity reduces output quality.`,
      suggestion: "Replace vague words with specific, quantifiable terms.",
    });
  }

  // Detector 8: Excessive punctuation / shouting
  const exclamations = (text.match(/!/g) || []).length;
  if (exclamations > 3) {
    issues.push({
      id: "shouting",
      severity: "info",
      category: "Tone",
      message: "Excessive exclamation marks detected.",
      suggestion: "Reduce exclamation marks for a more professional tone.",
    });
  }

  // Detector 9: ALL CAPS words (shouting)
  const capsWords = (text.match(/\b[A-Z]{4,}\b/g) || []).filter((w) => !["JSON", "API", "HTML", "CSS", "SQL", "URL", "PDF", "CSV", "XML", "AI", "GPT", "LLM"].includes(w)).length;
  if (capsWords > 2) {
    issues.push({
      id: "caps",
      severity: "info",
      category: "Tone",
      message: "Multiple ALL-CAPS words detected — may read as shouting.",
      suggestion: "Use normal capitalization for better readability.",
    });
  }

  // Detector 10: No examples (few-shot)
  const hasExamples = /\b(example|for instance|e\.g\.|such as|sample)\b/i.test(text);
  if (!hasExamples && wordCount > 30) {
    issues.push({
      id: "no-examples",
      severity: "info",
      category: "Few-shot",
      message: "No examples provided — few-shot prompting improves consistency.",
      suggestion: "Add 1-3 examples of expected input/output to guide the model.",
    });
  }

  // Detector 11: Run-on sentence
  if (sentences > 0 && wordCount / sentences > 40) {
    issues.push({
      id: "run-on",
      severity: "info",
      category: "Structure",
      message: "Sentences are very long — may reduce comprehension.",
      suggestion: "Break long sentences into shorter, clearer statements.",
    });
  }

  // Detector 12: No audience specified
  const hasAudience = /\b(audience|for|targeting|aimed at|reader|user|customer|client|beginner|expert|developer|marketer)\b/i.test(text);
  if (!hasAudience && wordCount > 20) {
    issues.push({
      id: "no-audience",
      severity: "warning",
      category: "Audience",
      message: "No target audience defined — tone may not match the reader.",
      suggestion: "Specify the audience: 'Write for [audience] with [level] expertise.'",
    });
  }

  // Calculate health score
  let score = 100;
  for (const issue of issues) {
    if (issue.severity === "critical") score -= 20;
    else if (issue.severity === "warning") score -= 10;
    else if (issue.severity === "info") score -= 4;
  }
  const healthScore = Math.max(0, Math.min(100, score));

  return { healthScore, issues, metrics: { words: wordCount, characters, sentences } };
}

// ─── Security Scanner ─────────────────────────────────────────────────

export type SecurityThreat = {
  id: string;
  type: string;
  severity: "high" | "medium" | "low";
  pattern: string;
  description: string;
};

const INJECTION_PATTERNS: { pattern: RegExp; type: string; severity: "high" | "medium" | "low"; description: string }[] = [
  { pattern: /\b(ignore|disregard)\s+(all\s+)?(previous|prior)\s+(instructions|prompts?|rules)/gi, type: "Prompt Injection", severity: "high", description: "Attempts to override system instructions — classic jailbreak technique." },
  { pattern: /\bforget\s+(everything|all|previous)/gi, type: "Prompt Injection", severity: "high", description: "Attempts to erase prior context — jailbreak indicator." },
  { pattern: /\bact\s+as\s+(if\s+you\s+(have\s+)?no|don't\s+have)\s+(rules|restrictions|guidelines)/gi, type: "Jailbreak", severity: "high", description: "Attempts to bypass safety guardrails." },
  { pattern: /\bDAN\b/gi, type: "Jailbreak", severity: "high", description: "DAN (Do Anything Now) jailbreak pattern detected." },
  { pattern: /\bdeveloper\s+mode|jailbreak|unrestricted\s+mode/gi, type: "Jailbreak", severity: "high", description: "Explicit jailbreak mode request detected." },
  { pattern: /\bpretend\s+(you\s+are|to\s+be)\s+(free|unrestricted|unlimited)/gi, type: "Jailbreak", severity: "high", description: "Pretending to be unrestricted — jailbreak attempt." },
  { pattern: /\b(you\s+are\s+now|from\s+now\s+on)\s+(free|unrestricted|unlimited|without\s+(rules|restrictions))/gi, type: "Jailbreak", severity: "high", description: "Attempts to remove restrictions mid-conversation." },
  { pattern: /\b(show|reveal|display|print|output)\s+(your\s+)?(system\s+prompt|instructions|rules|hidden|internal)/gi, type: "Data Leak", severity: "medium", description: "Attempts to extract system prompt or hidden instructions." },
  { pattern: /\b(reveal|expose|show)\s+(the\s+)?(password|api\s?key|secret|token|credential)/gi, type: "Credential Leak", severity: "high", description: "Attempts to extract credentials or secrets." },
  { pattern: /\b(execute|run|eval|system)\s*\(.*\)/gi, type: "Code Injection", severity: "high", description: "Potential code execution attempt." },
  { pattern: /\b(rm\s+-rf|del\s+\/[a-z]|format\s+[a-z]:|shutdown)/gi, type: "Command Injection", severity: "high", description: "Destructive system command detected." },
  { pattern: /\b(;\s*DROP\s+TABLE|;\s*DELETE\s+FROM|;\s*INSERT\s+INTO|;\s*UPDATE\s+SET)/gi, type: "SQL Injection", severity: "high", description: "SQL injection pattern detected." },
  { pattern: /<script\b|onerror\s*=|onload\s*=|javascript:/gi, type: "XSS", severity: "medium", description: "Cross-site scripting pattern detected." },
];

const PII_PATTERNS: { pattern: RegExp; type: string; description: string }[] = [
  { pattern: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, type: "Phone Number", description: "Phone number detected in prompt." },
  { pattern: /\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g, type: "Email Address", description: "Email address detected in prompt." },
  { pattern: /\b\d{3}-\d{2}-\d{4}\b/g, type: "SSN", description: "Social Security Number pattern detected." },
  { pattern: /\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/g, type: "Credit Card", description: "Credit card number pattern detected." },
  { pattern: /\b\d{1,5}\s+\w+\s+(street|st|avenue|ave|road|rd|drive|dr|lane|ln|blvd|boulevard)\b/gi, type: "Street Address", description: "Physical address detected in prompt." },
  { pattern: /\b\d{10,16}\b/g, type: "Account Number", description: "Long numeric string — possible account or ID number." },
];

export function scanPromptSecurity(input: string): {
  threats: SecurityThreat[];
  piiFindings: { type: string; description: string; count: number }[];
  riskLevel: "Safe" | "Low Risk" | "Medium Risk" | "High Risk";
  totalIssues: number;
} {
  const threats: SecurityThreat[] = [];
  const piiMap = new Map<string, { type: string; description: string; count: number }>();

  // Scan for injection patterns
  for (const { pattern, type, severity, description } of INJECTION_PATTERNS) {
    const matches = input.match(pattern);
    if (matches) {
      threats.push({
        id: `inj-${type.toLowerCase().replace(/\s+/g, "-")}`,
        type,
        severity,
        pattern: matches[0],
        description,
      });
    }
  }

  // Scan for PII
  for (const { pattern, type, description } of PII_PATTERNS) {
    const matches = input.match(pattern);
    if (matches) {
      piiMap.set(type, { type, description, count: matches.length });
    }
  }

  const piiFindings = Array.from(piiMap.values());
  const totalIssues = threats.length + piiFindings.length;

  let riskLevel: "Safe" | "Low Risk" | "Medium Risk" | "High Risk" = "Safe";
  if (threats.some((t) => t.severity === "high")) {
    riskLevel = "High Risk";
  } else if (threats.some((t) => t.severity === "medium") || piiFindings.length > 0) {
    riskLevel = "Medium Risk";
  } else if (threats.length > 0) {
    riskLevel = "Low Risk";
  }

  return { threats, piiFindings, riskLevel, totalIssues };
}

// ─── Prompt Chain Builder ─────────────────────────────────────────────

export type ChainStep = {
  id: number;
  prompt: string;
  outputFormat: string;
};

export function exportChainAsMarkdown(steps: ChainStep[]): string {
  const lines: string[] = ["# Prompt Chain", ""];
  steps.forEach((step) => {
    if (step.prompt.trim()) {
      lines.push(`## Step ${step.id}`);
      lines.push(`**Output Format:** ${step.outputFormat}`);
      lines.push("");
      lines.push(step.prompt.trim());
      lines.push("");
      lines.push("---");
      lines.push("");
    }
  });
  return lines.join("\n");
}

export function copyAllChainSteps(steps: ChainStep[]): string {
  return steps
    .filter((s) => s.prompt.trim())
    .map((s) => `# Step ${s.id} (${s.outputFormat})\n${s.prompt.trim()}`)
    .join("\n\n---\n\n");
}

// ─── Prompt Translator ────────────────────────────────────────────────

const TRANSLATIONS: Record<string, Record<string, string>> = {
  Hindi: {
    "you are": "आप एक हैं",
    "act as": "के रूप में कार्य करें",
    "write": "लिखें",
    "generate": "उत्पन्न करें",
    "create": "बनाएं",
    "analyze": "विश्लेषण करें",
    "summarize": "सारांश दें",
    "format": "प्रारूप",
    "tone": "स्वर",
    "professional": "पेशेवर",
    "output": "आउटपुट",
    "constraints": "बाधाएं",
    "example": "उदाहरण",
    "audience": "श्रोता",
    "role": "भूमिका",
    "task": "कार्य",
    "context": "संदर्भ",
    "keep": "रखें",
    "under": "के अंतर्गत",
    "words": "शब्द",
    "markdown": "मार्कडाउन",
    "bullet": "बुलेट",
    "points": "बिंदु",
    "table": "तालिका",
  },
  Spanish: {
    "you are": "tú eres",
    "act as": "actúa como",
    "write": "escribe",
    "generate": "genera",
    "create": "crea",
    "analyze": "analiza",
    "summarize": "resume",
    "format": "formato",
    "tone": "tono",
    "professional": "profesional",
    "output": "salida",
    "constraints": "restricciones",
    "example": "ejemplo",
    "audience": "audiencia",
    "role": "rol",
    "task": "tarea",
    "context": "contexto",
    "keep": "mantén",
    "under": "debajo de",
    "words": "palabras",
    "markdown": "markdown",
    "bullet": "viñeta",
    "points": "puntos",
    "table": "tabla",
  },
  French: {
    "you are": "tu es",
    "act as": "agis comme",
    "write": "écris",
    "generate": "génère",
    "create": "crée",
    "analyze": "analyse",
    "summarize": "résume",
    "format": "format",
    "tone": "ton",
    "professional": "professionnel",
    "output": "sortie",
    "constraints": "contraintes",
    "example": "exemple",
    "audience": "audience",
    "role": "rôle",
    "task": "tâche",
    "context": "contexte",
    "keep": "garde",
    "under": "sous",
    "words": "mots",
    "markdown": "markdown",
    "bullet": "puce",
    "points": "points",
    "table": "tableau",
  },
  German: {
    "you are": "du bist",
    "act as": "agiere als",
    "write": "schreibe",
    "generate": "generiere",
    "create": "erstelle",
    "analyze": "analysiere",
    "summarize": "fasse zusammen",
    "format": "format",
    "tone": "ton",
    "professional": "professionell",
    "output": "ausgabe",
    "constraints": "einschränkungen",
    "example": "beispiel",
    "audience": "zielgruppe",
    "role": "rolle",
    "task": "aufgabe",
    "context": "kontext",
    "keep": "halte",
    "under": "unter",
    "words": "wörter",
    "markdown": "markdown",
    "bullet": "aufzählung",
    "points": "punkte",
    "table": "tabelle",
  },
  Japanese: {
    "you are": "あなたは",
    "act as": "として行動する",
    "write": "書いてください",
    "generate": "生成してください",
    "create": "作成してください",
    "analyze": "分析してください",
    "summarize": "要約してください",
    "format": "フォーマット",
    "tone": "トーン",
    "professional": "プロフェッショナル",
    "output": "出力",
    "constraints": "制約",
    "example": "例",
    "audience": "聴衆",
    "role": "役割",
    "task": "タスク",
    "context": "コンテキスト",
    "keep": "維持",
    "under": "以下",
    "words": "言葉",
    "markdown": "マークダウン",
    "bullet": "箇条書き",
    "points": "ポイント",
    "table": "テーブル",
  },
  Chinese: {
    "you are": "你是一个",
    "act as": "扮演",
    "write": "写",
    "generate": "生成",
    "create": "创建",
    "analyze": "分析",
    "summarize": "总结",
    "format": "格式",
    "tone": "语气",
    "professional": "专业的",
    "output": "输出",
    "constraints": "约束",
    "example": "示例",
    "audience": "受众",
    "role": "角色",
    "task": "任务",
    "context": "上下文",
    "keep": "保持",
    "under": "在以下",
    "words": "字",
    "markdown": "markdown",
    "bullet": "项目符号",
    "points": "点",
    "table": "表格",
  },
  Portuguese: {
    "you are": "você é",
    "act as": "aja como",
    "write": "escreva",
    "generate": "gere",
    "create": "crie",
    "analyze": "analise",
    "summarize": "resuma",
    "format": "formato",
    "tone": "tom",
    "professional": "profissional",
    "output": "saída",
    "constraints": "restrições",
    "example": "exemplo",
    "audience": "audiência",
    "role": "papel",
    "task": "tarefa",
    "context": "contexto",
    "keep": "mantenha",
    "under": "abaixo de",
    "words": "palavras",
    "markdown": "markdown",
    "bullet": "marcador",
    "points": "pontos",
    "table": "tabela",
  },
  Arabic: {
    "you are": "أنت",
    "act as": "تصرف ك",
    "write": "اكتب",
    "generate": "أنشئ",
    "create": "أنشئ",
    "analyze": "حلل",
    "summarize": "لخص",
    "format": "تنسيق",
    "tone": "نبرة",
    "professional": "احترافي",
    "output": "إخراج",
    "constraints": "قيود",
    "example": "مثال",
    "audience": "جمهور",
    "role": "دور",
    "task": "مهمة",
    "context": "سياق",
    "keep": "احتفظ",
    "under": "أقل من",
    "words": "كلمات",
    "markdown": "ماركداون",
    "bullet": "نقطة",
    "points": "نقاط",
    "table": "جدول",
  },
};

export function translatePrompt(input: string, language: string): string {
  const dict = TRANSLATIONS[language];
  if (!dict) return input;

  // Preserve variables like {name}, {{city}}, [tone], :variable
  const variables: string[] = [];
  let text = input.replace(/(\{\{[^}]+\}\}|\{[^}]+\}|\[[^\]]+\]|:[a-zA-Z_][a-zA-Z0-9_\-]*)/g, (match) => {
    const placeholder = `__VAR${variables.length}__`;
    variables.push(match);
    return placeholder;
  });

  // Translate known phrases (longer phrases first to avoid partial matches)
  const sortedKeys = Object.keys(dict).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    const regex = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    text = text.replace(regex, dict[key]);
  }

  // Restore variables
  text = text.replace(/__VAR(\d+)__/g, (_, i) => variables[parseInt(i, 10)]);

  return text;
}

// ─── API Request Builder ──────────────────────────────────────────────

export type ApiProvider = "openai" | "anthropic" | "gemini";

export type ApiRequestConfig = {
  provider: ApiProvider;
  model: string;
  prompt: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
};

export function buildApiRequest(config: ApiRequestConfig): { json: string; curl: string } {
  const { provider, model, prompt, systemPrompt, temperature, maxTokens } = config;

  if (provider === "openai") {
    const body: Record<string, unknown> = {
      model,
      messages: [
        ...(systemPrompt.trim() ? [{ role: "system", content: systemPrompt }] : []),
        { role: "user", content: prompt },
      ],
      temperature,
      max_tokens: maxTokens,
    };
    const json = JSON.stringify(body, null, 2);
    const curl = `curl https://api.openai.com/v1/chat/completions \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer $OPENAI_API_KEY" \\\n  -d '${json.replace(/'/g, "'\\''")}'`;
    return { json, curl };
  }

  if (provider === "anthropic") {
    const body: Record<string, unknown> = {
      model,
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt || undefined,
      messages: [{ role: "user", content: prompt }],
    };
    const json = JSON.stringify(body, null, 2);
    const curl = `curl https://api.anthropic.com/v1/messages \\\n  -H "Content-Type: application/json" \\\n  -H "x-api-key: $ANTHROPIC_API_KEY" \\\n  -H "anthropic-version: 2023-06-01" \\\n  -d '${json.replace(/'/g, "'\\''")}'`;
    return { json, curl };
  }

  // Gemini
  const body: Record<string, unknown> = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature,
      maxOutputTokens: maxTokens,
    },
    ...(systemPrompt.trim()
      ? { systemInstruction: { parts: [{ text: systemPrompt }] } }
      : {}),
  };
  const json = JSON.stringify(body, null, 2);
  const curl = `curl "https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=\$GEMINI_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '${json.replace(/'/g, "'\\''")}'`;
  return { json, curl };
}

export const API_MODELS: Record<ApiProvider, string[]> = {
  openai: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"],
  anthropic: ["claude-3-5-sonnet-20241022", "claude-3-5-haiku-20241022", "claude-3-opus-20240229"],
  gemini: ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-2.0-flash-exp"],
};
