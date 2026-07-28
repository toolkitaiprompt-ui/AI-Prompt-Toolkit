import { useState, useMemo } from 'react';
import { Copy, CheckCircle2, Code2, Terminal } from 'lucide-react';
import { buildApiRequest, API_MODELS, type ApiProvider } from '../lib/toolkit';

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
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const result = useMemo(
    () => buildApiRequest({ provider, model, prompt, systemPrompt, temperature, maxTokens }),
    [provider, model, prompt, systemPrompt, temperature, maxTokens],
  );

  const handleProviderChange = (newProvider: ApiProvider) => {
    setProvider(newProvider);
    setModel(API_MODELS[newProvider][0]);
  };

  const copyText = (text: string, which: 'json' | 'curl') => {
    navigator.clipboard.writeText(text);
    if (which === 'json') {
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    } else {
      setCopiedCurl(true);
      setTimeout(() => setCopiedCurl(false), 2000);
    }
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
        </label>
      </div>

      {/* JSON Output */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-emerald-400" />
            <h3 className="text-base font-semibold text-white">Request Body (JSON)</h3>
          </div>
          <button
            type="button"
            onClick={() => copyText(result.json, 'json')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-slate-800"
          >
            {copiedJson ? <><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Copied!</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
          </button>
        </div>
        <pre className="overflow-auto rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-slate-300 whitespace-pre-wrap break-words min-h-[120px]">
          {result.json}
        </pre>
      </div>

      {/* cURL Output */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-amber-400" />
            <h3 className="text-base font-semibold text-white">cURL Command</h3>
          </div>
          <button
            type="button"
            onClick={() => copyText(result.curl, 'curl')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-slate-800"
          >
            {copiedCurl ? <><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Copied!</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
          </button>
        </div>
        <pre className="overflow-auto rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-slate-300 whitespace-pre-wrap break-words min-h-[80px] font-mono">
          {result.curl}
        </pre>
      </div>
    </div>
  );
}
