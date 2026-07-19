/**
 * AdsterraSmartlink — Smartlink CTA button.
 * When users click, they see relevant offers (high CPM).
 * Best placement: after content, as "Continue" or "Try Free" button.
 */
export default function AdsterraSmartlink({
  text = "🚀 Explore Premium AI Tools",
  className = "",
}: {
  text?: string;
  className?: string;
}) {
  return (
    <div className={`flex justify-center my-6 ${className}`}>
      <a
        href="https://www.effectivecpmnetwork.com/t8k74dzb?key=8775c0c88eb5c61525d0d42cd6378dc1"
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-8 py-4 text-sm font-bold text-black shadow-lg shadow-amber-500/30 transition duration-300 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/50"
      >
        {text}
      </a>
    </div>
  );
}
