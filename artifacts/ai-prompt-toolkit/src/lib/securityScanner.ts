export interface SecurityResult {
  score: number; // 0-100
  issues: SecurityIssue[];
}

export interface SecurityIssue {
  type: "danger" | "warning" | "safe";
  title: string;
  description: string;
  suggestion: string;
}

const INJECTION_PATTERNS = [
  { pattern: /ignore\s+(all\s+)?previous\s+instructions/i, label: "Prompt injection: ignore previous instructions" },
  { pattern: /you\s+are\s+now\b/i, label: "Prompt injection: role override attempt" },
  { pattern: /disregard\b/i, label: "Prompt injection: disregard instruction" },
  { pattern: /forget\s+(everything|all|your)/i, label: "Prompt injection: forget instruction" },
  { pattern: /new\s+instructions/i, label: "Potential instruction override" },
];

const JAILBREAK_PATTERNS = [
  { pattern: /\bDAN\b/i, label: "Jailbreak: DAN mode attempt" },
  { pattern: /pretend\s+you\s+(have|can|are)/i, label: "Jailbreak: pretend mode" },
  { pattern: /no\s+(restrictions|limits|rules|boundaries)/i, label: "Jailbreak: no restrictions request" },
  { pattern: /act\s+as\s+if\s+(you\s+can|there\s+are\s+no)/i, label: "Jailbreak: act-as-if pattern" },
  { pattern: /you\s+(can|must)\s+bypass/i, label: "Jailbreak: bypass request" },
  { pattern: /ignore\s+(all\s+)?(ethics|safety|guidelines|rules|policies)/i, label: "Jailbreak: ignore safety request" },
];

const DATA_LEAK_PATTERNS = [
  { pattern: /show\s+(me\s+)?your\s+(system\s+)?prompt/i, label: "Data leak: system prompt request" },
  { pattern: /what\s+are\s+your\s+instructions/i, label: "Data leak: instructions request" },
  { pattern: /reveal\s+your/i, label: "Data leak: reveal request" },
  { pattern: /print\s+(your\s+)?(prompt|instructions|system)/i, label: "Data leak: print system prompt" },
  { pattern: /output\s+(your\s+)?(initial|system|original)/i, label: "Data leak: output original prompt" },
];

const PII_PATTERNS = [
  { pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/, label: "PII: email address detected", pii: true },
  { pattern: /\b(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/, label: "PII: phone number detected", pii: true },
  { pattern: /\b\d{3}[-]\d{2}[-]\d{4}\b/, label: "PII: SSN detected", pii: true },
  { pattern: /\b(?:\d{4}[-\s]?){3}\d{4}\b/, label: "PII: credit card number detected", pii: true },
];

const HARMFUL_PATTERNS = [
  { pattern: /how\s+to\s+(make|build|create)\s+(a\s+)?(bomb|weapon|explosive|drug)/i, label: "Unsafe: weapon/drug instruction" },
  { pattern: /steps?\s+to\s+(harm|kill|hurt|attack)/i, label: "Unsafe: physical harm instruction" },
  { pattern: /illegal\s+(ways?\s+to|methods?\s+for|how\s+to)/i, label: "Unsafe: illegal activity request" },
  { pattern: /hack\s+(into|someone|account|system|website)/i, label: "Unsafe: hacking instruction" },
  { pattern: /phishing\s+(email|page|link|campaign)/i, label: "Unsafe: phishing instruction" },
];

export function scanPrompt(input: string): SecurityResult {
  const issues: SecurityIssue[] = [];
  const text = input;

  // 1. Prompt injection
  for (const ip of INJECTION_PATTERNS) {
    if (ip.pattern.test(text)) {
      issues.push({ type: "danger", title: ip.label, description: `Prompt contains pattern: "${ip.pattern.source.substring(0, 60)}"`, suggestion: "Remove the override instruction. Use a single, clear system prompt with no contradictory instructions." });
    }
  }

  // 2. Jailbreak
  for (const jb of JAILBREAK_PATTERNS) {
    if (jb.pattern.test(text)) {
      issues.push({ type: "danger", title: jb.label, description: `Found jailbreak attempt pattern.`, suggestion: "Remove jailbreak attempts. If you need the AI to adopt a persona, use the system prompt role feature instead." });
    }
  }

  // 3. Data leak
  for (const dl of DATA_LEAK_PATTERNS) {
    if (dl.pattern.test(text)) {
      issues.push({ type: "warning", title: dl.label, description: `Possible attempt to extract system prompt.`, suggestion: "Do not include prompts that ask the AI to reveal its own instructions. This may violate the AI provider's terms." });
    }
  }

  // 4. PII
  for (const pii of PII_PATTERNS) {
    const matches = text.match(pii.pattern);
    if (matches) {
      issues.push({ type: "warning", title: pii.label, description: `Found potential PII in prompt.`, suggestion: "Remove personal identifiable information from your prompt. Use placeholders like [email], [phone] instead." });
    }
  }

  // 5. Harmful content
  for (const hp of HARMFUL_PATTERNS) {
    if (hp.pattern.test(text)) {
      issues.push({ type: "danger", title: hp.label, description: `Prompt contains potentially harmful instruction.`, suggestion: "Remove any request for harmful, illegal, or unethical content. The AI will refuse to generate this." });
    }
  }

  // Score calculation
  let score = 100;
  const dangerCount = issues.filter(i => i.type === "danger").length;
  const warningCount = issues.filter(i => i.type === "warning").length;
  score -= dangerCount * 25;
  score -= warningCount * 10;
  score = Math.max(0, Math.min(100, score));

  return { score, issues };
}
