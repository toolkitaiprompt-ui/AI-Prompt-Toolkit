import { useState } from "react";
import { ImageIcon, Copy, Check, Wand2, RefreshCw } from "lucide-react";
import { ToolGuide } from "../ToolGuide";

const STYLES = ["Photorealistic", "Anime", "Oil Painting", "3D Render", "Pixel Art", "Cyberpunk", "Watercolor", "Sketch"];
const MOODS = ["Dramatic", "Cheerful", "Mysterious", "Serene", "Epic", "Whimsical", "Dark", "Vibrant"];
const CAMERAS = ["Close-up", "Wide angle", "Portrait", "Bird's eye", "Macro", "Cinematic", "Over-the-shoulder", "Panoramic"];

export default function ImagePromptGenerator() {
  const [subject, setSubject] = useState("");
  const [style, setStyle] = useState("Photorealistic");
  const [mood, setMood] = useState("Dramatic");
  const [camera, setCamera] = useState("Cinematic");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const generate = () => {
    if (!subject.trim()) return;
    const prompts = [
      `${style} image of ${subject}, ${mood.toLowerCase()} atmosphere, ${camera.toLowerCase()} shot, highly detailed, 8k resolution, professional lighting, trending on artstation`,
      `${style} portrayal of ${subject}, ${mood.toLowerCase()} mood, ${camera.toLowerCase()} composition, ultra-detailed, masterpiece, best quality, sharp focus`,
      `A ${style.toLowerCase()} ${camera.toLowerCase()} of ${subject}, conveying a ${mood.toLowerCase()} feeling, intricate details, studio lighting, award-winning photography`,
    ];
    const chosen = prompts[Math.floor(Math.random() * prompts.length)];
    setResult(chosen);
    setHistory((prev) => [chosen, ...prev].slice(0, 5));
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable (permissions/insecure context) — ignore
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-5">
        <div className="space-y-2">
          <label htmlFor="ipg-subject" className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <ImageIcon className="h-4 w-4 text-amber-400" />
            Subject / Scene Description
          </label>
          <input
            id="ipg-subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. a futuristic city at sunset with flying cars"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-100 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <label htmlFor="ipg-style" className="text-xs font-medium text-slate-400 uppercase tracking-wider">Art Style</label>
            <select
              id="ipg-style"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-sm text-slate-100 outline-none transition focus:border-amber-400/60"
            >
              {STYLES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="ipg-mood" className="text-xs font-medium text-slate-400 uppercase tracking-wider">Mood</label>
            <select
              id="ipg-mood"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-sm text-slate-100 outline-none transition focus:border-amber-400/60"
            >
              {MOODS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="ipg-camera" className="text-xs font-medium text-slate-400 uppercase tracking-wider">Camera Angle</label>
            <select
              id="ipg-camera"
              value={camera}
              onChange={(e) => setCamera(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-sm text-slate-100 outline-none transition focus:border-amber-400/60"
            >
              {CAMERAS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={generate}
          disabled={!subject.trim()}
          className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Wand2 className="h-4 w-4" />
          Generate Image Prompt
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Generated Prompt</span>
            <div className="flex gap-2">
              <button
                onClick={generate}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:text-white"
              >
                <RefreshCw className="h-3 w-3" />
                Regenerate
              </button>
              <button
                onClick={copy}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 transition hover:bg-emerald-500/20"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
          <p className="text-sm leading-7 text-slate-200">{result}</p>
        </div>
      )}

      {/* History */}
      {history.length > 1 && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Recent Generations</h3>
          <div className="space-y-2">
            {history.slice(1).map((h, i) => (
              <button
                key={i}
                onClick={() => setResult(h)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/40 p-3 text-left text-sm text-slate-400 transition hover:border-slate-700 hover:text-slate-300 truncate"
              >
                {h}
              </button>
            ))}
          </div>
        </div>
      )}

      <ToolGuide
        intro="The Image Prompt Generator builds production-ready prompts for DALL-E, Midjourney, and Stable Diffusion from one simple description — with style, mood, camera angle, and quality modifiers added automatically. It is made for content creators, designers, marketers, and hobbyists who want consistent, high-quality AI images without learning each tool's prompt syntax."
        steps={[
          "Type what you want to see — for example \"a cozy coffee shop on a rainy street\".",
          "Pick a style (Photorealistic, Anime, Oil Painting, 3D Render, etc.) and a mood (Dramatic, Cheerful, Mysterious…).",
          "Choose a camera angle such as Close-up, Wide angle, or Cinematic.",
          "The tool builds three versions instantly — one for Midjourney, one for DALL-E, one for Stable Diffusion.",
          "Copy the version for the tool you use, paste it in, and regenerate with different styles until you love the result.",
        ]}
        example={{
          title: "One idea, three model-ready prompts.",
          before:
            "a dog wearing sunglasses on a beach",
          after:
            "Midjourney: /imagine prompt: a dog wearing sunglasses on a beach, photorealistic, cheerful mood, cinematic wide angle --ar 16:9 --v 6.1 --s 750\n\nDALL-E: a dog wearing sunglasses on a beach. Style: photorealistic. Mood: cheerful. Wide 16:9 composition, highly detailed.\n\nStable Diffusion: a dog wearing sunglasses on a beach, photorealistic, cheerful, cinematic, masterpiece, best quality\nNegative prompt: blurry, low quality, distorted, watermark",
          note: "Each model has its own syntax — Midjourney uses flags like --ar and --v, while Stable Diffusion works best with a negative prompt. The generator writes all three so you never have to remember the differences.",
        }}
      />
    </div>
  );
}
