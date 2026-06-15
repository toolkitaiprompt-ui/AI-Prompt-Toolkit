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