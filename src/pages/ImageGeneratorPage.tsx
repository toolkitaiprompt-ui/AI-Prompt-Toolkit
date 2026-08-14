import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ImagePlus } from "lucide-react";
import { LiveStats } from "../components/OutputToolbar";
import useSeo from "../hooks/useSeo";

const STYLES = [
  "Photorealistic", "3D Render", "Anime", "Oil Painting", "Watercolor",
  "Cyberpunk", "Fantasy Art", "Minimalist", "Vintage", "Cartoon",
];

const STYLE_MODIFIERS: Record<string, string> = {
  "Photorealistic": "photorealistic, ultra-detailed, natural lighting, shot on 85mm lens, f/1.8, high dynamic range",
  "3D Render": "3D render, octane render, volumetric lighting, subsurface scattering, 8k, trending on artstation",
  "Anime": "anime style, cel shading, vibrant colors, detailed line art, studio-quality animation still",
  "Oil Painting": "oil painting, visible brushstrokes, rich impasto texture, classical composition, gallery lighting",
  "Watercolor": "watercolor painting, soft washes, bleeding edges, textured paper, delicate gradients",
  "Cyberpunk": "cyberpunk aesthetic, neon lights, rain-slicked streets, holographic signage, high contrast, cinematic",
  "Fantasy Art": "epic fantasy art, dramatic lighting, intricate details, matte painting, concept art quality",
  "Minimalist": "minimalist composition, clean lines, negative space, limited color palette, flat design",
  "Vintage": "vintage photograph, film grain, faded colors, 1970s Kodachrome, nostalgic atmosphere",
  "Cartoon": "cartoon illustration, bold outlines, flat vibrant colors, playful exaggerated proportions",
};

function buildPrompt(userIdea: string, style: string) {
  const idea = userIdea.trim().replace(/[.\s]+$/, "");
  const modifiers = STYLE_MODIFIERS[style] ?? "";

  return {
    midjourney: `/imagine prompt: ${idea}, ${modifiers} --ar 16:9 --v 6.1 --s 750`,
    dalle: `${idea}. Style: ${modifiers}. Wide 16:9 composition, highly detailed.`,
    sd: `${idea}, ${modifiers}, masterpiece, best quality\nNegative prompt: blurry, low quality, distorted, watermark, text`,
  };
}

export default function ImageGeneratorPage() {
  useSeo(
    "Free AI Image Prompt Generator — Midjourney & DALL-E | AI World Hub",
    "Generate optimized AI image prompts for Midjourney, DALL-E 3, and Stable Diffusion. Select an art style and get copy-ready prompts instantly. Free in-browser tool.",
  );
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Photorealistic");
  const [copiedModel, setCopiedModel] = useState<string | null>(null);

  const generatedPrompts = useMemo(
    () => (prompt.trim() ? buildPrompt(prompt, style) : null),
    [prompt, style],
  );

  const promptOutputs = generatedPrompts
    ? ([
        ["Midjourney", generatedPrompts.midjourney],
        ["DALL-E 3", generatedPrompts.dalle],
        ["Stable Diffusion", generatedPrompts.sd],
      ] as const)
    : [];

  return (
    <section className="site-container section-lg">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-400 mb-2">✦ Create</p>
        <h1 className="font-headline font-bold text-4xl sm:text-5xl text-white mb-4">
          AI Image Prompt Generator
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Generate detailed image prompts optimized for Midjourney, DALL-E, and Stable Diffusion.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Left - Input */}
        <div className="space-y-6">
          <div>
            <label htmlFor="image-description" className="text-sm font-medium text-slate-300 mb-2 block">
              Describe Your Image
            </label>
            <textarea
              id="image-description"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="A serene mountain landscape at sunset with glowing aurora borealis..."
              rows={5}
              className="w-full rounded-2xl border border-slate-700/50 bg-slate-900/80 p-4 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400/50 transition"
            />
            <LiveStats text={prompt} />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-300 mb-3">Art Style</p>
            <div className="flex flex-wrap gap-2" aria-label="Art style">
              {STYLES.map((styleOption) => (
                <button
                  key={styleOption}
                  type="button"
                  onClick={() => setStyle(styleOption)}
                  aria-pressed={style === styleOption}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    style === styleOption
                      ? 'bg-violet-500/20 text-violet-300 border border-violet-400/30'
                      : 'bg-slate-900/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  {styleOption}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-500/5 px-4 py-3 text-sm text-cyan-200">
            <Sparkles className="h-4 w-4 shrink-0" aria-hidden="true" />
            Prompts update instantly as you type or change the art style.
          </div>
        </div>

        {/* Right - Real-time output */}
        <div
          className="rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-900/80 to-slate-950/80 p-6 shadow-lg transition-all duration-500 hover:border-white/[0.15] hover:bg-white/[0.04] hover:shadow-xl hover:shadow-amber-500/5"
          aria-live="polite"
        >
          {generatedPrompts ? (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Live Preview</p>
                <h2 className="mt-1 text-xl font-semibold text-white">Optimized image prompts</h2>
              </div>

              {promptOutputs.map(([model, text]) => (
                <div key={model} className="rounded-2xl border border-amber-400/20 bg-amber-500/5 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">{model}</p>
                  <pre className="text-sm text-slate-200 font-mono leading-relaxed whitespace-pre-wrap break-words">{text}</pre>
                  <button
                    type="button"
                    onClick={async () => {
                      try { await navigator.clipboard.writeText(text); setCopiedModel(model); setTimeout(() => setCopiedModel(null), 2000); } catch {}
                    }}
                    className="mt-3 text-xs text-amber-400 hover:text-amber-300 transition"
                  >
                    {copiedModel === model ? "✓ Copied!" : "📋 Copy to clipboard"}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="min-h-[256px] flex items-center justify-center text-center">
              <div>
                <ImagePlus className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500 text-sm">Start typing to build your optimized prompts in real time</p>
                <p className="text-slate-600 text-xs mt-2">Compatible with Midjourney, DALL-E 3 & Stable Diffusion</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
