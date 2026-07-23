import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ImagePlus } from "lucide-react";

const STYLES = [
  "Photorealistic", "3D Render", "Anime", "Oil Painting", "Watercolor",
  "Cyberpunk", "Fantasy Art", "Minimalist", "Vintage", "Cartoon",
];

const MOCK_IMAGES = [
  { url: "", label: "Your generated image will appear here" },
];

export default function ImageGeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Photorealistic");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2000);
  };

  return (
    <section className="site-container py-16 lg:py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400 mb-2">✦ Create</p>
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
            <label className="text-sm font-medium text-slate-300 mb-2 block">Describe Your Image</label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="A serene mountain landscape at sunset with glowing aurora borealis..."
              rows={5}
              className="w-full rounded-2xl border border-slate-700/50 bg-slate-900/80 p-4 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400/50 transition"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 mb-3 block">Art Style</label>
            <div className="flex flex-wrap gap-2">
              {STYLES.map(s => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    style === s
                      ? "bg-violet-500/20 text-violet-300 border border-violet-400/30"
                      : "bg-slate-900/50 text-slate-400 border border-slate-700/50 hover:border-slate-600"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || generating}
            className="btn-primary w-full justify-center"
          >
            {generating ? (
              <>✨ Generating...</>
            ) : (
              <><Sparkles className="w-5 h-5" /> Generate Prompt</>
            )}
          </button>

          {generated && (
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">Optimized Prompt</p>
              <pre className="text-sm text-slate-200 font-mono leading-relaxed whitespace-pre-wrap">
                {`/${style === "Photorealistic" ? "imagine" : "create"} ${prompt} --style ${style.toLowerCase().replace(" ", "-")} --ar 16:9 --v 6.1 --s 750`}
              </pre>
              <button
                onClick={() => navigator.clipboard.writeText(`${style === "Photorealistic" ? "/imagine" : "/create"} ${prompt} --style ${style.toLowerCase().replace(" ", "-")} --ar 16:9 --v 6.1 --s 750`)}
                className="mt-3 text-xs text-cyan-400 hover:text-cyan-300 transition"
              >
                📋 Copy to clipboard
              </button>
            </div>
          )}
        </div>

        {/* Right - Preview */}
        <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/80 to-slate-950/80 p-8 flex items-center justify-center min-h-[320px]">
          {generating ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 animate-pulse mx-auto mb-4" />
              <p className="text-slate-400 text-sm">Generating your prompt...</p>
            </div>
          ) : (
            <div className="text-center">
              <ImagePlus className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 text-sm">Your optimized image prompt will appear here</p>
              <p className="text-slate-600 text-xs mt-2">Compatible with Midjourney, DALL-E 3 & Stable Diffusion</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
