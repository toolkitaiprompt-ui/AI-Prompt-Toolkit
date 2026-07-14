/**
 * AdsterraPopup — Popunder ab index.html HEAD me hai.
 * Yahan sirf Smartlink button dikhta hai (chhota, clean).
 * Bada popup HAT GAYA.
 */
export default function AdsterraPopup() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-4 lg:px-6">
      <div className="flex flex-wrap items-center justify-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <span className="text-xs text-slate-400">Sponsored</span>
        <a
          href="https://www.effectivecpmnetwork.com/t8k74dzb?key=8775c0c88eb5c61525d0d42cd6378dc1"
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-6 py-2.5 text-xs font-bold text-black shadow-lg shadow-amber-500/30 transition hover:scale-105"
        >
          🚀 Explore Premium AI Tools
        </a>
      </div>
    </div>
  );
}
