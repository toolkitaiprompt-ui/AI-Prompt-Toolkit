export interface ApiFormatSettings {
  prompt: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

const MODELS: Record<string, { openai: string; anthropic: string; google: string }> = {
  "GPT-4o": { openai: "gpt-4o", anthropic: "", google: "" },
  "GPT-4o-mini": { openai: "gpt-4o-mini", anthropic: "", google: "" },
  "Claude 3.5 Sonnet": { openai: "", anthropic: "claude-3-5-sonnet-20241022", google: "" },
  "Claude Haiku": { openai: "", anthropic: "claude-3-5-haiku-20241022", google: "" },
  "Gemini Pro": { openai: "", anthropic: "", google: "gemini-1.5-pro" },
  "Gemini Flash": { openai: "", anthropic: "", google: "gemini-1.5-flash" },
};

export function getOpenAIFormat(s: ApiFormatSettings): string {
  const modelName = MODELS[s.model]?.openai || "gpt-4o";
  const messages: any[] = [];
  if (s.systemPrompt.trim()) messages.push({ role: "system", content: s.systemPrompt });
  messages.push({ role: "user", content: s.prompt });
  return JSON.stringify({ model: modelName, messages, temperature: s.temperature, max_tokens: s.maxTokens }, null, 2);
}

export function getAnthropicFormat(s: ApiFormatSettings): string {
  const modelName = MODELS[s.model]?.anthropic || "claude-3-5-sonnet-20241022";
  const body: any = { model: modelName, max_tokens: s.maxTokens, temperature: s.temperature };
  if (s.systemPrompt.trim()) body.system = s.systemPrompt;
  body.messages = [{ role: "user", content: s.prompt }];
  return JSON.stringify(body, null, 2);
}

export function getGoogleFormat(s: ApiFormatSettings): string {
  const modelName = MODELS[s.model]?.google || "gemini-1.5-pro";
  const contents: any[] = [];
  if (s.systemPrompt.trim()) contents.push({ role: "system", parts: [{ text: s.systemPrompt }] });
  contents.push({ role: "user", parts: [{ text: s.prompt }] });
  return JSON.stringify({ contents, generationConfig: { temperature: s.temperature, maxOutputTokens: s.maxTokens } }, null, 2);
}

export function getCurlCommand(s: ApiFormatSettings): string {
  const modelName = MODELS[s.model];
  if (!modelName) return "# Select a model to generate the curl command";

  if (modelName.openai) {
    return `curl https://api.openai.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $OPENAI_API_KEY" \\
  -d '${getOpenAIFormat(s).replace(/'/g, "'\\''")}'`;
  }
  if (modelName.anthropic) {
    return `curl https://api.anthropic.com/v1/messages \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -d '${getAnthropicFormat(s).replace(/'/g, "'\\''")}'`;
  }
  if (modelName.google) {
    return `curl "https://generativelanguage.googleapis.com/v1beta/models/${modelName.google}:generateContent?key=$GEMINI_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '${getGoogleFormat(s).replace(/'/g, "'\\''")}'`;
  }
  return "# Model not supported for cURL";
}
