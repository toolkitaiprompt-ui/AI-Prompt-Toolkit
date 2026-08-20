import { useState, useMemo } from 'react';
import { Languages } from 'lucide-react';
import { translatePrompt } from '../lib/toolkit';
import OutputToolbar, { LiveStats } from './OutputToolbar';
import { ToolGuide } from './ToolGuide';

const LANGUAGES = [
  { code: 'Hindi', flag: '🇮🇳', sample: 'हिंदी' },
  { code: 'Spanish', flag: '🇪🇸', sample: 'Español' },
  { code: 'French', flag: '🇫🇷', sample: 'Français' },
  { code: 'German', flag: '🇩🇪', sample: 'Deutsch' },
  { code: 'Japanese', flag: '🇯🇵', sample: '日本語' },
  { code: 'Chinese', flag: '🇨🇳', sample: '中文' },
  { code: 'Portuguese', flag: '🇵🇹', sample: 'Português' },
  { code: 'Arabic', flag: '🇸🇦', sample: 'العربية' },
];

export default function PromptTranslator() {
  const [input, setInput] = useState('You are a marketing expert. Write a professional email for {product_name} targeting {audience}. Keep the tone professional. Output as markdown with bullet points.');
  const [selectedLang, setSelectedLang] = useState('Hindi');

  const translated = useMemo(() => translatePrompt(input, selectedLang), [input, selectedLang]);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-4">
        <Languages className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-sm text-slate-300">
          <p className="font-medium text-cyan-300">Prompt Translator</p>
          <p className="mt-1">Translate your AI prompts into 8 languages while preserving variables like {`{name}`}, {`{{city}}`}, and {`[tone]`}. Perfect for multi-locale prompt engineering.</p>
        </div>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-300">Your Prompt (English)</span>
        <textarea
          className="h-40 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 resize-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your prompt in English..."
          aria-label="Prompt to translate"
        />
        <LiveStats text={input} />
      </label>

      {/* Language Selector */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">Select Target Language</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setSelectedLang(lang.code)}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                selectedLang === lang.code
                  ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                  : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-600'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="truncate">{lang.code}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Translated Output */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <h3 className="text-base font-semibold text-white mb-3">Translated Prompt ({selectedLang})</h3>
        <OutputToolbar text={translated} fileName="translated-prompt.txt" className="mb-2" />
        <pre className="overflow-auto rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-300 whitespace-pre-wrap break-words min-h-[120px]">
          {translated || 'Translated prompt will appear here...'}
        </pre>
      </div>

      <ToolGuide
        intro="The Prompt Translator converts your English prompts into 8 languages — Hindi, Spanish, French, German, Japanese, Chinese, Portuguese, and Arabic — while keeping placeholders like {name}, {{city}}, and [tone] untouched. It is built for content teams working across markets, freelancers serving international clients, developers building multilingual apps, and students practising prompts in another language."
        steps={[
          "Paste your English prompt into the text area. The translation updates live as you type.",
          "Pick a target language from the grid — Hindi, Spanish, French, German, Japanese, Chinese, Portuguese, or Arabic.",
          "Read the translated prompt in the output panel. Note how placeholders like {name} and {{city}} stay exactly as they were.",
          "If you use prompts with variables, keep the same variable names in the English original so they survive the translation.",
          "Click Copy and paste the translated prompt into your AI chatbot in that language — ChatGPT, Claude, or Gemini respond in the same language.",
        ]}
        example={{
          title: "The same prompt, ready for a Hindi-speaking audience — variables intact.",
          before:
            "You are a marketing expert. Write a professional email for {product_name} targeting {audience}. Keep the tone professional. Output as markdown with bullet points.",
          after:
            "आप एक marketing expert हैं। {product_name} के लिए एक professional email लिखें जो {audience} को target करता है। Tone professional रखें और bullet points के साथ markdown में output करें।",
          note: "The instructions are translated into Hindi, while {product_name} and {audience} stay in place — so the same workflow keeps working across all 8 languages without breaking your templates.",
        }}
      />
    </div>
  );
}
