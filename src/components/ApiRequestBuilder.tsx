import { useState, useMemo } from 'react';
import { Code2, Terminal } from 'lucide-react';
import { buildApiRequest, API_MODELS, type ApiProvider } from '../lib/toolkit';
import OutputToolbar, { LiveStats } from './OutputToolbar';
import { ToolGuide } from './ToolGuide';

const PROVIDERS: { id: ApiProvider; name: string; color: string }[] = [
  { id: 'openai', name: 'OpenAI (GPT)', color: 'from-emerald-500 to-green-500' },
  { id: 'anthropic', name: 'Anthropic (Claude)', color: 'from-amber-500 to-orange-500' },
  { id: 'gemini', name: 'Google Gemini', color: 'from-blue-500 to-cyan-500' },
];

export default function ApiRequestBuilder() {
  const [provider, setProvider] = useState<ApiProvider>('openai');
  const [model, setModel] = useState(API_MODELS.openai[0]);
  const [prompt, setPrompt] = useState('Write a concise summary of the quarterly business performance.');
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful business analyst assistant.');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1000);

  const result = useMemo(
    () => buildApiRequest({ provider, model, prompt, systemPrompt, temperature, maxTokens }),
    [provider, model, prompt, systemPrompt, temperature, maxTokens],
  );

  const handleProviderChange = (newProvider: ApiProvider) => {
    setProvider(newProvider);
    setModel(API_MODELS[newProvider][0]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
        <Code2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-sm text-slate-300">
          <p className="font-medium text-emerald-300">API Request Builder</p>
          <p className="mt-1">Build API request bodies and cURL commands for OpenAI, Anthropic, and Gemini. Configure model, temperature, and max tokens. Copy ready-to-use code instantly.</p>
        </div>
      </div>

      {/* Provider Selector */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">API Provider</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PROVIDERS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleProviderChange(p.id)}
              className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                provider === p.id
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                  : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-600'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Configuration */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-300">Model</span>
            <select
              className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400/60"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              aria-label="Select model"
            >
              {API_MODELS[provider].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-300">Temperature ({temperature})</span>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-emerald-500"
              aria-label="Temperature"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-300">Max Tokens ({maxTokens})</span>
            <input
              type="range"
              min="100"
              max="4000"
              step="100"
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-500"
              aria-label="Max tokens"
            />
          </label>
        </div>
      </div>

      {/* Prompts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-300">System Prompt</span>
          <textarea
            className="h-28 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20 resize-none"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="System prompt (optional)..."
            aria-label="System prompt"
          />
          <LiveStats text={systemPrompt} />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-300">User Prompt</span>
          <textarea
            className="h-28 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20 resize-none"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="User prompt..."
            aria-label="User prompt"
          />
          <LiveStats text={prompt} />
        </label>
      </div>

      {/* JSON Output */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex items-center gap-2 mb-3">
          <Code2 className="h-5 w-5 text-emerald-400" />
          <h3 className="text-base font-semibold text-white">Request Body (JSON)</h3>
        </div>
        <OutputToolbar text={result.json} fileName="request.json" fileMime="application/json" className="mb-2" />
        <pre className="overflow-auto rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-slate-300 whitespace-pre-wrap break-words min-h-[120px]">
          {result.json}
        </pre>
      </div>

      {/* cURL Output */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex items-center gap-2 mb-3">
          <Terminal className="h-5 w-5 text-amber-400" />
          <h3 className="text-base font-semibold text-white">cURL Command</h3>
        </div>
        <OutputToolbar text={result.curl} fileName="request.sh" className="mb-2" />
        <pre className="overflow-auto rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-slate-300 whitespace-pre-wrap break-words min-h-[80px] font-mono">
          {result.curl}
        </pre>
      </div>

      <ToolGuide
        intro="The API Request Builder creates ready-to-run JSON and cURL requests for OpenAI, Anthropic (Claude), and Google Gemini — with model selection, temperature, max tokens, and a system prompt. It is made for developers building AI features, students learning LLM APIs, and makers prototyping chatbots without hunting through API docs."
        steps={[
          "Pick a provider — OpenAI, Anthropic, or Gemini — and choose a model from the list.",
          "Write your system prompt (the instructions) and user prompt (the task).",
          "Set the temperature and max tokens to control creativity and output length.",
          "Copy the generated JSON body or the cURL command from the output panel.",
          "Paste the cURL command into your terminal (or the JSON into your code) with your API key and run it.",
        ]}
        example={{
          title: "From idea to cURL request in seconds.",
          before:
            "I want to call the OpenAI API to summarize text with GPT-4o mini. I will set temperature to 0.3 and max tokens to 200.",
          after:
            "curl https://api.openai.com/v1/chat/completions \\\n  -H \"Authorization: Bearer $OPENAI_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"model\":\"gpt-4o-mini\",\"messages\":[{\"role\":\"system\",\"content\":\"You are a helpful summarizer.\"},{\"role\":\"user\",\"content\":\"Summarize this article in 3 bullets.\"}],\"temperature\":0.3,\"max_tokens\":200}'",
          note: "The tool writes the correct endpoint, headers, and body format for each provider, so you skip the documentation lookup. Use the Token Estimator first to check your prompt stays inside the model's context window.",
        }}
      />
    </div>
  );
}
