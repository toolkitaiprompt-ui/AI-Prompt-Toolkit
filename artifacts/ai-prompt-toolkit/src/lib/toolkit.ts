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

export type TokenEstimate = {
  characters: number;
  words: number;
  modelEstimates: ModelTokenEstimate[];
};

export type ModelTokenEstimate = {
  model: string;
  tokens: number;
  costPer1MInput: number;
  costPer1MOutput: number;
  inputCost: number;
  outputCost: number;
  isCheapest: boolean;
};

const MODELS = [
  { name: "GPT-4o", charsPerToken: 4, costPer1MInput: 3, costPer1MOutput: 12 },
  { name: "Claude 3.5 Sonnet", charsPerToken: 3.7, costPer1MInput: 3, costPer1MOutput: 15 },
  { name: "Gemini 1.5 Pro", charsPerToken: 4.2, costPer1MInput: 1.25, costPer1MOutput: 5 },
  { name: "DeepSeek V3", charsPerToken: 4, costPer1MInput: 0.5, costPer1MOutput: 2 },
  { name: "Llama 3 (Together)", charsPerToken: 3.8, costPer1MInput: 0.9, costPer1MOutput: 0.9 },
];

export function estimateTokens(input: string): TokenEstimate {
  const characters = input.length;
  const words = input.trim() ? input.trim().split(/\s+/).length : 0;

  const modelEstimates: ModelTokenEstimate[] = MODELS.map((m) => {
    const charTokens = Math.ceil(characters / m.charsPerToken);
    const wordTokens = Math.ceil(words * 1.3);
    const tokens = Math.max(charTokens, wordTokens);

    const inputCost = (tokens / 1_000_000) * m.costPer1MInput;
    const outputCost = (tokens / 1_000_000) * m.costPer1MOutput;

    return {
      model: m.name,
      tokens,
      costPer1MInput: m.costPer1MInput,
      costPer1MOutput: m.costPer1MOutput,
      inputCost,
      outputCost,
      isCheapest: false,
    };
  });

  const minInputCost = Math.min(...modelEstimates.map((m) => m.inputCost));
  for (const m of modelEstimates) {
    if (m.inputCost === minInputCost) m.isCheapest = true;
  }

  return { characters, words, modelEstimates };
}
