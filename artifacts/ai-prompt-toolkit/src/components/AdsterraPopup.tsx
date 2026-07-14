/**
 * AdsterraPopup — Homepage ad section.
 * App.tsx isye call karta hai homepage pe.
 * Isme saare 6 banners + Smartlink = 7 ads ek saath.
 * App.tsx ko BILKUL nahi chhedna.
 */

function AdFrame({ keyId, w, h }: { keyId: string; w: number; h: number }) {
  const iframeContent = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{margin:0;padding:0;overflow:hidden}body{display:flex;align-items:center;justify-content:center}</style></head><body><script type="text/javascript">atOptions={'key':'${keyId}','format':'iframe','height':${h},'width':${w},'params':{}};<\/script><script type="text/javascript" src="https://www.highperformanceformat.com/${keyId}/invoke.js"><\/script></body></html>`;

  return (
    <div className="flex w-full justify-center overflow-hidden" style={{ maxWidth: "100%" }}>
      <iframe
        srcDoc={iframeContent}
        width={w}
        height={h}
        style={{ border: "none", display: "block", maxWidth: "100%" }}
        title={`ad-${w}x${h}`}
        scrolling="no"
        loading="lazy"
      />
    </div>
  );
}

export default function AdsterraPopup() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:px-6 space-y-4">

      {/* 728x90 Leaderboard */}
      <AdFrame keyId="efb96f4493e16d22d2ab3bb6495cd81e" w={728} h={90} />

      <div className="flex flex-wrap gap-4 justify-center">
        {/* 300x250 Rectangle */}
        <AdFrame keyId="523e38092d3627240bb849c8a280d954" w={300} h={250} />

        {/* 320x50 Mobile Banner */}
        <AdFrame keyId="46f7b6db75df38088c8ec175e2049c67" w={320} h={50} />
      </div>

      {/* Smartlink Button */}
      <div className="flex justify-center pt-2">
        <a
          href="https://www.effectivecpmnetwork.com/t8k74dzb?key=8775c0c88eb5c61525d0d42cd6378dc1"
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-6 py-3 text-xs font-bold text-black shadow-lg shadow-amber-500/30 transition hover:scale-105"
        >
          🚀 Explore Premium AI Tools
        </a>
      </div>
    </div>
  );
}
